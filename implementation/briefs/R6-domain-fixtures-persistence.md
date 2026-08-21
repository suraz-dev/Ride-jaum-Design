# R6 — Domain Models, Fixtures, Persistence, and Connection/Freshness States

> **Status:** Approved for Antigravity implementation.  
> **Repository:** `/Users/surajshrestha/Documents/Ride Jaum/RideJaunm-Mobile` (`main`).  
> **Design/system source:** this repository.  
> **Dependencies satisfied:** R0 strict TypeScript baseline; R1 tokens/themes; R2–R5 UI shell/composites.

## Outcome

Create the mobile domain and offline foundation required by maps, routing, packs, groups, chat, profile, and SOS UI. The app must restart into deterministic fixture-backed state, represent queued writes honestly, and never turn local persistence into a delivery claim.

This task is deliberately **not** real navigation, geolocation, networking, BLE mesh, SMS, push, encryption-provider selection, or SOS-channel delivery.

## Required source references

- `AGENTS.md` in both repositories.
- `docs/10-design-to-code-react-native.md` — React Native quality contract.
- `docs/21-adr-005-mobile-encrypted-store-decision-packet.md` — encrypted local-store boundary.
- `docs/23-adr-007-safety-channel-evidence-decision-packet.md` — safety evidence wording.
- `docs/27-s1-api-event-contract-foundations.md` and `docs/28-s1-domain-api-schema-catalogue.md` — shared models, idempotency, API state.
- `docs/29-s1-event-schema-catalogue.md` — durable event/outbox rules.
- `implementation/task-manifest.md` — fixture requirements and R6 definition of done.

## Scope

### 1. Typed domain model modules

Create strict, dependency-light modules under `src/domain/` (exact filenames are Antigravity’s choice) for:

- `RouteCandidate`, route profile (`straight`, `curvy`, `supercurvy`), restriction, provenance, and map/coverage freshness.
- `Trip`, `Group`, membership, `Ride`, and safe lifecycle enums.
- `OfflineRegion` / pack download state: `queued`, `downloading`, `paused`, `partial`, `complete`, `stale`, `failed`, `storage_full`.
- `ConnectionState`: online, offline, cellular unavailable, mesh connected/unavailable, with user-facing limitation state.
- `GpsFreshnessState`: `acquiring`, `locked`, `stale`, `lost`; include observation timestamp and accuracy where present.
- `QueuedOperation`: client operation ID, idempotency key, resource type/ref, state (`queued`, `sending`, `accepted`, `rejected`, `conflicted`), retry metadata, and a safe error code.
- `SafetyCapabilitySnapshot` / evidence state from ADR-007. It models local/device-reported status only; it must not model a successful public emergency dispatch.
- Shared opaque IDs, RFC-3339 UTC instants, country configuration version, and safe error codes aligned with S1.

Do not duplicate API models in screens. Screens consume selectors/view models derived from these types.

### 2. Deterministic Nepal-first fixture repository

Create deterministic, typed fixtures under `src/fixtures/` for the manifest’s required data:

- all three route candidates, a no-Supercurvy Terai route, restriction/hazard, monsoon closure, and partial-map state;
- GPS acquiring/locked/stale/lost; map fresh/stale; a Ride Mode threshold;
- a group in riding/stopped/mesh/offline/low-battery/SOS-member states;
- all offline-region states listed above;
- SOS capability unavailable, cellular, mesh, zero peers, last-known GPS, low battery, acknowledgement, release/cancel/stand-down;
- EN/NE/HI labels, long Devanagari place name, `Asia/Kathmandu`, and AD/BS display test input.

Fixtures are synthetic. No real rider location, contacts, emergency recipients, or credentials are allowed.

### 3. Persistence and repository interfaces

Create a provider-neutral persistence boundary under `src/services/` or `src/data/`:

```ts
interface LocalStore {
  hydrate(): Promise<void>;
  read<T>(key: string): Promise<T | null>;
  write<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clearAccountScopedData(): Promise<void>;
}

interface OfflineOperationRepository {
  enqueue(operation: QueuedOperation): Promise<void>;
  listPending(): Promise<QueuedOperation[]>;
  markResult(id: string, result: 'accepted' | 'rejected' | 'conflicted'): Promise<void>;
}
```

- Choose an Expo-compatible local implementation only after inspecting the current mobile dependencies. Keep the interface independent of that library.
- If encrypted storage is not available/configured in this task, use a clearly named development adapter and document the limitation. Do **not** claim protected production storage is complete.
- Persist account-scoped state, route/pack fixture selection, freshness state, and queue state required for restart-recovery tests.
- Store no access token, contact, medical value, or full precise-location history in fixtures/logs.
- A queue entry means only `queued locally`; it must never render as server accepted, provider accepted, or recipient acknowledged.

### 4. State/selectors integration

Wire the existing prototype screens to read only safe fixture-backed selectors where practical:

- current connection/banner state;
- telemetry GPS freshness state;
- selected route and route restriction state;
- offline-download state;
- selected group presence state.

Keep the change small: R6 establishes the state foundation; it does not redesign R5 screens or begin R7 map implementation.

## Non-negotiable constraints

- Strict TypeScript; no `any`, unchecked type assertions, raw hex colors, or magic UI sizes.
- Preserve all four themes and 200% dynamic type behavior.
- Respect 48/56/88 dp interaction targets where an existing component is touched.
- `SOS Red` remains emergency-only.
- Treat client/device/fixture state as observations. “Local queued” is never network, provider, or human delivery.
- Offline, stale, unavailable, and failed states must be visible and accessible—not silently replaced with optimistic values.
- No external backend, map, notification, or emergency provider integration in R6.

## Acceptance criteria

1. Domain modules compile under strict TypeScript and have no screen-owned duplicate models.
2. Required typed Nepal-first fixtures exist and cover every state in the mobile manifest.
3. App restart/hydration restores a selected fixture state and pending queue deterministically.
4. Queued operations have unique operation/idempotency IDs; retry/replay does not create duplicate logical rows.
5. Local queue UI/state uses evidence wording such as `queued locally`, `server accepted`, `provider accepted`, and `recipient acknowledged` only when the matching model state exists; R6 fixtures never simulate public dispatch.
6. GPS/connection/offline/download state transitions are unit-tested, including `acquiring → locked → stale → lost` and every pack/download state.
7. Account-scoped reset clears persisted fixture/queue state in tests.
8. `npm run typecheck` and `npm test` pass. Report the exact commands and results.

## Out of scope / explicit handoffs

| Not in R6 | Earliest follow-up |
|---|---|
| Map renderer/camera/attribution | R7 |
| route and marker layers | R8 |
| GPS-driven Map Home ride state | R9 |
| real trip routing/search | R10 |
| offline region downloader | R12 |
| live group service/chat/media | R13 |
| languages/profile flow | R14 |
| SOS UI or native safety delivery | R15–R16 |
| backend persistence/outbox | S2–S4 |

## Required Antigravity completion report

Report back with:

1. changed files and added dependencies, including why each dependency is needed;
2. chosen storage adapter and any production-encryption limitation;
3. models/fixtures/state transitions covered;
4. exact test/typecheck commands and output summary;
5. simulator verification, if UI integration changed;
6. deviations, blockers, and decisions that need lead approval.

The lead will perform read-only QA before accepting R6 and releasing R7.
