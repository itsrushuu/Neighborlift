import { ArrowLeft, Check, CheckCircle2, Clock3, HeartHandshake, Lightbulb, Loader2, MapPin, MessageCircleMore, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import { toast as sonnerToast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { SiteHeader } from "@/components/SiteHeader";
import { categoryMeta, demoPosts, DemoPost, safeParseSkills, urgencyMeta } from "@/data/demo";
import { trpc } from "@/lib/trpc";
import { liveQueryOptions } from "@/lib/liveData";
import { refreshAfterMatchStatusChange } from "@/lib/liveData";
import { celebrationCopy, shouldCelebrate } from "@shared/celebration";

type MatchStatus = "proposed" | "matched" | "completed";
type Candidate = DemoPost & { score?: number; reasons?: string[]; persistedMatchId?: number; status?: MatchStatus };

function asDemoPost(post: Omit<DemoPost, "id" | "skills" | "accessibilityNotes" | "createdLabel" | "matchCount"> & { id: number; skills: string; accessibilityNotes: string | null }): DemoPost {
  return { ...post, id: String(post.id), skills: safeParseSkills(post.skills), accessibilityNotes: post.accessibilityNotes || undefined, createdLabel: "Just posted", matchCount: 0 };
}

function profile(post: DemoPost) {
  return { category: post.category, skills: post.skills, availability: post.availability, approximateArea: post.approximateArea, urgency: post.urgency, accessibilityNotes: post.accessibilityNotes };
}

export default function HelpDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const demoPost = demoPosts.find(item => item.id === id);
  const numericId = Number(id);
  const isLivePost = !demoPost && Number.isInteger(numericId) && numericId > 0;
  const queryId = isLivePost ? numericId : 1;
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const { data: livePost, isLoading, error } = trpc.community.get.useQuery({ id: queryId }, { enabled: isLivePost, ...liveQueryOptions });
  const { data: persistedMatches } = trpc.matching.forPost.useQuery({ postId: queryId }, { enabled: isLivePost, ...liveQueryOptions });
  const { data: liveCandidates } = trpc.matching.rankForPost.useQuery({ postId: queryId }, { enabled: isLivePost, ...liveQueryOptions });
  const [selectedId, setSelectedId] = useState<string>();
  const [demoStatus, setDemoStatus] = useState<MatchStatus>("proposed");
  const [coordinationReady, setCoordinationReady] = useState(false);
  const preview = trpc.matching.explainPreview.useMutation();
  const refreshMatching = () => refreshAfterMatchStatusChange({ refreshMatches: postId => utils.matching.forPost.invalidate({ postId }), refreshCandidates: postId => utils.matching.rankForPost.invalidate({ postId }), refreshDetail: postId => utils.community.get.invalidate({ id: postId }) }, queryId);
  const setPersistedStatus = trpc.matching.setStatus.useMutation({ onSuccess: result => { if (result?.status === "matched" && shouldCelebrate("connection-matched")) sonnerToast.success(celebrationCopy.connectionMatched, { description: "This neighbor connection is ready to coordinate." }); refreshMatching(); } });
  const createPersistedMatch = trpc.matching.create.useMutation({ onSuccess: match => setPersistedStatus.mutate({ id: match!.id, status: "matched" }) });

  const post = useMemo<DemoPost | undefined>(() => demoPost || (livePost ? asDemoPost(livePost) : undefined), [demoPost, livePost]);
  const demoCandidate = post?.kind === "request" ? demoPosts.find(item => item.kind === "offer" && item.category === post.category) : demoPosts.find(item => item.kind === "request" && item.category === post?.category);
  const storedCandidates = useMemo<Candidate[]>(() => (persistedMatches || []).flatMap(match => match.counterpart && match.status !== "declined" ? [{ ...asDemoPost(match.counterpart), score: match.compatibilityScore, reasons: JSON.parse(match.reasons) as string[], persistedMatchId: match.id, status: match.status === "completed" || match.status === "matched" ? match.status : "proposed" }] : []), [persistedMatches]);
  const rankedCandidates = useMemo<Candidate[]>(() => (liveCandidates || []).map(item => ({ ...asDemoPost(item.candidate), score: item.score, reasons: item.reasons })), [liveCandidates]);
  const allCandidates: Candidate[] = isLivePost ? [...storedCandidates, ...rankedCandidates.filter(candidate => !storedCandidates.some(stored => stored.id === candidate.id))] : (demoCandidate ? [demoCandidate] : []);
  const candidate = allCandidates.find(item => item.id === selectedId) || allCandidates[0];
  const persistedMatch = storedCandidates.find(item => item.id === candidate?.id && item.persistedMatchId);
  const currentStatus: MatchStatus = isLivePost && persistedMatch ? persistedMatch.status || "proposed" : demoStatus;
  const pendingUpdate = createPersistedMatch.isPending || setPersistedStatus.isPending;

  if (isLoading) return <div className="min-h-screen bg-[#fbfaf6]"><SiteHeader /><main className="container grid min-h-[60vh] place-items-center px-5 sm:px-7"><div className="flex items-center gap-3 text-sm font-bold text-stone-600"><Loader2 className="h-5 w-5 animate-spin text-[#536645]" />Opening this help post…</div></main></div>;
  if (error || !post) return <div className="min-h-screen bg-[#fbfaf6]"><SiteHeader /><main className="container grid min-h-[60vh] place-items-center px-5 text-center sm:px-7"><div><p className="section-kicker">Post unavailable</p><h1 className="mt-3 font-display text-3xl font-extrabold text-stone-950">We couldn’t find that community post.</h1><p className="mt-3 text-sm text-stone-600">It may have been removed or the board may be taking a moment to refresh.</p><button onClick={() => setLocation("/board")} className="mt-6 rounded-full bg-stone-900 px-5 py-3 text-sm font-bold text-white">Return to the board</button></div></main></div>;

  const category = categoryMeta[post.category];
  const urgency = urgencyMeta[post.urgency];
  const statusMessage = currentStatus === "proposed" ? "Suggested for a human review" : currentStatus === "matched" ? "Connection accepted" : "Assistance completed";
  const runPreview = () => {
    if (!candidate) return;
    const request = post.kind === "request" ? post : candidate;
    const offer = post.kind === "offer" ? post : candidate;
    preview.mutate({ request: profile(request), offer: profile(offer) });
  };
  const updateStatus = (status: MatchStatus) => {
    if (!isLivePost) {
      setDemoStatus(status);
      if (status === "matched" && shouldCelebrate("connection-matched")) sonnerToast.success(celebrationCopy.connectionMatched, { description: "This neighbor connection is ready to coordinate." });
      return;
    }
    if (!isAuthenticated) {
      startLogin();
      return;
    }
    if (persistedMatch?.persistedMatchId) {
      setPersistedStatus.mutate({ id: persistedMatch.persistedMatchId, status });
      return;
    }
    if (!candidate) return;
    const requestId = post.kind === "request" ? Number(post.id) : Number(candidate.id);
    const offerId = post.kind === "offer" ? Number(post.id) : Number(candidate.id);
    createPersistedMatch.mutate({ requestId, offerId, aiExplanation: preview.data?.explanation });
  };

  return <div className="min-h-screen bg-[#fbfaf6] text-stone-900"><SiteHeader /><main className="container max-w-6xl px-5 py-8 sm:px-7 sm:py-12"><button onClick={() => setLocation("/board")} className="inline-flex items-center gap-2 text-sm font-bold text-stone-600 transition hover:text-[#536645]"><ArrowLeft className="h-4 w-4" />Back to the board</button><div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]"><section><div className="rounded-[1.8rem] border border-stone-200 bg-white p-6 shadow-[0_14px_36px_rgba(51,43,34,0.05)] sm:p-9"><div className="flex flex-wrap items-center gap-2"><span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${category.color}`}><span>{category.emoji}</span>{category.label}</span><span className={`rounded-full px-3 py-1.5 text-xs font-bold ${urgency.className}`}>{urgency.label}</span><span className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-bold text-stone-600">{post.kind === "request" ? "Help request" : "Volunteer offer"}</span></div><h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.05em] text-stone-950 sm:text-5xl">{post.title}</h1><p className="mt-6 max-w-3xl text-base leading-7 text-stone-600">{post.description}</p><div className="mt-8 grid gap-4 border-y border-stone-100 py-6 sm:grid-cols-2"><div className="flex gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#536645]" /><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-stone-500">Approximate area</p><p className="mt-1 text-sm font-semibold text-stone-800">{post.approximateArea}</p></div></div><div className="flex gap-3"><Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-[#536645]" /><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-stone-500">Availability</p><p className="mt-1 text-sm font-semibold text-stone-800">{post.availability}</p></div></div></div><div className="mt-6"><p className="text-xs font-bold uppercase tracking-[0.12em] text-stone-500">Useful skills or needs</p><div className="mt-3 flex flex-wrap gap-2">{post.skills.map(skill => <span key={skill} className="rounded-lg bg-stone-100 px-3 py-1.5 text-sm font-semibold text-stone-700">{skill}</span>)}</div></div>{post.accessibilityNotes && <div className="mt-6 rounded-2xl bg-[#f1f4ed] p-4 text-sm leading-6 text-[#47553d]"><ShieldCheck className="mr-2 inline h-4 w-4" /><strong>Accessibility considerations:</strong> {post.accessibilityNotes}</div>}<div className="mt-8 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#e9eee2] font-bold text-[#536645]">{post.displayName.charAt(0)}</span><div><p className="text-sm font-bold text-stone-800">{post.displayName}</p><p className="text-xs text-stone-500">{post.createdLabel}</p></div></div></div></section>
      <aside className="space-y-5"><section className="match-assist-panel"><div className="relative z-10 flex items-center gap-2 text-sm font-bold text-[#d5e2c9]"><Sparkles className="h-4 w-4" />AI-assisted matches</div><h2 className="relative z-10 mt-3 font-display text-2xl font-bold tracking-[-0.04em]">{candidate ? "A compatible connection is ready to review." : "A match will appear when a complementary post is available."}</h2>{candidate && <><p className="relative z-10 mt-3 text-sm leading-6 text-stone-300">NeighborLift ranks skills, timing, approximate area, urgency, and access needs—then leaves the decision to people.</p><button onClick={runPreview} disabled={preview.isPending} className="relative z-10 mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#dbe7cd] px-4 py-3 text-sm font-bold text-[#34412c] transition hover:-translate-y-0.5 hover:bg-white active:scale-[0.98] disabled:opacity-60">{preview.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lightbulb className="h-4 w-4" />}{preview.isPending ? "Comparing needs…" : "Explain this match"}</button></>}{preview.data && <div className="relative z-10 mt-5 rounded-xl bg-white/10 p-4"><div className="flex items-baseline justify-between gap-3"><p className="text-xs font-bold uppercase tracking-[0.1em] text-[#d5e2c9]">Compatibility</p><p className="font-display text-3xl font-bold text-white">{preview.data.score}%</p></div><p className="mt-3 text-sm leading-6 text-stone-200">{preview.data.explanation}</p></div>}{preview.error && <div role="alert" className="relative z-10 mt-5 rounded-xl bg-rose-900/40 p-3 text-xs leading-5 text-rose-100">The explanation is unavailable right now. You can still review the shared details below.</div>}</section>
        {allCandidates.length > 1 && <section className="rounded-[1.6rem] border border-stone-200 bg-white p-5"><p className="text-xs font-bold uppercase tracking-[0.12em] text-stone-500">Ranked connections</p><div className="mt-3 space-y-2">{allCandidates.slice(0, 3).map((item, index) => <button key={item.id} onClick={() => { setSelectedId(item.id); setCoordinationReady(false); }} className={`w-full rounded-xl border p-3 text-left transition ${candidate?.id === item.id ? "border-[#71865f] bg-[#f1f4ed]" : "border-stone-200 hover:border-stone-400"}`}><div className="flex items-center justify-between gap-3"><span className="text-xs font-bold text-stone-500">#{index + 1} match</span>{item.score !== undefined && <span className="rounded-full bg-stone-900 px-2 py-1 text-xs font-bold text-white">{item.score}%</span>}</div><p className="mt-1 text-sm font-bold leading-5 text-stone-900">{item.title}</p><p className="mt-1 text-xs text-stone-500">{item.reasons?.[0] || item.approximateArea}</p></button>)}</div></section>}
        {candidate && <section className="rounded-[1.6rem] border border-stone-200 bg-white p-6"><div className="flex items-center gap-2 text-sm font-bold text-stone-900"><UsersRound className="h-4 w-4 text-[#536645]" />Suggested connection</div><p className="mt-3 text-sm font-bold leading-5 text-stone-900">{candidate.title}</p><p className="mt-2 text-sm text-stone-600">{candidate.displayName} · {candidate.approximateArea}</p><div className="mt-4 space-y-2">{post.skills.filter(skill => candidate.skills.some(candidateSkill => candidateSkill.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(candidateSkill.toLowerCase()))).slice(0, 2).map(skill => <p key={skill} className="flex items-center gap-2 text-xs font-semibold text-[#536645]"><Check className="h-3.5 w-3.5" />Shared skill: {skill}</p>)}</div><div className="mt-5 rounded-xl bg-[#f4f4ef] p-3"><p className="text-xs font-bold text-stone-500">STATUS · {statusMessage}</p><div className="mt-3 grid grid-cols-2 gap-2">{currentStatus === "proposed" && <button onClick={() => updateStatus("matched")} disabled={pendingUpdate} className="rounded-lg bg-[#536645] px-3 py-2 text-xs font-bold text-white disabled:opacity-60">{pendingUpdate ? "Saving…" : "Mark matched"}</button>}{currentStatus === "matched" && <button onClick={() => updateStatus("completed")} disabled={pendingUpdate} className="rounded-lg bg-[#536645] px-3 py-2 text-xs font-bold text-white disabled:opacity-60">{pendingUpdate ? "Saving…" : "Mark complete"}</button>}<button onClick={() => setDemoStatus("proposed")} className="rounded-lg border border-stone-300 px-3 py-2 text-xs font-bold text-stone-700">Reset status</button></div></div>{(createPersistedMatch.error || setPersistedStatus.error) && <p role="alert" className="mt-3 rounded-xl bg-rose-50 p-3 text-xs leading-5 text-rose-800">{createPersistedMatch.error?.message || setPersistedStatus.error?.message}</p>}<button onClick={() => setCoordinationReady(true)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-stone-300 px-4 py-2.5 text-sm font-bold text-stone-800 transition hover:border-stone-900"><MessageCircleMore className="h-4 w-4" />{coordinationReady ? "Ready to coordinate" : "Coordinate safely"}</button>{coordinationReady && <p role="status" className="mt-3 rounded-xl bg-[#f1f4ed] p-3 text-xs leading-5 text-[#4d5b42]"><CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />This connection is ready for a private conversation once both neighbors agree.</p>}</section>}</aside></div></main></div>;
}
