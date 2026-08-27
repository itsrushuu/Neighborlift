import { ArrowUpRight, Clock3, MapPin, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { categoryMeta, DemoPost, urgencyMeta } from "@/data/demo";

export function CommunityPostCard({ post }: { post: DemoPost }) {
  const category = categoryMeta[post.category];
  const urgency = urgencyMeta[post.urgency];
  const isRequest = post.kind === "request";

  return (
    <article className="group flex h-full flex-col rounded-[1.55rem] border border-stone-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(51,43,34,0.05)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(51,43,34,0.11)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl text-base font-bold ${category.color}`}>{category.emoji}</span>
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.13em] text-stone-500">{isRequest ? "Help request" : "Neighbor offer"}</p>
            <p className="text-sm font-semibold text-stone-900">{category.label}</p>
          </div>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${urgency.className}`}>{urgency.label}</span>
      </div>

      <h3 className="mt-5 text-lg font-bold leading-snug tracking-[-0.02em] text-stone-950">{post.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-stone-600">{post.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {post.skills.slice(0, 3).map(skill => <span key={skill} className="rounded-md bg-stone-100 px-2 py-1 text-xs font-medium text-stone-600">{skill}</span>)}
      </div>

      <div className="mt-5 space-y-2 border-t border-stone-100 pt-4 text-xs font-medium text-stone-500">
        <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-[#738a62]" />{post.approximateArea}</p>
        <p className="flex items-center gap-2"><Clock3 className="h-3.5 w-3.5 text-[#738a62]" />{post.availability}</p>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 text-xs text-stone-500">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#eef0e8] font-bold text-[#536645]">{post.displayName.charAt(0)}</span>
          <span className="truncate">{post.displayName}</span>
        </div>
        <Link href={`/help/${post.id}`} className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-stone-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-[#536645] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#536645]">
          View <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      {post.matchCount > 0 && <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#536645]"><Sparkles className="h-3.5 w-3.5" />{post.matchCount} compatible neighbor{post.matchCount === 1 ? "" : "s"} to review</div>}
    </article>
  );
}
