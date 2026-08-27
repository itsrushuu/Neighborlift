# NeighborLift — Community help, matched with care

## Inspiration

Asking for help can be harder than offering it. A neighbor recovering from surgery may need a grocery pickup, a family may need help understanding a school form, or a student may benefit from an hour of algebra review. In each case, people in the community may be willing to help, but they often do not have a comfortable, trustworthy way to find one another.

We built NeighborLift to make everyday care easier to discover and coordinate. The project begins with a simple principle: technology should lower the friction around small acts of support without taking agency away from the people involved. Rather than treating neighbors as transactions, NeighborLift presents clear requests and offers, explains why a connection may be useful, and leaves the final decision to humans.

## What it does

NeighborLift is a responsive community-help web app with two clear entry points: **Browse Help** and **Offer Support**. The public community board includes practical requests and volunteer offers in five everyday categories: groceries, rides, tutoring, translation, and accessibility support. Visitors can filter posts by category, urgency, and post type, then open a detailed view to understand the timing, approximate area, helpful skills, and accessibility considerations.

Signed-in users can create a help request or volunteer offer. The privacy-conscious form asks for only the information that helps someone assess fit: useful skills or needs, availability, an approximate area, urgency, and optional accessibility considerations. It intentionally avoids asking for precise addresses in the public flow.

NeighborLift also includes an AI-assisted matching experience. When a request and an offer are compatible, the app ranks the pair using shared skills, availability overlap, approximate-area alignment, urgency, and relevant accessibility support. It displays human-readable reasons for the score so the recommendation is understandable rather than opaque. People can review a proposed connection, mark it as matched, and later mark the assistance as completed.

Finally, the authenticated profile gives each person a private view of their activity history. It summarizes past requests, offers, and completed assistance, while providing dedicated filters to revisit each type of contribution.

## How we built it

| Area | Technology and approach |
| --- | --- |
| Frontend | React 19, TypeScript, Tailwind CSS 4, Wouter, and Lucide icons |
| Backend | Express and tRPC with end-to-end typed procedures |
| Authentication | Manus OAuth with protected server procedures for posting and personal history |
| Data | MySQL/TiDB with Drizzle ORM tables for help posts and help matches |
| Validation | Zod schemas validate community-post fields before data is saved |
| AI assistance | A server-side structured language-model call explains compatible matches without exposing credentials to the browser |
| Reliability | Deterministic compatibility scoring and local explanation fallback keep the main workflow useful if the AI explanation is unavailable |
| Testing | Vitest coverage for validation, user-scoped history, filters, matching, fallback behavior, and status logic |

The matching engine is deliberately hybrid. First, it applies transparent, deterministic scoring to create a dependable compatibility baseline. It rewards a complementary request-offer pair, aligned category, shared skills, overlapping availability, similar approximate areas, time-sensitive urgency when appropriate, and relevant accessibility support. Second, a server-side language model turns that evidence into a concise explanation. This creates an experience that benefits from AI communication while keeping the recommendation auditable and grounded in visible data.

## Challenges we ran into

The most important challenge was designing an AI feature that felt helpful without making promises it could not keep. Community assistance has context that an algorithm cannot fully understand, so a high score should not be mistaken for a safety guarantee or an automatic commitment. We addressed this by framing every result as a suggested connection for human review. The language throughout the app reinforces that the people involved decide whether, when, and how to coordinate.

We also balanced useful matching signals with privacy. Exact home addresses might make matching more precise, but they are not necessary for an early-stage connection and would make the public experience less comfortable. NeighborLift therefore uses approximate areas in the first interaction and treats accessibility considerations as respectful preferences that can make an offer more useful.

## Accomplishments that we are proud of

We are proud that NeighborLift combines a warm, polished user experience with a complete technical path from discovery to coordination. The project includes a mission-led landing page, a responsive and filterable help board, authenticated request and offer creation, persistent post and match data, ranked recommendations, explainable AI assistance, status transitions, and a private activity profile.

The visual system is also intentional. We used an editorial serif, a warm paper-like background, and sage trust accents to make the product feel like a thoughtful neighborhood facilitator rather than a generic marketplace. The interface works across desktop and mobile layouts and includes loading, empty, unavailable, and AI-fallback states so judges can understand how it handles more than the ideal path.

## What we learned

We learned that an AI feature is stronger when people can understand why it made a suggestion. Starting with a transparent score made the app easier to test, easier to explain, and safer to use than relying on a single black-box response. We also learned that privacy and accessibility are not optional polish for a community product; they should shape the data model, user flow, and interface from the first design decision.

On the technical side, we learned how strongly typed procedures, schema validation, and focused tests can make a small full-stack project feel dependable even under hackathon time constraints. A thoughtful fallback path was equally important: if an AI explanation cannot be generated, NeighborLift still provides a useful compatibility result instead of preventing a potential act of care.

## What’s next for NeighborLift

The next version would introduce consent-based private messaging after both people accept a match, multilingual onboarding, neighborhood partner verification, moderation and reporting tools, opt-in notifications, and more precise approximate-distance calculations. For a real community rollout, we would also work with local organizations to develop robust consent, safeguarding, and trust-and-safety practices.

## Built for

HackSocial 2026 — a social-good project focused on helping communities turn small everyday moments into meaningful support.
