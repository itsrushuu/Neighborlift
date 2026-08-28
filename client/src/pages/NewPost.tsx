import { ArrowLeft, CheckCircle2, HeartHandshake, Loader2, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast as sonnerToast } from "sonner";
import { useLocation, useParams } from "wouter";
import { SiteHeader } from "@/components/SiteHeader";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { categoryMeta, DemoPost } from "@/data/demo";
import { trpc } from "@/lib/trpc";
import { refreshAfterPostCreation } from "@/lib/liveData";

type FormValues = { title: string; description: string; displayName: string; category: DemoPost["category"]; urgency: DemoPost["urgency"]; approximateArea: string; skills: string; availability: string; accessibilityNotes: string };
const initialValues: FormValues = { title: "", description: "", displayName: "", category: "groceries", urgency: "this_week", approximateArea: "", skills: "", availability: "", accessibilityNotes: "" };

export default function NewPost() {
  const { kind } = useParams<{ kind: "request" | "offer" }>();
  const postKind = kind === "offer" ? "offer" : "request";
  const [values, setValues] = useState<FormValues>(initialValues);
  const [formError, setFormError] = useState("");
  const [, setLocation] = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const utils = trpc.useUtils();
  const { data: preferences } = trpc.community.preferences.useQuery(undefined, { enabled: isAuthenticated });
  const updatePreferences = trpc.community.updatePreferences.useMutation();
  useEffect(() => {
    if (!preferences) return;
    setValues(current => ({ ...current, displayName: current.displayName || preferences.displayNamePreference || "", availability: current.availability || preferences.availabilityPreference || "" }));
  }, [preferences]);
  const createPost = trpc.community.create.useMutation({ onSuccess: async created => { try { await updatePreferences.mutateAsync({ displayNamePreference: values.displayName, availabilityPreference: values.availability }); } catch { /* The post itself is already saved; preferences can be updated on the next post. */ } if (postKind === "offer") sonnerToast.success("Thank you for showing up.", { description: "Your offer is now on the neighborhood board." }); await refreshAfterPostCreation({ refreshBoard: () => utils.community.list.invalidate(), refreshProfile: () => utils.community.mine.invalidate(), refreshDetail: postId => utils.community.get.invalidate({ id: postId }), refreshCandidates: () => utils.matching.rankForPost.invalidate(), refreshMatches: () => utils.matching.forPost.invalidate() }, created.id); setLocation(`/help/${created.id}`); }, onError: error => setFormError(error.message || "We could not save this post. Please try again.") });
  const message = postKind === "offer" ? "Offer a little time, a useful skill, or a practical hand." : "Share only what a neighbor needs to know to offer a useful hand.";

  const update = <K extends keyof FormValues>(key: K, value: FormValues[K]) => setValues(current => ({ ...current, [key]: value }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setFormError("");
    if (!isAuthenticated) return startLogin();
    const skills = values.skills.split(",").map(item => item.trim()).filter(Boolean);
    if (!values.title || !values.description || !values.displayName || !values.approximateArea || !values.availability || !skills.length) {
      setFormError("Please complete the required fields so a neighbor can understand the need or offer.");
      return;
    }
    createPost.mutate({ ...values, kind: postKind, skills, accessibilityNotes: values.accessibilityNotes || undefined });
  };

  return <div className="min-h-screen bg-[#fbfaf6] text-stone-900"><SiteHeader /><main className="container max-w-3xl px-5 py-8 sm:px-7 sm:py-12"><button onClick={() => setLocation("/board")} className="inline-flex items-center gap-2 text-sm font-bold text-stone-600 transition hover:text-[#536645]"><ArrowLeft className="h-4 w-4" />Back to the board</button><div className="mt-7 grid gap-6 lg:grid-cols-[1fr_14rem]"><div><p className="section-kicker">{postKind === "offer" ? "Offer support" : "Ask for help"}</p><h1 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.05em] text-stone-950 sm:text-5xl">{postKind === "offer" ? "A little help can travel far." : "You don’t have to do it alone."}</h1><p className="mt-4 max-w-xl text-base leading-7 text-stone-600">{message}</p></div><div className="rounded-2xl bg-[#e9eee2] p-5 text-sm leading-6 text-[#526144]"><HeartHandshake className="mb-3 h-5 w-5" />NeighborLift shares approximate areas first. Exact details stay with the people who choose to connect.</div></div>
    {!loading && !isAuthenticated && <div className="mt-8 flex gap-3 rounded-2xl border border-[#cfd8c6] bg-[#f1f4ed] p-4 text-sm text-[#435139]"><LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" /><p><strong>Sign in to post.</strong> You can fill in the form first; NeighborLift will ask you to sign in securely when you submit.</p></div>}
    <form onSubmit={submit} className="mt-8 rounded-[1.7rem] border border-stone-200 bg-white p-5 shadow-[0_14px_36px_rgba(51,43,34,0.05)] sm:p-8"><div className="grid gap-2 border-b border-stone-100 pb-6 sm:grid-cols-3"><div className="form-progress-step"><span>1</span>Share the essentials</div><div className="form-progress-step"><span>2</span>Review possible fits</div><div className="form-progress-step"><span>3</span>Choose together</div></div><div className="mt-7 grid gap-5"><label className="form-field"><span>Short title <b aria-hidden="true">*</b></span><input value={values.title} onChange={e => update("title", e.target.value)} placeholder={postKind === "offer" ? "e.g. I can help with weekend errands" : "e.g. Grocery pickup after a tough week"} maxLength={160} /></label><label className="form-field"><span>What would be useful to know? <b aria-hidden="true">*</b></span><textarea value={values.description} onChange={e => update("description", e.target.value)} placeholder="Describe the task, not private details. Mention what a helpful response looks like." rows={5} maxLength={1200} /></label><div className="grid gap-5 sm:grid-cols-2"><label className="form-field"><span>How should neighbors see your name? <b aria-hidden="true">*</b></span><input value={values.displayName} onChange={e => update("displayName", e.target.value)} placeholder="Your first name, nickname, or “Neighbor”" maxLength={80} /><small>We’ll remember this for your next post, and you can change it anytime.</small></label><label className="form-field"><span>Approximate area <b aria-hidden="true">*</b></span><input value={values.approximateArea} onChange={e => update("approximateArea", e.target.value)} placeholder="e.g. Eastwood, near the library" maxLength={120} /></label></div><div className="grid gap-5 sm:grid-cols-2"><label className="form-field"><span>Category <b aria-hidden="true">*</b></span><select value={values.category} onChange={e => update("category", e.target.value as DemoPost["category"])}>{Object.entries(categoryMeta).map(([value, meta]) => <option key={value} value={value}>{meta.label}</option>)}</select></label><label className="form-field"><span>Timing <b aria-hidden="true">*</b></span><select value={values.urgency} onChange={e => update("urgency", e.target.value as DemoPost["urgency"])}><option value="today">Today</option><option value="this_week">This week</option><option value="flexible">Flexible</option></select></label></div><label className="form-field"><span>Useful skills or needs <b aria-hidden="true">*</b></span><input value={values.skills} onChange={e => update("skills", e.target.value)} placeholder="Separate with commas, e.g. driving, Spanish, label reading" maxLength={280} /><small>These power the match suggestions. Use terms a neighbor would recognize.</small></label><label className="form-field"><span>When can you help or connect? <b aria-hidden="true">*</b></span><input value={values.availability} onChange={e => update("availability", e.target.value)} placeholder="e.g. Tuesday afternoon or weekends" maxLength={180} /><small>This is saved as a handy starting point for future posts.</small></label><label className="form-field"><span>Accessibility considerations <em>(optional)</em></span><textarea value={values.accessibilityNotes} onChange={e => update("accessibilityNotes", e.target.value)} placeholder="Share only the preferences that make support more useful or comfortable." rows={3} maxLength={500} /></label></div>{formError && <p role="alert" className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">{formError}</p>}<div className="mt-7 flex flex-col-reverse gap-3 border-t border-stone-100 pt-6 sm:flex-row sm:items-center sm:justify-between"><p className="flex max-w-sm items-center gap-2 text-xs leading-5 text-stone-500"><ShieldCheck className="h-4 w-4 shrink-0 text-[#738a62]" />Only the essentials are visible before people choose to coordinate.</p><button disabled={createPost.isPending} className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-[#536645] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60">{createPost.isPending && <Loader2 className="h-4 w-4 animate-spin" />}{isAuthenticated ? `Publish ${postKind === "offer" ? "offer" : "request"}` : "Sign in and publish"}</button></div></form></main></div>;
}
