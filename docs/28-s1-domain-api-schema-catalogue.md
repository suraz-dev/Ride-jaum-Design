# S1 — Domain and API Schema Catalogue

> **Companion:** [S1 API/event contract foundations](27-s1-api-event-contract-foundations.md).  
> **Status:** Draft for implementation planning. Endpoint names describe contracts, not a requirement to expose every resource publicly.

## 1. Domain ownership

| Bounded context | Owns | May reference, but never own |
|---|---|---|
| Identity & policy | accounts, device sessions, consent receipts, safety profiles | trip/group IDs, incident IDs |
| Trip & group | trip, route selection, group, membership, ride lifecycle | route candidate provenance, scoped presence |
| Geospatial | search/place, route candidate, graph/coverage, hazard, pack catalogue | user private route or membership |
| Offline packs | pack manifest, download entitlement/receipt, integrity status | raw provider secrets or unrestricted map assets |
| Realtime & sync | presence projection, location observation, sync operation status | durable trip/incident truth |
| Community | post, comment/reaction, chat thread/message, media moderation | precise location by default |
| Safety | incident, immutable transition, channel attempt, acknowledgement | provider transport implementation/secret |
| Country configuration | active profile/capability/resource content | a client’s authorization decision |

All IDs are opaque strings. Aggregate IDs are canonical; cross-context fields use `...Id` references rather than embedded mutable records.

## 2. Common primitives

```ts
type UtcInstant = string; // RFC 3339 UTC, e.g. 2026-08-19T16:30:00Z
type ResourceVersion = string; // opaque ETag/version token
type GeoPoint = { latitude: number; longitude: number; accuracyMeters?: number };
type LocalizedText = { messageId: string; fallback: string };
type EvidenceState =
  | 'local_recorded'
  | 'server_accepted'
  | 'provider_accepted'
  | 'delivery_unknown'
  | 'recipient_acknowledged'
  | 'failed';
type CountryContext = { code: string; configVersion: string };
type AuditRef = { correlationId: string; occurredAt: UtcInstant };
```

`GeoPoint` is protected data whenever connected to a person, ride, incident, or private route. It must be omitted, generalized, or rejected according to resource policy rather than represented as an empty permission bypass.

## 3. Identity, device, consent, and safety profile

```ts
type DeviceSession = {
  id: string;
  deviceLabel?: string;
  platform: 'ios' | 'android';
  state: 'active' | 'revoked' | 'expired';
  createdAt: UtcInstant;
  lastSeenAt?: UtcInstant;
};

type ConsentReceipt = {
  id: string;
  purpose: 'location_sharing' | 'safety_profile' | 'analytics' | 'marketing';
  state: 'granted' | 'revoked' | 'expired';
  policyVersion: string;
  locale: string;
  grantedAt?: UtcInstant;
  revokedAt?: UtcInstant;
};

type SafetyProfile = {
  id: string;
  state: 'enabled' | 'disabled';
  emergencyContactCount: number; // lists only with explicit safety purpose
  medicalCardState: 'absent' | 'present';
  version: ResourceVersion;
};
```

| Method | Path | Purpose | Authorization / rules |
|---|---|---|---|
| `GET` | `/v1/me` | current account and safe profile summary | current user only |
| `GET` | `/v1/me/device-sessions` | enumerate own sessions | current user only; never return refresh tokens |
| `DELETE` | `/v1/me/device-sessions/{sessionId}` | revoke a device session | current user or privileged security action; idempotent |
| `GET` | `/v1/me/consents` | retrieve own receipts | current user only |
| `POST` | `/v1/me/consents` | grant/revoke a purpose | idempotency required; preserve receipt history |
| `GET` | `/v1/me/safety-profile` | safe profile view | safety purpose + current user |
| `PUT` | `/v1/me/safety-profile` | update protected profile | `If-Match`, safety consent, audit; encrypt protected fields |

## 4. Trips, groups, and rides

```ts
type Trip = {
  id: string;
  ownerId: string;
  state: 'draft' | 'planned' | 'active' | 'completed' | 'cancelled';
  title?: string;
  origin?: GeoPoint;
  destination?: GeoPoint;
  selectedRouteCandidateId?: string;
  groupId?: string;
  plannedStartAt?: UtcInstant;
  country: CountryContext;
  version: ResourceVersion;
};

type Group = {
  id: string;
  name: string;
  visibility: 'private' | 'invite_only';
  memberCount: number;
  role: 'owner' | 'admin' | 'member';
  version: ResourceVersion;
};

type Ride = {
  id: string;
  tripId: string;
  groupId?: string;
  state: 'preparing' | 'in_progress' | 'paused' | 'completed' | 'cancelled';
  sharingState: 'off' | 'active' | 'stopped';
  startedAt?: UtcInstant;
  endedAt?: UtcInstant;
  version: ResourceVersion;
};
```

