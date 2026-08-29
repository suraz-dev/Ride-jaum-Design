# S5 — Geospatial Ingestion, Validation, and Graph-Version Registry

> **Status:** Ready for implementation after S2. Start from backend `dev` after the accepted S4 merge so the shared transactional outbox is available; do not merge S4 as part of S5.
>
> **Target repository:** `RideJaunm-Backend`
>
> **Required base:** latest backend `dev` containing accepted S2 and S4.
>
> **Architecture authority:** [ADR-001 geospatial decision packet](../../docs/17-adr-001-geospatial-decision-packet.md), [S1 API/event foundations](../../docs/27-s1-api-event-contract-foundations.md), [event catalogue](../../docs/29-s1-event-schema-catalogue.md), [LLD](../../docs/13-system-lld.md), and [S2 data platform LLD](../../docs/31-s2-data-platform-lld-draft.md).

## Objective

Build the server-owned, provenance-first foundation that ingests reviewed synthetic geo inputs, validates them, quarantines invalid input, and publishes immutable graph-version metadata. This is a registry and validation boundary: it does **not** calculate rider routes, serve tiles, download packs, use public OSM services, ingest production Nepal data, or expose location tracking.

Every publishable graph must be reproducible from named, licensed source datasets and explicit coverage/freshness metadata. Invalid input must remain observable in quarantine without becoming eligible for routing or offline-pack use.

## Required implementation scope

### 1. Design contract first

Before backend implementation, update the Design SSOT in a separate commit:

- add the S5 admin/internal API subset to `contracts/openapi/v1.yaml` and the S1 schema catalogue: source registration, dataset ingestion, graph-version creation, graph publication, and read-only graph/source status;
- use the standard API error envelope and require `Idempotency-Key` for every mutating S5 command;
- make admin/internal authorization explicit. The test-only synthetic identity seam may represent a `geo_admin`; production authentication/role-provider work remains deferred;
- define `GraphVersion` as immutable after publication and include opaque IDs, country/config version, source/dataset references, coverage reference, checksum, build time, review/publish state, and freshness; and
- document that `graph.published.v1` contains references and provenance only—never raw geometry, source credentials, precise user location, or protected input.

No rider-facing route-candidate endpoint belongs in S5. S6 owns candidate generation and profile behaviour.

### 2. Schema and provenance boundary

Add one forward Flyway migration that extends the S2 geo foundation without rewriting prior migrations. Reuse S2 `geo_sources`, `geo_datasets`, `admin_regions`, `offline_regions`, and `ingestion_quarantine`; introduce only the minimum S5-owned records needed, such as:

- `geo_ingestion_jobs`: immutable request/provenance summary, actor, idempotency/correlation reference, received time, state, and result references;
- `geo_dataset_validation_results`: append-only validation facts with rule code, severity, safe reason, and dataset/input reference;
- `graph_versions`: immutable graph identity, country/config version, deterministic build/checksum, source/dataset provenance, coverage geometry/reference, build/review/publish/freshness states and timestamps; and
- if required for reproducibility, a normalized `graph_version_datasets` join that pins the precise immutable dataset version(s) used.

Use SRID 4326 consistently. Validate geometries with PostGIS (including non-empty, valid, expected geometry type and SRID); create spatial indexes only for data queried spatially in this task. Source and dataset metadata must include source name/version, licence/reference, attribution, received/published timestamps, review state, checksum, validity/freshness interval, country code, and country configuration version.

Do not add user-location tables, road-segment routing graphs, route geometries, POIs/hazards, tiles, pack manifests, cloud object storage, external fetchers, or cross-context cascade foreign keys.

### 3. Ingestion and quarantine rules

