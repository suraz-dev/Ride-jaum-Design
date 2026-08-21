# R12 — Fixture Offline Region Browser and Lifecycle UI

> **Status:** Ready for implementation
>
> **Scope boundary:** R12 is a deterministic presentation and local-interaction contract for offline-region states. It does not download, delete, verify, extract, encrypt, or serve any map pack; use device storage; invoke a map SDK; access the network; or claim that any map is available offline.

## 1. Objective

Build an accessible Offline Maps surface using the existing R6 `OfflineRegion` fixtures and lifecycle states. It must help riders understand simulated pack coverage, storage pressure, progress, freshness, partial coverage, and failures—without turning fixture state into a real download manager.

## 2. Required presentation

Add a dedicated Offline Maps screen, sheet, or Profile entry using existing navigation primitives. Reuse typed R6 region fixtures rather than introducing provider models.

- Header: **“Offline Maps — Fixture Preview”**, with permanent copy that no pack is being downloaded or verified.
- Storage summary: pre-authored fixture used/free capacity and a segmented, accessible visual. Do not read device storage.
- Filter control with `All`, `Downloading`, `Stale`, and `Issues` views. Use accessible tab semantics.
- Region cards show English + Nepali name, administrative/corridor type, estimated fixture size, zoom range, source/version, freshness, and a synthetic disclosure.
- Represent every R6 lifecycle state visibly: `queued`, `downloading`, `paused`, `partial`, `complete`, `stale`, `failed`, and `storage_full`.
- `partial` must state that only simulated covered sectors are shown and missing coverage is unavailable; never promise usable navigation.
- `stale`/`failed`/`storage_full` must remain visually explicit in every filter; no optimistic replacement.
- Include an optional R8 `MapSurface` preview only if it remains fixture-only and visibly marks partial/missing coverage.

## 3. Local preview interactions

Interactions may change only component-local preview state for the current render:

- pause/resume a `downloading` fixture;
- show a fixture retry result for `failed` (for example, **“Retry preview only — no download started”**);
- show a fixture remove confirmation (for example, **“Removal preview only — no region was deleted”**);
- switch the simulated list filter; and
- open/close region details.

Every action must include lasting, accessible truth copy. It must not call storage write/remove/clear APIs, create an outbox operation, mutate `AppStateContext` persistence, or change real map coverage.

## 4. Truth and safety rules

- Avoid words such as **downloaded**, **complete**, **updated**, **available offline**, **verified**, or **deleted** unless immediately qualified as a fixture/simulation state and never presented as device fact.
- A lifecycle value means a pre-authored demonstration state only—not bytes, tiles, or routing data on the device.
- Map coverage and freshness never imply current road, hazard, weather, permit, traffic, or emergency information.
- Preserve OpenStreetMap attribution where an R8 map preview is shown.
- Use warning/neutral semantics for ordinary storage, freshness, and download-preview states. SOS Red is reserved for an actual emergency UI only.
- In online, mesh-only, and dead-zone connection fixtures, render the same local content with truthful connection copy; no network operation is started or queued.

## 5. Accessibility, theme, and localization

- Standard controls use 48dp minimum targets and descriptive labels: e.g. “Pause Kathmandu fixture download preview,” “Show Mustang stale fixture details.”
- Progress has a textual percentage/state equivalent; storage visual has an accessibility summary.
- Use tokens only in all four themes: Night, Day Glare, Dusk, and Blackout.
- Test long Devanagari names and leave EN/NE/HI copy behind translation-ready keys/fixtures without claiming full localization.

## 6. Explicitly excluded

- tile/package downloads, HTTP clients, provider SDKs, file-system writes/deletes, storage capacity reads, integrity verification, unpacking, encryption, or cache eviction;
- actual map offline availability, routing/nav fallback, route-corridor calculation, region selection geometry, background transfer, mobile-data/Wi-Fi settings, or auto-update;
- any persisted lifecycle mutation, outbox operation, server API, analytics, push notification, or deep link;
- live map freshness, hazards, roads, weather, permits, traffic, group state, or safety-service assertions.

## 7. Acceptance criteria

1. Existing R6 region types and stable fixtures are reused; no provider or file-system model is added.
2. All eight lifecycle states, storage summary, filters, and each required truth disclosure are visible and unit-tested.
3. Pause/resume, retry, and remove interactions are local preview only and permanently state that no device data changed.
4. Partial, stale, failed, and storage-full states remain explicit and accessible; ordinary states never use SOS styling.
5. Connection fixture modes, all four themes, 48dp controls, Devanagari content, and tab semantics are covered.
6. Existing R6 persistence, R7/R8 map contracts, R9 telemetry, R10 planner, and R11 readiness flows do not regress.
7. `npm run typecheck`, `npm test -- --runInBand`, `git diff --check dev...HEAD`, and a simulator walkthrough pass.

## Required Antigravity completion report

Report touched files; reused contracts/fixtures; lifecycle state matrix; truth-copy proof for every preview action; accessibility/touch evidence; Night/Day Glare/Dusk/Blackout screenshots/video; exact validation output; and deliberately deferred device/download risks. Open a PR against mobile `dev`; do not merge it.
