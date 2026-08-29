# S4 — Core Trip, Group, Ride, and Transactional-Outbox Foundation

> **Status:** Ready for implementation from backend `dev` after S2. S3 is recommended for the production authentication seam but is not an S4 dependency.
>
> **Target repository:** `RideJaunm-Backend`
>
> **Required base:** backend `dev` containing accepted S2. Do not merge S3 as part of this task.
>
> **Architecture authority:** [S1 API/event foundations](../../docs/27-s1-api-event-contract-foundations.md), [schema catalogue](../../docs/28-s1-domain-api-schema-catalogue.md), [event catalogue](../../docs/29-s1-event-schema-catalogue.md), [LLD](../../docs/13-system-lld.md), and [ADR-004](../../docs/20-adr-004-eventing-realtime-decision-packet.md).

## Objective

Establish the durable, server-owned foundation for private trips, groups, memberships, ride lifecycle, and transactional outbox facts. A successful command must atomically persist its aggregate change, safe audit fact, idempotency outcome, and one immutable outbox event. No publisher, queue broker, realtime gateway, routing engine, location ingestion, notification provider, or SOS transport is introduced in S4.

S4 creates durable facts and explicit state transitions only. It must never claim route availability, location sharing, live group presence, message delivery, or emergency delivery.

## Required implementation scope

### 1. Contract first

Before backend changes, update the Design SSOT OpenAPI and schema catalogue in a separate commit. Add only the S4 subset:

- `POST /v1/trips`, `GET /v1/trips/{tripId}`, `PUT /v1/trips/{tripId}`;
- `POST /v1/trips/{tripId}/start` and `POST /v1/trips/{tripId}/complete`;
- `POST /v1/groups`, `GET /v1/groups/{groupId}`;
- `POST /v1/groups/{groupId}/invites`, `POST /v1/group-invites/{inviteId}/accept`;
- `PATCH /v1/groups/{groupId}/members/{userId}`; and
- `GET /v1/rides/{rideId}`.

Every command uses a required `Idempotency-Key`; mutable resources use `If-Match`; all errors use the shared API envelope. Explicitly add the state/role/error/idempotency rules below. Do not expose the later route-selection endpoint until S6 can validate a real candidate against graph and coverage provenance.

### 2. Schema and domain ownership

Add a forward Flyway migration for these tables, using opaque UUID storage internally and public opaque-ID encoding at the API boundary:

- `trips`: owner, title, origin/destination only as safe planning coordinates, country/profile context, state, planned start, selected route reference nullable, timestamps, version;
- `groups`: private or invite-only visibility only, creator, name, timestamps, version;
- `group_memberships`: group/user, role (`owner`, `admin`, `member`), lifecycle (`active`, `removed`, `left`), timestamps, version; at most one active membership per group/user;
- `group_invites`: opaque non-guessable invite token hash only, creator, intended group, expiry, accepted/revoked state, timestamps; never store or log the plaintext token;
- `rides`: trip, optional group, state (`preparing`, `in_progress`, `paused`, `completed`, `cancelled`), `sharing_state` default `off`, start/end timestamps, version;
- `outbox_events`: immutable event ID, aggregate type/id/version, event type/schema version, classification, safe JSON payload, actor/country/correlation/causation metadata, creation/publication/lease/attempt fields; and
- consumer-deduplication support only if needed to prove the contract locally.

Do not add cross-context foreign-key cascades that turn identity deletion, geography, community, or safety changes into implicit trip decisions. Record external references as opaque IDs and enforce ownership/policy at the application boundary.

### 3. Authorization and state policy

- The owner has the initial `owner` membership when a group is created; only owner/admin can create/revoke invites or change membership roles.
- A member may leave themself but cannot remove/change another member unless owner/admin; the last owner cannot leave or be removed. Prevent ownership-free groups.
- Group reads return no unauthorized existence detail; non-members receive the S1 policy error.
- A trip owner may create/read/update/start/complete their own trip. Group-linked operations require active membership.
- Valid trip transitions are `draft → planned → active → completed` and `draft|planned|active → cancelled`; no resurrection. Starting creates exactly one `preparing`/`in_progress` ride fact according to the documented command semantics. Completion is a valid idempotent terminal transition.
- `sharing_state=off` must remain the default. S4 cannot write location, claim sharing is active, or create presence events.
- Until S3 is merged, use only the existing test-only synthetic identity configuration for integration tests. Runtime and Compose must remain fail closed; do not add an identity provider or production credential workaround.

### 4. Outbox contract

Persist one immutable outbox event in the same database transaction as every successful state-changing command. Use the S1 envelope and only these S4 event families:

- `trip.created.v1`, `trip.updated.v1`, `trip.started.v1`, `trip.completed.v1`;
- `group.created.v1`, `membership.changed.v1`; and
- `ride.started.v1`, `ride.completed.v1`.

Events contain opaque references and safe state/version metadata only—no invite token, bearer token, protected profile data, precise route geometry, contact, medical, or location-observation payload. There is no broker/publisher in S4. An unpublished outbox row means only `persisted locally in the server database`; never say sent, delivered, projected, or consumed.

### 5. Required verification

Add Testcontainers/PostGIS integration coverage proving:

1. migration/schema constraints and public opaque-ID handling;
2. owner/member/non-member/cross-group negative authorization paths;
3. valid and invalid trip/ride transitions, including terminal replay;
4. invite expiry, revoke/accept race, duplicate acceptance, member self-leave, and last-owner protection;
5. exact replay returns the original response without a second aggregate/audit/outbox row; payload mismatch is rejected;
6. forced domain/outbox persistence failure rolls back all related writes;
7. concurrency around invite acceptance and trip start cannot create duplicate active memberships/rides/events; and
8. outbox rows have the expected safe envelope, are immutable, and contain no protected values/secrets/precise locations.

Add `docs/evidence/s4/trip-group-outbox.md` with the schema inventory, endpoint/policy matrix, state tables, event examples using synthetic/redacted data, transaction/failure proof, migration notes, and exact command results.

Run and report `git diff --check dev...HEAD`, `./mvnw clean verify`, Compose health probes, and the existing S2 restore verification. Keep the PR unmerged into backend `dev` for QA.

## Explicitly deferred

- identity-provider selection, production token verification, protected-data encryption, and retention policy;
- route candidate generation/validation, graph or coverage data, map search, and route geometry (S5–S6);
- offline packs (S7), location/presence/realtime transport (S8), community/chat/media (S9), and all safety incidents or notification transports (S10–S11);
- message broker, queue, event publisher, worker, cache, cloud SDK, and external provider integration.

## Antigravity completion report

Open an unmerged PR against backend `dev` and report:

1. Design-contract commit, backend base/head commits, and migration inventory;
2. endpoint-to-role/state policy matrix and all deferred capability guards;
3. transactional write/outbox/idempotency/concurrency proof;
4. exact verification commands and results; and
5. explicit confirmation that no real routing, location, realtime, provider, notification, or SOS delivery capability was introduced.
