import { describe, expect, it } from "vitest";
import { summarizeActivity } from "../shared/activity";

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
});

