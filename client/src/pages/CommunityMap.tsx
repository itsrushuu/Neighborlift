import { Activity, Clock3, Filter, HeartHandshake, Loader2, MapPin, RefreshCw, Sparkles, UsersRound } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { SiteHeader } from "@/components/SiteHeader";
import { categoryMeta, demoPosts, DemoPost, filterPosts, safeParseSkills, urgencyMeta } from "@/data/demo";
import { liveQueryOptions } from "@/lib/liveData";
import { trpc } from "@/lib/trpc";
import { MapView } from "@/components/Map";
import { approximateAreaPoint, isMapActivationKey, isUsableApproximateArea, MAP_CENTER, mapMarkerAccessibility } from "@shared/map";

type MapPost = DemoPost & { lat: number; lng: number };
type CategoryFilter = "all" | DemoPost["category"];

function mapPoint(post: DemoPost, index: number): MapPost | null {
  if (!isUsableApproximateArea(post.approximateArea)) return null;
  return { ...post, ...approximateAreaPoint(post.approximateArea, index) };
}

function markerElement(post: MapPost) {
  const element = document.createElement("button");
  element.type = "button";
  const accessibility = mapMarkerAccessibility(post.kind, post.title);
  element.setAttribute("aria-label", accessibility.ariaLabel);
  element.setAttribute("tabindex", accessibility.tabIndex);
  element.setAttribute("role", accessibility.role);
  element.className = `map-marker map-marker-${post.kind}`;
  element.addEventListener("keydown", event => {
    if (isMapActivationKey(event.key)) {
      event.preventDefault();
      element.click();
    }
  });
  element.innerHTML = `<span>${categoryMeta[post.category].emoji}</span>`;
  return element;
}

