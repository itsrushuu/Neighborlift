export type ActivityPost = {
  kind: "request" | "offer";
  status: "open" | "matched" | "completed" | "closed";
};

export function summarizeActivity(posts: ActivityPost[]) {
  return {
    requests: posts.filter(post => post.kind === "request").length,
    offers: posts.filter(post => post.kind === "offer").length,
    completed: posts.filter(post => post.status === "completed").length,
  };
}
