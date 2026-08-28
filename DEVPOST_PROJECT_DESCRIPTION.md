# NeighborLift — Community help, matched with care

## Inspiration

Asking for help can be harder than offering it. Someone recovering from surgery may need a grocery pickup, a family may need help understanding a school form, or a student may need an hour of algebra review. At the same time, neighbors may have the time, skills, or access to help—but no comfortable way to find the right opportunity.

We built NeighborLift for that first, human moment of connection. The goal is not to turn care into a marketplace. It is to make everyday support easier to discover, safer to explore, and clearer to coordinate while keeping the final decision with the people involved.

## What it does

NeighborLift is a responsive community-help web app with two simple entry points: **Browse Help** and **Offer Support**. People can discover requests and offers across groceries, rides, tutoring, translation, and accessibility support. They can filter by post type, category, urgency, or skill, then open a post to understand the timing, approximate area, and context before deciding whether to respond.

The interactive community map adds a visual way to understand what is happening nearby. It uses privacy-safe neighborhood-level locations rather than exact addresses, provides category-aware activity insights, and adapts friendly prompts to the time of day and the kinds of help currently visible. Posts without a usable approximate area remain available in the list without receiving a map pin.

Signed-in users can create requests and offers with useful skills, availability, an approximate area, urgency, and optional accessibility considerations. They can personalize the display name and availability used on future posts. After a successful offer, NeighborLift responds with a small thank-you message and a restrained heart/confetti moment. The feedback is non-blocking, screen-reader friendly, and static for people who prefer reduced motion.

The app also includes an authenticated My Activity profile where people can revisit their requests, offers, matched connections, and completed assistance. Coordination moves through visible states so that a proposed connection can be reviewed, accepted, and later marked complete.

For demonstrations, the map includes an opt-in **Demo Mode**. It loads clearly labeled, non-personal sample posts across multiple categories, urgencies, skills, and approximate neighborhoods, making it easy for judges to explore filters and record a walkthrough without pretending that sample activity is real usage. Demo Mode can be opened directly with the map’s `?demo=1` URL parameter or enabled with the map toggle.

## How we built it

| Area | Technology and approach |
|---|---|
| Frontend | React 19, TypeScript, Tailwind CSS 4, Wouter, and Lucide icons |
| Backend | Express and tRPC with end-to-end typed procedures |
| Authentication | Manus OAuth with protected server procedures for posting and personal history |
| Data | MySQL/TiDB with Drizzle ORM tables for users, help posts, and help matches |
| Validation | Zod schemas validate community-post fields and bounded display preferences |
| Map | Google Maps JavaScript SDK through the configured proxy, with approximate-area coordinate handling |
| AI assistance | A server-side language-model call explains compatible matches without exposing credentials to the browser |
| Reliability | Deterministic compatibility scoring and local explanation fallback keep the workflow useful if AI assistance is unavailable |
| Live activity | Database-backed periodic refresh with immediate cache updates after relevant mutations |
| Testing | Vitest coverage for validation, filters, map privacy, marker keyboard behavior, matching, fallbacks, celebrations, and status logic |

The matching engine is deliberately hybrid. First, transparent deterministic scoring creates a dependable compatibility baseline from structured signals: complementary request and offer types, aligned categories, shared skills, overlapping availability, similar approximate areas, urgency, and relevant accessibility support. Second, a server-side language model turns that evidence into a concise explanation. This combines the usefulness of AI-generated communication with a grounded, inspectable foundation.

## Challenges we ran into

The most important challenge was designing an AI feature that felt helpful without making promises it could not keep. Community assistance contains context an algorithm cannot fully understand. A high score is not a safety guarantee, and it should never create an automatic commitment. We addressed this by presenting every result as a suggested connection for human review and by showing the factors behind the recommendation.

We also had to balance useful discovery with privacy. Exact home addresses might make matching more precise, but they are unnecessary for a first connection and would make the public experience less comfortable. NeighborLift uses approximate areas, excludes unusable locations from map pins, and keeps accessibility considerations optional and task-focused.

A third challenge was making the product feel warm instead of transactional. Small details mattered: plainspoken labels, human empty states, personalized posting defaults, a brief thank-you after an offer, and prompts that respond to the community context rather than repeating generic marketing copy.

## Accomplishments we are proud of

We are proud that NeighborLift has a complete path from discovery to coordination: a mission-led landing page, a filterable community board, authenticated request and offer creation, persisted user preferences, a privacy-safe interactive map, ranked recommendations, explainable AI assistance, coordination status transitions, and a private activity profile.

We are especially proud of the map experience. A judge can switch between live activity and clearly labeled Demo Mode, filter by help type, category, urgency, or skill, select accessible markers with a keyboard, inspect a post, and understand why some activity appears in the list without appearing as a pin.

The visual system is intentional as well. An editorial serif, warm paper-like surfaces, sage trust accents, approachable copy, and restrained motion make the app feel like a thoughtful neighborhood noticeboard rather than a generic marketplace. Loading, empty, unavailable, no-location, and AI-fallback states are treated as part of the product—not afterthoughts.

## What we learned

We learned that an AI feature is stronger when people can understand why it made a suggestion. Starting with a transparent score made the app easier to test, easier to explain, and safer to position than relying on a single black-box response. We also learned that privacy and accessibility are not optional polish for a community product; they should shape the data model, user flow, map behavior, and interface from the beginning.

On the technical side, we learned how strongly typed procedures, schema validation, shared filtering helpers, and focused tests can make a small full-stack project feel dependable under hackathon time constraints. We learned that a good demo should be honest too: Demo Mode helps judges see the product’s possibilities, while clear labels distinguish sample activity from authentic community participation.

## What’s next for NeighborLift

The next version would introduce consent-based private messaging after both people accept a match, multilingual onboarding, neighborhood partner verification, moderation and reporting tools, opt-in notifications, and stronger safeguarding practices for a real community rollout. We would also conduct user research with community organizations and measure impact through authentic participation rather than invented testimonials or usage numbers.

## Built for

HackSocial 2026 — a social-good project focused on helping communities turn small everyday moments into meaningful support.
