export const MAP_CENTER = { lat: 37.7749, lng: -122.4194 } as const;

const areaCenters: Record<string, { lat: number; lng: number }> = {
  eastwood: { lat: 37.786, lng: -122.407 },
  "north park": { lat: 37.785, lng: -122.433 },
  riverside: { lat: 37.765, lng: -122.431 },
  "cedar hill": { lat: 37.757, lng: -122.414 },
};

function hashArea(area: string, index: number) {
  const hash = area.split("").reduce((total, character) => total + character.charCodeAt(0), index * 17);
  const angle = (hash % 360) * (Math.PI / 180);
  return { lat: MAP_CENTER.lat + Math.sin(angle) * 0.012, lng: MAP_CENTER.lng + Math.cos(angle) * 0.016 };
}

/** Returns whether a post contains enough area context to place a neighborhood-level pin. */
export function isUsableApproximateArea(approximateArea: string | null | undefined) {
  const value = approximateArea?.trim().toLowerCase() || "";
  return value.length >= 3 && !["unknown", "not provided", "private", "n/a"].includes(value);
}

export function mapMarkerAccessibility(kind: "request" | "offer", title: string) {
  return { ariaLabel: `${kind === "request" ? "Help request" : "Neighbor offer"}: ${title}`, tabIndex: "0", role: "button" };
}

export function isMapActivationKey(key: string) {
  return key === "Enter" || key === " " || key === "Spacebar";
}

/** Returns neighborhood-level coordinates; it never turns an exact address into a map pin. */
export function approximateAreaPoint(approximateArea: string, index: number) {
  const normalizedArea = approximateArea.toLowerCase();
  return Object.entries(areaCenters).find(([name]) => normalizedArea.includes(name))?.[1] || hashArea(approximateArea, index);
}
