import { describe, expect, it } from "vitest";
import { postInput, preferencesInput } from "./routers/community";

const validPost = {
  kind: "request" as const,
  title: "A grocery pickup would make today easier",
  description: "I need someone to collect a short grocery list and leave it at my door this afternoon.",
  displayName: "Maya",
  category: "groceries" as const,
  urgency: "today" as const,
  approximateArea: "Eastwood, near the library",
  skills: ["shopping", "Spanish"],
  availability: "Today after 3 pm",
  accessibilityNotes: "Elevator building; please text first.",
};

describe("community post validation", () => {
  it("accepts a complete, privacy-conscious community post", () => {
    expect(postInput.safeParse(validPost).success).toBe(true);
  });

  it("rejects a post without enough context for a meaningful match", () => {
    const result = postInput.safeParse({ ...validPost, description: "Need help" });
    expect(result.success).toBe(false);
  });

  it("requires at least one useful skill or need", () => {
    const result = postInput.safeParse({ ...validPost, skills: [] });
    expect(result.success).toBe(false);
  });

  it("accepts concise personal display preferences and rejects oversized values", () => {
    expect(preferencesInput.safeParse({ displayNamePreference: "Rae", availabilityPreference: "Saturday mornings" }).success).toBe(true);
    expect(preferencesInput.safeParse({ displayNamePreference: "x".repeat(81) }).success).toBe(false);
  });
});
