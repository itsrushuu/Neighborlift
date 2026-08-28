import { describe, expect, it } from "vitest";
import { demoPosts, filterPosts } from "../client/src/data/demo";
import { approximateAreaPoint, getFriendlyMapPrompts, isMapActivationKey, isUsableApproximateArea, mapMarkerAccessibility, selectMapPosts } from "../shared/map";

describe("privacy-safe map coordinates", () => {
  it("uses stable neighborhood centers for known approximate areas", () => {
    expect(approximateAreaPoint("Eastwood · about 1 mi", 0)).toEqual({ lat: 37.786, lng: -122.407 });
    expect(approximateAreaPoint("Eastwood · about 1 mi", 0)).toEqual(approximateAreaPoint("Eastwood · about 1 mi", 0));
  });

  it("does not place a pin when approximate area information is missing or private", () => {
    expect(isUsableApproximateArea("")).toBe(false);
    expect(isUsableApproximateArea("private")).toBe(false);
    expect(isUsableApproximateArea(undefined)).toBe(false);
    expect(isUsableApproximateArea("Eastwood")).toBe(true);
  });

  it("exposes keyboard-safe marker semantics for map controls", () => {
    expect(mapMarkerAccessibility("request", "Grocery pickup")).toEqual({ ariaLabel: "Help request: Grocery pickup", tabIndex: "0", role: "button" });
    expect(["Enter", " ", "Spacebar"].every(isMapActivationKey)).toBe(true);
    expect(isMapActivationKey("Escape")).toBe(false);
  });

  it("selects sample posts only when Demo Mode is enabled", () => {
    const livePosts = [{ id: "live-1" }];
    const samplePosts = [{ id: "sample-1" }];
    expect(selectMapPosts(livePosts, samplePosts, true)).toEqual(samplePosts);
    expect(selectMapPosts(livePosts, samplePosts, false)).toEqual(livePosts);
    expect(selectMapPosts(undefined, samplePosts, false)).toEqual([]);
  });

  it("filters posts by category and skill tag together", () => {
    const filtered = filterPosts(demoPosts, { category: "groceries", urgency: "all", kind: "all", tag: "Spanish" });
    expect(filtered.map(post => post.id)).toEqual(["demo-grocery-request", "demo-grocery-offer"]);
    expect(filterPosts(demoPosts, { category: "all", urgency: "all", kind: "all", tag: "algebra" }).every(post => post.skills.includes("algebra"))).toBe(true);
    expect(filterPosts(demoPosts, { category: "all", urgency: "today", kind: "all" }).map(post => post.id)).toEqual(["demo-grocery-request", "demo-grocery-offer"]);
    expect(filterPosts(demoPosts, { category: "all", urgency: "all", kind: "all", tagQuery: "wheelchair" }).map(post => post.id)).toEqual(["demo-ride-request", "demo-ride-offer"]);
  });

  it("personalizes friendly prompts by time and nearby category", () => {
    expect(getFriendlyMapPrompts(["groceries"], 9)[0]).toContain("Good morning");
    expect(getFriendlyMapPrompts(["rides"], 19)[0]).toContain("evening");
    expect(getFriendlyMapPrompts(["rides"], 14)[1]).toContain("ride");
    expect(getFriendlyMapPrompts([], 14)[1]).toContain("something useful");
  });

  it("creates a bounded deterministic point for an unknown approximate area", () => {
    const point = approximateAreaPoint("A neighborhood near the community center", 2);
    expect(point.lat).toBeGreaterThan(37.76);
    expect(point.lat).toBeLessThan(37.79);
    expect(point.lng).toBeGreaterThan(-122.44);
    expect(point.lng).toBeLessThan(-122.40);
  });
});
