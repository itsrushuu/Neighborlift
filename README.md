# NeighborLift

> **A kinder way to ask for help, offer support, and find the right neighbor.**

NeighborLift is a social-good web app for everyday community support. People can request help with groceries, rides, tutoring, translation, or accessibility needs; neighbors can offer time and skills; and explainable matching helps surface promising connections without making decisions for people.

**HackSocial 2026 project** · [Live prototype](https://3000-ih2fssvx185rdibod2ph0-fe67d51d.us3.manus.computer) · [GitHub repository](https://github.com/itsrushuu/Neighborlift) · [Devpost project description](./DEVPOST_PROJECT_DESCRIPTION.md)

> **Demo GIF placeholder**
>
> Replace this block with a short recording before submission:
>
> `![NeighborLift demo](./docs/demo.gif)`
>
> The recommended recording should show one complete journey: browse a help post, filter the live map, inspect an explainable match, and publish an offer. Keep it brief, crop out private information, and use authentic activity whenever possible.

## Why it matters

People regularly need practical support, while other people nearby are willing to help but do not know where their time or skills would be useful. Existing community tools can feel transactional, difficult to search, or careless with personal information. NeighborLift creates a more human first step: describe the need or offer, discover nearby activity at an approximate neighborhood level, and review an explainable suggested connection before choosing whether to coordinate.

## The judge walkthrough

The clearest way to experience the prototype is to follow one complete story.

1. Open the [community board](https://3000-ih2fssvx185rdibod2ph0-fe67d51d.us3.manus.computer/board) and browse requests and offers.
2. Open the [live map](https://3000-ih2fssvx185rdibod2ph0-fe67d51d.us3.manus.computer/map?demo=1), or press **Try Demo Mode** on the map to load clearly labeled, non-personal sample posts for a populated walkthrough. Filter by help type, category, urgency, or skill, and select a post.
3. Open a post detail page to review the AI-assisted compatibility explanation and coordination status.
4. Sign in to publish a request or offer at [`/new/request`](https://3000-ih2fssvx185rdibod2ph0-fe67d51d.us3.manus.computer/new/request) or [`/new/offer`](https://3000-ih2fssvx185rdibod2ph0-fe67d51d.us3.manus.computer/new/offer).
5. Visit [`/profile`](https://3000-ih2fssvx185rdibod2ph0-fe67d51d.us3.manus.computer/profile) to see personal activity history and saved display preferences.

The visible sample posts are clearly marked as demo content. Demo Mode can be opened directly with `?demo=1`, or enabled with the map toggle. Turning it off returns to persisted live activity; authentic community-post creation remains available through the normal authenticated flow.

## What is built

| Experience | What it does |
|---|---|
| Community board | Browse and filter requests and neighbor offers with loading, empty, error, and live-refresh states. |
| Privacy-safe live map | Shows approximate neighborhood-level pins, category icons, activity insights, and no-location fallbacks. |
| Explainable matching | Ranks compatibility using skills, timing, approximate area, urgency, and accessibility considerations, then explains the result in plain language. |
| Authenticated posting | Lets people create requests and offers with skills, availability, approximate area, and optional accessibility notes. |
| Personal activity | Shows a user’s request, offer, matched, and completed history with sorting and filtering. |
| Human-centered feedback | Saves preferred display name and availability, provides a small accessible thank-you celebration, and adapts map prompts to time and nearby categories. |
| Demo Mode | Opt-in sample posts make the map easy to record and evaluate without pretending that sample activity is real community usage. |

## AI approach

NeighborLift uses a hybrid matching design. Deterministic server-side scoring evaluates structured compatibility signals such as skills, timing, approximate area, urgency, and accessibility needs. A server-side language model then turns those signals into a short explanation that people can understand. The result is a suggestion for human review, not an automatic decision or an assurance that a connection will work.

## Architecture

```text
React 19 + TypeScript + Tailwind CSS 4
                │
                ▼
      tRPC typed client procedures
                │
                ▼
 Express server + Manus OAuth + Drizzle ORM
                │
                ├── MySQL/TiDB persisted community data
                ├── deterministic compatibility scoring
                └── server-side LLM match explanations
```

The Google Maps SDK is accessed through the configured proxy integration. Live activity uses database-backed periodic refresh, with immediate cache invalidation after relevant mutations. Shared TypeScript helpers keep filtering, coordinate safety, marker accessibility, celebration behavior, and matching vocabulary consistent across client and server code.

For more detail, see [the architecture notes](./docs/architecture.md).

## Privacy and safety decisions

NeighborLift never plots exact addresses. Map coordinates are derived from an approximate area and are intentionally softened to neighborhood-level context. Posts can omit a usable area and remain visible in the activity list without receiving a map pin. Accessibility notes are optional, and the matching explanation exposes the factors behind a suggestion instead of presenting an opaque score.

Read the full design rationale in [docs/privacy.md](./docs/privacy.md).

## Technology

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Wouter, Tailwind CSS 4, Lucide icons |
| Backend | Node.js, Express, tRPC 11 |
| Data | MySQL/TiDB with Drizzle ORM |
| Authentication | Manus OAuth |
| Maps | Google Maps JavaScript SDK through the configured proxy |
| AI | Server-side GPT-5-mini explanations over deterministic match signals |
| Quality | Vitest, TypeScript compiler, Vite production build |

## Run locally

### Prerequisites

Use Node.js with pnpm and provide the project’s required runtime environment, including database and authentication configuration. Do not commit `.env` files or credentials.

### Install and start

```bash
pnpm install
pnpm dev
```

Open the local address printed by the development server. The primary routes are `/`, `/board`, `/map`, `/new/request`, `/new/offer`, `/help/:id`, and `/profile`.

### Validate the project

```bash
pnpm test
pnpm check
pnpm build
```

The current verified state includes **29 passing Vitest tests**, clean TypeScript validation, and a successful production build.

## Deploy (Railway + MySQL/TiDB)

This project runs as a long-lived Node.js service, so deploy it to a host such as Railway, Render, Fly.io, or a VPS. The configuration in this repository is prepared for Railway.

### 1) Create infrastructure

1. Create a Railway project for this repository.
2. Add a **MySQL** service (or use an external TiDB cluster).
3. Connect the Node app service to that database.

### 2) Set required environment variables

Copy values from your infrastructure and identity provider settings, then configure:

- `DATABASE_URL`
- `JWT_SECRET`
- `VITE_APP_ID`
- `OAUTH_SERVER_URL`
- `OWNER_OPEN_ID`
- `BUILT_IN_FORGE_API_URL`
- `BUILT_IN_FORGE_API_KEY`
- `NODE_ENV=production`

A starter template is included at `/home/runner/work/Neighborlift/Neighborlift/.env.example`.

### 3) Build and start commands

Use these commands in your host configuration:

- Build: `pnpm install --frozen-lockfile && pnpm build`
- Start: `pnpm start`

### 4) Run database migrations before first production start

Run:

```bash
pnpm db:push
```

### 5) Verify deployment

After deploy, open and validate:

- `/board`
- `/map`
- Authenticated flow: `/new/request` or `/new/offer`

## Repository guide

```text
client/src/pages/       User-facing routes and journeys
client/src/components/  Shared layout, map, and UI components
server/routers/         Typed community and matching procedures
server/*.test.ts        Deterministic validation and behavior tests
drizzle/schema.ts      Database tables and typed inserts/shared models
shared/                 Privacy, matching, map, and celebration contracts
docs/                   Architecture, privacy, and demo notes
```

## Tester feedback

This section is intentionally a template until real people have tried NeighborLift. Do not publish invented quotes, ratings, or testimonials. After a tester gives permission, replace the fields below with their exact words and a short description of what they tried.

### Feedback entry template

| Field | Replace with |
|---|---|
| Tester context | `[e.g., student volunteer, community organizer, neighbor]` |
| What they tried | `[route or task they completed]` |
| Exact feedback | `[Paste a genuine quote verbatim after receiving permission]` |
| What changed | `[Describe the product improvement you made, if any]` |

### How to record and upload the demo GIF

1. Open the live prototype and close any personal tabs, notifications, or account details that should not appear in the recording.
2. Record a 30–90 second walkthrough using Windows Snipping Tool, Xbox Game Bar, macOS Screenshot, or another screen recorder. Move the cursor slowly and pause briefly when showing the map filter, match explanation, and offer confirmation.
3. Convert the recording to GIF and keep it lightweight. A width around 960px and a file size under 5MB is a practical target for a README and hackathon submission. If your recorder exports MP4, use a trusted local converter rather than uploading private footage to an unknown website.
4. Save the final file as `docs/demo.gif` in this repository. You can upload it on GitHub by opening the repository, selecting **Add file → Upload files**, dragging in `docs/demo.gif`, and committing to `main`; or use Git locally with `git add docs/demo.gif`, `git commit -m "docs: add demo walkthrough gif"`, and `git push origin main`.
5. Confirm that the image renders from the README on GitHub and that the GIF does not reveal exact addresses, private messages, credentials, or other personal information.

## What we learned

The project reinforced that useful AI in a community product should support human judgment rather than replace it. We also learned that privacy is part of the interaction design: approximate areas, clear fallbacks, and plain-language explanations make the product feel safer before a user ever coordinates with another person. Finally, keeping the filtering, matching, and live-refresh contracts typed across the stack made it easier to iterate quickly without losing consistency.

## Future direction

The next responsible steps are user research with real community organizations, moderation and reporting workflows, opt-in notifications, multilingual support, and impact measurement based on authentic activity. The prototype intentionally avoids inventing testimonials or usage metrics; those should come from real participants.

## Hackathon submission

NeighborLift was built for HackSocial 2026 and is designed to demonstrate both social impact and practical engineering. The prepared [Devpost project description](./DEVPOST_PROJECT_DESCRIPTION.md) contains the longer inspiration, functionality, challenges, accomplishments, learning, and next-steps narrative. A reusable development workflow is also captured in the project’s social-good hackathon skill materials.

## License

This project is released under the MIT License.