| Method | Path | Purpose | Key rules |
|---|---|---|---|
| `POST` | `/v1/trips` | create draft | idempotency, country context resolved server-side |
| `GET/PUT` | `/v1/trips/{tripId}` | read/update owner-visible trip | resource policy; `If-Match` on update |
| `POST` | `/v1/trips/{tripId}/select-route` | select a valid route candidate | candidate must match current graph/coverage and capability |
| `POST` | `/v1/trips/{tripId}/start` | begin ride | explicit state transition; does not imply location sharing |
| `POST` | `/v1/trips/{tripId}/complete` | complete ride | idempotent valid transition |
| `POST` | `/v1/groups` | create private group | idempotency |
| `GET` | `/v1/groups/{groupId}` | group summary | membership required |
| `POST` | `/v1/groups/{groupId}/invites` | create invite | owner/admin only; expiring opaque invite |
| `POST` | `/v1/group-invites/{inviteId}/accept` | accept invite | current user; membership event/outbox |
| `PATCH` | `/v1/groups/{groupId}/members/{userId}` | change/remove membership | owner/admin policy; `If-Match` where mutable |
| `GET` | `/v1/rides/{rideId}` | active/previous ride summary | scoped member/owner policy |

type GeoSource = {
  id: string;
  sourceName: string;
  sourceVersion: string;
  licenceReference: string;
  reviewState: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUPERSEDED';
  receivedAt: UtcInstant;
  publishedAt?: UtcInstant;
};

type GeoDataset = {
  id: string;
  datasetType: string;
  sourceId: string;
  graphCoverageVersion: string;
  validFrom: UtcInstant;
  freshUntil: UtcInstant;
  checksum: string;
  reviewState: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUPERSEDED';
  publishState: 'UNPUBLISHED' | 'PUBLISHED' | 'ARCHIVED' | 'DEPRECATED';
};

type GraphVersion = {
  id: string;
  countryCode: string;
  configVersion: string;
  checksum: string;
  coverageReference: string;
  datasetIds: string[];
  reviewState: 'draft' | 'reviewed' | 'approved' | 'rejected';
  publishState: 'unpublished' | 'published' | 'superseded' | 'expired';
  validFrom: UtcInstant;
  freshUntil: UtcInstant;
  buildAt: UtcInstant;
  publishedAt?: UtcInstant;
  version: ResourceVersion;
};

type QuarantineRecord = {
  id: string;
  sourceId?: string;
  datasetId?: string;
  rejectionReason: string;
  rejectionCategory: string;
  rejectionMetadata: Record<string, any>;
  rejectedAt: UtcInstant;
};

type RouteCandidateProvenance = {
  graphVersionId: string;
  graphChecksum: string;
  configVersion: string;
  coverageReference: string;
  sourceVersion: string;
  datasetIds: string[];
  generatedAt: UtcInstant;
};

type RouteCandidate = {
  id: string;
  profile: 'straight' | 'curvy' | 'supercurvy';
  state: 'available' | 'restricted' | 'unavailable';
  distanceMeters?: number;
  durationSeconds?: number;
  elevationGainMeters?: number;
  curvatureScore?: number;
  restrictionReasonCodes: string[];
  capabilityDeclaration: 'synthetic_preview';
  preview?: { previewFixtureRef: string; mode: 'synthetic_preview' };
  provenance: RouteCandidateProvenance;
};

type RouteCandidatesCommand = {
  countryCode: string;
  configVersion: string;
  origin: GeoPoint;
  destination: GeoPoint;
  waypointIds?: string[];
  requestedProfiles: Array<'straight' | 'curvy' | 'supercurvy'>;
};

type RouteCandidatesMeta = {
  requestId: string;
  calculationMode: 'synthetic_preview';
  countryCode: string;
  configVersion: string;
  graphVersionId: string;
  graphChecksum: string;
  freshnessState: 'fresh' | 'stale' | 'expired';
  generatedAt: UtcInstant;
};

