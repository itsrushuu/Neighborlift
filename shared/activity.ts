export type ActivityPost = {
  kind: "request" | "offer";
  status: "open" | "matched" | "completed" | "closed";
  createdAt?: Date | string;
};

export type ActivityKindFilter = "all" | ActivityPost["kind"];
export type ActivityStatusFilter = "all" | ActivityPost["status"];
export type ActivitySort = "newest" | "oldest" | "status";

export function filterAndSortActivity<T extends ActivityPost>(posts: T[], options: { kind: ActivityKindFilter; status: ActivityStatusFilter; sort: ActivitySort }) {
  const statusOrder: Record<ActivityPost["status"], number> = { matched: 0, open: 1, completed: 2, closed: 3 };
  const timestamp = (post: T) => post.createdAt ? new Date(post.createdAt).getTime() : 0;
  const filtered = posts.filter(post =>
    (options.kind === "all" || post.kind === options.kind) &&
    (options.status === "all" || post.status === options.status)
  );

  return [...filtered].sort((a, b) => {
    if (options.sort === "oldest") return timestamp(a) - timestamp(b);
    if (options.sort === "status") return statusOrder[a.status] - statusOrder[b.status] || timestamp(b) - timestamp(a);
    return timestamp(b) - timestamp(a);
  });
}

export function summarizeActivity(posts: ActivityPost[]) {
  return {
    requests: posts.filter(post => post.kind === "request").length,
    offers: posts.filter(post => post.kind === "offer").length,
    completed: posts.filter(post => post.status === "completed").length,
  };
}
