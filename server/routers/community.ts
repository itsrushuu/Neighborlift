import { z } from "zod";
import { createHelpPost, getHelpPostById, listHelpPosts } from "../db";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";

export const postInput = z.object({
  kind: z.enum(["request", "offer"]),
  title: z.string().trim().min(6).max(160),
  description: z.string().trim().min(20).max(1200),
  displayName: z.string().trim().min(2).max(80),
  category: z.enum(["groceries", "rides", "tutoring", "translation", "accessibility"]),
  urgency: z.enum(["flexible", "this_week", "today"]),
  approximateArea: z.string().trim().min(2).max(120),
  skills: z.array(z.string().trim().min(1).max(40)).min(1).max(8),
  availability: z.string().trim().min(2).max(180),
  accessibilityNotes: z.string().trim().max(500).optional(),
});

export const communityRouter = router({
  list: publicProcedure.query(() => listHelpPosts()),
  get: publicProcedure.input(z.object({ id: z.number().int().positive() })).query(({ input }) => getHelpPostById(input.id)),
  create: protectedProcedure.input(postInput).mutation(async ({ ctx, input }) => {
    const created = await createHelpPost({
      ...input,
      userId: ctx.user.id,
      skills: JSON.stringify(input.skills),
      accessibilityNotes: input.accessibilityNotes || null,
      status: "open",
    });
    if (!created) throw new Error("We could not save your post. Please try again.");
    return created;
  }),
});
