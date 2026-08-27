# NeighborLift

> **Community help, matched with care.**

NeighborLift is a responsive community-help web app that makes it easier to discover a practical need, offer a useful skill, and review a respectful, explainable match. It is designed around the belief that small acts of care—such as a grocery pickup, a ride to an appointment, or an hour of tutoring—should not be difficult to find or coordinate.

## Devpost project description

### Inspiration

Asking for help can be harder than helping. Everyday needs often fall through the cracks not because neighbors do not care, but because there is no low-pressure, privacy-conscious way to find one another. NeighborLift turns these moments into clear, manageable requests and offers. It keeps the interaction human: the system suggests a compatible connection, but people decide whether to proceed.

### What it does

NeighborLift offers two primary journeys: **Browse Help** and **Offer Support**. Visitors can explore a community board containing clearly labeled requests and volunteer offers across groceries, rides, tutoring, translation, and accessibility support. They can filter the board by category, urgency, and post type, then open a detailed view to understand the relevant skills, timing, approximate area, and accessibility considerations.

Signed-in users can publish a request or offer with an approximate area rather than an exact address. NeighborLift evaluates compatible request-offer pairs using shared skills, timing overlap, approximate-area alignment, urgency, and relevant accessibility support. It returns a ranked list with concise, human-readable reasons. Users can then mark a proposed match as matched or completed, while the interface updates the coordination state clearly.

### How we built it

| Layer | Implementation |
| --- | --- |
| Client experience | React 19, TypeScript, Tailwind CSS 4, Wouter, and Lucide icons |
| Server and API | Express, tRPC, Zod validation, and Manus OAuth |
| Data | MySQL/TiDB through Drizzle ORM with `helpPosts` and `helpMatches` tables |
| AI assistance | A server-side, structured language-model explanation layered over transparent compatibility scoring |
| Quality | Vitest coverage for input validation, match pairing, score logic, status mapping, empty filtering, and AI fallback behavior |

The matching engine uses a deterministic compatibility baseline so rankings remain traceable. It rewards complementary request-offer categories, shared skills, approximate area alignment, time overlap, accessibility-relevant support, and alignment with time-sensitive requests. A server-side language model then translates the score into a short explanation; if that service is unavailable, NeighborLift returns a clear local explanation instead of blocking the match workflow.

### Challenges we ran into

The core challenge was balancing helpful recommendations with human agency. A purely automated connection tool could overstate certainty, mishandle context, or make people uncomfortable. We addressed that by treating each result as a **suggestion for human review**, not an automated commitment. We also designed the form and match views to use approximate area information first and to surface accessibility considerations as a useful preference, not a judgment.

### Accomplishments that we are proud of

NeighborLift brings together a polished, mobile-friendly interface and an end-to-end community coordination model. The app includes a public landing experience, a demo-ready help board, authenticated creation flows, persistent data structures, ranked matches, explainable AI assistance, match status transitions, and clear fallback or recovery states. Its visual style is intentionally warm and civic rather than transactional, helping the app feel more like a thoughtful neighborhood facilitator than a marketplace.

### What we learned

We learned that “AI-powered” is stronger when the user can understand and challenge the recommendation. Building an explainable baseline first made the AI layer safer, easier to test, and more useful. We also learned that accessibility and privacy should shape the information architecture from the beginning, rather than becoming decorative features added at the end.

### What is next for NeighborLift

The next iteration would add consent-based private messaging after both people accept a match, community partner verification, better approximate-distance calculations, moderation and reporting workflows, multilingual onboarding, and opt-in notifications. A production launch would also require a fuller trust-and-safety program, including explicit consent controls and local community partnerships.

## Judge-facing demo script

This approximately 90-second walkthrough is designed for the live app or a screen recording.

| Time | Demonstration | Narration |
| --- | --- | --- |
| 0:00–0:15 | Open the landing page. | “NeighborLift makes everyday community support easier to discover, request, offer, and coordinate—without making care feel transactional.” |
| 0:15–0:30 | Select **Browse Help** and use category or urgency filters. | “The board keeps the decision simple. I can quickly focus on a category, such as groceries or accessibility support, and choose the timing that works for me.” |
| 0:30–0:45 | Open the grocery request. | “Each post exposes only the information needed to decide whether I can help: an approximate area, availability, useful skills, and any accessibility considerations.” |
| 0:45–1:05 | Select **Explain this match**. | “NeighborLift ranks a complementary offer against the request using skills, timing, area, urgency, and access needs. It shows why the match may work, while leaving the decision with people.” |
| 1:05–1:18 | Mark a match as matched, then completed. | “Once both people agree, the match advances from proposed to matched and then completed, so coordination remains clear.” |
| 1:18–1:30 | Open **Offer Support**. | “Finally, a neighbor can publish a new offer or request with a privacy-conscious form. This is a small tool for making it easier to show up for one another.” |

## Submission checklist

| Item | Status | Notes |
| --- | --- | --- |
| Working prototype | Ready | Use the project preview during development; publish from the project interface for a shareable live link. |
| Source code | Ready | Export the project to GitHub or download the code archive from the project interface. |
| Project description | Ready | Paste the **Devpost project description** section above. |
| Demo video | Recommended | Record the 90-second script above with a browser screen recorder. |
| Screenshots | Recommended | Capture the landing page, board, offer form, and match-detail view. |
| Team registration | Confirm manually | Each participant must be registered before submission. |

## Notes for submission

The included community cards are clearly presented as **demo posts** for judge exploration. NeighborLift does not present them as real endorsements, user reviews, or live personal data. The project should be described as an MVP that prioritizes clear consent, privacy-conscious disclosure, and human review.

HackSocial requires a project description, the problem addressed, and a way for judges to evaluate the project; the overview also emphasizes technical execution, innovation and creativity, and UI/design. [1]

## References

[1] [HackSocial 2026 on Devpost](https://hacksocial2026.devpost.com/)
