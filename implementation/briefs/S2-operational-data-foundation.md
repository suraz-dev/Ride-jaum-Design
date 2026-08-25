# S2 — Operational Data Foundation

> **Status:** Ready for implementation
>
> **Target repository:** `RideJaunm-Backend`
>
> **Starting baseline:** `main` at `ba67de2` (`chore: bootstrap Docker PostGIS data plane`)
>
> **Architecture authority:** [Spring Boot pilot architecture](../../docs/30-spring-boot-pilot-architecture-draft.md), [LLD](../../docs/13-system-lld.md), [S1 contract foundations](../../docs/27-s1-api-event-contract-foundations.md), and [S1 schema catalogue](../../docs/28-s1-domain-api-schema-catalogue.md).

## Objective

Turn the existing local PostgreSQL/PostGIS Docker bootstrap into a reproducible, testable **Spring Boot 3 / Java 21 data foundation**. Establish Flyway as the only application-schema change mechanism; add the minimum provenance-capable geographic schema; and prove forward migration plus local backup/restore.

This task is deliberately an operational foundation. It does **not** expose a product API or make a rider-facing claim.

## Required implementation

### 1. Spring Boot runtime skeleton

- Create one Gradle or Maven Spring Boot 3 application using Java 21. Prefer Maven if no build tool exists yet.
- Add Spring Boot Actuator, JDBC, Flyway, PostgreSQL driver, and Testcontainers dependencies. Do not add Spring Security, an OIDC SDK, a queue/broker SDK, map/routing SDK, Redis, object-storage SDK, WebSocket, or provider integration.
- Add a container-friendly `Dockerfile` and extend Compose with an `api` service that depends on healthy `db`. The database remains private to the Compose network; local host exposure remains development-only.
- Provide `GET /actuator/health/liveness` and `GET /actuator/health/readiness`. These endpoints may report only application/database readiness and must not imply a production deployment or external capability.
- Use structured, redacted logs. Never log database passwords, tokens, precise coordinates, protected contacts, medical content, or SQL values containing protected data.

### 2. Flyway and schema ownership

- Put ordered SQL migrations under the conventional Spring Boot Flyway location, e.g. `src/main/resources/db/migration/`.
- Retire the split ownership implied by `db/init/001_extensions.sql`: the database image may perform image/bootstrap setup only; extensions and all application schema must be idempotently managed by Flyway so an empty database and a restored database converge through the same migration history.
- Keep the existing named Docker volume, health check, `.env` safety, backup command, and interactive restore confirmation.
- Do not implement destructive “down migrations.” Each migration must have a documented forward correction/rollback plan in the task evidence.

### 3. S2 database schema

Implement only a data-provenance foundation, using `uuid` primary keys and UTC `timestamptz` values:

| Relation | Required properties |
|---|---|
| `schema_metadata` or equivalent | migration/application provenance (`schema_version`, applied/verified timestamp, optional build reference); no user data |
| `geo_sources` | source name, source version, licence/reference, received/published timestamps, review state |
| `geo_datasets` | dataset type, source reference, graph/coverage version, validity/freshness interval, checksum, review/publish state |
| `admin_regions` | country configuration reference; declared SRID geometry/geography, source/dataset provenance, validity/freshness/review fields, spatial index |
| `offline_regions` | region identity, declared SRID geometry/geography, country configuration and dataset provenance, coverage/graph versions, validity/freshness/review fields, spatial index |
| `ingestion_quarantine` | immutable reason/evidence metadata for rejected source rows; protected/raw payloads must not be logged or exposed |

For mutable foundation records include `id`, `created_at`, `updated_at`, and `version`. Geographic records must retain `source`, `source_version`, `observed_at`, `published_at`, `ingested_at`, `valid_from`, `fresh_until`, and `review_state` as defined in the LLD. Use declared SRID `4326` and appropriate PostGIS constraints/indexes. No production Nepal boundaries, rider coordinates, or third-party datasets are to be imported in S2; test data must be synthetic.

Do **not** add users/devices/consents, trips/groups/rides, routes/road segments/hazards, offline packs/assets, locations, chat/social data, incidents, audit facts, or outbox events. Those belong to S3–S10/S4 after their authorization and transactional boundaries are implemented.

### 4. Verification and recovery proof

- Add a Testcontainers integration test that starts PostgreSQL/PostGIS, applies Flyway migrations, verifies the PostGIS extension/version, required tables, declared SRID constraints, and spatial indexes.
- Add a deterministic migration-verification command (for example `make verify` or Maven profile) that works from a clean checkout after `make init`.
- Add a documented, automated local restore proof that:
  1. starts an empty database;
  2. applies migrations;
  3. writes only a synthetic provenance/region fixture;
  4. creates a custom-format backup;
  5. restores into a replacement local development database; and
  6. proves the migration history, PostGIS extension, and fixture checksum survive.
- The proof must be safe by default: it may target only the Compose local database, needs an explicit confirmation before replacement, and must never delete volumes or run against an arbitrary database URL.
- Record exact commands and result in `docs/evidence/s2/operational-data-foundation.md` in the backend repository. Do not commit `.env`, backup dumps, credentials, or real data.

## Acceptance criteria

1. `docker compose up --build` starts a healthy `db` and `api` locally.
2. Flyway is the single versioned authority for PostGIS extensions and application schema.
3. A clean Testcontainers run proves migrations, PostGIS, provenance fields, SRID constraints, and spatial indexes.
4. The local backup/restore proof passes using only synthetic data and records the verification evidence.
5. `mvn verify` (or the committed equivalent), `docker compose config`, and `git diff --check main...HEAD` pass with normal diagnostics.
6. No public product endpoint beyond Actuator health, no authentication, no provider, no queue, no routing, no real location, no safety delivery, and no external network dependency is added.

## Explicit exclusions

Identity, authorization, encrypted profile/contact storage, trip/group persistence, transactional outbox, routing graph ingestion, route calculation, offline-pack assets, live presence, chat/media, incidents/SOS channels, cloud/IaC, cache/broker/object-storage vendor selection, and production retention/RTO/RPO commitments.

## Antigravity completion report

Open an **unmerged** PR against backend `main`. Report:

1. the base and head commit, touched schema/runtime files, and any migration version numbers;
2. the exact commands/output for Maven verification, Testcontainers migration test, Compose configuration, and backup/restore proof;
3. schema table/index/constraint inventory and provenance-field mapping to the LLD;
4. proof that only synthetic data was used and no external/provider capability was introduced;
5. rollback/forward-correction notes for every migration; and
6. known limitations and the next dependency gate: S3 identity/device/consent/emergency-profile boundaries.

Keep the PR unmerged for CTO/QA review. Do not create a mobile change as part of this task.
