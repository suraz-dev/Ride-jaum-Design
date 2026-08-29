# S6 — Route-Candidate API and Profile Contract

> **Status:** Ready for implementation after accepted S4 and S5 merges.
>
> **Target repository:** `RideJaunm-Backend`
>
> **Required base:** backend `dev` at or after S5 merge commit `c4bc4d5`. Create `feat/s6-route-candidate-profile-contract` from that base and keep the resulting PR unmerged.
>
> **Architecture authority:** [S1 API/event foundations](../../docs/27-s1-api-event-contract-foundations.md), [domain/API schema catalogue](../../docs/28-s1-domain-api-schema-catalogue.md), [geospatial decision packet](../../docs/17-adr-001-geospatial-decision-packet.md), [S4 brief](S4-trip-group-outbox.md), and [S5 brief](S5-geospatial-ingestion-graph-registry.md).

## Objective

Build the authenticated, provenance-first `POST /v1/routes:candidates` boundary. It accepts an explicit planning request and returns the three product profiles—`straight`, `curvy`, and `supercurvy`—only against a current, published S5 graph with valid coverage.

S6 is a **deterministic synthetic-preview contract**, not a production navigation or routing service. Each response must state its fixture/preview capability and graph provenance. It must never claim that a route is GPS-navigable, traffic-aware, offline-ready, legal for every vehicle, or safe to ride.

## Required implementation scope

### 1. Contract first

Before backend implementation, update the Design SSOT in a separate commit. Refine the existing OpenAPI and schema-catalogue definitions for:

- `POST /v1/routes:candidates`, retaining the required `Idempotency-Key` and shared error envelope;
- `RouteCandidatesCommand`: country/config context, origin, destination, optional bounded waypoint references, and requested profiles; reject absent/duplicate profiles and more than 12 waypoints;
- `RouteCandidate`: opaque candidate ID, profile, `available | restricted | unavailable` state, safe metrics/annotations, restriction reason codes, capability declaration, and provenance; and
- response metadata: request correlation, explicit calculation mode (`synthetic_preview`), graph version/checksum, country configuration version, coverage/freshness state, and generated time.

The API returns a stable ordered set for `straight`, `curvy`, and `supercurvy`; an unavailable or restricted profile remains present with a safe reason code. It must not silently substitute a different profile.

`encodedPolyline` is not introduced or returned in S6. If a synthetic visual hint is necessary for a test, it must be clearly non-navigable and represented as a bounded, non-geographic fixture reference—not raw route geometry. Add the field only if it is explicitly named `preview` and declares `synthetic_preview`, never as a navigable polyline.

### 2. Route-candidate decision boundary

Implement a provider-neutral `RouteCandidateCalculator` port plus a deterministic fixture adapter. The adapter may derive repeatable sample metrics and restrictions from a safe request fingerprint and the pinned graph identity; it may not call a routing engine, geocoder, map/OSM service, tile source, SDK, or network provider.

For every request:

1. authenticate the caller through the S3 boundary and validate country/configuration support;
2. resolve exactly one current published S5 graph for that country/configuration;
3. verify that graph review/publish/freshness and input coverage are eligible; and
4. calculate the three explicit profile projections with graph/dataset/source provenance pinned in the response.

If no eligible graph exists, coverage is unavailable, or freshness has lapsed, return a safe, explicit unavailable result or standard policy/validation error as defined by the S6 contract. Never fall back to a draft, quarantined, expired, unreviewed, or different-country graph.

`straight` means direct/lowest-turn preference, `curvy` means balanced-turn preference, and `supercurvy` means high-curvature/adventure preference. These are product profile labels only until a real routing/provider decision is approved. The fixture adapter must provide a documented restriction path for `supercurvy`; it must never manufacture an available adventurous route when the graph cannot support that claim.

### 3. Persistence, privacy, and idempotency

Add one forward Flyway migration only if durable S6 request/candidate records are required to honour the contract. Do not modify earlier migrations. If records are persisted:

