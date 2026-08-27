import { describe, expect, it } from "vitest";
import { filterAndSortActivity, summarizeActivity } from "../shared/activity";

describe("summarizeActivity", () => {
  it("counts only the signed-in user’s supplied request and offer history", () => {
    const summary = summarizeActivity([
      { kind: "request", status: "completed" },
      { kind: "offer", status: "matched" },
      { kind: "offer", status: "open" },
    ]);

    expect(summary).toEqual({ requests: 1, offers: 2, completed: 1 });
  });

  it("returns an empty activity summary for a user with no posts", () => {
    expect(summarizeActivity([])).toEqual({ requests: 0, offers: 0, completed: 0 });
  });

  it("filters a person’s requests and offers, then orders the newest post first", () => {
    const activity = [
      { kind: "request" as const, status: "open" as const, createdAt: new Date("2026-08-24") },
      { kind: "offer" as const, status: "completed" as const, createdAt: new Date("2026-08-26") },
      { kind: "request" as const, status: "matched" as const, createdAt: new Date("2026-08-25") },
    ];

    const results = filterAndSortActivity(activity, { kind: "request", status: "all", sort: "newest" });

    expect(results.map(post => post.status)).toEqual(["matched", "open"]);
  });

  it("brings active match statuses forward when sorting by status", () => {
    const activity = [
      { kind: "offer" as const, status: "completed" as const, createdAt: new Date("2026-08-26") },
      { kind: "request" as const, status: "open" as const, createdAt: new Date("2026-08-25") },
      { kind: "offer" as const, status: "matched" as const, createdAt: new Date("2026-08-24") },
    ];

    const results = filterAndSortActivity(activity, { kind: "all", status: "all", sort: "status" });

    expect(results.map(post => post.status)).toEqual(["matched", "open", "completed"]);
  });
});
