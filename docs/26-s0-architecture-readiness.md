# S0 — Architecture Readiness Record

> **Purpose:** Convert the approved architecture decisions into build-ready evidence and ownership before implementation contracts begin.  
> **Status:** In progress. ADR-001 through ADR-009 are accepted; operational, security, privacy, legal, and recovery evidence remains to be recorded.

## 1. Exit gate

S0 closes only when all rows below have an accountable owner, a review date, recorded evidence, and no unmitigated blocker that would make S1 contracts unsafe or misleading. A role is assigned here; a named person is intentionally left for the project owner to designate.

| Gate | Accountable role | Evidence required | Target phase | Status |
|---|---|---|---|---|
| ADR register is accepted and linked to implementation | Solution Architect | ADR-001…009 status, assumptions, rollback boundaries | S0 | Complete |
| High/Critical risks have owners and review dates | Engineering Lead | risk log with named owner and next-review date for R-01…R-12 | S0 | Open |
| Threat model review | Security/Privacy Lead | review record, findings, accepted mitigations | S0 | Open |
| Nepal policy, consent, and emergency-copy review | Product + Nepal Counsel | written review of ADR-008 / content scope | Before production; S1 assumptions documented now | Open — external authority required |
| Safety evidence language and channel boundary | Safety Owner | ADR-007 review; test-channel plan; no-dispatch claim check | S0 | Open |
| Environment controls | Platform/Operations Lead | local/dev/staging/prod access, data, and secret-control checklist | S0 | Open |
| Backup and recovery feasibility | Platform/Operations Lead | provider-neutral restore drill design and acceptance criteria | S0 | Open |
| Geospatial data/licence feasibility | Geospatial Owner | source inventory, licence/attribution review plan, Nepal field-validation plan | S0 | Open |
| S1 contract scope and test strategy | Tech Lead | schema ownership, compatibility, idempotency, contract-test plan | S0 → S1 | Open |

## 2. Risk ownership register

Set an individual and next-review date in the delivery tracker before S0 closure. The roles are the minimum accountability model.

| Risk | Owner role | Review cadence | Closure evidence |
|---|---|---|---|
| R-01 map data/licence | Geospatial Owner | before each data release | source/provenance and licence record |
| R-02 unsafe route recommendation | Routing Lead | each route-profile release | regression + Nepal field evidence |
| R-03 false SOS interpretation | Safety Owner | each SOS/copy/channel change | evidence-state UX and safety review |
| R-04 offline loss/duplication | Backend Lead | each sync/outbox change | idempotency/failure tests |
| R-05 location exposure | Security/Privacy Lead | each presence/group change | authorization and payload review |
| R-06 device-data compromise | Mobile Security Owner | each storage/auth change | encrypted-store/lost-device test |
| R-07 corrupt offline pack | Geospatial + Mobile Leads | each pack format/release | checksum/interruption test |
| R-08 provider outage | Platform/Operations Lead | each provider change | outage/failover exercise |
| R-09 media abuse | Community Product Owner | each media policy/release | moderation/authorization test |
| R-10 safety workload starvation | Platform + Safety Owners | each capacity change | priority backlog/load drill |
| R-11 restore failure | Platform/Operations Lead | scheduled; before production | signed restore exercise |
| R-12 inaccurate Nepal policy/copy | Product + Nepal Counsel | material policy/copy change | recorded legal/localization review |

## 3. S0 evidence checklist

### Architecture and contracts

- [x] HLD, LLD, full system architecture, risk/threat/environment baseline published.
- [x] ADR-001 through ADR-009 accepted with explicit boundaries.
- [ ] S1 schema owners and API compatibility policy named.
- [ ] Event naming, versioning, idempotency, correlation-ID, and error-envelope rules accepted.

### Security and privacy

- [ ] Threat-model review held; findings assigned/accepted.
- [ ] Data classification and protected-field inventory reviewed.
- [ ] Access model for location, medical/safety profile, media, and incidents reviewed.
- [ ] Production-secret and non-production-data controls validated.
- [ ] Nepal counsel and localized-copy review plan has an owner, budget/authority, and schedule.

### Operations and resilience

- [ ] Environment accounts/projects, access groups, and audit policy defined.
- [ ] Migration/rollback convention accepted.
- [ ] Backup retention, restoration objective, and restore-drill procedure proposed for approval.
- [ ] Monitoring/log-redaction baseline and incident/runbook ownership assigned.
- [ ] Safety test-recipient rules prevent any accidental live contact from non-production.

### Geography and safety

- [ ] Map/routing/pack source inventory and attribution plan reviewed.
- [ ] Nepal route-quality test corridors and field-validation method selected.
- [ ] Emergency-resource verification owner and review cadence assigned.
- [ ] SOS channel test plan distinguishes local, server, provider, and recipient evidence.

## 4. S1 entry assumptions

S1 may define contracts now using the following accepted architecture boundaries, while later external reviews remain explicit gates:

1. APIs are versioned and deny unsafe/unknown states by default.
2. The server, not a client claim, is authoritative for resource access and country capability eligibility.
3. Commands use idempotency keys; durable facts use transactional outbox events.
4. Location, medical/safety profile, incident, and provider evidence are protected data classes with minimal fields and auditability.
5. Offline queues and device caches are not delivery evidence.
6. Country configuration is versioned and Nepal is the only active launch profile.

S1 cannot set legal retention durations, select unapproved providers, claim public emergency dispatch, or enable unvalidated safety transport.

## 5. S0 completion record

When the open rows are complete, append:

```text
S0 completed on: YYYY-MM-DD
Approved by: Product / Architecture / Security-Privacy / Safety / Operations
Open production gates deferred to: [tracked IDs]
Evidence links: [links]
```

Until then, implementation may create interfaces, fixtures, schemas, and non-production tests—but must keep affected live capabilities behind disabled flags.
