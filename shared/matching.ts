export type MatchProfile = {
  category: "groceries" | "rides" | "tutoring" | "translation" | "accessibility";
  skills: string[];
  availability: string;
  approximateArea: string;
  urgency: "flexible" | "this_week" | "today";
  accessibilityNotes?: string | null;
};

export type CompatibilityResult = {
  score: number;
  reasons: string[];
};

export function buildFallbackExplanation(result: CompatibilityResult) {
  return `This match is a ${result.score}% fit because ${result.reasons.join(" ")}`;
}

export function isValidMatchPair(requestKind: "request" | "offer", offerKind: "request" | "offer") {
  return requestKind === "request" && offerKind === "offer";
}

export function postStatusForMatch(status: "proposed" | "matched" | "completed" | "declined") {
  if (status === "matched") return "matched" as const;
  if (status === "completed") return "completed" as const;
  return undefined;
}

const normalize = (value: string) => value.toLowerCase().trim();

const includesAny = (text: string, candidates: string[]) =>
  candidates.some(candidate => normalize(text).includes(normalize(candidate)));

export function scoreCompatibility(request: MatchProfile, offer: MatchProfile): CompatibilityResult {
  const requestSkills = request.skills.map(normalize);
  const offerSkills = offer.skills.map(normalize);
  const sharedSkills = requestSkills.filter(skill => offerSkills.some(offerSkill => offerSkill.includes(skill) || skill.includes(offerSkill)));
  const reasons: string[] = [];
  let score = 18;

  if (request.category === offer.category) {
    score += 30;
    reasons.push(`Both focus on ${request.category}.`);
  }

  if (sharedSkills.length > 0) {
    score += Math.min(sharedSkills.length * 16, 32);
    reasons.push(`Shared skills: ${sharedSkills.slice(0, 2).join(", ")}.`);
  }

  const requestArea = normalize(request.approximateArea).split(/[·,]/)[0];
  const offerArea = normalize(offer.approximateArea).split(/[·,]/)[0];
  if (requestArea && offerArea && (requestArea.includes(offerArea) || offerArea.includes(requestArea))) {
    score += 14;
    reasons.push("Approximate areas are aligned.");
  }

  const timeWords = ["today", "tomorrow", "morning", "afternoon", "evening", "weekend", "week"];
  const sharedTime = timeWords.filter(word => includesAny(request.availability, [word]) && includesAny(offer.availability, [word]));
  if (sharedTime.length > 0) {
    score += 13;
    reasons.push(`Availability overlaps around ${sharedTime[0]}.`);
  }

  const accessibilityKeywords = ["accessible", "mobility", "wheelchair", "elevator", "hearing", "vision", "support"];
  if (request.accessibilityNotes && includesAny(offer.skills.join(" "), accessibilityKeywords)) {
    score += 9;
    reasons.push("The offer includes relevant accessibility support.");
  }

  if (request.urgency === "today" && sharedTime.includes("today")) {
    score += 7;
    reasons.push("The timing supports a time-sensitive request.");
  }

  if (reasons.length === 0) reasons.push("The pair has a practical starting point for a human review.");
  return { score: Math.min(score, 98), reasons };
}
