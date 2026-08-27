import { describe, expect, it } from "vitest";
import { buildFallbackExplanation, isValidMatchPair, postStatusForMatch, scoreCompatibility } from "../shared/matching";

describe("scoreCompatibility", () => {
  const request = {
    category: "groceries" as const,
    skills: ["shopping", "Spanish"],
    availability: "Today afternoon",
    approximateArea: "Eastwood · 1.2 mi",
    urgency: "today" as const,
    accessibilityNotes: "Elevator building; please text before arrival.",
  };

  it("rewards an offer that fits the need, time, and area", () => {
    const result = scoreCompatibility(request, {
      category: "groceries",
      skills: ["shopping", "Spanish", "accessibility support"],
      availability: "Today afternoon and evening",
      approximateArea: "Eastwood · 0.8 mi",
      urgency: "today",
    });

    expect(result.score).toBeGreaterThanOrEqual(85);
    expect(result.reasons.join(" ")).toContain("Shared skills");
    expect(result.reasons.join(" ")).toContain("Approximate areas");
  });

  it("keeps an unrelated pair below a strong-match score", () => {
    const result = scoreCompatibility(request, {
      category: "tutoring",
      skills: ["math"],
      availability: "Weekend mornings",
      approximateArea: "North Park",
      urgency: "flexible",
    });

    expect(result.score).toBeLessThan(50);
  });

  it("allows only request-to-offer match pairings", () => {
    expect(isValidMatchPair("request", "offer")).toBe(true);
    expect(isValidMatchPair("offer", "request")).toBe(false);
    expect(isValidMatchPair("request", "request")).toBe(false);
  });

  it("maps match progress to a coordinated post status only when appropriate", () => {
    expect(postStatusForMatch("proposed")).toBeUndefined();
    expect(postStatusForMatch("declined")).toBeUndefined();
    expect(postStatusForMatch("matched")).toBe("matched");
    expect(postStatusForMatch("completed")).toBe("completed");
  });

  it("retains a clear explanation if the AI response is unavailable", () => {
    expect(buildFallbackExplanation({ score: 76, reasons: ["Both focus on groceries.", "Availability overlaps around today."] })).toContain("76% fit");
  });
});
