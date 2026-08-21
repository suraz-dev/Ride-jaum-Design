# R9 — Fixture Map Home and Truthful Telemetry HUD

> **Status:** Approved for Antigravity implementation after R8 merge `ef9a1c7` into mobile `dev`.
> **Implementation repository:** `/Users/surajshrestha/Documents/Ride Jaum/RideJaunm-Mobile` (`dev`).
> **Dependencies accepted:** R3 action/telemetry components, R5 navigation shell, R6 connectivity fixtures, R7 `MapSurface`, and R8 map controls/overlays.
> **This task does not enable real device GPS, background location, navigation SDKs, live tracking, route matching, or BLE/mesh transport.**

## Outcome

Make Ride Home’s map position, recenter/follow affordances, Ride Mode, and telemetry truthful under deterministic fixture states. A rider must always see whether the shown position is acquiring, locked, stale/last-known, or lost. No UI transition may imply GPS tracking, active navigation, group visibility, route progress, or emergency delivery that R9 does not actually perform.

R10 owns trip planning and route comparison. R13 owns live group/rider positions. R16 owns native safety services. Keep R9 as a reusable, fixture-backed visual and state contract.

## Required source references

- Mobile `AGENTS.md` and design-repo `AGENTS.md`.
- `docs/03-color-system.md`, `docs/04-component-architecture.md`, and `docs/10-design-to-code-react-native.md`.
- `docs/09-nepal-offline-data-spec.md` for freshness and offline truth.
- `docs/13-system-lld.md` for observation/freshness rules.
- `docs/20-adr-004-eventing-realtime-decision-packet.md` — a display projection is not durable/live truth.
- `docs/21-adr-005-mobile-encrypted-store-decision-packet.md` — local state remains protected and truthful.
- `implementation/briefs/R6-domain-fixtures-persistence.md` and `implementation/briefs/R8-route-marker-layers-controls.md`.

## Scope

### 1. Typed Map Home fixture state

Create a screen-independent, provider-neutral view model, for example `MapHomeState` or `RideMapPresentation`, derived only from existing R6 fixture/domain values:

- `GpsLockState`: `acquiring`, `locked`, `stale`, `lost`;
- device-observed timestamp, accuracy, altitude, speed, heading, and source label where the fixture provides them;
- map base state: `fresh`, `stale`, `partial`, `unavailable`, `error`, or `loading`;
- connection state: online, mesh-only, or dead zone;
- local fixture camera/follow mode: `route_origin`, `fixture_position`, `heading_up`, `north_up`, or `unavailable`;
- local Ride Mode: `idle`, `active_fixture`, or `ended`.

The model must make it impossible to label a stale/lost observation as live. It must keep `deviceObservedAt`, age/freshness, accuracy, and source separate from server receipt or group presence. Do not create a generic `isLive` boolean.

### 2. GPS/freshness truth matrix

| GPS state | Position/telemetry presentation | Allowed local action | Prohibited claim |
|---|---|---|---|
| `acquiring` | “Acquiring GPS”; no precise live marker; speed/heading may be unavailable | route-origin recenter and fixture camera toggle | “GPS locked”, current location, active tracking |
| `locked` | fixture position marker, accuracy and observed-time disclosure; telemetry is labelled fixture/local | local fixture follow/heading presentation | device/background tracking or group sharing |
| `stale` | “Last known position”; show age and degraded accuracy/source; marker visually stale | return camera to route origin; retain last-known marker only with disclosure | live location, current route progress, fresh navigation |
| `lost` | “GPS unavailable”; no current-position marker; unavailable telemetry uses a non-numeric placeholder | route-origin recenter and retry/acquire fixture state only | a last-known location presented as current, navigation guidance |

At any GPS state, `MapSurface` base coverage/freshness remains an independent truth. A locked GPS fixture does not make stale/partial/unavailable map data fresh; a fresh map does not make stale/lost GPS current.

### 3. Map Home controls

Extend or compose the R8 map controls using fixture-only callbacks:

- **Recenter:** always returns the camera to the selected route origin. It must not call a location API.
- **Follow fixture position:** available only for `locked`; this is a local presentation mode, clearly labelled as fixture state in development/test copy or a component contract.
- **Heading up / north up:** rotates only the fixture camera using the supplied fixture heading; stale/lost states cannot imply a current compass heading.
- **Retry/acquire:** changes only the deterministic local fixture/test state. It does not request OS permissions, device GPS, or network data.

