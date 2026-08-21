# R8 — Fixture Route/Marker Layers and Map Controls

> **Status:** Approved for Antigravity implementation after R7 has merged to mobile `dev`.  
> **Implementation repository:** `/Users/surajshrestha/Documents/Ride Jaum/RideJaunm-Mobile` (`dev`).  
> **Dependencies accepted:** R1 tokens/themes, R6 domain/fixtures/persistence, and R7 MapAdapter/MapSurface.  
> **This task does not enable a production map provider, live routing, GPS navigation, or offline-pack download.**

## Outcome

Extend the R7 fixture base map with typed, provider-neutral route, marker, and control overlays. The Ride Home screen must clearly represent selected route mode and deterministic Nepal-first route state while remaining safe in every map base state.

R9 owns GPS-driven Map Home, live heading/follow behaviour, and ride telemetry state. R10 owns Trip Planner route comparison and waypoint editing. R12 owns actual offline-region management. Keep R8 to reusable visual contracts and deterministic fixtures.

## Required source references

- Mobile `AGENTS.md` and design-repo `AGENTS.md`.
- `docs/03-color-system.md` and `docs/10-design-to-code-react-native.md` — token, route-semantic, accessibility, and map rules.
- `docs/04-component-architecture.md` — map-control and marker interaction intent.
- `docs/09-nepal-offline-data-spec.md` — hazard, restriction, provenance, and freshness rules.
- `docs/17-adr-001-geospatial-decision-packet.md` — provider-neutrality, attribution, and no public OSM dependency.
- `docs/34-mobile-qa-r6-acceptance.md` and `implementation/briefs/R7-map-adapter-surface.md` — accepted boundaries.

## Scope

### 1. Typed overlay view models

Add typed, screen-independent view models under `src/domain/` or `src/components/map/` for the following fixture overlays:

- `RouteLayerInput`: a route identifier, semantic kind, selected state, display label, bounded synthetic screen points, and provenance/freshness disclosure.
- `RouteSemantic`: `straight`, `curvy`, `supercurvy`, `alternative`, `hazard`, `detour`, or `lost`.
- `MapMarker`: `origin`, `destination`, `waypoint`, `hazard`, `rider`, or `group`; only origin/destination/waypoint/hazard are active R8 visuals. Rider/group rendering belongs to R13.
- `MapControlState`: fixture-only compass, recenter, pitch, layers, and zoom accessibility state. Controls describe local visual state only; they must not invoke an SDK or device service.

Preserve existing `RouteCandidate` and `MapRenderInput` boundaries. Do not leak MapLibre, Mapbox, Google, tile URLs, geometry formats, or provider identifiers into screen/domain types.

### 2. Reusable fixture overlays

Create reusable map components, with exact filenames at Antigravity’s discretion:

- `RouteLayer`: renders a **synthetic visual trace** from fixture screen points. It is not route geometry or turn-by-turn navigation.
- `MarkerLayer`: renders accessible origin/destination/waypoint/hazard markers. Hazard is visually distinct from SOS red and shows a text label or accessible name.
- `MapControls`: renders only the scoped controls below. Every interactive control uses tokenized styling, descriptive accessibility labels, and at least `primitive.size.targetMin` (48 dp); in-ride controls use `primitive.size.targetInRide` (56 dp).

Route semantics are invariant:

| Semantic | Required treatment |
|---|---|
| Straight | Glacier Cyan, solid, direct/fastest label |
| Curvy | Volt, solid, balanced-bends label |
| Supercurvy | Magenta, clearly adventure/maximum-bends label |
| Alternative | Blue dashed, distinct from selected route |
| Hazard | Warning/danger semantic, dashed plus glyph/text; never SOS red |
| Detour | Amber dashed and temporary label |
| Lost | Neutral dashed plus explicit off-route/unavailable label |

Route color is never the only semantic signal. Use the ThemeProvider and existing design tokens—no raw colors, ad-hoc opacity, or magic touch sizing.

### 3. Scoped controls and states

Implement fixture-local actions only:

- Compass: reset the fixture bearing to north.
- Recenter: restore the fixture camera to its selected route origin; it must not read device location.
- Pitch: toggle a fixture camera between 0° and 60°.
- Layers: open a fixture-only sheet/panel that identifies unavailable future layers without claiming traffic, satellite, terrain, mesh, or downloaded data exists.
- Zoom: optional accessible plus/minus; change only fixture camera zoom within documented bounds.

The control bar must remain usable when `MapSurface` is loading, stale, partial, unavailable, or error. For unavailable/error, hide disabled overlay data if necessary but retain truthful map status and attribution. R8 must not mask MapSurface’s fallback panel or OSM attribution.

### 4. Deterministic Nepal-first fixtures

Add fixtures for:

1. selected Straight, Curvy, and Supercurvy route traces;
2. a selected Curvy route with an Alternative trace;
3. a hazard/detour segment and explicit restriction label;
4. origin, destination, and waypoint markers;
5. Supercurvy unavailable/disabled in the Terai;
6. map stale, partial, unavailable, and error combinations where overlays never overstate coverage/freshness.

All coordinates/points are approved synthetic fixture values. Do not introduce real route geometry, road-following claims, distance calculations, route requests, GPS reads, or a new backend/API client.

### 5. Ride Home integration

Replace only the R7 placeholder-level overlay area on Ride Home. Existing `RouteModeSelector`, `TelemetryHUD`, hazard banner, bottom navigation, and SOS behaviour must remain intact.

Selecting an available mode may switch deterministic fixture overlays and the existing selected `RouteCandidate`. A disabled or unavailable Supercurvy route must show an explicit reason and must not silently choose another route.

## Non-negotiable constraints

- No production map SDK, API key, public OSM tile URL, network fetch, routing request, or offline-pack download.
- No real GPS/location/network/BLE/mesh call; connection state can choose a fixture policy only.
- No live rider/group position, chat, SOS transport, turn-by-turn instruction, or real navigation state.
- No raw hex/RGBA or un-tokenized touch geometry.
- Do not use SOS red for hazards, detours, generic error, or disabled state.
- Never claim a route is current, legally passable, downloaded, or navigable solely from a visual fixture.
- Visible OSM attribution remains in every base-map state.

## Acceptance criteria

1. Route/marker/control models are provider-neutral and have unit coverage.
2. All seven route semantics use text/icon/pattern as well as token-based color and work across Night, Day Glare, Dusk, and Blackout.
3. Origin, destination, waypoint, and hazard markers are accessible and distinct; hazards are never SOS red.
4. Compass, recenter, pitch, layers, and accessible zoom update only fixture state and meet touch-target requirements.
5. Terai Supercurvy unavailable, stale, partial, unavailable, and error states remain explicit and do not show false coverage, routing, or live-data claims.
6. Ride Home integrates the selected fixture route without broadening into R9/R10/R12/R13 work.
7. `npm run typecheck`, `npm test -- --runInBand`, and `git diff --check dev...HEAD` pass. Include simulator verification of the Ride Home overlay stack and non-obscured OSM attribution.

## Required Antigravity completion report

Report changed files/dependencies, overlay and control contracts, fixture matrix, accessibility/touch-target proof, screenshot/video simulator evidence, exact validation outputs, and all deliberately deferred native/provider risks. Open a PR to mobile `dev`; the lead will QA before R9 or S2 client integration proceeds.
