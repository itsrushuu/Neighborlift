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

/** Resets Demo Mode playback state without creating or persisting a community post. */
export const demoPlaybackCancelledState = { demoPlaying: false, demoCelebrationVisible: false } as const;

export function clearDemoPlaybackTimers<T>(timers: T[], clearTimer: (timer: T) => void) {
  timers.forEach(clearTimer);
  return [] as T[];
}

/** Defines the non-persisting Demo Mode story beats used by the map auto-play. */
export const demoPlaybackPlan = [
  { type: "select-request", postId: "demo-grocery-request", atMs: 650 },
  { type: "celebrate-offer", atMs: 1500 },
  { type: "finish", atMs: 2800 },
  { type: "hide-celebration", atMs: 3600 },
] as const;

/** Selects the map’s explicit data source: labeled samples for demos or persisted activity for live use. */
export function selectMapPosts<T>(livePosts: T[] | undefined, demoPosts: T[], demoMode: boolean) {
  return demoMode ? demoPosts : livePosts || [];
}

/** Builds friendly, context-aware map prompts without exposing private post details. */
export function getFriendlyMapPrompts(categories: string[], hour: number) {
  const timePrompt = hour < 12
    ? "Good morning—there may be a neighbor you can brighten up today."
    : hour < 17
      ? "Have a little time this afternoon? Someone nearby may need it."
      : "A kind evening gesture can make tomorrow feel lighter.";
  const categoryPrompt = categories.includes("groceries")
    ? "Someone nearby could use a hand with everyday errands."
    : categories.includes("rides")
      ? "A ride can turn a tricky day into a manageable one."
      : categories.includes("tutoring")
        ? "A bit of knowledge shared can go a long way."
        : categories.includes("translation")
          ? "Language connects neighbors—your words might help someone feel understood."
          : categories.includes("accessibility")
            ? "Small accessibility-minded actions can open big doors."
            : "Every neighbor has something useful to share.";
  return [timePrompt, categoryPrompt, "A small offer can make someone’s whole day easier.", "You might be the neighbor someone has been hoping to find."];
}

/** Returns neighborhood-level coordinates; it never turns an exact address into a map pin. */
export function approximateAreaPoint(approximateArea: string, index: number) {
  const normalizedArea = approximateArea.toLowerCase();
  return Object.entries(areaCenters).find(([name]) => normalizedArea.includes(name))?.[1] || hashArea(approximateArea, index);
}