export default function CommunityMap() {
  const { data: livePosts, isLoading, isFetching, error, refetch } = trpc.community.list.useQuery(undefined, liveQueryOptions);
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [kind, setKind] = useState<"all" | DemoPost["kind"]>("all");
  const [selectedId, setSelectedId] = useState<string>();
  const [mapReady, setMapReady] = useState(false);
  const [mapTimedOut, setMapTimedOut] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const hasLivePosts = Boolean(livePosts?.length);

  const posts = useMemo<DemoPost[]>(() => livePosts?.length ? livePosts.map(post => ({ ...post, id: String(post.id), skills: safeParseSkills(post.skills), accessibilityNotes: post.accessibilityNotes || undefined, createdLabel: "Just posted", matchCount: 0 })) : demoPosts, [livePosts]);
  const filtered = useMemo(() => filterPosts(posts, { category, urgency: "all", kind }), [posts, category, kind]);
  const points = useMemo(() => filtered.flatMap((post, index) => { const point = mapPoint(post, index); return point ? [point] : []; }), [filtered]);
  const noLocationPosts = useMemo(() => filtered.filter(post => !isUsableApproximateArea(post.approximateArea)), [filtered]);
  const selectedPost = points.find(post => post.id === selectedId) || points[0];
  const insights = useMemo(() => ({ active: posts.filter(post => post.urgency !== "flexible").length, requests: posts.filter(post => post.kind === "request").length, offers: posts.filter(post => post.kind === "offer").length, today: posts.filter(post => post.urgency === "today").length }), [posts]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setMapTimedOut(true), 4500);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !window.google?.maps?.marker) return;
    markersRef.current.forEach(marker => { marker.map = null; });
    markersRef.current = points.map(post => {
      const marker = new google.maps.marker.AdvancedMarkerElement({ map: mapRef.current!, position: { lat: post.lat, lng: post.lng }, title: post.title, content: markerElement(post) });
      marker.addListener("click", () => { setSelectedId(post.id); mapRef.current?.panTo({ lat: post.lat, lng: post.lng }); });
      return marker;
    });
    if (!selectedId && points[0]) setSelectedId(points[0].id);
    return () => { markersRef.current.forEach(marker => { marker.map = null; }); };
  }, [mapReady, points, selectedId]);

  return <div className="min-h-screen bg-[#fbfaf6] text-stone-900"><SiteHeader /><main className="container px-5 py-9 sm:px-7 sm:py-14"><div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><p className="section-kicker">Live community map</p><h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold leading-[0.98] tracking-[-0.055em] text-stone-950 sm:text-5xl">See where a little help is moving.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-stone-600">Explore active requests and neighbor offers by approximate area. Pins are intentionally softened—enough context to discover, never an exact address.</p></div><div className="map-live-note"><span className="live-dot" />{isFetching ? "Refreshing live activity…" : hasLivePosts ? "Live community activity" : "Demo activity · live when posts exist"}</div></div>
    <section className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><div className="map-insight-card bg-[#e9eee2]"><Activity className="h-5 w-5 text-[#536645]" /><p>Active today</p><strong>{insights.active}</strong><span>requests and offers with a near-term need</span></div><div className="map-insight-card bg-[#f5eee1]"><HeartHandshake className="h-5 w-5 text-[#987034]" /><p>Requests</p><strong>{insights.requests}</strong><span>neighbors who have asked for support</span></div><div className="map-insight-card bg-[#ece9f3]"><UsersRound className="h-5 w-5 text-[#685989]" /><p>Offers</p><strong>{insights.offers}</strong><span>ways someone is ready to show up</span></div><div className="map-insight-card bg-[#f5e8e3]"><Clock3 className="h-5 w-5 text-[#9a4d39]" /><p>Needed today</p><strong>{insights.today}</strong><span>time-sensitive posts to review first</span></div></section>
    <section className="mt-8 rounded-[1.8rem] border border-stone-200 bg-white p-4 shadow-[0_14px_36px_rgba(51,43,34,0.05)] sm:p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="flex items-center gap-2 text-sm font-bold text-stone-800"><Filter className="h-4 w-4 text-[#536645]" />Explore the neighborhood</div><div className="flex flex-wrap gap-2">{(["all", "request", "offer"] as const).map(option => <button key={option} onClick={() => setKind(option)} aria-pressed={kind === option} className={`filter-chip ${kind === option ? "filter-chip-active" : ""}`}>{option === "all" ? "Everyone" : option === "request" ? "Needs help" : "Ready to help"}</button>)}<span className="hidden h-7 w-px bg-stone-200 sm:block" />{(["all", ...Object.keys(categoryMeta)] as const).map(option => <button key={option} onClick={() => setCategory(option as CategoryFilter)} aria-pressed={category === option} className={`filter-chip ${category === option ? "filter-chip-active" : ""}`}>{option === "all" ? "All topics" : categoryMeta[option as DemoPost["category"]].label}</button>)}</div></div></section>
    <section className="relative mt-6 overflow-hidden rounded-[2rem] border border-stone-200 bg-[#e9eee2] shadow-[0_18px_45px_rgba(51,43,34,0.08)]"><div className="map-frame"><MapView initialCenter={MAP_CENTER} initialZoom={13} onMapReady={map => { mapRef.current = map; setMapReady(true); }} className="h-[24rem] sm:h-[36rem]" />{!mapReady && !mapTimedOut && <div className="map-overlay"><Loader2 className="h-5 w-5 animate-spin text-[#536645]" /><span>Warming up the neighborhood map…</span></div>}{mapTimedOut && !mapReady && <div className="map-overlay"><MapPin className="h-5 w-5 text-[#536645]" /><span>Map tiles are taking a moment. The live activity list below is ready now.</span></div>}<div className="map-legend"><span><i className="map-legend-dot map-legend-request" />Needs help</span><span><i className="map-legend-dot map-legend-offer" />Ready to help</span><span><MapPin className="h-3.5 w-3.5" />Approximate area</span></div></div></section>
    <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]"><div className="rounded-[1.7rem] border border-stone-200 bg-white p-5 shadow-[0_12px_30px_rgba(51,43,34,0.04)] sm:p-6"><div className="flex items-center justify-between gap-4"><div><p className="section-kicker">{filtered.length} nearby {filtered.length === 1 ? "post" : "posts"}</p><h2 className="mt-2 font-display text-2xl font-bold tracking-[-0.04em] text-stone-950">Activity around you</h2></div><button onClick={() => void refetch()} disabled={isFetching} className="inline-flex items-center gap-1.5 text-sm font-bold text-stone-600 transition hover:text-[#536645] disabled:opacity-50"><RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />Refresh</button></div>{error && <p role="alert" className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">The live map could not refresh. Showing the last available activity.</p>}{isLoading && <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-stone-500"><Loader2 className="h-4 w-4 animate-spin" />Loading activity…</div>}{filtered.length === 0 && !isLoading && <div className="grid place-items-center py-12 text-center"><Sparkles className="h-7 w-7 text-[#738a62]" /><p className="mt-3 font-display text-xl font-bold">No posts in this view yet.</p><p className="mt-1 text-sm text-stone-600">Try another topic or post a new request.</p></div>}{noLocationPosts.length > 0 && <div className="mt-5 rounded-2xl border border-dashed border-stone-300 bg-[#faf9f5] p-4"><p className="text-xs font-bold uppercase tracking-[0.12em] text-stone-500">Location unavailable</p><p className="mt-1 text-xs leading-5 text-stone-600">{noLocationPosts.length} post{noLocationPosts.length === 1 ? "" : "s"} remain visible here without a pin because no usable approximate area was provided.</p><div className="mt-3 space-y-2">{noLocationPosts.map(post => <Link key={post.id} href={`/help/${post.id}`} className="block truncate text-sm font-bold text-[#536645] underline decoration-2 underline-offset-2">{post.title}</Link>)}</div></div>}{points.length > 0 && <div className="mt-5 grid gap-2">{points.map(post => <button key={post.id} onClick={() => { setSelectedId(post.id); mapRef.current?.panTo({ lat: post.lat, lng: post.lng }); }} className={`map-list-row ${selectedPost?.id === post.id ? "map-list-row-selected" : ""}`}><span className={`map-list-icon ${post.kind === "request" ? "map-list-icon-request" : "map-list-icon-offer"}`}>{categoryMeta[post.category].emoji}</span><span className="min-w-0 flex-1 text-left"><strong>{post.title}</strong><small>{post.kind === "request" ? "Needs help" : "Ready to help"} · {post.approximateArea}</small></span><span className={`rounded-full px-2 py-1 text-[0.68rem] font-bold ${urgencyMeta[post.urgency].className}`}>{urgencyMeta[post.urgency].label}</span></button>)}</div>}</div><aside className="map-selected-card">{selectedPost ? <><p className="section-kicker">Selected on the map</p><span className={`mt-4 inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${categoryMeta[selectedPost.category].color}`}>{categoryMeta[selectedPost.category].emoji} {categoryMeta[selectedPost.category].label}</span><h2 className="mt-4 font-display text-2xl font-bold leading-tight tracking-[-0.04em] text-stone-950">{selectedPost.title}</h2><p className="mt-3 text-sm leading-6 text-stone-600">{selectedPost.description}</p><div className="mt-5 space-y-3 border-t border-stone-200 pt-5 text-sm font-semibold text-stone-700"><p className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-[#536645]" />{selectedPost.approximateArea}</p><p className="flex gap-2"><Clock3 className="h-4 w-4 shrink-0 text-[#536645]" />{selectedPost.availability}</p></div><Link href={`/help/${selectedPost.id}`} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-[#536645]">Open post <Sparkles className="h-4 w-4" /></Link></> : <div className="py-8 text-center"><MapPin className="mx-auto h-7 w-7 text-[#738a62]" /><p className="mt-3 font-display text-xl font-bold">Choose a post</p><p className="mt-1 text-sm text-stone-600">Select a pin or activity row to see the details.</p></div>}</aside></section>
    <p className="mt-5 flex items-center gap-2 text-xs font-medium leading-5 text-stone-500"><MapPin className="h-3.5 w-3.5 text-[#738a62]" />Privacy note: NeighborLift shows neighborhood-level context only. Exact addresses are never plotted.</p>
  </main></div>;
}
