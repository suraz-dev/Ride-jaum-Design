# RideJaunm Architecture Decision Records

> **Purpose:** S0 decision log. A proposed record is not an approved implementation choice.  
> **Companion:** [Full System Architecture](14-full-system-architecture.md) and [S0 build task](../implementation/system-design-task-manifest.md).

## ADR template

| Field | Required content |
|---|---|
| ID / title | stable identifier and a one-line decision |
| Status | proposed, accepted, superseded, or rejected |
| Context | problem, constraints, and decision owner |
| Options | at least two viable choices and their trade-offs |
| Decision | chosen option and explicit scope |
| Consequences | benefits, risks, cost/licensing, migration/rollback |
| Validation | evidence required before production |

## Decision register

| ID | Decision | Status | Owner / gate |
|---|---|---|---|
| ADR-001 | Map tiles, route engine, graph build, and licence model | Accepted — pilot only | product + architecture approval |
| ADR-002 | Identity provider and device-session model | Accepted — provider-neutral | product + security approval |
| ADR-003 | Cloud, network, region, backup and recovery model | Accepted — single-region pilot | product + operations approval |
| ADR-004 | Event transport and realtime gateway | Accepted — provider-neutral | architecture approval |
| ADR-005 | Encrypted mobile local-store approach | Accepted — provider-neutral | mobile + security approval |
| ADR-006 | Media moderation, storage and retention | Accepted — provider-neutral | product + privacy approval |
| ADR-007 | SOS channels/providers and allowable delivery language | Accepted — safety boundary | product + legal/safety approval |
| ADR-008 | Nepal consent, emergency copy, and data policy review | Accepted — architecture boundary | legal/privacy approval |
| ADR-009 | Country configuration and expansion model | Accepted — architecture boundary | product + architecture approval |

## ADR-001 — Geospatial platform and licence model

**Status:** Accepted — pilot only (2026-08-19)  
**Context:** RideJaunm needs Nepal map display, search, routing, three route profiles, offline packs, terrain/hazard data, and correct attribution. Offline support, source licence, operational cost, pack size, routing quality, and provider availability must be evaluated together.

| Option | Advantages | Risks / constraints |
|---|---|---|
| Managed map/routing provider | quickest integration, hosted routing/tiles | price, offline/licence limits, vendor lock-in, Nepal coverage variance |
| Open data + self/managed graph stack | control of profile algorithms, provenance, offline graph packaging | higher geospatial operations and data-quality responsibility |
| Hybrid provider adapters | phased launch with future replacement seam | integration complexity; licence terms must remain compatible |

**Decision:** approve the provider-neutral, open-data-first pilot described in the [ADR-001 geospatial decision packet](17-adr-001-geospatial-decision-packet.md): MapLibre rendering/offline-pack validation, an OSM-derived versioned Nepal graph, and a Valhalla routing proof of concept. A managed platform remains a benchmark/fallback.  
**Boundary:** this does not approve paid-provider commitments, public production use, unreviewed geographic data, or safety delivery claims. Those remain gated by licence/budget authority and pilot evidence.  
**Validation:** field-route comparison in Nepal, licence review, offline-download test, graph provenance/freshness test, provider-outage behaviour.  
**Rollback:** keep `MapAdapter`, `RoutingProvider`, and `PackAssetProvider` interfaces; do not embed provider identifiers in domain records.

## ADR-002 — Identity and device-session boundary

**Status:** Accepted — provider-neutral (2026-08-19)  
**Context:** Authorization must protect trips, precise locations, protected safety data, and device capabilities while supporting iOS/Android sessions and offline queues.

| Option | Advantages | Risks / constraints |
|---|---|---|
| Managed OIDC provider | mature login, MFA, token lifecycle | account cost/dependency and data residency review |
| Self-hosted OIDC-compatible service | control and portability | security/operations burden |
| Platform-native sign-in plus identity broker | familiar mobile UX | still requires a server-side authorization model |

