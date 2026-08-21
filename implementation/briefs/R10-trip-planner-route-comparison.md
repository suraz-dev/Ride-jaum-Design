# R10 — Fixture Trip Planner and Route Comparison

> **Status:** Approved for Antigravity implementation after R9 merge `e547308` into mobile `dev`.
> **Implementation repository:** `/Users/surajshrestha/Documents/Ride Jaum/RideJaunm-Mobile` (`dev`).
> **Dependencies accepted:** R4 form/control foundations, R6 domain fixtures/persistence, R7/R8 map surfaces and route overlays, and R9 truthful map/telemetry states.
> **This task does not enable a routing/geocoding API, real device location, offline-pack download, group persistence/invites, or live tracking.**

## Outcome

Replace the static Trip Planner placeholder with a fixture-backed planning flow that lets a rider select origin/destination, local waypoints, Solo/Group planning intent, and one of three deterministic route candidates. Every candidate exposes route profile, distance, duration, bends/curvature, elevation, surface, hazards, restrictions, provenance, and availability honestly.

R10 builds a reusable local planning presentation contract. It does not claim that a route was calculated, legally validated, saved, shared, downloadable, or navigable. Server-side candidate computation belongs to S6; persisted trips/invites/readiness belong to R11; real offline packs belong to R12; live groups belong to R13.

## Required references

- Mobile `AGENTS.md` and design-repo `AGENTS.md`.
- `docs/04-component-architecture.md`, `docs/05-information-architecture.md`, and `docs/10-design-to-code-react-native.md`.
- `docs/09-nepal-offline-data-spec.md` and [ADR-001](../../docs/17-adr-001-geospatial-decision-packet.md) for provenance, restrictions, and provider neutrality.
- [S1 domain/API catalogue](../../docs/28-s1-domain-api-schema-catalogue.md) for the future `RouteCandidate` contract.
- R6, R8, and R9 implementation briefs.

## Scope

### 1. Typed fixture planning model

Create screen-independent, provider-neutral planning types under `src/domain/` (or a clearly equivalent boundary), for example:

```ts
type PlanningMode = 'solo' | 'group_fixture';
type PlannerSearchState = 'idle' | 'searching_fixture' | 'results' | 'offline_cached' | 'no_results';
type CandidateAvailability = 'available' | 'restricted' | 'unavailable';

type PlannerPlace = {
  id: string;
  name: string;
  nameNepali?: string;
  kind: 'origin' | 'destination' | 'waypoint' | 'suggested_stop';
  source: 'fixture_catalog' | 'offline_fixture_catalog';
};

type PlannerWaypoint = {
  id: string;
  place: PlannerPlace;
  order: number;
  category: 'fuel' | 'food' | 'viewpoint' | 'rest' | 'permit';
  state: 'selected' | 'suggested';
};
```

The planner candidate model must carry display metrics and truth metadata: profile, availability/restriction reason, direct/additional distance and duration disclosure, curviness/bends, elevation, surface summary, hazard/permit/fuel-gap annotations, graph/source/coverage version, freshness, and synthetic/fixture disclosure. Do not use raw encoded geometry, provider IDs, SDK objects, or a generic `isSafe` boolean.

### 2. Local destination search

Provide an accessible origin/destination editor and local, deterministic result list. Searches are against a named synthetic Nepal fixture catalogue only.

- Initial planner fixture may use Kathmandu → Pokhara or another explicitly labelled synthetic corridor.
- Empty query, typing/searching, results, selected result, no results, and offline-catalogue state are visible.
- Offline copy must say it searches the downloaded/fixture catalogue only; it must not imply country-wide place search.
- Do not call a geocoder, location API, remote fetch, map SDK, or device permission.
- Queries remain local component state; do not log, persist, or send precise search/location content.

### 3. Route comparison and selection

Render **Straight, Curvy, and Supercurvy together** as fixture candidates. Curvy is the initial selected candidate unless the active fixture explicitly says otherwise.

Each candidate card/segment must expose more than color:

| Profile | Required copy | Semantic treatment |
|---|---|---|
| Straight | direct/fastest; distance and duration | Cyan, solid, direct icon/label |
| Curvy | balanced bends; distance/duration/bends | Volt, solid, wave icon/label |
| Supercurvy | maximum bends/adventure; additional distance/time | Magenta, distinct pattern/icon/label |
| Restricted | explicit reason and next action/learn-more fixture copy | warning/hazard semantics; never SOS red |
| Unavailable | explicit reason; disabled and non-selectable | neutral/warning state, never silent substitution |

