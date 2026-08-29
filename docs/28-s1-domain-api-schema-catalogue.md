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

type OfflinePackManifest = {
  id: string;
  state: 'available' | 'deprecated' | 'retired';
  regionRef: string;
  graphVersion: string;
  coverageVersion: string;
  country: CountryContext;
  assets: Array<{ assetId: string; bytes: number; sha256: string; type: string }>;
  attribution: Array<{ source: string; licenceUrl: string }>;
  expiresAt?: UtcInstant;
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
| `GET` | `/v1/offline-packs` | list eligible packs | country/coverage/capability policy |
| `GET` | `/v1/offline-packs/{packId}/manifest` | integrity and provenance manifest | signed/cached versioned document |
| `POST` | `/v1/offline-packs/{packId}/download-intents` | acquire scoped asset download URLs | short-lived intents; no public bucket URL |
| `POST` | `/v1/offline-packs/{packId}/receipts` | record verified client receipt | client claim is audit/telemetry; server still verifies catalog entitlement |

## 6. Presence, location, and sync

```ts
type Presence = {
  rideId: string;
  userId: string;
  state: 'active' | 'stale' | 'stopped';
  observedAt: UtcInstant;
  expiresAt: UtcInstant;
  location?: GeoPoint; // only when viewer policy permits
  headingDegrees?: number;
  evidence: 'device_reported' | 'server_relayed';
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
| `POST` | `/v1/rides/{rideId}/presence` | begin/update/stop presence | membership + explicit sharing scope/consent; TTL required |
| `GET` | `/v1/rides/{rideId}/presence` | current group projection | membership only; stale marker; no historical scrape |
| `POST` | `/v1/sync/operations` | submit supported queued commands | operation + command idempotency; return reconciliation state |
| `GET` | `/v1/sync` | cursor-based scoped changes | opaque cursor; tombstones/minimal instruction after revocation |

Transport-level WebSocket subscriptions mirror authorized projections and use short-lived subscription authorization. They never bypass the REST policy check or replace durable reconciliation.

## 7. Community, chat, and media

```ts
type MediaAsset = {
  id: string;
  state: 'uploading' | 'quarantined' | 'processing' | 'published' | 'rejected' | 'deleted';
  mediaType: 'image' | 'video';
  visibility: 'private' | 'group' | 'community';
  createdAt: UtcInstant;
};

type ChatMessage = {
  id: string;
  threadId: string;
  senderId: string;
  body?: string;
  mediaIds: string[];
  state: 'sent' | 'moderated' | 'deleted';
  createdAt: UtcInstant;
};
```

| Method | Path | Purpose | Key rules |
|---|---|---|---|
| `GET/POST` | `/v1/feed` | retrieve/create community post | default no precise location; visibility/moderation policy |
| `POST` | `/v1/media/upload-intents` | create upload intent | file/size/type validation; quarantine destination |
| `POST` | `/v1/media/{mediaId}/complete` | submit uploaded asset for processing | idempotency; server checks intended object/integrity |
| `POST` | `/v1/media/{mediaId}/reports` | report content | protected reporter identity; moderation audit |
| `GET/POST` | `/v1/chat-threads/{threadId}/messages` | list/send message | membership policy; idempotent sends |
| `POST` | `/v1/posts/{postId}/reports` | report post | no exposed reporter identity |

## 8. Safety incidents and channel attempts

```ts
type SafetyIncident = {
  id: string;
  state: 'activating' | 'active' | 'stand_down_requested' | 'resolved' | 'cancelled';
  activatedAt: UtcInstant;
  country: CountryContext;
  latestEvidence: EvidenceState;
  capabilitySnapshot: Array<{ channel: string; state: 'available' | 'unavailable' | 'unknown' }>;
  version: ResourceVersion;
};

type ChannelAttempt = {
  id: string;
  incidentId: string;
  channel: string;
  evidence: EvidenceState;
  attemptedAt: UtcInstant;
  providerReference?: string; // protected/audited; no secret
  failureCode?: string;
};
```

| Method | Path | Purpose | Key rules |
|---|---|---|---|
| `POST` | `/v1/safety-incidents` | record deliberate SOS activation | idempotency; immutable initial fact; explicit evidence state |
| `GET` | `/v1/safety-incidents/{incidentId}` | incident status | incident participant/safety policy; minimal protected fields |
| `POST` | `/v1/safety-incidents/{incidentId}/stand-down` | request/confirm stand-down | state-machine, audit, accessibility equivalent path |
| `GET` | `/v1/safety-incidents/{incidentId}/attempts` | evidence timeline | authorized participants only; no fabricated receipt |
| `POST` | `/v1/safety-incidents/{incidentId}/acknowledgements` | record recipient/user acknowledgement | identity/time evidence, not inferred delivery |

No API names a public emergency-service integration until one is approved, tested, legally reviewed, and represented as an explicit provider/channel capability under ADR-007.

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
