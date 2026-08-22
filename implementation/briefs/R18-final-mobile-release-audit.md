# R18 — Final Mobile Release-Quality Audit

> **Status:** Ready for implementation
>
> **Baseline:** Mobile `dev` after R17 merge `afd2f2b`.
>
> **Scope boundary:** R18 is an evidence-led audit and release decision. It does not add product features, backend integration, native capability, new persistence, or visual redesign. If it finds a defect, document it with severity and reproduction; do not silently fix it in this task.

## Objective

Produce the final go/no-go assessment for the fixture-backed RideJaunm mobile foundation. Confirm that R6–R17 work coherently on a clean simulator/device, remain visually aligned with the approved Himalayan tactical design system, preserve all truth/safety boundaries, and can be frozen as the mobile presentation baseline before backend/S2 work begins.

R18 accepts one of two outcomes:

- **GO — Mobile foundation frozen:** all blocking criteria pass and a baseline tag recommendation is recorded.
- **NO-GO — remediation required:** one or more P0/P1 defects are recorded with owner, reproducible steps, evidence, and a follow-up task. Do not merge a cosmetic workaround.

## Audit procedure

### 1. Baseline integrity

- Begin from current mobile `dev`; record the exact commit SHA, React Native/Expo versions, and installed dependency lockfile state.
- Confirm the root app still loads Space Grotesk, Inter, Mukta, and JetBrains Mono through the established font gate, uses the Expo font plugin, and renders the normal `NavigationContainer` + `TabNavigator` entry path.
- Confirm the shared vector `Icon` primitive is used for production controls. No emoji-based UI and no hard-coded preview/debug screen switch may exist.
- Run `git diff --check dev...HEAD`. R18 should normally change only audit documentation/evidence. Any production-code change is a scope exception and requires a separate follow-up task.

### 2. Functional smoke matrix

Execute and evidence the following without a navigation dead end:

| Area | Required smoke path |
|---|---|
| Ride | map home, route mode selection, layers/controls, GPS locked/acquiring/stale/lost presentation, start/end local ride mode |
| Plan | origin/destination search, route comparison, restricted Supercurvy/Terai treatment, waypoint/editor sheets, squad-readiness handoff and return |
| SOS | entry does not arm; early hold release; accessible confirmation; cancel window; active preview; stand-down; no delivery claim |
| Squad | feed filters, group roster/map preview, chat composer and local/no-delivery disclosure |
| Profile | inner tabs, garage/history empty state, settings EN/NE/HI and AD/BS previews, Offline Maps entry and return |
| Offline Maps | lifecycle preview states, pause/resume/retry/remove wording, offline/dead-zone mode, map bounds preview |

### 3. Visual and device evidence

- Capture Ride, Plan, SOS, Squad, Profile, Offline Maps, and root 5-tab navigation in **Night** and **Day Glare**.
- Captures must be from the audited baseline and be free of simulator/developer/debug overlays. Commit them under `docs/evidence/r18/` or attach them directly in the PR using durable reviewable links.
- Inspect at least one small and one standard iPhone viewport. Record model/OS for each.
- Check Dynamic Island/home-indicator clearance, map attribution visibility, modal/sheet dismissal, keyboard obstruction, bottom navigation, text clipping, and route/control overlap.
- Check Dusk and Blackout in addition to the captured Night/Day Glare evidence. Record pass/fail in the matrix.

### 4. Accessibility and localization

- Check accessible role, label, and state for each primary tab, common control, sheet/dialog action, and SOS action.
- Verify focus order and modal cancellation/close routes with VoiceOver/TalkBack-equivalent test evidence.
- Verify 48dp default, 56dp in-ride, 72dp PTT, and 88dp SOS target contracts.
- Verify English, Nepali, and Hindi preview wrapping; include long Devanagari content and AD/BS display evidence.

### 5. Truth, safety, and scope scan

The audit must prove these conditions remain true:

- No rider-facing `fixture`, `mock`, `synthetic`, `debug`, or false-precision coordinates. Use rider language such as `Local preview`, `Cached map preview`, or `Last-known location`.
- SOS continues to say no alert/contact/emergency-service delivery occurred. It contains no real contact, dial action, precise current location, or sender/recipient/provider acknowledgement claim.
- No new HTTP/API/WebSocket, authentication, map provider, native GPS/background location, Bluetooth/mesh/satellite, dial/SMS, notification, analytics, storage/file mutation, outbox, or external-share behavior.
- No claim that a map pack was actually downloaded/stored, a rider is live/nearby, a message was delivered, a preference was saved, or a real route was calculated.

Run targeted repository searches and include their exact output or a concise zero-result summary in the audit report.

### 6. Automated quality gates

Run with normal console diagnostics; no console suppression is permitted:

- `npm run typecheck`
- `npm test -- --runInBand`
- `git diff --check dev...HEAD`

All tests must pass. Any warning/error emitted by the tests is a NO-GO until resolved in a separately scoped remediation task.

## Required audit artifacts

Create `docs/evidence/r18/mobile-release-quality-audit.md` in the mobile repository. It must contain:

1. audited baseline commit and environment;
2. a pass/fail functional smoke matrix;
3. device/safe-area/keyboard/theme/localization/accessibility results;
4. links to all reviewable screenshots;
5. test/typecheck/diff-check evidence;
6. exact truth/safety scan summary;
7. P0/P1/P2 findings (or explicit `None`), each with reproduction and owner;
8. a final **GO / NO-GO** decision and mobile-baseline tag recommendation;
9. backend/API handoff gaps: identity/auth, route provider, map tile/offline-pack delivery, profile/preferences persistence, squad/chat transport, and SOS capability/evidence service boundaries.

## Explicitly excluded

Feature changes; visual redesign; code cleanup unrelated to an audit defect; backend/S2 code; OpenAPI implementation; authentication; real maps/routing/GPS; actual offline storage/download; chat/community transport; push/analytics; PTT; mesh/Bluetooth/satellite; and real SOS delivery.

## Antigravity completion report

Open an unmerged PR against mobile `dev` containing only audit artifacts (unless a separately approved remediation task is linked). Report the GO/NO-GO decision first, followed by the audit document path, evidence links, exact validation output, open findings, and the recommended next task. Do not merge the PR.