type PackState = 'available' | 'deprecated' | 'retired';

type ClientPackState =
  | 'queued'
  | 'downloading'
  | 'partial'
  | 'verified'
  | 'stale'
  | 'failed';

type ServerEntitlementState = 'recorded_unverified';

type PackLayerCode =
  | 'vector_tiles'
  | 'elevation_dem'
  | 'hillshade'
  | 'hazard_zones'
  | 'routing_graph'
  | 'poi_places';

type OfflinePackSummary = {
  id: string;
  regionCode: string;
  name: LocalizedText;
  countryCode: string;
  configVersion: string;
  graphVersionId: string;
  state: PackState;
  coverageReference: string;
  totalBytes: number;
  validFrom: UtcInstant;
  freshUntil: UtcInstant;
  capabilityDeclaration: 'synthetic_fixture';
};

type OfflinePackAsset = {
  assetId: string;
  layerCode: PackLayerCode;
  contentType: string;
  byteSize: number;
  checksum: string;
  validFrom: UtcInstant;
  freshUntil: UtcInstant;
  attributionReference: string;
};

type OfflinePackAttribution = {
  sourceName: string;
  licenceReference: string;
  noticeText: string;
};

type OfflinePackManifest = {
  id: string;
  packId: string;
  regionCode: string;
  name: LocalizedText;
  countryCode: string;
  configVersion: string;
  graphVersionId: string;
  state: PackState;
  coverageReference: string;
  totalBytes: number;
  validFrom: UtcInstant;
  freshUntil: UtcInstant;
  capabilityDeclaration: 'synthetic_fixture';
  assets: OfflinePackAsset[];
  attributions: OfflinePackAttribution[];
};

type CreateDownloadIntentCommand = {
  deviceSessionId: string;
  targetLayers?: PackLayerCode[];
};

type DownloadIntentItem = {
  layerCode: PackLayerCode;
  contentType: string;
  byteSize: number;
  checksum: string;
  fixtureRef: string;
};

type DownloadIntent = {
  intentId: string;
  packId: string;
  userId: string;
  deviceSessionId: string;
  state: 'issued' | 'expired' | 'completed';
  expiresAt: UtcInstant;
  createdAt: UtcInstant;
  items: DownloadIntentItem[];
};

type RecordPackReceiptCommand = {
  intentId?: string;
  deviceSessionId: string;
  clientReportedState: ClientPackState;
  downloadedBytes: number;
  verifiedAssetCount: number;
  failureReasonCode?: string;
  clientEvidenceMetadata?: Record<string, unknown>;
};

type OfflinePackReceipt = {
  receiptId: string;
  packId: string;
  userId: string;
  deviceSessionId: string;
  intentId?: string;
  clientReportedState: ClientPackState;
  serverEntitlementState: ServerEntitlementState;
  downloadedBytes: number;
  verifiedAssetCount: number;
  failureReasonCode?: string;
  recordedAt: UtcInstant;
};
```

| Method | Path | Purpose | Key rules |
|---|---|---|---|
| `POST` | `/v1/geo/sources` | register geo source | `geo_admin` only; `Idempotency-Key` required |
| `POST` | `/v1/geo/sources/{sourceId}/review` | review and approve geo source | `geo_admin` only; approve/reject source; `Idempotency-Key` |
| `POST` | `/v1/geo/datasets` | ingest synthetic dataset | `geo_admin` only; validation pipeline; quarantine on failure; `Idempotency-Key` |
| `POST` | `/v1/geo/datasets/{datasetId}/review` | review and approve dataset | `geo_admin` only; approve/reject dataset; `Idempotency-Key` |
| `POST` | `/v1/geo/graphs` | create immutable graph version | `geo_admin` only; pins approved datasets; `Idempotency-Key` |
| `POST` | `/v1/geo/graphs/{graphId}/publish` | publish graph version | `geo_admin` only; emits `graph.published.v1` outbox fact; immutable; `Idempotency-Key` |
| `GET` | `/v1/geo/graphs/{graphId}` | read graph version status | safe provenance projection |
| `GET` | `/v1/geo/graphs/active` | read active published graph | public/rider eligible graph metadata |
| `GET` | `/v1/geo/quarantine` | list quarantine records | `geo_admin` only; safe diagnostic reason codes |
| `GET` | `/v1/places:search` | place search | query/rate limits; scoped coverage; do not log raw queries unnecessarily |
| `POST` | `/v1/routes:candidates` | calculate the three route profiles | idempotency; validate territory/capability; preserve provenance |
| `GET` | `/v1/routes/{routeId}` | fetch candidate/detail | ownership/entitlement; expose restrictions/attribution |
| `GET` | `/v1/offline-packs` | list eligible offline packs | filter by countryCode ('NP') and required configVersion; bind to active published graph; fail closed (422) if graph stale/expired |
| `GET` | `/v1/offline-packs/{packId}/manifest` | integrity and provenance manifest | per-layer checksum, byte size, and freshness window; enforces shared eligibility: pack must be available, not retired, and fresh; bound graph must be approved, published, and fresh; fails closed with 422 PACK_STALE if any layer asset is stale |
| `POST` | `/v1/offline-packs/{packId}/download-intents` | acquire scoped asset download intent | short-lived expiry (15m); opaque `fixtureRef` URI; zero live URLs or signed URLs; enforces shared eligibility; fails closed with 422 if any target asset is stale; `Idempotency-Key` required |
| `POST` | `/v1/offline-packs/{packId}/receipts` | record verified client receipt | telemetry only; when intentId supplied, verifies intent belongs to pack, user, device session, is issued and unexpired (422 on mismatch); rejects byte/asset counts exceeding pack or intent scope (422); server entitlement strictly remains `recorded_unverified`; `Idempotency-Key` required |

## 6. Presence, location, and sync

```ts
type PresenceState = 'active' | 'stale' | 'stopped';