- Accept **synthetic fixture input only** through the internal/admin command boundary. There is no URL fetch, provider SDK, OSM download, or production source connector in S5.
- Reject and quarantine malformed JSON, absent/invalid source provenance, unsupported country/config, duplicate checksum with conflicting metadata, invalid/empty/SRID-mismatched geometry, expired source data, and attempts to publish an unreviewed or quarantined dataset.
- Quarantine is append-only and records a safe reason code plus redacted evidence metadata. Do not expose raw payloads in logs, errors, audit facts, or outbox events. The original input must never become eligible by retrying a publish command.
- A valid graph publication atomically records the published graph state, safe audit fact, and `graph.published.v1` outbox event. Failed validation or publication produces no graph publication event.
- Published graph versions and their pinned source/dataset/checksum/coverage/freshness values are immutable. Corrections create a new version; no historical graph is overwritten or deleted.
- Read models must clearly distinguish `draft`, `reviewed`, `published`, `quarantined`, `expired`, and `stale` according to their documented clocks. Never report a graph as route-ready; it is only *eligible for later S6 validation*.

### 4. Authorization, privacy, and failure policy

- Only `geo_admin` can register or ingest sources/datasets, create/publish graph versions, or inspect quarantine detail. Non-admin and unauthenticated callers receive the shared policy error without dataset detail.
- Public/rider reads (if exposed at all) return only the safe published graph provenance/status projection; no raw input, internal quarantine evidence, or provider credentials.
- Idempotent replay returns the same safe accepted result and does not create a second job, validation fact, graph version, audit fact, or outbox row. A payload mismatch is rejected.
- Any failure in source/dataset/graph persistence, audit, or outbox persistence rolls back the command. A quarantined ingestion is a deliberate accepted terminal result, recorded atomically with its validation evidence but without `graph.published.v1`.

### 5. Required verification

Add Testcontainers/PostGIS integration coverage proving:

1. migration/schema constraints, SRID/type/validity checks, provenance/freshness fields, and public opaque-ID behaviour;
2. geo-admin, non-admin, and unauthenticated authorization paths, including no internal detail leakage;
3. successful synthetic source/dataset ingestion and deterministic graph-version creation/publishing with source, checksum, coverage, and freshness references;
4. malformed, invalid, empty, wrong-SRID, expired, conflicting-checksum, and unreviewed inputs are quarantined with safe reason codes and cannot be published;
5. publication is immutable, creates exactly one safe `graph.published.v1` outbox row, and contains no raw geometry, secrets, or precise user location;
6. idempotency replay/mismatch and forced persistence failure roll back correctly; and
7. historical graph versions remain unchanged when a newer version is created, while stale/expired status is explicit.

Add `docs/evidence/s5/geospatial-ingestion-graph-registry.md` with the source/dataset/graph schema inventory, ingest and quarantine state tables, endpoint/policy matrix, synthetic fixtures, event example, transaction/failure proof, migration/rollback notes, exact verification results, and deferred decisions.

Run and report `git diff --check dev...HEAD`, `./mvnw clean verify`, Compose health probes, and `make verify-backup-restore`. Keep the PR unmerged into backend `dev` for QA.

## Explicitly deferred

- production Nepal data, external source connectors, legal acceptance of a specific provider/source, source credential storage, object storage, and scheduled ingestion;
- road graph construction/routing engine, route candidate generation, search/geocoding, profile scoring, restrictions/hazards/POIs, and rider-facing route API (S6);
- map tiles/styles and offline packs/manifests/assets (S7);
- rider location, presence, realtime transport, community, SOS, notifications, cache, queue broker, and cloud SDKs.

## Antigravity completion report

Open an unmerged PR against backend `dev` and report:

1. Design-contract commit, backend base/head commits, and migration inventory;
2. endpoint-to-role/state policy matrix, source/dataset/graph provenance model, and all deferred guards;
3. quarantine, immutability, outbox, idempotency, and transaction-failure proof;
4. exact verification commands and results; and
5. explicit confirmation that no real routing, public OSM dependency, external ingestion, tiles, packs, rider location, realtime, or emergency capability was introduced.
