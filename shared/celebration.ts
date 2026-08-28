export type CelebrationTrigger = "offer-published" | "connection-matched" | "other";

export function shouldCelebrate(trigger: CelebrationTrigger) {
  return trigger === "offer-published" || trigger === "connection-matched";
}

export function celebrationTriggerForPostKind(postKind: "request" | "offer"): CelebrationTrigger {
  return postKind === "offer" ? "offer-published" : "other";
}

/** The celebration is a polite, non-blocking status; reduced-motion users see the same message without animation. */
export const celebrationAccessibility = {
  role: "status",
  ariaLive: "polite",
  nonBlocking: true,
  reducedMotionFallback: "static-message",
} as const;

export const celebrationCopy = {
  offerPublished: "That kindness is on its way.",
  connectionMatched: "Thanks for stepping in.",
} as const;


export function celebrationMotionClass(prefersReducedMotion: boolean) {
  return prefersReducedMotion ? "offer-celebration-static" : "offer-celebration-animated";
}
