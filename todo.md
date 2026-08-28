# Project TODO

- [x] Define the NeighborLift request, offer, match, and match-status data model for community coordination.
- [x] Add database schema and server procedures for help requests, volunteer offers, matching, and status transitions.
- [x] Add server-side validation for match creation: verify both posts exist, enforce request↔offer pairing, and compute compatibility data on the server.
- [x] Implement coordinated status-transition logic so marking a match as matched or completed updates related help-post statuses consistently.
- [x] Add tests for invalid pairings and status-transition behavior across matching logic.
- [x] Wire the detail workspace to fetch and display persisted matches for a live post.
- [x] Add a server-side candidate-ranking procedure and a ranked candidate list for live posts.
- [x] Connect live match status controls to saved status transitions and refresh the visible state.
- [x] Build a public landing page that explains the NeighborLift mission and guides visitors to browse help or offer support.
- [x] Build a filterable community help board with seeded demo requests for groceries, rides, tutoring, translation, and accessibility support.
- [x] Add category and urgency filtering with clear empty, loading, and error states.
- [x] Build an authenticated request or volunteer-offer form covering skills, availability, approximate area, urgency, and accessibility considerations.
- [x] Build request-detail and offer-detail views with proposed matches and clear coordination status.
- [x] Implement explainable AI-assisted compatibility ranking based on skills, availability, proximity, urgency, and accessibility needs.
- [x] Let users mark assistance as matched or completed with visible status updates.
- [x] Apply an elegant, accessible, responsive visual system that keeps Browse Help and Offer Support as the primary journeys.
- [x] Write or update Vitest coverage for matching logic, validation, and status transitions.
- [x] Verify desktop and mobile rendering, TypeScript checks, tests, and key error states.
- [x] Exercise a missing-post recovery state and add reproducible tests for empty-filter and AI-fallback scenarios.
- [x] Prepare the project description, setup notes, and judge-facing submission checklist.
- [x] Build an authenticated profile page showing a user’s request, offer, and completed-assistance history.
- [x] Add a profile navigation entry and clear empty, loading, and error states for personal activity.
- [x] Add test coverage for user-specific community-post history.
- [x] Verify the authenticated `community.mine` path passes only the signed-in user ID and returns completed request/offer history.
- [x] Finalize a complete Devpost project description covering inspiration, functionality, tech stack, challenges, accomplishments, learning, and next steps.
- [x] Create and validate a reusable skill that captures the HackSocial project-development workflow used for NeighborLift.
- [x] Export the updated project to a GitHub repository and provide the repository URL for Devpost.
- [x] Assist with GitHub reauthorization through the browser if user consent is required, then publish the code to the supplied repository.
- [x] Share the verified GitHub repository URL for use in the Devpost submission.
- [x] Re-verify the updated profile flow, tests, build, and submission materials before the final checkpoint.
- [x] Restart the development server after resolving the stale match-summary module state and verify the landing, profile, and match-detail routes load.
- [x] Run a clean final type, test, and production-build pass after the development-server restart.
- [x] Verify the authenticated profile’s first-time empty state in the browser and cover populated history data through the authenticated router test.
- [x] Complete a final post-profile review of both Devpost submission documents.
- [x] Add My Activity sorting for newest, oldest, status, requests, and offers.
- [x] Enhance My Activity with smooth loading skeletons and accessible hover/focus feedback.
- [x] Add tests for My Activity sorting and filtering behavior.
- [x] Deferred at the user’s request: create two authenticated community posts through the normal app flow when the user is ready to sign in.
- [x] Complete a product-wide UI/UX refinement for the landing, discovery, creation, matching, and profile experiences.
- [x] Improve responsive navigation, interaction feedback, and accessibility cues across key journeys.
- [x] Re-verify the refined project’s visual states, TypeScript checks, tests, and production build.
- [x] Synchronize the refreshed NeighborLift code to the connected GitHub repository.
- [x] Verify that the GitHub `main` revision matches the polished NeighborLift UI/UX checkpoint.
- [x] Add resilient live refresh for the help board, match workspace, and My Activity profile using persisted server data.
- [x] Provide visible live-refresh feedback and immediate cache updates after creating posts or changing match status.
- [x] Verify that the live-data behavior works in local development and remains safe for deployed multi-user use.
- [x] Add automated coverage for live-refresh configuration and mutation cache invalidation.
- [x] Extract and test post-creation and match-status cache-refresh routines used by the live-data workflows.
- [x] Synchronize the real-data update to the connected GitHub repository.

