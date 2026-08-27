export type DemoPost = {
  id: string;
  kind: "request" | "offer";
  title: string;
  description: string;
  displayName: string;
  category: "groceries" | "rides" | "tutoring" | "translation" | "accessibility";
  urgency: "flexible" | "this_week" | "today";
  approximateArea: string;
  skills: string[];
  availability: string;
  accessibilityNotes?: string;
  createdLabel: string;
  matchCount: number;
};

export type BoardFilters = {
  category: "all" | DemoPost["category"];
  urgency: "all" | DemoPost["urgency"];
  kind: "all" | DemoPost["kind"];
};

export const categoryMeta = {
  groceries: { label: "Groceries", emoji: "◒", color: "bg-amber-100 text-amber-900" },
  rides: { label: "Rides", emoji: "↗", color: "bg-sky-100 text-sky-900" },
  tutoring: { label: "Tutoring", emoji: "✦", color: "bg-violet-100 text-violet-900" },
  translation: { label: "Translation", emoji: "文", color: "bg-rose-100 text-rose-900" },
  accessibility: { label: "Accessibility", emoji: "◎", color: "bg-emerald-100 text-emerald-900" },
} as const;

export const urgencyMeta = {
  flexible: { label: "Flexible", className: "bg-stone-100 text-stone-700" },
  this_week: { label: "This week", className: "bg-orange-100 text-orange-800" },
  today: { label: "Today", className: "bg-rose-100 text-rose-800" },
} as const;

export const demoPosts: DemoPost[] = [
  {
    id: "demo-grocery-request",
    kind: "request",
    title: "A grocery pickup would help me recover at home",
    description: "I am recovering from a minor surgery and could use help collecting a short grocery list from the co-op. A quick doorstep drop-off is all I need.",
    displayName: "Maya · demo request",
    category: "groceries",
    urgency: "today",
    approximateArea: "Eastwood · about 1 mi",
    skills: ["shopping", "Spanish"],
    availability: "Today after 3 pm",
    accessibilityNotes: "Elevator building; please text before arriving.",
    createdLabel: "Posted 18 min ago",
    matchCount: 3,
  },
  {
    id: "demo-ride-request",
    kind: "request",
    title: "Ride to a physical therapy appointment",
    description: "Looking for a neighbor who could help with a round trip to a physical therapy appointment on Thursday. I can contribute toward parking.",
    displayName: "Jon · demo request",
    category: "rides",
    urgency: "this_week",
    approximateArea: "North Park · about 2 mi",
    skills: ["safe driving", "wheelchair-friendly vehicle"],
    availability: "Thursday, 9:30 am–12 pm",
    accessibilityNotes: "Foldable mobility aid will be joining us.",
    createdLabel: "Posted 42 min ago",
    matchCount: 2,
  },
  {
    id: "demo-tutoring-request",
    kind: "request",
    title: "Algebra study partner for my ninth grader",
    description: "My daughter would benefit from a patient one-hour review session before her upcoming algebra quiz. A library or video call both work.",
    displayName: "Sam · demo request",
    category: "tutoring",
    urgency: "this_week",
    approximateArea: "Riverside · about 3 mi",
    skills: ["algebra", "patient coaching"],
    availability: "Wednesday or Friday after 5 pm",
    createdLabel: "Posted 1 hr ago",
    matchCount: 4,
  },
  {
    id: "demo-translation-request",
    kind: "request",
    title: "Help reading a school enrollment form",
    description: "I would appreciate someone who can help me understand a school enrollment form and the next steps. A 20-minute phone or video call is enough.",
    displayName: "Lucía · demo request",
    category: "translation",
    urgency: "flexible",
    approximateArea: "Eastwood · online welcome",
    skills: ["Spanish", "forms"],
    availability: "Evenings this week",
    createdLabel: "Posted 2 hrs ago",
    matchCount: 1,
  },
  {
    id: "demo-access-request",
    kind: "request",
    title: "Companion for a low-vision grocery trip",
    description: "Seeking a neighbor to accompany me on a short grocery trip and help read labels. I know the store well and would value a second set of eyes.",
    displayName: "Elena · demo request",
    category: "accessibility",
    urgency: "this_week",
    approximateArea: "Cedar Hill · about 1 mi",
    skills: ["low-vision support", "label reading"],
    availability: "Saturday morning",
    accessibilityNotes: "Please describe shelf locations clearly rather than pointing.",
    createdLabel: "Posted 3 hrs ago",
    matchCount: 2,
  },
  {
    id: "demo-grocery-offer",
    kind: "offer",
    title: "I can combine grocery runs with a neighbor pickup",
    description: "I shop at the Eastwood co-op twice a week and can add a small grocery list to my trip. I am happy to communicate in English or Spanish.",
    displayName: "Ari · demo offer",
    category: "groceries",
    urgency: "today",
    approximateArea: "Eastwood · about 1 mi",
    skills: ["shopping", "Spanish", "accessibility support"],
    availability: "Today after 3 pm and Friday morning",
    createdLabel: "Available today",
    matchCount: 5,
  },
  {
    id: "demo-tutoring-offer",
    kind: "offer",
    title: "Patient algebra tutor with library availability",
    description: "I am a college engineering student offering relaxed, confidence-building algebra review sessions. I can meet at Riverside Library or video call.",
    displayName: "Nia · demo offer",
    category: "tutoring",
    urgency: "this_week",
    approximateArea: "Riverside · about 2 mi",
    skills: ["algebra", "patient coaching", "video tutoring"],
    availability: "Wednesday and Friday after 5 pm",
    createdLabel: "Available this week",
    matchCount: 3,
  },
  {
    id: "demo-ride-offer",
    kind: "offer",
    title: "Thursday morning rides with mobility-aid space",
    description: "I can offer a local ride on Thursday morning. My vehicle has space for a foldable mobility aid, and I am happy to wait during short appointments.",
    displayName: "Theo · demo offer",
    category: "rides",
    urgency: "this_week",
    approximateArea: "North Park · about 2 mi",
    skills: ["safe driving", "wheelchair-friendly vehicle", "appointment support"],
    availability: "Thursday, 9 am–1 pm",
    createdLabel: "Available this week",
    matchCount: 2,
  },
];

export const safeParseSkills = (value: string | string[]) => {
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const filterPosts = (posts: DemoPost[], filters: BoardFilters) => posts.filter(post =>
  (filters.category === "all" || post.category === filters.category) &&
  (filters.urgency === "all" || post.urgency === filters.urgency) &&
  (filters.kind === "all" || post.kind === filters.kind)
);
