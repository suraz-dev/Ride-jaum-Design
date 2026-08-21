# R15 — Fixture SOS Console and Safety Capability Gate

> **Status:** Ready for implementation
>
> **Scope boundary:** R15 is a deterministic, local SOS interaction and evidence-state preview. It does **not** create a safety incident, contact anyone, send SMS/push/data, dial a phone number, activate GPS/Bluetooth/mesh/satellite, write storage, enqueue an outbox item, or claim a message, peer, provider, responder, or emergency service received anything.

## Objective

Replace the SOS placeholder with an accessible emergency console that rehearses the safe interaction model: capability visibility, a deliberate three-second hold, an explicit cancellation window, a clearly simulated active state, and a deliberate stand-down preview. Every state must say what the app knows locally and what it does **not** prove.

This task establishes the presentational safety state machine and guarded UI contracts that R16 may later connect to individually validated native capabilities.

## Required contracts and fixtures

Create screen-independent, typed fixture models with stable IDs, source/version, and a synthetic disclosure:

- `FixtureSafetyCapabilitySnapshot`: cellular observation, GPS freshness (`unavailable`, `last_known`, `fresh`), mesh capability (`unavailable`, `device_reported`, `zero_peers`), satellite (`unavailable`), battery (`normal`, `low`), and `capabilityUnavailable`.
- `FixtureSafetyConsoleState`: `ready`, `holding`, `cancel_window`, `active_preview`, `stand_down_hold`, `stood_down_preview`.
- `FixtureSafetyEvidenceItem`: only `unavailable`, `local_observation`, `device_reported`, `unknown`, or `simulated_preview` evidence. Never use `sent`, `delivered`, `received`, `notified`, `dispatched`, or equivalent proof claims.
- A pre-authored, clearly synthetic last-known location label. Do not use a precise coordinate, live clock, real contact, or device identifier.

Required fixtures: capability unavailable; cellular present but no delivery integration; mesh zero peers; last-known GPS; low battery; cancellation; active preview; acknowledgement unavailable/unknown; stand-down preview.

## Required UI and interactions

Use the existing centre SOS navigation entry and SOS visual token only for this emergency surface.

- **Ready:** Show a limitation banner before the control: `Safety preview only — this build cannot contact emergency services or your contacts.` Show a capability matrix with plain-language evidence labels and unknown/unavailable states.
- **Activation:** Reuse the SOS control with a three-second hold. The hold can advance only component-local state. Early release returns to `ready`; it must not create an active incident.
- **Cancel window:** After a completed hold, render a 10-second **simulated** cancel window. Visible copy: `SIMULATED SOS PREVIEW — no alert was sent.` A deterministic, testable timer may drive the preview; do not schedule/background an OS task.
- **Active preview:** Render a clearly labelled full-screen emergency preview using SOS Red only here. Show an evidence timeline where every channel is `Unavailable`, `Unknown`, or `Simulated`; no recipient count, relay count, or delivery wording.
- **Stand-down:** Require a second deliberate three-second hold and show `Stand-down preview complete — no all-clear was sent.` Then return to `ready` or explicit `stood_down_preview` confirmation.
- **Manual help information:** Do not hard-code or dial emergency numbers. If a manual-help row exists, disable it and say `Emergency resources require reviewed country configuration.`

## Truth, safety, and scope invariants

- Never claim SOS was sent, broadcast, queued, relayed, delivered, received, acknowledged by a person, or dispatched to public services.
- No `Linking`, phone dial, SMS, push, network/API request, WebSocket, Bluetooth, mesh, satellite, background location/service, analytics, external share, or deep link.
- No AsyncStorage/file/secure-store writes, removals, clears, app-state/outbox mutation, route/trip/group mutation, or persisted incident. Component-local state only.
- No real contacts, medical card, phone/email, current/precise location, device IDs, or vehicle data.
- A local indicator is not transport: cellular is fixture capability only; `Mesh: zero peers` means no peer in the fixture; satellite remains unavailable.
- SOS Red is permitted only for the SOS trigger, hold/active preview, and emergency-only state treatment. Ordinary warnings and disabled rows use warning/neutral tokens.
- SOS target is at least 88dp; all other interactive elements are at least 48dp. Expose hold progress/state and cancellation/stand-down instructions with accessible labels and non-colour text. Provide accessible equivalents for deliberate holds.

## State and test matrix

| Case | Required proof |
|---|---|
| Ready / capability unavailable | limitation banner and unavailable matrix, no activation claim |
| Hold released early | returns to ready; no active-preview state |
| Hold completes | simulated cancel window has explicit no-send copy |
| Cancel | returns to ready with no message/contact/provider claim |
| Active preview | every evidence item is unavailable, unknown, local/device-reported, or simulated |
| Mesh zero peers + last-known GPS + low battery | words identify the exact fixture limitation |
| Stand-down hold | deliberate interaction and explicit no-all-clear-sent copy |
| Accessibility | 88dp SOS, 48dp controls, meaningful labels/state announcements |
| Isolation | no red token outside SOS elements; no storage, app-state, outbox, network, Linking, native-capability, or analytics call |

Required commands: `npm run typecheck`, `npm test -- --runInBand`, and `git diff --check dev...HEAD`.

Include a simulator walkthrough for ready, completed hold/cancel, active preview, and stand-down preview. If long-press cannot be exercised, state the limitation and provide test evidence; never substitute a real-delivery claim.

## Explicitly excluded

R16 native safety services; backend incident endpoints; account/consent/emergency-contact or medical-card management; Nepal resource directory or phone dial action; crash detection; PTT; SMS/push/email; mesh/Bluetooth/satellite transport; background GPS; persistent incident history; provider acknowledgements; analytics; emergency-service integration; production/legal safety approval.

## Antigravity completion report

Report touched files, fixture/domain contracts, state-transition table, exact no-effect proof (storage/app-state/outbox/network/native/Linking/analytics searches), accessibility/touch evidence, four-theme proof, test output, and every deferred native/legal/provider risk. Open a PR against mobile `dev`; do not merge it.
