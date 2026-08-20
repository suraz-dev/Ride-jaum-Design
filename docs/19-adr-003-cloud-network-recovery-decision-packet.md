# ADR-003 Decision Packet — Cloud, Network, and Recovery

> **Decision:** Select the pilot cloud operating model, network zones, backup/recovery model, and operational-access boundary.  
> **Status:** Accepted — single-region pilot (2026-08-19).  
> **Parent record:** [ADR-003](15-architecture-decision-records.md#adr-003--cloud-network-recovery-and-data-residency).

## 1. Decision statement

Adopt a **single-primary-region, provider-neutral pilot platform** with separate environments, private application/data networks, managed PostgreSQL + PostGIS, encrypted object storage, managed secret storage, durable asynchronous processing, and tested point-in-time recovery.

```text
Internet → DDoS/WAF/rate controls → public API/realtime ingress
         → private application services/workers
         → private data services (Postgres/PostGIS, cache, queue, object storage)
         → egress-controlled provider adapters
```

The primary cloud, region, RTO/RPO target, and cross-region disaster-recovery spend remain unselected. This decision sets the minimum architecture and validation requirements, not a vendor commitment.

## 2. Why this model

The pilot must be operationally simple enough to build and test while still protecting precise location, emergency contact, medical-card, incident, and source/provenance data. A single primary region avoids premature multi-region complexity. It does not remove the requirement to prove recovery.

PostgreSQL supports continuous archiving and point-in-time recovery through a base backup plus archived WAL, which is the portability baseline expected from the selected managed database or self-managed fallback. [PostgreSQL PITR documentation](https://www.postgresql.org/docs/17/continuous-archiving.html)

Recovery proof must cover the complete application stack with restored data, not only a successful database restore. Recovery testing should use declared integrity, RTO, and RPO objectives. [Recovery testing guidance](https://docs.cloud.google.com/architecture/framework/reliability/perform-testing-for-recovery-from-data-loss)

Secrets and backups must be encrypted, access-restricted, monitored, and restore-tested. [OWASP secrets-management guidance](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

## 3. Target topology

```mermaid
flowchart TB
  User["Rider / contact / operator"] --> Edge["Public edge\nTLS, WAF, DDoS, rate limits"]
  Edge --> API["Private API and realtime services"]
  API --> Worker["Private workers\npack, ingestion, notification, export"]
  API --> DB[("Private Postgres + PostGIS")]
  API --> Cache[("Private cache / presence")]
  API --> Queue["Durable queue/event transport"]
  Worker --> DB
  Worker --> Blob[("Private object storage\npacks, media, exports")]
  API --> Blob
  Worker --> Provider["Egress-controlled provider adapters"]
  Secrets["Managed secrets + KMS"] --> API
  Secrets --> Worker
  Audit["Redacted logs, metrics, traces, audit stream"] <-- API
  Audit <-- Worker
  Backup["Encrypted backup/PITR archive\nseparate access boundary"] <-- DB
  Backup <-- Blob
```

### Network-zone rules

| Zone | Allowed inbound | Allowed outbound | Rule |
|---|---|---|---|
| Public edge | internet HTTPS/WebSocket only | private API/realtime | no direct database/object/queue access |
| Private services | edge and authorized service identity | private data services; approved provider adapters | mutual/service identity and least privilege |
| Data | private service identity only | backup/monitoring endpoints only | no public IP or public administrative access |
| Operations | approved administrator through audited path | scoped management plane | no shared root credentials or direct routine data browsing |
| Recovery | controlled restore tooling | isolated restore target | no production traffic until validation completes |

## 4. Environment and account/project separation

| Environment | Isolation | Data | Provider integrations |
|---|---|---|---|
| Local | developer-controlled, no cloud trust | synthetic fixtures | mocks/sandboxes only |
| Development | separate cloud account/project/namespace | synthetic/sanitized | sandbox credentials |
| Staging | separate from production; production-like topology | synthetic/approved test data | test recipients and sandbox channels only |
| Production | separate account/project and access boundary | live, policy-governed data | approved production credentials only |

Infrastructure is defined as code. Environment configuration references secret IDs/feature flags, never secret values. Production changes require an auditable deployment path and rollback plan.

## 5. Data-platform requirements

| Concern | Pilot requirement |
|---|---|
| Operational/geospatial data | managed PostgreSQL compatible with PostGIS, migrations, read replicas only when measured need exists |
| Recovery | automated backup plus PITR or equivalent; encrypted backups with separate restricted access |
| Object assets | private object storage, immutable checksum-addressed pack assets, versioned manifest metadata, scoped signed URLs |
| Queue/events | durable, retryable transport with DLQ, message encryption/control appropriate to provider |
| Cache | TTL-bounded presence/session/rate state; cache loss cannot lose source-of-truth records |
| Secrets | managed secret store, rotation process, least-privilege service identity, break-glass process |
| Audit | append-only incident/privileged-access audit and retention/export policy |

The selected platform must support PostGIS extension availability, encrypted storage/backups, private network endpoints, service/workload identity, object lifecycle policies, and log/metric redaction. If it cannot, it is not eligible for production.

## 6. Backup and recovery design

### Recovery classes

| Class | Examples | Minimum recovery approach |
|---|---|---|
| Critical safety ledger | incident lifecycle, channel attempts, acknowledgements | PITR/equivalent, immutable audit history, restore validation before release |
| Core transactional data | users, consent, trips, membership, saved routes | PITR/equivalent and migration-aware restore |
| Geospatial registry | graph/source/manifest metadata | restore metadata plus matching immutable asset version |
| Object assets | packs, media, exports | object versioning/checksum, lifecycle and deletion policy |
| Ephemeral state | presence/cache | recreate from clients/durable data; never depend on it for truth |

### Recovery procedure requirements

1. Declare RTO and RPO after a product/business-impact decision; do not claim a recovery objective before it is tested.
2. Restore database, object manifests/assets, secrets/config references, and application services into a non-production recovery environment.
3. Validate schema version, migration compatibility, source/pack checksums, core authorization, and incident-audit continuity.
4. Record actual recovery time, recovery point, data-integrity checks, gaps, and corrective actions.
5. Test failure of the primary provider path and safety notification dependency separately from data restoration.

## 7. Security and access controls

- Use workload/service identities instead of shared static credentials where the selected platform supports them.
- Secrets are never committed, emitted in build logs, added to client bundles, or copied between environments.
- Require multi-factor administrator access, least privilege, time-bound privileged elevation, and audit of privileged data reads.
- Place data services behind private endpoints/firewalls; use TLS in transit and KMS-managed encryption at rest.
- Separate runtime, deployment, audit, and backup roles so one compromised runtime identity cannot erase both data and recovery evidence.
- Egress to identity, map, weather, SMS/push, and future providers is adapter-scoped and observable.
- External provider callbacks validate signature/authentication and are rate-limited before state mutation.

## 8. Selection scorecard

| Criterion | Weight | Hard gate |
|---|---:|---|
| Private networking, workload identity, secret management | 20% | required |
| Managed Postgres/PostGIS + PITR/recovery support | 20% | required |
| Object storage, encryption, lifecycle, signed access | 15% | required |
| Nepal rider and operator latency/reachability evidence | 10% | required pilot measurement |
| Environment/account isolation and IaC support | 10% | required |
| Backup/restore and audit tooling | 10% | restore drill required |
| Cost/egress/support fit | 10% | budget approval required before production |
| Cross-region recovery option | 5% | documented migration path required |

## 9. Rollout plan

| Phase | Scope | Exit evidence |
|---|---|---|
| Pilot foundation | one region, development/staging, private topology, synthetic data | IaC review and no public data service exposure |
| Data proof | migration, backup, PITR/equivalent restore, object/manifest integrity | recorded restore exercise |
| Safety readiness | independent safety queues/secrets/audit, provider-outage simulation | no false delivery state; runbook complete |
| Production gate | approved region/provider/cost, live privacy policy, on-call model | owner approval plus security/recovery tests |
| Scale/DR gate | evaluated second-region/recovery need | RTO/RPO and failover evidence |

## 10. Decision alternatives

| Option | Decision |
|---|---|
| Single primary cloud region for pilot + tested recovery | **recommended** |
| Active-active multi-region from day one | deferred until RTO/RPO, budget, and operational ownership justify it |
| Public database/cache/object endpoints | rejected |
| Backup without restore drills | rejected |
| Shared production and staging account/project | rejected |
| Static credentials embedded in applications | rejected |

## 11. Approval record and scope

**Approved on 2026-08-19:** the provider-neutral, single-primary-region pilot architecture and its recovery/security gates.

This does **not** select a cloud vendor/region, approve production data residency, set RTO/RPO, or authorize cross-region spend.
