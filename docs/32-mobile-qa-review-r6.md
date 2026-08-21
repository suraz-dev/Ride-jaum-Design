# Mobile QA Review — R6 Domain, Fixtures, Persistence, and State

> **Reviewed build:** `RideJaunm-Mobile` commit `2c4621e` on `dev`  
> **Design brief:** [R6 implementation brief](../implementation/briefs/R6-domain-fixtures-persistence.md)  
> **Review date:** 2026-08-20  
> **Verdict:** **Not accepted — remediation required. R7 is blocked.**

## Validation evidence

| Check | Result | Evidence |
|---|---|---|
| Git synchronization | Pass | both design and mobile `dev` branches were already current; mobile `dev` equals `origin/dev` |
| Strict TypeScript | Pass | `npm run typecheck` completed with zero errors |
| Automated tests | Pass | `npm test -- --runInBand`: 5 suites / 19 tests passed |
| Domain/persistence architecture | Partial pass | typed `src/domain`, fixtures, a `LocalStore` abstraction, AsyncStorage development adapter, outbox repository, and app state context are present |
| R6 acceptance criteria | Fail | required fixture coverage, restart recovery, and safety evidence boundaries are incomplete or violated |

## What is on track

- Strict domain modules, provider-neutral `LocalStore`, and an idempotency-keyed outbox repository are good foundations.
- The selected AsyncStorage adapter is explicitly described as a development adapter in the execution log; it is not treated as the final ADR-005 protected-storage implementation.
- The app is wired to use domain/fixture state for the active route, ride telemetry inputs, offline-region summary, and queued-operation count.
- Local-store, outbox, app-state, token, component, and domain tests run successfully.

## Required remediation before R6 acceptance

### R6-1 — Complete required fixture coverage

**Finding:** `offlineRegions.fixture.ts` defines only `complete`, `downloading`, and `storage_full` lifecycle examples. The required `queued`, `paused`, `partial`, `stale`, and `failed` fixtures are absent. `safety.fixture.ts` does not provide the full approved R6 matrix (capability unavailable, cellular, mesh, zero peers, last-known GPS, low battery, acknowledgement, release/cancel/stand-down). No fixture modules cover the required EN/NE/HI + long Devanagari + `Asia/Kathmandu` + AD/BS test inputs.

**Required correction:** add a complete typed fixture for every manifest state, export them centrally, and add tests that assert each lifecycle/state is represented. Do not invent real provider or public-dispatch evidence.

### R6-2 — Implement and test restart recovery for every persisted R6 state

**Finding:** `AppStateContext` hydrates only `active_route_v1` and pending outbox operations. It does not persist/hydrate connection/freshness, offline-region/pack selection and state, or active safety observation. The current app-state tests use a fresh store rather than remounting a provider against persisted data to prove restart recovery.

**Required correction:** persist only safe, account-scoped R6 fixture selections/state; remount the provider using the same `MemoryLocalStore` and verify deterministic recovery of selected route, connection/GPS freshness, offline/pack state, and pending queue. Include reset behavior for each persisted key.

### R6-3 — Enforce the ADR-007/R6 safety evidence boundary

**Finding:** the new `SafetyEvidenceTier` adds `sms_gateway_queued`, `provider_acknowledged`, and `human_confirmed`, with comments describing cellular/satellite gateway receipt and human dispatch. R6 explicitly permits only local/device-reported safety capability/observation state and prohibits modelling successful public emergency dispatch. No approved provider or physical-device evidence exists.

**Required correction:** R6 safety fixtures/models must be limited to safe observation/capability states (for example: local observation, device-reported mesh availability, zero peers, last-known GPS, low battery, cancellation/stand-down). Put future provider/recipient evidence behind the S10/R15–R16 contract and an approved capability flag. Never claim a gateway, satellite, provider, human dispatcher, or public service action.

### R6-4 — Correct persistence and queue truthfulness language

**Finding:** `OperationState` comments say local operations are “stored locally in encrypted store,” while the active adapter is AsyncStorage and is explicitly not the final encrypted solution. The outbox model also permits `accepted` as “confirmed received by server / peer” although R6 has no transport or server/peer receipt contract.

**Required correction:** label the current adapter and state exactly: `stored locally by the configured development adapter`; queue state begins as `queued locally`. Model remote evidence only in a later capability-gated transport layer; retain `accepted` only if it is typed as a future server-authoritative result that R6 cannot create. Add a negative test proving local enqueue cannot produce server/provider/recipient evidence.

### R6-5 — Make persistence faults visible to the state layer

**Finding:** `AsyncStorageLocalStore.read` catches all parse/storage errors and returns `null`, silently making corruption/unavailability look like an empty/new state.

**Required correction:** return a safe typed storage failure result or surface an explicit recoverable state to the app context. Do not silently discard a queue or stale/offline-pack state. Add corruption/read-failure tests.

## Non-blocking follow-up observations

- The R6 tests enumerate GPS states but do not test a real transition rule or time-based stale threshold. Add an explicit transition/selector test while addressing R6-2.
- `ProfileGarageScreen` renders only a subset of offline lifecycle badges; R12 will own full download UI, but the R6 selector/test should preserve all states now.
- Existing SOS copy outside the R6 diff describes active BLE relay and SMS behavior as if real. This predates R6 but remains a release-critical ADR-007 issue for the R15 QA gate; no future UI may present it as live capability without proof.

## Acceptance path

Antigravity should submit one bounded R6 remediation commit with the above corrections, report changed files/dependencies/tests, and run:

```bash
npm run typecheck
npm test -- --runInBand
```

The lead will re-review the changed code. Only then may R6 be accepted and R7 (`MapAdapter` + fixture-backed `MapSurface`) be released.