type PresenceCommand = {
  state: 'active' | 'stopped';
  deviceObservedAt: UtcInstant;
  clientSequence: number;
  ttlSeconds: number; // bounded (5-300s, default 60s); capped by server
  location?: GeoPoint;
  headingDegrees?: number;
  accuracyMeters?: number;
};

type Presence = {
  rideId: string;
  userId: string;
  displayName?: string;
  state: PresenceState;
  deviceObservedAt: UtcInstant;
  serverReceivedAt: UtcInstant;
  expiresAt: UtcInstant;
  clientSequence: number;
  location?: GeoPoint; // strictly omitted when state is stale or stopped
  headingDegrees?: number;
  accuracyMeters?: number;
};

type PresenceSubscriptionAuth = {
  subscriptionToken: string;
  expiresAt: UtcInstant;
  channel: string; // "ride:{rideId}:presence"
  destination: string; // "/user/queue/ride:{rideId}:presence"
  ttlSeconds: number; // short-lived (e.g. 300s)
};

type GroupPresenceChangedEvent = {
  eventId: string;
  eventType: 'group.presence.changed.v1';
  occurredAt: UtcInstant;
  rideId: string;
  presence: Presence;
};

type SyncOperation = {
  id: string;
  clientOperationId: string;
  state: 'queued' | 'accepted' | 'rejected' | 'conflicted';
  errorCode?: string;
  serverResourceRef?: { type: string; id: string };
};
```

| Method | Path | Purpose | Key rules |
|---|---|---|---|
| `POST` | `/v1/rides/{rideId}/presence` | begin/update/stop presence | active presence requires active ride, active group membership, active device session, and active location_sharing consent; stopped clears location immediately; rejects stale/out-of-order clientSequence (409 Conflict); bounded TTL; single current projection stored, zero breadcrumbs/history table |
| `GET` | `/v1/rides/{rideId}/presence` | current group projection | active group members only; expired presence returns as stale with location omitted; stopped presence returns with location omitted; current projection only, no historical presence endpoint |
| `POST` | `/v1/rides/{rideId}/presence/subscription-authorizations` | acquire short-lived subscription token | requires active ride, active group membership, active device session, and active location_sharing consent; returns short-lived token (300s) bound to caller and ride for STOMP WebSocket subscription |
| `POST` | `/v1/sync/operations` | submit supported queued commands | operation + command idempotency; return reconciliation state |
| `GET` | `/v1/sync` | cursor-based scoped changes | opaque cursor; tombstones/minimal instruction after revocation |

### Realtime Presence Delivery Specification (S8B)

1. **Protocol & Endpoint:**
   - Protocol: STOMP 1.2 over WebSocket at `/v1/ws`.
   - Security: Handshake via HTTP Upgrade. Tokens must **never be passed in URL query parameters** or logged.
   - Session Authentication: Provided in STOMP `CONNECT` frame headers (`Authorization: Bearer <sessionToken>`).
   - Browser Origin Restrictions: Handshake enforces configuration-backed allowed origins (`ridejaunm.websocket.allowed-origins`, e.g. local dev defaults `http://localhost:3000`, `http://localhost:8080`, `http://127.0.0.1:3000`, `http://127.0.0.1:8080`). Unlisted browser origins fail closed with HTTP 403 Forbidden. Native mobile clients sending no browser `Origin` header are preserved.
