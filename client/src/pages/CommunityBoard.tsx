import { Filter, Loader2, SearchX, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { CommunityPostCard } from "@/components/CommunityPostCard";
import { SiteHeader } from "@/components/SiteHeader";
import { categoryMeta, demoPosts, DemoPost, filterPosts, safeParseSkills, urgencyMeta } from "@/data/demo";
import { trpc } from "@/lib/trpc";

const allCategories = Object.keys(categoryMeta) as DemoPost["category"][];

export default function CommunityBoard() {
  const [category, setCategory] = useState<"all" | DemoPost["category"]>("all");
  const [urgency, setUrgency] = useState<"all" | DemoPost["urgency"]>("all");
  const [kind, setKind] = useState<"all" | DemoPost["kind"]>("all");
  const { data: livePosts, isLoading, error } = trpc.community.list.useQuery();

  const posts = useMemo<DemoPost[]>(() => {
    if (!livePosts?.length) return demoPosts;
    return [...livePosts.map(post => ({ ...post, id: String(post.id), skills: safeParseSkills(post.skills), accessibilityNotes: post.accessibilityNotes || undefined, createdLabel: "Just posted", matchCount: 0 })), ...demoPosts];
  }, [livePosts]);

  const filtered = filterPosts(posts, { category, urgency, kind });

  return (
    <div className="min-h-screen bg-[#fbfaf6] text-stone-900">
      <SiteHeader />
      <main className="container px-5 pb-16 pt-9 sm:px-7 sm:pt-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-end">
          <div>
            <p className="section-kicker">Community help board</p>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold leading-[0.98] tracking-[-0.055em] text-stone-950 sm:text-5xl">Small help, made easier to find.</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600">Browse neighborhood requests and offers by category, timing, and what feels right for you. Profiles show approximate areas only until people choose to connect.</p>
          </div>
          <div className="rounded-2xl bg-[#e9eee2] p-5"><p className="text-sm font-bold text-[#425135]">Demo board</p><p className="mt-1 text-sm leading-5 text-[#607050]">Sample posts make the matching experience easy to explore for HackSocial judges.</p></div>
        </div>

        <section className="mt-10 rounded-[1.7rem] border border-stone-200 bg-white p-4 shadow-[0_14px_36px_rgba(51,43,34,0.05)] sm:p-6" aria-label="Help board filters">
          <div className="flex items-center gap-2 text-sm font-bold text-stone-800"><SlidersHorizontal className="h-4 w-4 text-[#536645]" /> Find the right way to help</div>
          <div className="mt-4 grid gap-5 md:grid-cols-3">
            <fieldset><legend className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-stone-500">I want to see</legend><div className="flex flex-wrap gap-2">{(["all", "request", "offer"] as const).map(option => <button key={option} onClick={() => setKind(option)} className={`filter-chip ${kind === option ? "filter-chip-active" : ""}`}>{option === "all" ? "Everything" : option === "request" ? "Requests" : "Offers"}</button>)}</div></fieldset>
            <fieldset><legend className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-stone-500">Category</legend><div className="flex flex-wrap gap-2"><button onClick={() => setCategory("all")} className={`filter-chip ${category === "all" ? "filter-chip-active" : ""}`}>All</button>{allCategories.map(item => <button key={item} onClick={() => setCategory(item)} className={`filter-chip ${category === item ? "filter-chip-active" : ""}`}>{categoryMeta[item].label}</button>)}</div></fieldset>
            <fieldset><legend className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-stone-500">Timing</legend><div className="flex flex-wrap gap-2"><button onClick={() => setUrgency("all")} className={`filter-chip ${urgency === "all" ? "filter-chip-active" : ""}`}>Any time</button>{(Object.keys(urgencyMeta) as DemoPost["urgency"][]).map(item => <button key={item} onClick={() => setUrgency(item)} className={`filter-chip ${urgency === item ? "filter-chip-active" : ""}`}>{urgencyMeta[item].label}</button>)}</div></fieldset>
          </div>
        </section>

        {error && <div role="alert" className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><strong>We could not refresh the live board.</strong> The sample board remains available so you can still explore NeighborLift.</div>}
        {isLoading && <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-stone-500"><Loader2 className="h-4 w-4 animate-spin" /> Checking for new community posts…</div>}

        <div className="mt-9 flex items-baseline justify-between gap-4"><p className="text-sm font-bold text-stone-600"><Filter className="mr-1.5 inline h-4 w-4 text-[#536645]" />{filtered.length} {filtered.length === 1 ? "post" : "posts"} to explore</p><Link href="/new/request" className="text-sm font-bold text-[#536645] underline decoration-2 underline-offset-4 transition hover:text-stone-900">Post a request</Link></div>
        {filtered.length > 0 ? <section className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{filtered.map(post => <CommunityPostCard key={post.id} post={post} />)}</section> : <section className="mt-5 grid place-items-center rounded-[1.7rem] border border-dashed border-stone-300 bg-white px-6 py-20 text-center"><SearchX className="h-9 w-9 text-[#738a62]" /><h2 className="mt-4 font-display text-2xl font-bold text-stone-950">No posts match those filters yet.</h2><p className="mt-2 max-w-sm text-sm leading-6 text-stone-600">Try another category or timing, or be the first to share a request or offer.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><button onClick={() => { setCategory("all"); setUrgency("all"); setKind("all"); }} className="rounded-full bg-stone-900 px-4 py-2.5 text-sm font-bold text-white">Clear filters</button><Link href="/new/offer" className="rounded-full border border-stone-300 px-4 py-2.5 text-sm font-bold text-stone-800">Offer support</Link></div></section>}
      </main>
    </div>
  );
}
