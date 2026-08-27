import { describe, expect, it } from "vitest";
import { demoPosts, filterPosts } from "./demo";

describe("community board filters", () => {
  it("returns an empty collection when no post meets every selected filter", () => {
    const results = filterPosts(demoPosts, { category: "translation", urgency: "today", kind: "offer" });
    expect(results).toEqual([]);
  });

  it("keeps a matching request visible when filters are compatible", () => {
    const results = filterPosts(demoPosts, { category: "groceries", urgency: "today", kind: "request" });
    expect(results).toHaveLength(1);
    expect(results[0]?.title).toContain("grocery pickup");
  });
});
