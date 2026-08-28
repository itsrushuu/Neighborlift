import { describe, expect, it } from "vitest";
import { celebrationAccessibility, celebrationCopy, celebrationMotionClass, celebrationTriggerForPostKind, shouldCelebrate } from "../shared/celebration";

describe("offer celebration contract", () => {
  it("celebrates only meaningful neighbor-help moments", () => {
    expect(shouldCelebrate("offer-published")).toBe(true);
    expect(shouldCelebrate("connection-matched")).toBe(true);
    expect(shouldCelebrate("other")).toBe(false);
    expect(shouldCelebrate(celebrationTriggerForPostKind("offer"))).toBe(true);
    expect(shouldCelebrate(celebrationTriggerForPostKind("request"))).toBe(false);
  });

  it("keeps the celebration screen-reader friendly and non-blocking", () => {
    expect(celebrationAccessibility).toMatchObject({ role: "status", ariaLive: "polite", nonBlocking: true, reducedMotionFallback: "static-message" });
    expect(celebrationCopy.offerPublished).toContain("kindness");
  });

  it("uses a static class when reduced motion is preferred", () => {
    expect(celebrationMotionClass(true)).toBe("offer-celebration-static");
    expect(celebrationMotionClass(false)).toBe("offer-celebration-animated");
  });
});
