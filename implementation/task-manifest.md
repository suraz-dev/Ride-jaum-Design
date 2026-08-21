# RideJaunm Mobile Build Manifest

Complete these bounded Codex tasks in order. A task is not complete until tests and its state matrix pass.

| ID | Task | Depends on | Completion evidence |
|---|---|---|---|
| R0 | Strict TypeScript RN project + development build | — | iOS/Android build, lint/typecheck/test commands recorded |
| R1 | Fonts, DTCG adapter, 4 themes, dynamic type | R0 | token specimen and no raw UI colours |
| R2 | Foundations: text/icon/status/avatar/badge/progress/signal/battery | R1 | a11y + 200% font-scale stories |
| R3 | Action family: buttons, FAB, SOS, PTT | R2 | target/hold/cancel/loading tests |
| R4 | Forms/controls and destination-search contracts | R2 | error/offline/keyboard/Devanagari cases |
| R5 | Navigation shell, sheets, banners, deep links | R3,R4 | 5 tabs, priority banner, return-to-ride |
| R6 | Domain models, fixtures, persistence, connection/freshness states | R0 | restart recovery and queued-write state; implementation brief: `implementation/briefs/R6-domain-fixtures-persistence.md` |
| R7 | `MapAdapter` and fixture-backed `MapSurface` | R1,R6 | attribution, camera, fallback rendering |
| R8 | Route/marker layers, map controls and map modes | R7 | all route semantics/state machines |
| R9 | Map Home and Telemetry HUD | R3,R5,R8 | acquire/stale/lost GPS and Ride Mode |
| R10 | Trip Planner and route comparison | R4,R8 | solo/group, disabled Supercurvy, hazards, waypoints |
| R11 | Group setup, invites, saved trips, readiness | R6,R10 | role/tile/permit/fuel fixtures |
| R12 | Offline region browser/manager/progress UI | R6,R8 | queued/downloading/partial/stale/fail visible |
| R13 | Squad, live tracking, Feed, composer, chats | R2,R5,R6,R8 | cached/read-only/queued/low-data cases |
| R14 | Profile, garage, history, settings, languages | R5,R6 | EN/NE/HI + AD/BS tests |
| R15 | SOS console UI and safety capability gate | R3,R5,R6 | cannot indicate delivery without evidence |
| R16 | Native safety services behind feature flags | R15 | per-capability physical-device proof |
| R17 | Motion, haptics, analytics, performance fallbacks | R9–R16 | Reduce Motion + low-tier fallback tests |
| R18 | Release-quality audit | R9–R17 | full state/a11y/glare/offline/device audit |

## Task protocol

Every task report includes scope, files touched, interface changes, state coverage, test commands/output, and native/device risks. Do not combine tasks without user direction.

## Required fixtures

- `routeCandidates`: three modes, no-Supercurvy Terai, restriction, monsoon closure, partial map.
- `ride`: acquiring/locked/stale/lost GPS, map fresh/stale, Ride Mode threshold.
- `group`: riding/stopped/mesh/offline/low battery/SOS member.
- `offlineRegion`: queued/downloading/paused/partial/complete/stale/failed/storage full.
- `sos`: capability unavailable, cellular, mesh, zero peers, last-known GPS, low battery, acknowledgement, release/cancel/stand-down.
- `locale`: EN/NE/HI, long Devanagari place name, Nepal 45-minute timezone, AD/BS.
