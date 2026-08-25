# System Design Build Manifest

| ID | Bounded task | Depends on | Definition of done |
|---|---|---|---|
| S0 | Create ADR template, risk register, threat model, environment model, and readiness record | — | ADRs accepted; unresolved provider/policy questions explicit; ownership/evidence gates tracked in `docs/26-s0-architecture-readiness.md` |
| S1 | Define versioned domain/API/event schemas and error envelope | S0 (architecture assumptions may proceed while external S0 gates remain tracked) | contract tests and idempotency rules exist; shared baseline: `docs/27-s1-api-event-contract-foundations.md`; endpoint/schema catalogue: `docs/28-s1-domain-api-schema-catalogue.md`; machine-readable draft: `contracts/openapi/v1.yaml`; event catalogue: `docs/29-s1-event-schema-catalogue.md` |
| S2 | Establish operational data store, geospatial schema, migrations, backup policy | S1 | migration/restore test and provenance fields; implementation brief: [S2 operational data foundation](briefs/S2-operational-data-foundation.md) |
| S3 | Build identity/device/consent/emergency-profile boundaries | S1,S2 | resource policy tests and audit records; implementation brief: [S3 identity/device/consent boundaries](briefs/S3-identity-device-consent-boundaries.md) |
| S4 | Implement core trip/group/route persistence and outbox | S1,S2 | transactional writes emit idempotent events |
| S5 | Implement geospatial ingestion, validation, graph-version registry | S2 | malformed data quarantined; source/freshness visible |
| S6 | Implement route candidate API and profile contract | S4,S5 | three candidates/restrictions/provenance tests |
| S7 | Implement pack manifest, signed assets, integrity receipts | S5 | resumable partial/stale/integrity tests |
| S8 | Implement realtime presence/location and sync queue | S3,S4 | membership, TTL, stale, dedupe and privacy tests |
| S9 | Implement social/chat/media boundaries | S3,S4 | authorization, moderation, queued-write tests |
| S10 | Implement safety incident/audit/channel-attempt APIs | S3,S4 | no false-delivery state; immutable lifecycle tests |
| S11 | Integrate approved notification channels behind flags | S10 | provider receipt/failure/retry/failover evidence |
| S12 | Add observability, abuse controls, runbooks and load/failure drills | S4–S11 | dashboards, alerts, restore and incident exercises |
| S13 | Country-configuration and expansion validation | S5–S12 | Nepal configuration has no hard-coded product branches |

For every system task report: data/API/event changes, migration/rollback plan, authorization and privacy effects, idempotency and failure behavior, test evidence, operational metrics, and open decisions.
