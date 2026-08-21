# Mobile QA Re-review — R6 Remediation PR #1

> **Pull request:** [RideJaunm-Mobile #1](https://github.com/suraz-dev/RideJaunm-Mobile/pull/1)
> **Reviewed head:** `ea593c3` — `fix(mobile): resolve R6 QA review findings…`
> **Target:** `dev`
> **Review date:** 2026-08-20
> **Verdict:** **Request changes — do not merge / do not release R7 yet.**

## Checks executed

| Check | Result |
|---|---|
| Branch status | PR is open, mergeable, and targets `dev` |
| `npm run typecheck` | Pass — 0 errors |
| `npm test -- --runInBand` | Pass — 5 suites / 24 tests |
| `git diff --check dev...HEAD` | **Fail** — trailing whitespace in 5 changed files |

## Remediation that is accepted

- Complete typed offline-pack fixture set now includes all eight lifecycle states.
- EN/NE/HI, long Devanagari, `Asia/Kathmandu`, and AD/BS fixtures were added.
- R6 safety evidence has been reduced to local/device-observed capability state; it no longer models provider/human dispatch receipt.
- The AsyncStorage development adapter no longer claims to be encrypted.
- `LocalStore.read` now exposes `found`, `not_found`, `corrupted`, and `read_failed` results.
- Route, connection, active safety observation, and queue state have persistence paths; a cold-remount test covers several of them.

## Required changes

### RC-1 — Do not silently erase an unreadable outbox

**Blocking.** `DefaultOfflineOperationRepository.loadQueue()` converts `corrupted` and `read_failed` storage results into `[]`. Its callers can subsequently write that empty array back, overwriting the only local copy of queued rider actions. This is the exact R6-5 failure the first review identified.

**Required fix:** expose a typed queue read/fault result, or throw/propagate a recoverable storage-fault state to `AppStateContext`; preserve the original key until explicit user recovery/reset. Add tests proving a corrupt or unreadable outbox cannot be interpreted as an empty queue and cannot be overwritten by an enqueue/retry operation.

### RC-2 — Surface faults for every hydrated key

**Blocking.** `AppStateContext` sets `storageFault` only for route storage. Corrupted/read-failed connection mode, offline regions, active safety observation, and outbox queue are ignored or normalized to defaults despite the file comment claiming all stored keys are handled.

**Required fix:** collect safe fault identifiers for route, connection, offline-region, safety-observation, and outbox hydration; show a non-sensitive recoverable state through the context. Add focused tests for each key class.

### RC-3 — Complete restart-recovery evidence

**Blocking acceptance evidence.** The implementation can persist offline-region state through `setOfflineRegionsState`, but the cold-remount test does not change and verify an offline-region/pack state. The R6 brief requires restart recovery for route, connection/GPS freshness, offline/pack state, and queue.

**Required fix:** mutate a fixture-backed pack state/selection, remount with the same `MemoryLocalStore`, and assert recovery. Also assert the GPS freshness state associated with the recovered connection snapshot. Test reset removes every persisted R6 key.

### RC-4 — Test actual state-transition rules

**Required acceptance evidence.** The tests enumerate GPS and pack enum values but do not exercise a transition/selector rule for `acquiring → locked → stale → lost`, nor do they assert allowed/blocked offline-pack transitions.

**Required fix:** introduce a small pure transition/selector function or equivalent state-machine test; include valid and invalid transitions. This remains fixture-backed—no live location or downloader work belongs in R6.

### RC-5 — Remove whitespace errors

`git diff --check dev...HEAD` reports trailing whitespace in:

- `src/fixtures/locale.fixture.ts`
- `src/services/storage/LocalStore.ts`
- `src/services/storage/OfflineOperationRepository.ts`
- `src/state/AppStateContext.tsx`

**Required fix:** remove the whitespace and include `git diff --check dev...HEAD` in the completion report.

## Scope reminder

Do not reintroduce provider, satellite, SMS, human-dispatch, public-emergency, or encrypted-storage claims. The existing SOS console’s older marketing-style relay/SMS wording remains a separate R15 safety-release issue; it is not evidence of a working transport.

## Re-review submission

Update this same PR with the smallest corrective commit(s), then report these commands:

```bash
npm run typecheck
npm test -- --runInBand
git diff --check dev...HEAD
```

R6 will be accepted only after all three commands pass and RC-1 through RC-4 have test evidence.
