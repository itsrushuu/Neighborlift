import { z } from "zod";
import { createHelpMatch, getHelpMatchById, getHelpPostById, getMatchSummariesForPost, rankCandidatesForPost, updateHelpMatchStatus } from "../db";
import { invokeLLM, listLLMModels } from "../_core/llm";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { buildFallbackExplanation, MatchProfile, scoreCompatibility } from "../../shared/matching";
import { postInput } from "./community";

const profileInput = postInput.pick({ category: true, skills: true, availability: true, approximateArea: true, urgency: true, accessibilityNotes: true });

async function createExplanation(request: MatchProfile, offer: MatchProfile, baseline: ReturnType<typeof scoreCompatibility>) {
  const fallback = buildFallbackExplanation(baseline);
  try {
    const { data } = await listLLMModels();
    const model = data.find(item => item.id === "gpt-5-mini")?.id ?? data[0]?.id;
    if (!model) return fallback;
    const response = await invokeLLM({
      model,
      messages: [
        { role: "system", content: "You explain community-help matches. Be concise, practical, supportive, and never claim safety screening or guarantees. Return JSON only." },
        { role: "user", content: JSON.stringify({ request, offer, score: baseline.score, reasons: baseline.reasons }) },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "neighborlift_match_explanation",
          strict: true,
          schema: {
            type: "object",
            properties: { summary: { type: "string" } },
            required: ["summary"],
            additionalProperties: false,
          },
        },
      },
    });
    const content = response.choices[0]?.message.content;
    return typeof content === "string" ? JSON.parse(content).summary : fallback;
  } catch {
    return fallback;
  }
}

export const matchingRouter = router({
  forPost: publicProcedure.input(z.object({ postId: z.number().int().positive() })).query(({ input }) => getMatchSummariesForPost(input.postId)),
  rankForPost: publicProcedure.input(z.object({ postId: z.number().int().positive() })).query(({ input }) => rankCandidatesForPost(input.postId)),
  explainPreview: publicProcedure.input(z.object({ request: profileInput, offer: profileInput })).mutation(async ({ input }) => {
    const baseline = scoreCompatibility(input.request, input.offer);
    const explanation = await createExplanation(input.request, input.offer, baseline);
    return { ...baseline, explanation };
  }),
  create: protectedProcedure.input(z.object({ requestId: z.number().int().positive(), offerId: z.number().int().positive(), aiExplanation: z.string().max(1000).optional() })).mutation(async ({ ctx, input }) => {
    const [request, offer] = await Promise.all([getHelpPostById(input.requestId), getHelpPostById(input.offerId)]);
    if (!request || !offer || (request.userId !== ctx.user.id && offer.userId !== ctx.user.id)) throw new Error("You can only create a match for one of your own posts.");
    return createHelpMatch(input.requestId, input.offerId, input.aiExplanation);
  }),
  setStatus: protectedProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["proposed", "matched", "completed", "declined"]) })).mutation(async ({ ctx, input }) => {
    const match = await getHelpMatchById(input.id);
    if (!match) throw new Error("This match is no longer available.");
    const [request, offer] = await Promise.all([getHelpPostById(match.requestId), getHelpPostById(match.offerId)]);
    if (!request || !offer || (request.userId !== ctx.user.id && offer.userId !== ctx.user.id)) throw new Error("You can only update matches connected to your own posts.");
    return updateHelpMatchStatus(input.id, input.status);
  }),
});
