# RideJaunm System Risks, Threat Model, and Environments

> **Purpose:** S0 operational and security baseline.  
> **Companion:** [ADR register](15-architecture-decision-records.md), [Full System Architecture](14-full-system-architecture.md), and [system build manifest](../implementation/system-design-task-manifest.md).

## 1. Risk register

| ID | Risk | Likelihood | Impact | Mitigation / owner | Gate |
|---|---|---:|---:|---|---|
| R-01 | Nepal road/map data is incomplete, stale, or incorrectly licensed | Medium | High | provenance model, source review, freshness UI, ADR-001 | geo validation + licence review |
| R-02 | Supercurvy recommends a closed/unsafe/unsupported road | Medium | High | hard constraint filtering, explicit unavailable state, hazard provenance | route regression + field validation |
| R-03 | User interprets local/peer SOS state as emergency-service delivery | Medium | Critical | evidence-state vocabulary, isolated safety ledger, ADR-007 | safety/legal/device proof |
| R-04 | Poor connectivity loses or duplicates user writes | High | High | local queue, idempotency keys, transactional outbox, retry/DLQ | offline/duplicate/failure tests |
| R-05 | Precise group location is exposed beyond consent/scope | Medium | Critical | server resource policy, TTL presence, audit, least disclosure | security/privacy review |
| R-06 | Device loss compromises cached protected data | Medium | High | encrypted local store, key-store lifecycle, scoped cache | ADR-005 + device test |
| R-07 | Pack corruption or partial coverage causes unsafe assumptions | Medium | High | manifest checksums, partial/stale labels, layer freshness | interruption/integrity tests |
| R-08 | Map/SMS/push provider outage blocks critical flows | Medium | High | adapters, outage UI, configured failover, provider evidence | failure-injection drill |
| R-09 | Community/media abuse or illegal content | Medium | Medium | moderation state, reporting, quotas, storage policy | ADR-006 + authorization tests |
| R-10 | Safety workload is starved by social/media traffic | Low | Critical | isolated deployable, priority queues, separate quotas/runbooks | backlog/load drill |
| R-11 | No tested restore path for relational/object/geospatial data | Medium | Critical | encrypted backups, routine restore exercises | production readiness gate |
| R-12 | Nepal legal/privacy/emergency language is inaccurate | Medium | Critical | explicit ADR-008 and counsel review | legal sign-off |

Risk review cadence: reassess before each phase gate, after a provider/retention change, and following a security/safety incident.

## 2. Threat model

### Assets to protect

- precise location, route history, presence, group membership, and device/session identifiers;
- emergency contacts, medical-card fields, incident timelines, acknowledgements, and provider receipts;
- account identity/tokens, server secrets, encryption keys, signed asset URLs;
- map/route/pack provenance, integrity, licences, and safety/hazard records;
- service availability, especially safety channel processing and audit availability.

### Threats and controls

| Threat | Attack/failure path | Primary controls | Verification |
|---|---|---|---|
| Account/session takeover | stolen token, refresh token, device impersonation | short-lived tokens, device sessions, rotation/revocation, suspicious-login controls | revocation and authorization tests |
| IDOR/location scraping | guessed trip/ride/media/incident IDs | per-resource policy, opaque identifiers, audit, scoped signed URLs | negative authorization tests |
| Location overcollection | default feed/realtime payload contains precise data | private-by-default schema, visibility purpose, TTL/downsampling/retention | payload/privacy review |
| Tampered pack/map asset | corrupted CDN/object response or malicious file | signed manifest, checksum, licence/provenance, client verification | integrity/fuzz/interrupted-download tests |
| Route data poisoning | unreviewed community report or malformed external source | quarantine, validation, reviewer/provenance state, immutable source version | ingestion test corpus |
| Replay/duplicate command | reconnect or malicious repeated request | idempotency key, command version, outbox dedupe | duplicate/retry tests |
| SOS abuse or false delivery | spam, forged device claim, optimistic UI | separate quotas, immutable evidence, provider receipt model, exact labels | safety state-machine tests |
| Channel/provider leakage | provider secret or personal contact data in logs | secret manager, redaction, least privilege, provider adapter boundary | log scan/access review |
| Worker/queue exhaustion | media/pack burst starves critical work | separate priorities, quotas, back-pressure, DLQ/alerts | load/failure drill |
| Privileged insider access | operations user reads protected data without need | audited break-glass/purpose access, role policy, periodic review | audit review |

### Trust-boundary checklist

1. Validate/authorize every client command at the API boundary.
2. Treat client time, location, peer transport, roles, and delivery claims as input—not truth.
3. Verify service-to-service identity and least privilege in the private network.
4. Use signed scoped links for object assets; no public bucket/container listing.
5. Validate external geo sources and provider callbacks before publication/state mutation.
6. Preserve evidence and correlation IDs for every safety transition.

## 3. Environment model

| Environment | Purpose | Data | External integration | Controls |
|---|---|---|---|---|
| Local | developer unit/integration work | synthetic fixtures only | local mocks/sandboxes | no production secrets or rider data |
| Development | shared service/contract integration | synthetic/sanitized data | sandbox where available | feature flags, ephemeral test accounts |
| Staging | production-like end-to-end and failure drills | synthetic or explicitly approved test data | sandbox/test recipients only | controlled access, audit, migration/restore rehearsal |
| Production | real rider service | policy-governed live data | approved providers only | least privilege, on-call/runbooks, backups, monitoring |

### Environment invariants

- Schema migrations are forward-compatible where a rolling deployment requires it; every migration has rollback or mitigation documentation.
- Production identifiers, secrets, provider credentials, and incident contacts never enter source control or non-production environments.
- Safety feature flags default to disabled outside deliberately controlled validation. No staging/test event can contact unapproved real recipients.
- All environments emit correlation IDs and redacted logs; only production enables governed live audit retention.
- Geospatial source/build versions are reproducible from declared inputs; staging uses a representative Nepal fixture set.

## 4. S0 exit criteria

S0 is ready to move to S1 only when:

1. ADR-001 through ADR-009 are marked accepted, rejected, or explicitly deferred with a safe feature flag.
2. This risk register has owners and review dates for every High/Critical item.
3. The threat model has been reviewed by product, mobile/backend, and security/privacy stakeholders.
4. Local, development, staging, and production data/integration rules are documented and enforceable.
5. Provider, cost, legal, or emergency-policy decisions that need user authority remain unresolved rather than guessed.
6. The S1 API/event schema work can state its selected assumptions and validation plan.
