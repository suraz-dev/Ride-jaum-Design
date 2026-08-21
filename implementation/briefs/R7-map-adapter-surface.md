# R7 — MapAdapter and Fixture-Backed MapSurface

> **Status:** Approved for Antigravity implementation after mobile PR #1 has merged to `dev`.  
> **Implementation repository:** `/Users/surajshrestha/Documents/Ride Jaum/RideJaunm-Mobile` (`dev`).  
> **Dependencies accepted:** R1 tokens/themes and R6 domain/fixtures/persistence.  
> **This task does not enable a production map provider or offline-pack download.**

## Outcome

Create a provider-neutral `MapAdapter` boundary and a visual `MapSurface` that runs deterministically in the simulator using fixtures. It must render map loading, cache-only, fresh, stale, partial-coverage, unavailable, and error states truthfully; preserve camera state; and show visible OpenStreetMap attribution on every map surface.

R8 owns route/marker layers, map controls, and map modes. R9 owns GPS-driven Map Home and Ride Mode. R12 owns actual offline-region download UI. Keep R7 focused on the reusable base-map contract.

## Required source references

- Mobile `AGENTS.md` and design-repo `AGENTS.md`.
- `docs/10-design-to-code-react-native.md` — map component, offline, token, accessibility, and fallback rules.
- `docs/17-adr-001-geospatial-decision-packet.md` — `MapAdapter` boundary, attribution, provider-neutral pilot, and no public OSM dependency.
- `docs/09-nepal-offline-data-spec.md` — partial/stale/coverage truth and attribution requirements.
- `docs/28-s1-domain-api-schema-catalogue.md` — route/pack provenance boundary.
- `docs/34-mobile-qa-r6-acceptance.md` — R6 accepted state and residual boundaries.

## Scope

### 1. Provider-neutral adapter contract

Create typed map models and an adapter under `src/services/map/` (exact filenames are Antigravity’s choice):

```ts
type MapCamera = {
  center: { latitude: number; longitude: number };
  zoom: number;
  bearingDegrees: number;
  pitchDegrees: number;
};

type MapNetworkPolicy = 'online' | 'cache_only';
type MapBaseState =
  | 'loading'
  | 'fresh'
  | 'stale'
  | 'partial'
  | 'unavailable'
  | 'error';

type MapRenderInput = {
  camera: MapCamera;
  networkPolicy: MapNetworkPolicy;
  baseState: MapBaseState;
  coverage?: { isCovered: boolean; missingAreaLabel?: string };
  provenance: {
    source: string;
    sourceVersion: string;
    licence: string;
    attribution: string;
    freshUntil?: string;
  };
};

interface MapAdapter {
  render(input: MapRenderInput): Promise<void>;
  setCamera(camera: MapCamera): Promise<void>;
  getCamera(): Promise<MapCamera>;
  setNetworkPolicy(policy: MapNetworkPolicy): Promise<void>;
}
```

- Implement `FixtureMapAdapter`, an in-memory deterministic adapter for simulator/test usage. It exposes safe inspectable state/call history only; it contains no provider token, network request, map-SDK import, public OSM tile URL, or production offline-download claim.
- Persist safe camera/selected map fixture state through the R6 `LocalStore` boundary if doing so is small and covered by a restart test. Do not persist precise location history.
- Do not select or integrate MapLibre in this task. The architecture remains ready for a later native renderer adapter after its native-build/licence/source gate.

### 2. `MapSurface` composite

Create a reusable `src/components/map/MapSurface.tsx` (or equivalent) that receives only a typed view model/callbacks—never direct SDK calls—and is safe to use on the current Ride Home placeholder.

Required behavior:

- Render a Himalayan/topographic **fixture surface**, not a deceptive live street map.
- Render camera-derived test label/telemetry in a testable, non-sensitive form.
- Use the exact base state and network policy to show one clear state label/icon/pattern; color alone is never sufficient.
- `fresh`: normal fixture terrain/base surface.
- `stale`: visible stale badge and source/freshness disclosure.
- `partial`: wireframe/hatched missing-coverage region plus explicit “partial coverage” label; never a blank or fully covered-looking map.
- `unavailable` / `error`: explicit fallback panel and safe retry callback. Never substitute a public tile source or claim offline coverage.
- `cache_only` with unavailable/uncached data: say cached map data is unavailable; do not imply remote fetch occurred.
- Show `© OpenStreetMap contributors` in every state at bottom-left with accessible label. Include the source/licence version in a non-intrusive detail or accessibility description.
- Work in Night, Day Glare, Dusk, and Blackout. Day Glare must use a solid/high-contrast fallback rather than translucent glass. No raw hex or unexplained spacing values.

### 3. Fixture and state integration

- Add deterministic map fixtures for each required base state, cache-only policy, and a Nepal-specific partial-coverage example. Keep provenance/source/version/freshness explicit and synthetic/approved.
- Use the R6 connection state only to choose/simulate policy; do not call a device location or network API.
- Replace only the Ride Home simulated-map placeholder with `MapSurface` if this does not broaden into R8/R9. Preserve existing navigation, RouteModeSelector, TelemetryHUD, and SOS behavior.
- Map controls, route polylines, waypoints, group markers, compass, scale, layers sheet, and 3D/terrain interactions are out of scope for R7.

## Non-negotiable constraints

- No raw map/tile/routing provider SDK, API key, public OSM tile URL, or real network fetch.
- No claim that an offline pack is complete based only on a visual fixture or adapter state.
- No route geometry, marker, hazard, group-location, or SOS transport feature work; those belong to later tasks.
- Map screen uses design tokens, appropriate 48 dp touch targets for any retry action, dynamic type, roles/labels, and a low-tier solid fallback.
- OSM attribution is visible in every map state—not just successful rendering.
- Failure and cache-only states must be truthful and testable.

## Acceptance criteria

1. `MapAdapter` is provider-neutral, typed, and tested with `FixtureMapAdapter`; no mobile screen imports a map provider SDK.
2. `MapSurface` renders loading, fresh, stale, partial, unavailable, error, and cache-only-unavailable states with clear text/icon/pattern and theme variants.
3. Every map state visibly displays `© OpenStreetMap contributors`; accessibility metadata includes attribution/source/version.
4. Camera update/read and network-policy transitions are unit-tested. A later renderer can replace the fixture adapter without changing screen contracts.
5. Partial coverage renders a wireframe/hatched missing area and explicit label; stale/uncached/error states never imply data is current or available.
6. Ride Home uses the fixture-backed base map without adding route/marker/control work from R8/R9.
7. `npm run typecheck`, `npm test -- --runInBand`, and `git diff --check dev...HEAD` pass. Include simulator verification if `MapSurface` changes the Ride Home screen.

## Required Antigravity completion report

Report changed files/dependencies, adapter contract, fixture states, screen integration, accessibility/attribution proof, exact validation outputs, simulator/device evidence, and unverified native-renderer risks. The lead will QA review before releasing R8.
