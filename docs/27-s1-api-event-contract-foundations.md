# S1 — API and Event Contract Foundations

> **Purpose:** Define the cross-service contracts that make RideJaunm safe to build incrementally: API behavior, domain identifiers, errors, idempotency, auditability, event delivery, and compatibility.  
> **Status:** Draft for architecture review. It creates no production endpoint, provider commitment, or public emergency-service claim.

## 1. Contract rules

1. Public/mobile endpoints are versioned under `/v1`; incompatible behavior requires `/v2` or a negotiated representation—not a silent breaking change.
2. HTTPS, authenticated identity, server-side resource authorization, country-profile eligibility, and request validation apply before a command is accepted.
3. All state-changing commands require an `Idempotency-Key`; clients reuse it only for a retry of the same logical command.
4. Servers generate canonical IDs, timestamps, authorization decisions, delivery/evidence states, and audit records. Client-provided time/location/capability statements are observations, not authority.
5. APIs use JSON with explicit UTC RFC 3339 instants, opaque string identifiers, documented nullability, and stable enum values. Canonical instants are never replaced by local/Bikram Sambat display values.
6. Fine location, safety/medical profile, emergency contacts, incident evidence, device session, and signed URLs are protected data. They are never returned by broad feed/list endpoints without explicit scope.

## 2. Shared request and response shape

```ts
type ApiSuccess<T> = {
  data: T;
  meta: {
    requestId: string;
    apiVersion: 'v1';
    serverTime: string; // RFC 3339 UTC
    countryProfile?: { code: string; version: string };
  };
};

type ApiError = {
  error: {
    code: string; // stable machine identifier, e.g. RESOURCE_FORBIDDEN
    message: string; // safe, localized/presentable summary
    requestId: string;
    retryable: boolean;
    details?: Array<{ field?: string; code: string; message: string }>;
  };
};
```

Required headers:

| Header | Required | Rule |
|---|---:|---|
| `Authorization` | protected endpoints | OIDC bearer access token; audience/scope validated server-side |
| `Idempotency-Key` | every command | UUID/opaque high-entropy value; same actor + endpoint + semantic payload must match on replay |
| `X-Request-Id` | optional client input | validated; server returns its canonical correlation ID |
| `Accept-Language` | optional | BCP 47 preference; not an authorization, country, or legal-scope claim |
| `If-Match` | conditional writes | resource version/ETag; conflict rather than last-write-wins for user-visible mutable records |

## 3. Error catalogue

| HTTP | Code | Client behavior |
|---:|---|---|
| 400 | `VALIDATION_FAILED` | show field-level correction; do not retry unchanged |
| 401 | `AUTHENTICATION_REQUIRED` / `TOKEN_EXPIRED` | refresh/re-authenticate; do not present as resource failure |
| 403 | `RESOURCE_FORBIDDEN` / `COUNTRY_CAPABILITY_DISABLED` / `CONSENT_REQUIRED` | stop; show scoped next action if safe |
| 404 | `RESOURCE_NOT_FOUND` | do not reveal protected resource existence across authorization boundary |
| 409 | `VERSION_CONFLICT` / `IDEMPOTENCY_MISMATCH` | fetch/reconcile; never resend altered payload under same key |
| 410 | `RESOURCE_RETIRED` / `PACK_VERSION_EXPIRED` | remove/re-download only after user-visible explanation |
| 422 | `STATE_TRANSITION_INVALID` / `ROUTE_UNAVAILABLE` | show domain-specific safe state; do not fabricate fallback |
| 429 | `RATE_LIMITED` | respect retry interval; protect SOS with a distinct, reviewed policy |
| 503 | `DEPENDENCY_UNAVAILABLE` | queue only supported offline commands; surface delivery uncertainty accurately |

No error payload contains tokens, emergency contacts, medical values, precise coordinates, internal provider details, or stack traces.

## 4. Core domain identifiers and states

| Domain | Opaque ID | Version / state boundary |
|---|---|---|
| Account / device session | `usr_`, `dvs_` | token/session lifecycle; device claims are advisory |
| Consent / safety profile | `cns_`, `sfp_` | purpose, policy version, grant/revoke history |
| Trip / route candidate | `trp_`, `rtc_` | draft → planned → active → completed/cancelled; candidate has graph/coverage provenance |
| Group / membership / ride | `grp_`, `gmb_`, `rid_` | membership roles; ride sharing scope and TTL |
| Offline pack | `pak_` | manifest, graph/coverage/config/licence version; incomplete/verified/expired |
| Presence/location observation | `prs_`, `loc_` | scoped, freshness/accuracy/evidence; not permanent feed data |
| Post/chat/media | `pst_`, `cht_`, `med_` | visibility and moderation lifecycle; media quarantined before publish |
| Safety incident/channel attempt | `sos_`, `sat_` | immutable incident facts; local/server/provider/recipient evidence is separate |
| Country profile | `cty_` | country code + immutable configuration version + rollout state |

