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
| R6 | Domain models, fixtures, persistence, connection/freshness states | R0 | **Accepted at mobile PR #1 head `9eef2ac`** — acceptance: `docs/34-mobile-qa-r6-acceptance.md`; implementation brief: `implementation/briefs/R6-domain-fixtures-persistence.md` |
| R7 | `MapAdapter` and fixture-backed `MapSurface` | R1,R6 | **Accepted at mobile PR #2 merge `09782fb`** — attribution, camera, fallback rendering; implementation brief: `implementation/briefs/R7-map-adapter-surface.md` |
| R8 | Route/marker layers, map controls and map modes | R7 | **Accepted at mobile PR #3 merge `ef9a1c7`** — fixture overlays, controls, layers, and explicit Terai restriction; implementation brief: `implementation/briefs/R8-route-marker-layers-controls.md` |
| R9 | Map Home and Telemetry HUD | R3,R5,R8 | **Accepted at mobile PR #4 merge `e547308`** — fixture Map Home, truthful telemetry, follow-state and map-state boundaries; implementation brief: `implementation/briefs/R9-map-home-telemetry-hud.md` |
| R10 | Trip Planner and route comparison | R4,R8 | **Accepted at mobile PR #5 merge `bac396a`** — fixture planner, truth metadata, map preview, and offline-catalogue state; implementation brief: `implementation/briefs/R10-trip-planner-route-comparison.md` |
| R11 | Fixture trip readiness and squad planning handoff | R6,R10 | **Accepted at mobile PR #6 merge `f3ed47a`** — truthful local roster/readiness preview; implementation brief: `implementation/briefs/R11-fixture-trip-readiness-squad-handoff.md` |
| R12 | Fixture offline region browser and lifecycle UI | R6,R8 | **Accepted at mobile PR #8 merge `af5f1e9`** — cache-only lifecycle preview with truthful fixture copy; implementation brief: `implementation/briefs/R12-fixture-offline-region-manager.md` |
| R13 | Fixture squad, community feed, and chat presentation | R2,R5,R6,R8 | cached/read-only/queued/low-data cases; implementation brief: `implementation/briefs/R13-fixture-squad-community-chat.md` |
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
