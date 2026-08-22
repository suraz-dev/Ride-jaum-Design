# R17 — Mobile Integration Hardening and Release-Readiness QA

> **Status:** Ready for implementation
>
> **Scope boundary:** R17 hardens the fixture-backed R6–R16 mobile foundation as one application. It does **not** add backend/API integration, authentication, native map/GPS services, persistence, transport, or new product features.

## Objective

Validate and refine the current mobile foundation so it behaves and reads as one coherent app on device: reliable navigation, truthful resilient states, accessible interactions, safe layout, and consistent RideJaunm presentation across all supported themes and language previews.

The visual direction remains **a Himalayan riding instrument**: map-first, compact, tactile, calm, outdoor-readable, and safety-first. Do not reintroduce emoji controls, generic dashboard treatment, or rider-facing implementation vocabulary.

## Required integration scope

### 1. Navigation and return paths

Validate all existing paths between Ride, Plan, SOS, Squad, Profile, Garage, Offline Maps, Trip Readiness, sheets, dialogs, and other secondary surfaces.

- Active primary tab, selected inner tab, close/dismiss action, and back/return action must be clear and deterministic.
- A modal or sheet must dismiss to its originating state; there must be no navigation dead end.
- Preserve the centre SOS navigation entry and its visually distinct treatment. It must not activate an emergency flow simply from navigation.
- Do not introduce deep links, persistence, global route restoration, or backend-driven navigation.

### 2. Resilient state presentation

For every primary section, cover the existing presentation-level states where applicable:

| State | Required treatment |
|---|---|
| Loading | Clear non-blocking treatment; no fabricated progress/result claim |
| Empty | Helpful next step with no fake user/content history |
| Offline / mesh-only | Explicit limitation, cached/local-preview provenance, no transfer/relay claim |
| No signal | High-contrast constrained-mode banner and degraded capability wording |
| Error / retry | Describes only the local preview/rendering condition; retry must not imply an API/map download started |
| Local preview | Rider-friendly `Local preview`, `Cached map preview`, or `Last-known location` wording as appropriate |

Do not show `fixture`, `mock`, `synthetic`, `debug`, or implementation-state vocabulary to riders. This rule does not remove required SOS simulation/limitation wording: SOS must continue to state explicitly that no alert, contact, or emergency-service delivery occurred.

### 3. Accessibility and interaction

- Every actionable control must have an accessible role, label, and selected/expanded/disabled state where relevant.
- Verify focus order for each primary screen, sheet, and modal. Dialogs require a meaningful title and safe close/cancel route.
- Respect design-system touch targets: **48dp minimum**, **56dp in-ride**, **72dp PTT**, and **88dp SOS**.
- Validate text wrapping and readability under English, Nepali, and Hindi previews, including long Devanagari content.
- Preserve all R15 SOS hold, accessible-confirmation, early-release, cancel, active-preview, and stand-down semantics exactly.

### 4. Device, safe-area, and theme QA

Validate small and standard iPhone layouts.

- No header, map control, sheet, keyboard, or bottom-nav overlap with the Dynamic Island or home indicator.
- Map controls must remain tappable, legible, and leave attribution visible.
- Keyboards must not obscure destination search, waypoint editing, chat composition, or other focused input.
- Verify Night, Day Glare, Dusk, and Blackout. Contrast must remain usable outdoors; SOS Red remains emergency-only.
- Preserve route color semantics: Straight cyan, Curvy volt, Supercurvy magenta, Alternative blue dashed, Hazard red dashed, Detour orange dashed, Lost gray dashed.

### 5. Regression and QA evidence

Add focused deterministic tests for any navigation, state, accessibility, or layout behavior changed by R17. Do not delete valid R6–R16 regression or safety assertions.

Required commands: `npm run typecheck`, `npm test -- --runInBand`, and `git diff --check dev...HEAD`. The test run must have no suppressed diagnostics or console warnings/errors.

Provide PR evidence for Ride, Plan, SOS, Squad, Profile, and Offline Maps in at least Night and Day Glare, plus a compact matrix covering navigation, safe area, theme, language preview, offline/no-signal, and accessibility validation.

## Truth and safety invariants

- No network/API client, WebSocket, backend endpoint, auth, real map provider, GPS, background location, Bluetooth/mesh, phone dial, PTT transport, notification, analytics, deep link, or external share action.
- No AsyncStorage/file/secure-store writes, removals, or clears outside the already-accepted foundation scope; do not add new persistence or outbox mutation.
- Do not claim an actual map pack was downloaded/stored, a route was calculated from live data, a rider is live/nearby, a message was delivered, a preference was saved, or a safety event was dispatched.
- Keep all local-preview disclosures durable and understandable; never hide a limitation merely to make the UI look production-ready.
- No emoji-based production UI. Use the shared vector `Icon` primitive and the existing semantic token system.

## Explicitly excluded

R18 release audit; backend/S2 implementation; API contracts or service clients; auth/account lifecycle; native/real maps/routing/GPS; actual offline download/storage; chat/community transport; media; real language packs or calendar conversion; telemetry; analytics; push; PTT; mesh/Bluetooth/satellite; real SOS delivery; and new domain features.

## Antigravity completion report

Open an unmerged PR against mobile `dev`. Include:

1. touched files and whether any domain interface changed;
2. navigation and state matrix;
3. accessibility and touch-target evidence;
4. safe-area/keyboard/device/theme/language evidence with screenshots;
5. explicit proof that no prohibited real-world effect was introduced;
6. exact typecheck, test, and diff-check output;
7. known limitations and the backend/API handoff gap list.