**Decision:** adopt the provider-neutral OIDC/OAuth native-mobile contract in the [ADR-002 identity and device sessions packet](18-adr-002-identity-device-decision-packet.md): system-browser Authorization Code + PKCE S256, short-lived audience-restricted access tokens, rotating device-session refresh tokens, and server-side resource authorization.  
**Boundary:** this does not select an identity provider, social-login channel, or a production identity-data retention policy. Device integrity remains an advisory risk signal and may not be a universal sign-in or SOS block.  
**Validation:** token rotation/revocation tests, cross-device authorization tests, suspicious-login/rate-limit tests, offline reauthentication behaviour.  
**Non-negotiable:** no client-supplied role or device capability becomes authorization truth.

## ADR-003 — Cloud, network, recovery, and data residency

**Status:** Accepted — single-region pilot (2026-08-19)  
**Context:** Location, emergency contact, medical-card, incident audit, media, and geographic data require private networking, encryption, recoverability, and a legal/data-residency review.

| Option | Advantages | Risks / constraints |
|---|---|---|
| Single approved cloud region | lowest operational complexity | region outage/data-residency trade-off |
| Primary plus recovery region | stronger outage recovery | cost and data replication complexity |
| Managed database/object/queue services | reduced platform operations | provider limits/lock-in |

**Decision:** adopt the provider-neutral, single-primary-region pilot in the [ADR-003 cloud, network, and recovery packet](19-adr-003-cloud-network-recovery-decision-packet.md): separated environments, public-edge/private-service/private-data zones, managed Postgres/PostGIS with PITR or equivalent, encrypted object/secrets storage, and mandatory restore drills.  
**Boundary:** this does not select a cloud vendor/region, approve production data residency, set RTO/RPO, or authorize cross-region spend.  
**Validation:** least-privilege access review, encrypted backup inspection, restore exercise, provider outage drill.  
**Non-negotiable:** databases are private; object assets use signed scoped URLs; privileged data access is audited.

## ADR-004 — Durable events and realtime transport

**Status:** Accepted — provider-neutral (2026-08-19)  
**Context:** Core writes need transactional facts, while group presence/chat delivery needs low latency and disconnection recovery. Safety work cannot be starved by social or media jobs.

| Option | Advantages | Risks / constraints |
|---|---|---|
| Relational outbox + managed queue + WebSocket gateway | durable write path with managed operations | provider coupling and event-consumer design discipline |
| Relational outbox + self-managed stream | explicit control and replay | higher operating burden |
| Polling-only client updates | lowest realtime complexity | poor group-ride experience and latency |

**Decision:** adopt the provider-neutral model in the [ADR-004 durable events and realtime packet](20-adr-004-eventing-realtime-decision-packet.md): transactional outbox, at-least-once durable transport with idempotent consumers, authorized TTL-backed realtime projection, and isolated safety priority queues/workers.  
**Boundary:** this does not select a broker, define retention windows, or approve a production notification provider.  
**Validation:** duplicate delivery, consumer failure/DLQ, reconnect/TTL stale state, priority backlog test.  
**Non-negotiable:** outbox write is transactional; websocket messages are never the sole durable business record.

## ADR-005 — Mobile encrypted local store

**Status:** Accepted — provider-neutral (2026-08-19)  
**Context:** The client needs offline packs, drafts, sync operations, recovered ride state, and carefully scoped safety information without treating device storage as inherently safe.

| Option | Advantages | Risks / constraints |
|---|---|---|
| Encrypted database using platform key store | strong structured query/offline support | native setup/migration complexity |
| File/kv store plus encrypted envelope | simpler for limited state | weaker query/model ergonomics for packs and queues |
| Provider SDK store | rapid implementation | portability/audit implications |

**Decision:** adopt the provider-neutral boundary in the [ADR-005 encrypted mobile local store packet](21-adr-005-mobile-encrypted-store-decision-packet.md): platform secure store for small secrets/wrapping keys, encrypted structured database for offline state, app-private checksum-verified assets, and verified logout/revocation/migration/backup behaviour.  
**Boundary:** this does not select a library, define data retention, or approve production biometric handling.  
**Validation:** offline/restart recovery, migration/rollback, lost-key handling, no secret/medical data in logs or unencrypted backups.  
**Non-negotiable:** client storage never creates a claim that SOS or a queued message was delivered.