- store opaque request/candidate IDs, owner reference, safe request fingerprint, selected profiles, graph/source/dataset provenance, capability state, metrics/restrictions, idempotency/correlation references, and timestamps;
- do **not** store raw origin/destination/waypoint coordinates, exact route geometry, phone/contact data, or arbitrary request payload in an audit event, outbox event, logs, exception messages, or idempotency response cache;
- use a privacy-safe fingerprint and return the identical safe response on an exact idempotent replay; same key plus different safe command fingerprint returns `409 IDEMPOTENCY_MISMATCH`; and
- enforce ownership: only the requesting rider may retrieve any persisted S6 candidate/detail projection. Do not expose `GET /v1/routes/{routeId}` unless that rule and a safe representation are fully implemented and contract-approved.

Candidate calculation has no business outbox event in S6. It is not a saved route, trip selection, navigation start, notification, or external delivery. Do not emit a `route.saved.v1` fact or extend the S4 trip route-selection command.

### 4. Authorization, truthfulness, and failures

- authenticated riders may calculate only for their own request context; unauthenticated calls fail closed; a user must not infer another rider’s candidate/request existence;
- normalize and validate coordinates only in memory for country/coverage policy. Never log their values. Reject invalid, out-of-country, or unsupported configuration input without echoing protected values;
- all candidate metrics, restrictions, elevation/surface/hazard statements, and availability labels must carry either a synthetic-preview declaration or a provenance-backed source. Never imply live traffic, road closure, elevation, weather, legal clearance, satellite lock, or safety guarantees;
- graph lookup, candidate persistence, audit/idempotency persistence, and response persistence failures must fail atomically. A failed request must not create a reusable candidate/result;
- retained candidate data, if any, is never an offline-pack asset, location history, presence observation, or route navigation trace.

### 5. Required verification

Add Testcontainers/PostGIS integration coverage proving:

1. contract/schema behaviour, opaque IDs, required idempotency, profile ordering, and exactly three profile results;
2. rider, cross-rider, unauthenticated, invalid-input, out-of-country, and unsupported-country/configuration policy paths;
3. a reviewed, published, fresh graph produces deterministic `synthetic_preview` candidates with graph/source/dataset/checksum/coverage provenance;
4. a missing, stale, expired, unreviewed, draft, quarantined, wrong-country, or out-of-coverage graph cannot produce an available candidate or silently fall back;
5. each profile has distinct semantics, and `supercurvy` has explicit restricted/unavailable behaviour where fixture graph evidence cannot support it;
6. exact idempotent replay returns the safe original response without duplicate records; mismatch returns the standard conflict; and forced persistence failure rolls back all S6 writes;
7. raw request coordinates and route geometry are absent from database safe projections, audit/outbox rows, logs/exception messages, idempotency cache, and API error bodies; and
8. no candidate response is represented as navigation, offline-ready, live, delivered, or safety-guaranteed.

Add `docs/evidence/s6/route-candidate-profile-contract.md` with the endpoint/policy matrix, route state/profile table, candidate/provenance example using synthetic non-precise values, privacy scan, idempotency/failure proof, migration/rollback notes, exact test commands/results, and deferred-decision register.

Run and report `git diff --check dev...HEAD`, `./mvnw clean verify`, Compose health probes, and `make verify-backup-restore`. Keep the PR unmerged into backend `dev` for QA.

## Explicitly deferred

- routing-engine/provider selection and integration (Valhalla, GraphHopper, Mapbox, Google, or any other); real geometry/polyline, turn-by-turn directions, map tiles, geocoding/search, traffic, road closures, weather, elevation, hazards, vehicle restrictions, or external datasets;
- trip route selection/save, publishing, sharing, ride start, navigation, or route events;
- offline pack manifests/assets/downloads (S7), rider location/presence/realtime (S8), community/chat/media (S9), and SOS/notifications (S10–S11);
- cache, queue, broker, scheduled worker, cloud SDK, feature-provider credential, or production Nepal data.

## Antigravity completion report

Open an unmerged PR against backend `dev` and report:

1. Design-contract commit, backend base/head commits, and migration inventory;
2. endpoint/profile/state/role policy matrix and graph eligibility rule;
3. the synthetic-preview truthfulness boundary, provenance projection, privacy scan, idempotency, and transactional-failure proof;
4. exact verification commands and results; and
5. explicit confirmation that no external routing/geocoding/map provider, geometry navigation, offline pack, location/presence, realtime, notification, or SOS capability was introduced.