Prefixes are examples, not security controls. Authorization is always evaluated on the resource and relationship.

## 5. Command, concurrency, and idempotency model

```text
client command
  → authenticate + authorize + validate country/consent/state/version
  → reserve idempotency record (actor, endpoint, key, payload hash)
  → atomic domain write + audit fact + outbox record
  → cache/return original result for an identical replay
  → asynchronously publish event to authorized projections/workers
```

- A replay with the same key and same semantic payload returns the original outcome and correlation ID.
- A replay with the same key but another payload returns `409 IDEMPOTENCY_MISMATCH`.
- Commands that cannot be accepted offline fail explicitly; supported offline commands retain a local operation ID and become server facts only after server acceptance.
- `If-Match` protects mutable records such as trip draft, group membership settings, profile settings, and moderation actions. Safety incident facts are append-only transitions authorized by the state machine.
- Successful command responses return the resource version and any queued/accepted evidence state. “Accepted” is not “delivered.”

## 6. Pagination, filters, and sync

```ts
type CursorPage<T> = {
  data: T[];
  meta: {
    requestId: string;
    nextCursor?: string;
    snapshotAt: string;
  };
};
```

- Cursor pagination only; no exposed database offsets for protected or rapidly changing collections.
- Filters are allow-listed per endpoint and must not create a location-discovery side channel.
- Sync uses a signed/opaque cursor, server change version, device session, and scoped resource visibility. A deleted/revoked resource returns a tombstone/minimal reconciliation instruction, not protected historic contents.
- Realtime messages are projections for freshness. The client reconciles commands and critical state against durable APIs.

## 7. Event envelope and outbox contract

```ts
type DomainEvent<T> = {
  eventId: string;
  eventType: string; // e.g. trip.planned.v1
  occurredAt: string; // UTC instant assigned by the transaction
  aggregate: { type: string; id: string; version: number };
  actor?: { type: 'user' | 'service'; id: string };
  countryProfile?: { code: string; version: string };
  correlationId: string;
  causationId?: string;
  classification: 'internal' | 'protected' | 'safety';
  payload: T; // minimized; no raw token or unnecessary protected data
};
```

Initial event families:

| Family | Examples | Consumer rule |
|---|---|---|
| identity/consent | `consent.granted.v1`, `device.session_revoked.v1` | protected; update policy/session projections |
| trip/group | `trip.planned.v1`, `ride.started.v1`, `membership.changed.v1` | idempotent projections and notifications |
| geo/pack | `graph.published.v1`, `pack.verified.v1` | provenance and download/catalog projection |
| presence/sync | `presence.updated.v1`, `location.shared.v1` | short-lived scoped projection; do not use as historical delivery proof |
| community/media | `post.published.v1`, `media.quarantined.v1` | moderation and authorization-aware feed projection |
| safety | `incident.activated.v1`, `channel.attempt_recorded.v1` | dedicated priority path; immutable evidence semantics |
| configuration | `country_profile.activated.v1` | staged cache/config propagation; clients revalidate capability |

Events are delivered at least once. Every consumer must deduplicate by `eventId`, verify schema/type/version, record its processing outcome, and route poison messages to a reviewable dead-letter path. WebSocket or push delivery is never the only event record.

## 8. Compatibility and contract testing

1. Additive optional fields are permitted in `v1`; removing/retyping a field or changing semantic behavior is breaking.
2. Producers publish an event schema version with fixtures. Consumers test the current and immediately previous compatible version during transition.
3. Every endpoint has positive, unauthorized, forbidden, stale-version, idempotent-retry, duplicate-event, and redaction tests.
4. Every safety state test asserts evidence words and actual stored state together; no test may equate a local action with provider or recipient delivery.
5. Contract fixtures use synthetic Nepal places/people/contact data only; never source production riders or real emergency recipients.

## 9. Initial S1 deliverables

- `openapi/v1.yaml` or equivalent service-neutral API description;
- versioned JSON Schema/TypeScript domain models and event schemas;
- error-code registry and localization message-ID registry;
- idempotency/audit/outbox persistence contract;
- consumer dedupe and dead-letter contract;
- contract-test fixture package and CI compatibility check;
- per-domain endpoint catalogue for S3–S10, produced only after the shared foundations are accepted.

## 10. Open implementation decisions

- exact OpenAPI/JSON Schema/tooling choice and repository placement;
- identity provider and concrete broker/queue/database/cloud selection remain provider-neutral;
- final data retention durations and Nepal legal approval;
- exact rate limits, SOS anti-abuse rules, and approved notification channel configuration;
- authorization relation implementation (policy engine versus application-layer policy) while preserving ADR-002’s server-authoritative rule.