## ADR-006 — Community media, moderation, and retention

**Status:** Accepted — provider-neutral (2026-08-19)  
**Context:** Private/community content has abuse, storage cost, privacy, and user-deletion implications. Media must not block safety or core ride workflows.

**Decision:** adopt the provider-neutral boundary in the [ADR-006 media, moderation, and retention packet](22-adr-006-media-moderation-retention-decision-packet.md): private object storage, signed intents, quarantine-before-publish, validation/processing/moderation states, reporting, and auditable deletion.  
**Boundary:** this does not select a provider, decide eligible media formats, establish retention durations, or settle Nepal legal/takedown obligations.  
**Validation:** unauthorized media access, moderation state transition, deletion/export flow, failed/queued upload behaviour.  
**Non-negotiable:** generic feeds do not expose fine location by default.

## ADR-007 — SOS channels and evidence language

**Status:** Accepted — safety boundary (2026-08-19).  
**Context:** The product may offer cellular, push/SMS/voice/provider delivery, optional device-to-device relay, or future satellite/mesh capabilities. Each has different evidence and legal implications.

**Decision:** adopt the safety boundary and evidence vocabulary in the [ADR-007 SOS channels and evidence packet](23-adr-007-safety-channel-evidence-decision-packet.md): local/server/provider/recipient states remain distinct; only approved channels are attempted; untested peer/satellite/public-dispatch claims remain out of scope.  
**Boundary:** this does not select a provider, enable public emergency dispatch, or authorize an emergency-service notification claim. Provider, legal, operational, and physical-device validation are still required before any channel is enabled.  
**Validation:** real-device proof for every claimed transport, provider acceptance/failure tests, duplicate suppression, acknowledgement/stand-down tests, independent safety/legal review.  
**Non-negotiable:** only use `provider accepted` or `person confirmed` when matching evidence exists. Device relay is `device-reported` until server-verifiable.

## ADR-008 — Nepal privacy, emergency, and consent policy

**Status:** Accepted — architecture boundary (2026-08-19).  
**Context:** Nepal-first language, time/calendar, location, emergency contacts, medical profiles, source licences, and safety copy need counsel/policy review before public release.

**Decision:** adopt the consent, copy, and privacy architecture in the [ADR-008 Nepal consent and emergency copy packet](24-adr-008-nepal-consent-emergency-copy-decision-packet.md): separate/revocable purpose consent, receipt versioning, protected safety data, country-configured emergency content, and EN/NE/HI material-copy review.  
**Boundary:** this is not legal approval and does not set final retention, approve public dispatch, or replace Nepal counsel review.  
**Validation:** counsel review recorded, localized consent/copy tested in EN/NE/HI, deletion/export exercise, accessibility review.

## ADR-009 — Country configuration and expansion

**Status:** Accepted — architecture boundary (2026-08-19).  
**Context:** Nepal is the launch country, but routing profiles, languages, units, policy, source licences, emergency contacts/providers, time/calendar, and supported regions must evolve without forked product logic.

**Decision:** adopt the country-profile architecture defined in the [ADR-009 country configuration and expansion packet](25-adr-009-country-configuration-expansion-decision-packet.md): versioned, reviewed data profiles; a single active Nepal launch profile; staged capability gates; server-authoritative eligibility; and an unsupported-country state that fails safely.  
**Boundary:** this does not approve any additional country, provider, legal retention policy, or public emergency-service integration. Every country requires its own coverage, localization, legal, safety, operational, and release evidence.  
**Validation:** Nepal configuration behaves without country-specific application branches; a synthetic second-country configuration passes schema/feature-flag tests.

## Approval protocol

For every accepted ADR, record the date, approver, selected option, cost/licence authority, rejected alternatives, rollout/rollback plan, and validation evidence. Any later change creates a new ADR that supersedes the original; it does not rewrite history.