- [x] Add an interactive real-time map route powered by persisted community posts.
- [x] Visualize neighborhood-safe locations with accessible category icons and request/offer distinction.
- [x] Add map filters, selected-post detail panel, legend, and live refresh feedback.
- [x] Add friendly activity insights for active requests, offers, urgent needs, and category mix.
- [x] Add map loading, empty, error, unavailable, and no-location fallbacks.
- [x] Verify map responsiveness, keyboard accessibility, local runtime, tests, and production build.
- [x] Synchronize the interactive map update to GitHub.

> Real demonstration-post creation remains deferred at the user’s request; map demo cards remain clearly labeled as demo content until authentic community posts exist.

- [x] Add an explicit no-location map fallback that excludes posts without usable approximate areas from pin placement.
- [x] Add targeted keyboard-accessibility coverage and verification for map filters, activity rows, and marker selection.

- [x] Push and verify the latest interactive map changes on the connected GitHub main branch.
- [x] Add targeted keyboard interaction coverage for filters, activity rows, and marker Enter/Space selection behavior.

- [x] Add map filters for post type, category, urgency, and searchable skill/tag terms.
- [x] Keep map pins, activity list, counts, selected post, empty states, and clear-all controls synchronized with filters.
- [x] Add tests and responsive accessibility verification for the expanded map filtering experience.

- [x] Add an urgency filter control to the live map and synchronize it with pins and results.
- [x] Add searchable skill/tag text input alongside preset tag chips.
- [x] Extend tests for urgency and searchable tags and verify filter controls are keyboard-accessible and responsive.

- [x] Make the live map copy and interaction cues feel more human, warm, and neighbor-to-neighbor.

- [x] Add persisted user preferences for the display name and availability shown on new posts.
- [x] Add a lightweight thank-you message or animation after a neighbor offers help on a post.
- [x] Add rotating friendly encouragement prompts to the live map with reduced-motion-safe behavior.

- [x] Add a small heart/confetti celebration after a neighbor offers help, with reduced-motion support.
- [x] Personalize rotating map prompts using local time of day and nearby post categories.
- [x] Add tests and responsive accessibility verification for the celebration and contextual prompts.

- [x] Add automated coverage for the offer celebration trigger conditions and reduced-motion-safe fallback.
- [x] Verify and document celebration accessibility behavior: non-blocking status message, screen-reader announcement, and no motion under prefers-reduced-motion.

- [x] Restrict the celebration UI to successful offer posts and test that requests do not trigger it.
- [x] Align celebration motion classes with actual CSS and document the non-blocking reduced-motion accessibility behavior.

- [x] Rewrite README.md as a judge-ready project overview with demo flow, architecture, privacy, setup, testing, and learning sections.
- [x] Add concise supporting docs for architecture, privacy decisions, and the demo walkthrough.
- [x] Verify repository hygiene, documentation links, tests, TypeScript, and production build before GitHub synchronization.
- [x] Synchronize the polished repository package to the connected GitHub main branch.

- [x] Replace root-relative README app links with judge-friendly live prototype URLs or clearly labeled route text.
- [x] Re-verify all README and supporting-document links plus repository hygiene, tests, TypeScript, and production build.
- [x] Commit and push the README/docs package to GitHub main and verify the remote contains the new files.