2. **Channel & Subscription Destination:**
   - Channel Name: `ride:{rideId}:presence`.
   - STOMP Destination: Private user-scoped queue `/user/queue/ride:{rideId}:presence`.
   - Globally broadcast ride topics (e.g. `/topic/ride:...`) are strictly prohibited to prevent unauthorized eavesdropping.
3. **Subscription Lifecycle & Authorization Flow:**
   - Step 1: Rider requests short-lived authorization token via `POST /v1/rides/{rideId}/presence/subscription-authorizations`.
   - Step 2: In STOMP `SUBSCRIBE` frame to `/user/queue/ride:{rideId}:presence`, subscriber provides `subscription-token: <subscriptionToken>` in headers.
   - Step 3: Gateway atomically validates and consumes the single-use token. Re-using a consumed token or mismatched `userId`, `deviceSessionId`, or `rideId` is rejected with `AccessDeniedException`.
   - Step 4: Gateway maintains an active authorization context keyed by STOMP connection session ID and subscription ID (`SubscriptionKey`).
   - Step 5: Before each outgoing presence `MESSAGE`, the gateway strictly re-evaluates:
     - Ticket validity window (unexpired `expiresAt`),
     - Active device session in DB (`state == 'active'`),
     - Active group membership in DB (`state == 'active'`),
     - Active `location_sharing` consent in DB (`state == 'granted'`),
     - Matching authorized ride ID and destination.
     If any check fails, payload delivery is suppressed (`return null`), authorization state is purged, and the subscription/session is revoked with a STOMP ERROR frame.
4. **Heartbeat, Reconnect, Expiry, and Revocation Rules:**
   - Heartbeats: Bidirectional 10,000ms heartbeat interval configured in STOMP broker.
   - Expiry: Subscription authorization expires after `ttlSeconds` (default 300s). Following expiry, outgoing delivery terminates immediately and subscriber must re-authorize.
   - Fail-Closed Revocation: On session revocation, membership departure, or consent withdrawal, delivery terminates immediately and peer views project the user as `stopped` with coordinates stripped.
   - Reconnect Backoff: Clients implement jittered exponential backoff (1s, 2s, 4s... max 30s). Reconnect requires acquiring a fresh single-use subscription token and calling REST `GET /v1/rides/{rideId}/presence` for full baseline reconciliation.
   - Quotas per Device Session: Maximum 3 active presence subscriptions per authenticated `deviceSessionId` collectively enforced across all concurrent connections. Quota counters are cleaned on unsubscribe, disconnect, token expiry, and revocation. Maximum inbound frame payload size 64 KB.
   - Slow-Client Isolation: If client outbound buffer exceeds 256 KB or consumer drops behind, gateway closes session with STOMP error frame to protect server thread pool.
5. **Truth and Non-Authoritative Invariant:**
   - WebSocket delivery is purely an ephemeral fan-out assist and **never replaces GET presence reconciliation**.
   - Delivery does not write location history, trail breadcrumbs, or durable tracking records.
   - No multi-node broker, external message queue, or SMS/mesh fallback is assumed or required for S8B.

## 7. Community feed and moderation foundation (S9A)

```ts
type PostState = 'published' | 'restricted';

type Post = {
  id: string;
  groupId: string;
  authorUserId: string;
  authorDisplayName: string;
  content: string; // text-only, 1-2000 chars
  state: PostState;
  version: number;
  createdAt: UtcInstant;
  updatedAt: UtcInstant;
};

type PostReportState = 'pending' | 'reviewed' | 'dismissed';

type PostReport = {
  id: string;
  postId: string;
  reason: string;
  details?: string;
  state: PostReportState;
  createdAt: UtcInstant;
  // reporterUserId is strictly hidden and never projected in responses or feed
};

type ModerationAction = 'restrict' | 'restore';

type PostModerationDecision = {
  id: string;
  postId: string;
  moderatorUserId: string;
  action: ModerationAction;
  resultingState: PostState;
  reason: string;
  decidedAt: UtcInstant;
};
```

