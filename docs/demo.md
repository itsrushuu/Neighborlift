# NeighborLift judge walkthrough

## One-minute story

Start on the landing page and introduce the problem: a neighbor may need practical support, while another neighbor has time or a useful skill but no clear way to connect.

Open `/board` and show that requests and offers are discoverable by category and urgency. Move to `/map`, search for a skill such as `Spanish` or `driving`, and select a nearby post. Point out that the location is approximate and that posts without usable area context remain visible without a map pin.

Open the selected post. Use the matching workspace to show the compatibility score and plain-language explanation. Emphasize that the system supports human review rather than making an automatic decision.

Open `/new/offer` to show the friendly form. Enter a display name and availability; those values are saved as editable defaults for future posts. After a successful offer, the user receives a brief thank-you message and a small heart/confetti flourish. The effect is non-blocking and becomes static for reduced-motion users.

Finish on `/profile` to show the user’s activity history. Close by explaining that NeighborLift is intentionally honest about its prototype stage: the sample posts are labeled, and future impact claims will come from real participation.

## Judge talking points

| Topic | Point to make |
|---|---|
| Social impact | The product lowers the friction of asking for and offering everyday help. |
| AI | Deterministic compatibility signals are paired with an understandable server-side explanation. |
| Privacy | Approximate neighborhood context is enough for discovery; exact addresses are not plotted. |
| UX | The experience uses approachable language, clear empty states, keyboard-safe controls, and restrained feedback motion. |
| Engineering | Typed tRPC procedures, persisted coordination state, database-backed refresh, and automated tests support the prototype. |
