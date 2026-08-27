import { describe, expect, it } from "vitest";
import { approximateAreaPoint, isMapActivationKey, isUsableApproximateArea, mapMarkerAccessibility } from "../shared/map";

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

  it("creates a bounded deterministic point for an unknown approximate area", () => {
    const point = approximateAreaPoint("A neighborhood near the community center", 2);
    expect(point.lat).toBeGreaterThan(37.76);
    expect(point.lat).toBeLessThan(37.79);
    expect(point.lng).toBeGreaterThan(-122.44);
    expect(point.lng).toBeLessThan(-122.40);
  });
});