All controls retain 48dp minimum targets; in-ride actions use 56dp. They must remain usable or truthfully disabled when the map is loading, stale, partial, unavailable, or errored, without covering map status or OSM attribution.

### 4. Telemetry HUD contract

Refactor `TelemetryHUD` to consume a typed presentation model or exact equivalent. It must support all four GPS states, including `stale`; it must not collapse stale into lost.

Required fields and rules:

- speed, altitude, bearing, accuracy, observation age/source, GPS state, connection state, and Ride Mode state;
- numeric telemetry uses tabular numerals; unavailable values use a localized non-numeric placeholder, never `0` unless zero is observed fixture data;
- stale labels disclose last-known/degraded state and avoid the word “live”;
- `deadZone`/offline describes connectivity or cached-map state only, not GPS state or a downloaded/verified pack unless existing R6 pack state proves it;
- no `SOS` red for GPS, map, generic failure, stale, or offline state;
- use semantic tokens across Night, Day Glare, Dusk, and Blackout; do not add raw hex/RGBA, raw shadow colours, or magic touch sizes.

### 5. Ride Mode boundary

Retain the existing start/end action only as a **local fixture Ride Mode**. Its contract may show `idle → active_fixture → ended`, elapsed fixture time, and a local visual mode, but it must not:

- start background location collection;
- claim a saved ride session, route progress, or server synchronization;
- broadcast location to a group;
- start SOS transport or notification channels; or
- persist an authoritative navigation session beyond the existing R6 fixture/persistence boundary.

Use explicit labels/accessible descriptions so a user or future engineer cannot mistake R9’s local view state for R11 trip persistence or R13 live tracking.

### 6. Fixtures and tests

Use or extend deterministic fixtures for:

1. acquiring GPS with a fresh map;
2. locked GPS with fixture follow/heading display;
3. stale GPS in an offline/dead-zone map scenario, with explicit last-known age;
4. lost GPS with a stale/partial/unavailable map state;
5. a map error/loading state where overlays, attribution, and truthful controls remain visible;
6. idle, active-fixture, and ended Ride Mode; and
7. all four theme modes for at least locked and stale telemetry.

Tests must cover state derivation and boundary behaviour, including:

- `stale` cannot render a live/current label;
- `lost` cannot render a current position marker or numeric telemetry invented from a fixture default;
- follow is unavailable outside `locked`;
- recenter never consumes a location service or changes a route candidate;
- fresh map and locked GPS remain independent dimensions;
- all interactive controls expose descriptive accessibility roles/labels and target sizes; and
- existing R7/R8 route layers, hazard semantics, OSM attribution, bottom navigation, and SOS behaviour still work unchanged.

## Non-negotiable constraints

- No `expo-location`, `navigator.geolocation`, background task, native location permission, real GPS, live heading, route matching, or map SDK call.
- No network/API client, WebSocket, group presence, BLE/mesh transport, chat, or server integration.
- No real turn-by-turn/navigation claim; any motion/follow behaviour is fixture-local.
- No provider identifiers, API keys, tile URLs, raw device coordinates, or real route geometry.
- Do not show `0 km/h`, `0 m`, or `0°` as a substitute for unavailable telemetry.
- Do not use SOS red outside emergency UI; hazards remain governed by R8 semantics.
- Do not broaden into R10–R18 work.

## Acceptance criteria

1. A typed, provider-neutral presentation contract covers acquiring/locked/stale/lost GPS plus map freshness and local Ride Mode independently.
2. Telemetry and map marker/camera UI distinguish all four GPS states; stale/lost never overstate position, navigation, or liveness.
3. Map Home/follow/recenter/heading operations only change deterministic fixture state and obey touch/accessibility requirements.
4. Ride Mode remains explicitly local/fixture-only; no device, service, or group side effect is introduced.
5. Locked/stale telemetry and controls render correctly in Night, Day Glare, Dusk, and Blackout; no raw visual values are added.
6. Existing R7/R8 overlays, OSM attribution, Terai restriction, safety UI, and map fallback states regress neither behaviour nor truthful wording.
7. `npm run typecheck`, `npm test -- --runInBand`, `git diff --check dev...HEAD`, and a simulator walkthrough of locked/stale/lost states pass.

## Required Antigravity completion report

Report changed files/dependencies; the presentation and state-transition contract; exact fixture matrix; GPS/map truth table; accessibility/touch proof; all-theme screenshot/video simulator evidence; validation command output; and every deliberately deferred native/provider risk. Open a PR to mobile `dev`; do not merge it.
