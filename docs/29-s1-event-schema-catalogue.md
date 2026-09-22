# S1 — Event Schema Catalogue

> **Scope:** Versioned durable events carried through the transactional outbox. Realtime and push transports project these events; neither becomes the record of truth.

## Event naming and version rule

`{bounded-context}.{past-tense-action}.v{major}` — for example `trip.planned.v1`.

- `v1` payloads are additive only. Any removed/renamed/retyped field or changed meaning creates the next major version.
- Every producer commits the aggregate state, audit fact, and outbox row atomically.
- Every consumer deduplicates `eventId`, verifies event type/version, logs only safe metadata, and handles replay.

## Shared envelope

```json
{
  "eventId": "evt_opaque",
  "eventType": "trip.planned.v1",
  "occurredAt": "2026-08-19T16:30:00Z",
  "aggregate": { "type": "trip", "id": "trp_opaque", "version": 4 },
  "actor": { "type": "user", "id": "usr_opaque" },
  "countryProfile": { "code": "NP", "configVersion": "2026.08.1" },
  "correlationId": "req_opaque",
  "causationId": "cmd_opaque",
  "classification": "internal",
  "payload": {}
}
```

`classification` is `internal`, `protected`, or `safety`. It guides authorization, routing, logging redaction, retention, and worker isolation; it does not replace field-level security.

## Initial event contracts

| Event | Classification | Minimum payload | Consumers |
|---|---|---|---|
| `consent.granted.v1` / `consent.revoked.v1` | protected | receipt ID, purpose, policy version, state, time | policy projection, audit, sync |
| `device.session_revoked.v1` | protected | device session ID, reason class, time | auth/session cache, audit |
| `group.created.v1` | protected | group ID, name, creator ID, version | group projection, access policy |
| `group.invited.v1` | protected | invite ID, group ID, creator ID, expiresAt, state (no plaintext secret) | invite lifecycle, audit |
| `group.invite_revoked.v1` | protected | invite ID, group ID, actor ID, state | invite lifecycle, audit |
| `trip.created.v1` / `trip.planned.v1` / `trip.updated.v1` / `trip.started.v1` / `trip.completed.v1` | internal | trip ID, owner ID, state, version | trip projection, notification eligibility |
| `ride.started.v1` / `ride.completed.v1` | internal | ride/trip/group refs, time, state | presence eligibility, history projection |
| `membership.changed.v1` | protected | group, member, role, change type | access policy, realtime ACL, audit |
| `route.candidates_generated.v1` | internal | request/trip ref, candidate IDs, graph/coverage version | trip projection, observability |
| `graph.published.v1` | internal | graph version, coverage ref, source/attribution refs | route service, pack catalogue |
| `pack.verified.v1` | internal | pack ID, manifest/graph/config version, verification outcome | pack analytics, support audit |
| `presence.updated.v1` | protected | ride/member ref, TTL, observation time, coarse state | authorized realtime projection only |
| `group.presence.changed.v1` | protected | ride ID, member ID, projection state, observation time, client sequence, optional coordinates/telemetry | authorized realtime group subscribers (ephemeral delivery only) |
| `post.published.v1` | protected | postId, groupId, authorUserId, content, state, createdAt | group feed projection, audit |
| `post.reported.v1` | protected | reportId, postId, groupId, reason, createdAt | moderation queue, audit (reporter ID protected) |
| `post.moderated.v1` | protected | decisionId, postId, groupId, moderatorUserId, action, resultingState, reason, decidedAt | feed update, audit |
| `message.queued.v1` | protected | messageId, threadId, groupId, senderUserId, state, serverReceivedAt, clientCreatedAt | group chat projection, audit (body protected) |
| `incident.activated.v1` | safety | incident ID, server acceptance time, capability snapshot ref | safety ledger, dedicated channel workers, audit |
| `channel.attempt_recorded.v1` | safety | incident ID, attempt ID, channel, evidence state, failure class | incident projection, safety audit |
| `incident.acknowledged.v1` | safety | incident ID, acknowledgement ID, actor/evidence time | safety ledger and UI projection |
| `country_profile.activated.v1` | internal | country code, config version, effective time | config cache, capability revalidation |

## S9A Community Feed & Moderation Durable Events

Durable events emitted via the transactional outbox (`outbox_events` table) upon feed mutations:

1. **`post.published.v1`**:
   - Emitted when an active group member publishes a text-only post into a private group.
   - Payload: `{ postId, groupId, authorUserId, content, state: "published", createdAt }`.
   - Invariant: Strictly zero location or media references.

2. **`post.reported.v1`**:
   - Emitted when an active member submits a report on a post.
   - Payload: `{ reportId, postId, groupId, reason, createdAt }`.
   - Invariant: Does not alter post visibility; reporter identity is protected and never leaked in feed projections.

3. **`post.moderated.v1`**:
   - Emitted when a group owner restricts (`published` -> `restricted`) or restores (`restricted` -> `published`) a post.
   - Payload: `{ decisionId, postId, groupId, moderatorUserId, action, resultingState, reason, decidedAt }`.
   - Invariant: Appended to immutable decision audit table; immediate visibility adjustment in feed.

## S9B Private Group Chat Durable Events

Durable events emitted via the transactional outbox (`outbox_events` table) upon chat message acceptance:

1. **`message.queued.v1`**:
   - Emitted atomically when a text-only chat message is accepted by the server into a private group chat thread.
   - Aggregate Type: `chat_message`
   - Aggregate Version: `1`
   - Payload: `{ messageId, threadId, groupId, senderUserId, state: "accepted", serverReceivedAt, clientCreatedAt }`.
   - Invariants:
     - Message state is strictly `accepted` (server acceptance only; never claims delivered or read).
     - Message body is protected content and is omitted from public/broad outbox payload projection.
     - Strictly zero location coordinates, media references, links, or delivery receipts.

## Realtime Presence Event Constraint

`group.presence.changed.v1` is an **ephemeral fan-out event** delivered exclusively over authorized, user-scoped WebSocket channels (`/user/queue/ride:{rideId}:presence`). It mirrors the server-authoritative REST `Presence` projection.
- WebSocket delivery is best-effort and **never replaces GET `/v1/rides/{rideId}/presence` reconciliation**. Following connection drop, reconnect, or sequence gap, clients must reconcile state via REST GET.
- WebSocket delivery never writes location history, trail breadcrumbs, or durable tracking records.
- Stale, stopped, or consent/session-revoked projections must never carry coordinates, heading, or accuracy in event payloads.

## Safety event constraint

Safety payloads must not use `delivered` as a generic success state. They carry the explicit evidence vocabulary from ADR-007:

`local_recorded`, `server_accepted`, `provider_accepted`, `delivery_unknown`, `recipient_acknowledged`, or `failed`.

The event only proves the corresponding durable fact. It cannot prove a person has received assistance or that public emergency services were contacted unless the approved provider/evidence contract supports that exact statement.

## Consumer acceptance requirements

- Store `(consumerName, eventId)` before visible side effects or perform the effect transactionally with dedupe.
- Preserve `correlationId` and `causationId` across retries; never use personal data as an idempotency key.
- Reject unknown required schema fields/types to a controlled dead-letter workflow; tolerate documented additive optional fields.
- Do not send protected/safety payloads to generic analytics, feed, or unaudited third parties.
- Expose consumer lag, dead-letter count, retry count, and safety-worker separation in operational metrics.

## Fixture set

Each event requires positive, duplicate, out-of-order, unauthorized-projection, schema-version, and redaction fixtures. Fixtures contain only synthetic users, Nepal locations, and test contacts; they cannot trigger real external recipients.