Selection changes only local fixture presentation: selected candidate card, R8 synthetic map trace/route summary, metrics, and annotations. It must not calculate a route, mutate a saved route, start navigation, or fall back to another candidate without explaining why.

Required fixture cases:

1. Kathmandu → Pokhara: all three available, Curvy selected.
2. Terai: Supercurvy unavailable with “not enough bends”/flat-corridor reason, disabled and non-selectable.
3. Restricted/permit corridor: Supercurvy has an explicit permit requirement; selection is blocked or visibly restricted according to fixture rules.
4. Monsoon hazard/detour: a candidate shows hazard and detour annotation but no false claim that conditions are live/current.
5. Stale/partial map context: planner keeps source/freshness disclosure independent of candidate availability.

### 4. Waypoint editor

Implement local fixture waypoints only:

- add a suggested fuel, food, viewpoint, rest, or permit stop from the fixture catalogue;
- remove a selected waypoint with confirmation/accessibility label;
- reorder at least through accessible move-up/move-down controls; drag support is optional and must have an equivalent accessible path;
- update the visual route-summary state and a local “fixture route updated” disclosure;
- preserve stable waypoint IDs and explicit order.

Do not compute road geometry, ETA, distance, or route legality after an edit. Display pre-authored synthetic fixture estimates only, marked as such where needed.

### 5. Solo and group planning intent

Add a Solo/Group choice:

- **Solo:** only the current rider fixture context.
- **Group:** shows a read-only synthetic squad summary and a message that group setup/invites/readiness are completed in R11.

R10 must not create a group, invite a rider, assign lead/sweep roles, persist a rally point, send a link, or display live/shared location. The group control changes only the local planning presentation.

### 6. Planner state and accessibility

- All controls meet 48dp targets (56dp where the design declares an in-ride control; planning is normally 48dp).
- `RouteModeSelector` keeps radiogroup semantics; unavailable Supercurvy exposes `accessibilityState.disabled` and its reason.
- Candidate cards announce profile, availability, distance, duration, bends/curviness, and restriction state.
- Destination and waypoint actions have descriptive labels; reorder has an accessible equivalent.
- All added UI uses tokens across Night, Day Glare, Dusk, and Blackout; no raw hex/RGBA, magic touch geometry, or SOS red for ordinary warnings/restrictions.
- Long Nepali names, English, Nepali, and Hindi placeholder/copy keys must not break the layout. Do not claim localization is complete merely because a fixture includes Devanagari.

## Deliberately excluded

- network/API clients, map/routing/geocoding provider SDKs, API keys, tile URLs, or live search;
- GPS/device location, background services, live route progression, turn-by-turn guidance, or ETA calculation;
- actual saved trip, invitation, group, membership, readiness, route sharing, or server synchronization;
- actual offline-region selection/download/verification; a future/offline state must say unavailable or fixture-only;
- live hazards, weather, permit data, road legality, traffic, or emergency-service assertions;
- R11–R18 work.

## Acceptance criteria

1. Typed planning/candidate/waypoint models preserve provider neutrality and have unit coverage.
2. Search, Solo/Group intent, candidate comparison, selection, waypoint add/remove/reorder, empty/no-result/offline fixture states are functional locally.
3. Three profiles remain distinguishable by label/icon/pattern and token semantics; Supercurvy unavailable/restricted cases are explicit and cannot silently select/fallback.
4. Planner metrics, hazards, permits, source/freshness, map state, and offline state never overstate live/current/legal/downloaded data.
5. Group mode remains a read-only R11 handoff; no real group/persistence/network capability is introduced.
6. Existing R7–R9 map, telemetry, attribution, SOS, and bottom navigation behaviour do not regress.
7. `npm run typecheck`, `npm test -- --runInBand`, `git diff --check dev...HEAD`, and a simulator walkthrough covering all required fixture states pass.

## Required Antigravity completion report

Report changed files/dependencies; typed planner contracts; all fixture cases; state matrix; accessibility/touch evidence; Night/Day Glare/Dusk/Blackout simulator screenshots/video; exact validation output; and deliberately deferred native/provider risks. Open a PR against mobile `dev`; do not merge it.