| Method | Path | Purpose | Key rules |
|---|---|---|---|
| `GET` | `/v1/feed?groupId={groupId}&cursor={cursor}&limit={limit}` | retrieve paginated group feed | Active group membership required; reverse-chronological opaque cursor pagination; restricted posts strictly excluded. |
| `POST` | `/v1/feed` | publish text-only post | Active group membership required; Idempotency-Key required; strictly text-only (zero location, coordinates, or media attachments); emits `post.published.v1`. |
| `POST` | `/v1/posts/{postId}/reports` | report a post | Active group membership required; Idempotency-Key required; reports do not alter post visibility; reporter identity is protected and never returned; emits `post.reported.v1`. |
| `POST` | `/v1/posts/{postId}/moderation-decisions` | record owner moderation decision | Group owner only (403 for others); Idempotency-Key required; transitions `published` <-> `restricted`; appends immutable decision; emits `post.moderated.v1`. |

### S9A Feed & Moderation Invariants

1. **Active Private-Group Scoping:** Feed reads, post publication, and reporting are restricted to callers with active membership in the post's group (`groupId`). Non-members or removed members receive HTTP 403 Forbidden.
2. **Text-Only Content:** Post content is bounded text (1–2000 UTF-8 characters). Schema, DTOs, responses, and audit tables have zero location coordinates, GPS fields, media IDs, upload intents, comments, or reactions.
3. **Opaque Keyset Cursor Pagination:** `GET /v1/feed` orders by `(created_at DESC, id DESC)`. The `cursor` query param is an opaque base64 token encoding the boundary `(createdAt, id)`. Returns `nextCursor` if additional records exist.
4. **Reporter Privacy:** When a member reports a post, the `reporterUserId` is stored internally for safety audit and abuse tracking, but **must NEVER appear in feed, post projections, or the report response payload**.
5. **No Auto-Moderation on Report:** Reporting a post creates a `pending` report record but does not automatically restrict or hide the post.
6. **Group-Owner Moderation:** Only the verified group owner (`group.ownerId == caller.userId`) can restrict or restore posts. Other members (including admins/officers) receive HTTP 403 Forbidden.
7. **State Machine & Append-Only Audit:**
   - `published` -> `restricted` (action: `restrict`)
   - `restricted` -> `published` (action: `restore`)
   - Every moderation decision is appended to immutable `post_moderation_decisions` (no updates or deletes allowed).
8. **Transactional Outbox:** Post creation, reporting, and moderation atomically commit their respective outbox events (`post.published.v1`, `post.reported.v1`, `post.moderated.v1`) within the primary transaction.

### S9B Private Group Chat & Queued Message Foundation

```ts
type ChatThreadState = 'active';

type ChatThread = {
  id: string;
  groupId: string;
  state: ChatThreadState;
  createdAt: UtcInstant;
  updatedAt: UtcInstant;
};

type ChatMessageState = 'accepted'; // Server acceptance only; never implies delivered or recipient-acknowledged

type ChatMessage = {
  id: string;
  threadId: string;
  senderUserId: string;
  senderDisplayName: string;
  body: string; // text-only, 1-2000 chars, protected content
  state: ChatMessageState;
  clientCreatedAt?: UtcInstant;
  serverReceivedAt: UtcInstant;
};
```

| Method | Path | Purpose | Key rules |
|---|---|---|---|
| `GET` | `/v1/groups/{groupId}/chat-thread` | get group chat thread | Active group membership required; returns single active chat thread for group. |
| `POST` | `/v1/groups/{groupId}/chat-thread` | initialize or get group chat thread | Active group membership required; Idempotency-Key required; DB uniqueness constraint guarantees exactly one active thread per group; safe concurrent creation. |
| `GET` | `/v1/chat-threads/{threadId}/messages?cursor={cursor}&limit={limit}` | list thread messages | Active group membership required; reverse-chronological keyset cursor pagination over (serverReceivedAt DESC, id DESC). |
| `POST` | `/v1/chat-threads/{threadId}/messages` | send chat message | Active group membership required; Idempotency-Key required; strictly text-only (1–2000 chars); state: accepted; emits message.queued.v1 outbox fact; message body is protected content (never logged in audit). |

#### S9B Chat Invariants & Explicitly Deferred Scope

