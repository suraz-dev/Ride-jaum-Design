# R11 — Fixture Trip Readiness and Squad Planning Handoff

> **Status:** Ready for implementation
>
> **Scope boundary:** Local, typed fixtures only. This task creates no saved trip, invitation, group, membership, link, notification, delivery queue, route share, or server request. It must never claim that another rider was invited, notified, joined, ready, or tracked.

## 1. Objective

Extend the R10 Group planning handoff into a truthful, fixture-backed pre-ride readiness presentation. A rider can inspect a synthetic squad roster, choose local planning roles, view pre-authored readiness facts, and dismiss/restore a local preview. It is a UI contract for the later persisted-trip and group service work—not a collaborative feature.

## 2. Required contracts

Create screen-independent domain types under `src/domain/` and deterministic fixtures under `src/fixtures/`.

```ts
type FixtureTripRole = 'lead' | 'sweep' | 'rider';
type FixtureInviteState = 'not_invited' | 'preview_pending' | 'preview_ready' | 'preview_blocked';
type ReadinessState = 'ready' | 'attention' | 'blocked' | 'unknown';

interface FixtureSquadMember {
  id: string;
  displayName: string;
  role: FixtureTripRole;
  inviteState: FixtureInviteState;
  offlineMapState: ReadinessState;
  permitState: ReadinessState;
  fuelState: ReadinessState;
  emergencyContactState: ReadinessState;
  source: 'fixture';
}

interface FixtureTripReadinessItem {
  id: string;
  category: 'route' | 'offline_map' | 'permit' | 'fuel' | 'weather' | 'safety';
  state: ReadinessState;
  title: string;
  detail: string;
  sourceVersion: string;
  syntheticDisclosure: string;
}
```

Do not add server DTOs, API clients, mutation repositories, UUIDs generated at runtime, or provider payloads. IDs must be stable fixture IDs.

## 3. Required presentation

Add an R11 readiness surface reachable from R10 Group mode. A dedicated screen, sheet, or focused panel is acceptable; reuse existing navigation/sheet primitives and tokens.

- Show a clear header: **“Fixture Trip Readiness — Local Preview”**.
- Keep the R10 Group preview read-only until the rider explicitly opens the R11 readiness surface.
- Present 3–5 synthetic squad members with role, readiness summary, and a descriptive accessibility label.
- Permit local role reassignment among fixture members only. If there is no current lead or sweep, show a local validation state; do not block or submit anything remotely.
- Show at least one fixture in each relevant state:
  - route ready;
  - missing/offline-map attention;
  - permit attention or block for a restricted route;
  - fuel-gap attention;
  - unknown weather/current-condition state with wording that it is **not live weather**;
  - safety-contact readiness.
- A synthetic “Invite preview” action may change only local UI state from `not_invited` to `preview_pending`; its result must read **“No invitation was sent”**.
- A synthetic “Save preview” action may only show **“No trip was saved”** or stay disabled with an explanation. Do not write local persistence in R11.
- Include an explicit return to R10 Planner.

## 4. Truth, safety, and offline rules

- All facts must carry fixture provenance and a visible “synthetic/local preview” disclosure.
- Never imply that a route is legally validated, permits are current, maps are downloaded, weather is current, a rider has received a message, or a safety contact is reachable.
- In `meshOnly` and `deadZone`, show an offline/mesh banner and retain the same local fixture content. Do not queue, retry, or claim delivery.
- Do not use SOS Red for readiness, destructive actions, warnings, or ordinary errors.
- Standard controls must meet the 48dp target and use semantic tokens across Night, Day Glare, Dusk, and Blackout.

## 5. Accessibility and localization

- Use a radiogroup for exclusive role selection; each option announces member name, selected state, and role.
- Roster, readiness items, and preview actions need descriptive labels and state announcements.
- Test long Nepali names and include English/Nepali/Hindi placeholder copy keys or fixture strings without claiming complete localization.

## 6. Explicitly excluded

- R12 offline-region download, storage verification, or pack management;
- any persisted/saved trip, invite, membership, role, readiness, or route-sharing record;
- backend/API/WebSocket calls, deep links, SMS/WhatsApp handoff, push notifications, or outbox behaviour;
- live location, rider presence, group tracking, chat, media, or Feed work (R13);
- live weather, road condition, permit status, fuel availability, or emergency capability claims.

## 7. Acceptance criteria

1. Fixture domain models and stable fixture IDs have unit coverage.
2. R10 Group mode reaches the R11 readiness surface without regression to Solo planner behavior.
3. Role assignment, invite preview, and save preview are local-only and contain truthful no-send/no-save language.
4. Every readiness state and truth disclosure is visible, including mesh/dead-zone presentation.
5. No network/API client, storage mutation, live group tracking, or capability claim is introduced.
6. All four themes, 48dp targets, radio semantics, long Devanagari content, and accessibility labels are tested.
7. `npm run typecheck`, `npm test -- --runInBand`, `git diff --check dev...HEAD`, and a simulator walkthrough pass.

## Required Antigravity completion report

Report changed files; domain/fixture contracts; fixture state matrix; explicit no-send/no-save proof; accessibility/touch evidence; all-theme simulator screenshots/video; exact validation output; and deferred server/native risks. Open a PR against mobile `dev`; do not merge it.
