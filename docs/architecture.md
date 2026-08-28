# NeighborLift architecture

NeighborLift is a typed React, tRPC, Express, and Drizzle application. The browser owns presentation and interaction state; server procedures own authentication, validation, persistence, matching inputs, and mutation side effects.

## Request flow

```text
User action
   ↓
React page and tRPC hook
   ↓
Authenticated or public tRPC procedure
   ↓
Validation and server-side business rule
   ↓
Drizzle query against MySQL/TiDB
   ↓
Typed response and targeted client refresh
```

Community posts are persisted in `helpPosts`. Matches are persisted separately in `helpMatches`, allowing proposed, matched, completed, and declined states. User preferences for the display name and availability are stored on the authenticated user record and are used as editable defaults for future posts.

## Matching flow

The ranking procedure compares structured post information: category, skills, availability, approximate area, urgency, and accessibility considerations. A deterministic score is calculated first. The server can then request a concise explanation from the configured language model. The UI presents the explanation as a review aid; it never auto-accepts a connection.

## Live refresh

The board, map, match workspace, and My Activity page use database-backed periodic refresh with immediate cache invalidation after relevant mutations. This keeps the prototype useful across multiple browser sessions without pretending that it uses a WebSocket transport.

## Map flow

The map derives neighborhood-safe coordinates from an approximate area. Posts without usable area context remain available in the list but are excluded from pin placement. Markers expose labels, button semantics, and Enter/Space activation so the same selection path works for pointer and keyboard users.

## UI principles

The visual system uses a neighborhood-noticeboard metaphor: warm paper tones, category color cues, rounded cards, clear hierarchy, and short human copy. Motion is reserved for small moments of feedback. The offer celebration is a polite, non-blocking status message and becomes static when reduced motion is preferred.