1. **One Thread Per Group:** Exactly one active chat thread per group is enforced by a database uniqueness constraint (`uq_chat_threads_group`) and safe concurrent creation behavior.
2. **Active Group Membership Scoping:** All thread and message endpoints require verified active group membership of the caller. Non-members or removed members receive HTTP 403 Forbidden.
3. **Mandatory Idempotency:** Both `POST /v1/groups/{groupId}/chat-thread` and `POST /v1/chat-threads/{threadId}/messages` require the `Idempotency-Key` header. Missing key returns HTTP 400.
4. **Honest Acceptance State:** Messages are recorded with state `accepted` (server acceptance only). Delivered, read, or recipient-acknowledged statuses are strictly forbidden.
5. **Protected Content Policy:** Message bodies are classified as protected user communications. They must NEVER be logged in application logs, database audit logs (`identity_audit_events`), or error responses, and are accessible only to active group members.
6. **Durable Outbox Event:** Server acceptance commits the message and emits `message.queued.v1` atomically into the transactional outbox.
7. **Explicitly Deferred Scope:** The following are explicitly out of scope for S9B:
   - Media attachments, image/audio/video uploads, object storage, and upload intents.
   - URLs and link preview generation.
   - Direct messages (1:1 DMs between users).
   - Reactions, replies, threads, and comments.
   - Realtime WebSocket streaming, BLE mesh chat relay, and push notifications.
   - Typing indicators, online presence indicators, read receipts, and delivery receipts.

## 8. Safety incidents and channel attempts

### S10A Safety Incident Ledger Foundation

```ts
type SafetyIncidentActivationMethod = 'hold_to_activate' | 'accessibility_equivalent';

type SafetyIncidentState = 'active'; // Initial state for S10A; stand-down/resolved lifecycle deferred

type SafetyIncidentEvidenceTier = 'server_accepted'; // S10A initial tier; provider/recipient evidence deferred

type ActivateSafetyIncidentCommand = {
  activationMethod: SafetyIncidentActivationMethod;
  rideId?: string;
  locationObservation?: GeoPoint;
};

type SafetyIncident = {
  id: string;
  userId: string;
  rideId?: string;
  state: SafetyIncidentState;
  activationMethod: SafetyIncidentActivationMethod;
  latestEvidence: SafetyIncidentEvidenceTier;
  country: CountryContext;
  activatedAt: UtcInstant;
  createdAt: UtcInstant;
  updatedAt: UtcInstant;
  version: number;
};
```

| Method | Path | Purpose | Key rules |
|---|---|---|---|
| `POST` | `/v1/safety-incidents` | record deliberate SOS activation | Idempotency-Key required; deliberate activationMethod (hold_to_activate / accessibility_equivalent); initial state: active; latestEvidence: server_accepted; locationObservation requires active safety_profile consent (403 CONSENT_REQUIRED if absent/revoked; activation without coordinates succeeds without consent); rideId requires existing ride (404), active group membership (403), and eligible state (422); complete (lat, lng) pair required with lat [-90, 90], lng [-180, 180], accuracy >= 0; creates projection + append-only status ledger; emits incident.activated.v1 outbox fact with classification safety; records safe audit metadata |
| `GET` | `/v1/safety-incidents/{incidentId}` | retrieve safety incident projection | Creator-only read access for S10A (returns 403 for non-creators, 404 for missing); minimal protected fields; records safe audit metadata; zero leaked coordinates or emergency contacts |

### S10A Safety Invariants & Privacy Guardrails
1. **Deliberate Activation Methods:** Only `hold_to_activate` and `accessibility_equivalent` are permitted. Any other value is rejected with HTTP `400 INVALID_COMMAND`.
2. **Initial State & Truthful Evidence:** Initial state is strictly `active`. Initial evidence tier is strictly `server_accepted`. The system NEVER claims sent, delivered, acknowledged, or emergency-services contact.
3. **Consent-Gated Coordinate Retention:**
   - Incident activation without coordinates (`locationObservation: null` or omitted) is fully supported and does NOT require consent.
   - When `locationObservation` is provided, caller MUST have active `safety_profile` consent (`consent_receipts` purpose `safety_profile`, state `granted`).
   - If consent is absent or revoked, the coordinate-bearing request is rejected with HTTP `403 FORBIDDEN` (`code: CONSENT_REQUIRED`).
   - Zero coordinates are stored or leaked in `identity_audit_events` or outbox payloads.
4. **Authorized Ride Linkage:**
   - When `rideId` is supplied:
     - The ride must exist; missing ride returns HTTP `404 NOT_FOUND`.
     - The caller must be an active member of the ride's group; non-members or riders from other groups return HTTP `403 FORBIDDEN`.
     - The ride must be in an eligible ongoing state (`preparing`, `in_progress`, `paused`); completed or cancelled rides are rejected with HTTP `422 UNPROCESSABLE_ENTITY`.
     - Failure at any linkage validation gate rejects the request without creating an incident or emitting events.
5. **Location Input Validation:**
   - Latitude and longitude must be supplied as a complete pair. Providing one without the other returns HTTP `400 INVALID_COMMAND`.
   - Latitude must be in range `[-90.0, 90.0]`.
   - Longitude must be in range `[-180.0, 180.0]`.
   - `accuracyMeters`, if supplied, must be non-negative (`>= 0.0`).
6. **Creator-Only Read Authorization:** For S10A, incident projections can only be read by the user who activated the incident. Non-creators receive HTTP `403 FORBIDDEN`. Missing incidents return HTTP `404 NOT_FOUND`.
7. **Append-Only Status-Event Ledger:** Every incident activation writes to both `safety_incidents` (projection) and `safety_incident_events` (status ledger). The ledger is protected by database trigger `trg_safety_incident_events_immutability` executing function `prevent_safety_incident_events_mutation()`, preventing all `UPDATE` and `DELETE` operations.
8. **Durable Outbox Event:** Emits `incident.activated.v1` atomically into the transactional outbox with `classification = 'safety'`.
9. **Strict Privacy & Redaction Boundaries:**
   - Raw location coordinates, medical profiles, emergency contacts, secrets, and sensitive notes are strictly prohibited from `identity_audit_events` and outbox event payloads.
   - Audit logs record safe metadata only (`INCIDENT_ACTIVATED`, `INCIDENT_READ`, target incident ID, actor user ID, device session ID).
10. **Idempotency:** `Idempotency-Key` header is mandatory on `POST /v1/safety-incidents`. Retries with the same key and payload replay the cached `201 Created` response without duplicating database rows or outbox events. Mismatched payloads return `409 IDEMPOTENCY_MISMATCH`.
11. **Explicitly Deferred Scope:** The following are strictly out of scope for S10A:
   - Push notifications, SMS/voice alerts, cellular breadcrumbs, and emergency contact broadcasts.
   - BLE mesh relay broadcast, LoRa, or satellite communications.
   - Public emergency dispatch integrations (Nepal 112/100/102).
   - Third-party provider integrations, webhooks, and external status polling.
   - Stand-down request/confirm lifecycle (`POST /v1/safety-incidents/{incidentId}/stand-down`).
   - Channel attempt timeline (`GET /v1/safety-incidents/{incidentId}/attempts`).
   - Recipient acknowledgements (`POST /v1/safety-incidents/{incidentId}/acknowledgements`).
   - Realtime STOMP/WebSocket incident delivery.

## 9. Country configuration and capability content

| Method | Path | Purpose | Key rules |
|---|---|---|---|
| `GET` | `/v1/configuration/effective` | resolved safe country profile/capabilities | server-authoritative eligible profile; signed/versioned response |
| `GET` | `/v1/configuration/emergency-resources` | reviewed manual-use resources | profile scoped; source/last-verified metadata; no dispatch claim |
| `GET` | `/v1/configuration/locales` | enabled message-catalog metadata | locale preference only; not country authorization |

Administrative publishing of country profiles is an internal, audited operation and is deliberately absent from public/mobile API scope.

## 10. Contract test matrix and sequencing

| Test class | Must cover |
|---|---|
| Contract shape | schemas, optional fields, stable enums, examples, OpenAPI/JSON-schema validation |
| Authorization | owner/member/non-member/expired-session/cross-country negative paths |
| State machine | trip, ride, pack, moderation, consent, and SOS valid/invalid transitions |
| Idempotency | retry, duplicate, payload mismatch, crash between write/outbox publish |
| Privacy | field omission/redaction, export/delete policy boundary, no unauthorized existence leak |
| Resilience | offline queue, cursor rewind, stale presence, provider unavailable, partial pack |
| Safety | local/server/provider/recipient evidence distinction, immutable audit, no false copy |

Implementation sequence: publish common primitives and error registry first; model identity/consent and trips/groups next; then geospatial/packs, realtime, community, and safety contracts. Each resource family produces fixtures before service code.
