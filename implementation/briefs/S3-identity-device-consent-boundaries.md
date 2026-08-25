# S3 — Identity, Device, Consent, and Safety-Profile Boundaries

> **Status:** Ready for implementation from backend `dev` after S2 merge
>
> **Target repository:** `RideJaunm-Backend`
>
> **Required base:** backend `dev` containing the accepted S2 operational data foundation.
>
> **Architecture authority:** [ADR-002 identity/device sessions](../../docs/18-adr-002-identity-device-decision-packet.md), [ADR-008 consent and protected data](../../docs/24-adr-008-nepal-consent-emergency-copy-decision-packet.md), [LLD](../../docs/13-system-lld.md), [S1 foundations](../../docs/27-s1-api-event-contract-foundations.md), and [schema catalogue](../../docs/28-s1-domain-api-schema-catalogue.md).

## Objective

Create the server-owned identity and policy boundary on top of S2. The result is a provider-neutral, fail-closed authentication seam; durable internal user/device/consent/safety-profile metadata; request/audit/idempotency discipline; and resource-policy tests.

S3 proves that product authority comes from RideJaunm records and consent—not from a client role, raw provider profile, or device claim. It does **not** select or connect an identity provider.

## Required implementation

### 1. Module and security boundary

- Add explicit `platform` and `identity` packages. The identity module may depend on platform primitives and persistence only; it must not depend on trip, geo, community, realtime, safety-incident, provider SDK, or future outbox modules.
- Add Spring Security and a provider-neutral `IdentityTokenVerifier`/`IdentityProviderAdapter` port. Its default Compose/runtime implementation must fail closed: no configured provider means protected `/v1/**` requests cannot authenticate.
- Test-only synthetic principals may be used through test configuration only. They must never be enabled by a default, Docker, local, or production profile, and no endpoint may accept a fabricated identity header.
- Keep Actuator liveness/readiness available as S2 defines; all non-Actuator application routes require authentication.
- Generate/return a canonical `X-Request-Id`; use the S1 success/error envelope and redact provider subjects, tokens, contact/medical data, and precise locations from logs.

### 2. Schema migrations

Add ordered Flyway migrations only. Every mutable record has UUID `id`, UTC `created_at`/`updated_at`, and optimistic `version`.

| Relation | Required fields and constraints |
|---|---|
| `users` | internal UUID; provider issuer + subject mapping unique as a pair; account state; locale/country-profile reference; no copied provider profile beyond the approved minimum |
| `device_sessions` | user reference; platform/app version/device label; capability snapshot; advisory integrity level; `created_at`, `last_used_at`, `revoked_at`, revocation reason; never refresh/access tokens |
| `consent_receipts` | append-only user/purpose/state/policy version/content hash/locale/source/actor-device/time facts; no mutation of historical receipt; purposes limited to the ADR-008 catalogue |
| `safety_profiles` | one profile per user; enabled/disabled state, safe contact-count and medical-card-presence flags, resource version; **no emergency-contact or medical value storage in S3** |
| `identity_audit_events` | append-only actor/device/action/resource/purpose/outcome/correlation/occurred-at metadata; no raw protected payloads |
| `idempotency_records` | actor + endpoint + idempotency key + semantic payload hash + stored outcome reference/status/expiry; same key with a different payload yields `409 IDEMPOTENCY_MISMATCH` |

Use database constraints and indexes to enforce uniqueness and append-only facts. A forward correction/rollback note is required for every migration. Do not create a token table, credential table, refresh-token store, contact/medical table, incident table, or outbox table in this task.

### 3. API contract and resource policy

Before backend implementation, update the Design SSOT machine-readable OpenAPI contract and schema catalogue for the S3 resource family. Implement only these protected, versioned endpoints after that contract change is merged:

- `POST /v1/devices` — register safe device metadata for the authenticated internal user; command idempotency required.
- `GET /v1/me` and `PATCH /v1/me` — current user’s minimum RideJaunm profile only; update uses `If-Match` and an audit record.
- `GET /v1/me/device-sessions` and `DELETE /v1/me/device-sessions/{sessionId}` — list/revoke only the requester’s own sessions; revocation is idempotent and immediately blocks further use.
- `GET /v1/me/consents` and `POST /v1/me/consents` — list and record immutable grant/revoke facts; command idempotency required.
- `GET /v1/me/safety-profile` and `PUT /v1/me/safety-profile` — safe summary only; update requires current safety-profile consent, `If-Match`, and purpose-bound audit evidence.

All responses use S1 `data`/`meta` envelopes. All errors use the safe S1 error envelope. Unauthenticated requests receive `401`; other-user resource access receives `403` or safe `404` without existence leakage. Never return tokens, raw provider claims, refresh data, contact/medical values, or precise location.

### 4. Test evidence

Use Testcontainers/PostGIS for migration and repository tests, plus Spring Security integration tests. Prove at minimum:

1. default runtime fails closed without a configured identity provider;
2. synthetic test authentication is test-scoped and cannot be enabled through Compose/default configuration;
3. user/device mapping is internal and unique by issuer/subject pair;
4. an authenticated user can access only their own profile, device sessions, receipts, and safety-profile summary;
5. forged client role/device/user identifiers cannot widen authority;
6. a revoked session is denied; attempts create safe audit metadata;
7. consent history is append-only; policy-version changes create another receipt; revocation stops future safety-profile updates;
8. idempotent command replay returns the original result, while a mismatched payload returns `409`;
9. safety-profile reads/writes require the correct purpose and create audit evidence without storing/exposing protected contact/medical content;
10. errors/log captures do not contain bearer tokens, provider subjects, contacts, medical values, or precise coordinates.

Add `docs/evidence/s3/identity-device-consent-boundaries.md` in the backend repo with migration inventory, endpoint/authorization matrix, test results, audit samples with synthetic/redacted values, and explicit provider-deferred evidence.

## Acceptance criteria

1. The security boundary is fail-closed in the default Compose/runtime configuration.
2. Identity, device, consent, profile, audit, and idempotency data are migrated and constrained through Flyway.
3. All S3 endpoints are first represented in the Design OpenAPI/schema SSOT and then implemented without divergence.
4. Ownership, revocation, forged-claim, consent, optimistic-version, idempotent-replay, and redaction tests pass against a real PostGIS container.
5. `./mvnw clean verify`, `docker compose config`, `git diff --check main...HEAD`, and documented S3 migration/restore verification pass.
6. No real OIDC provider, browser login, provider credential, token issuance/refresh, contact/medical storage, location sharing, trip/group logic, outbox, realtime, routing, notification, or SOS incident/channel/delivery capability exists.

## Explicit exclusions

Identity-provider selection/integration, PKCE exchange, JWT/JWKS validation against a live issuer, refresh-token rotation, MFA, provider callback/redirect handling, account deletion/export, contact/medical encrypted storage, country configuration, trips/groups, events/outbox, presence, chat/media, routing, offline packs, safety incidents, emergency resources, notifications, SMS, mesh, satellite, or public-service dispatch.

## Antigravity completion report

Open an **unmerged** PR against backend `dev` only after S2 is present in `dev`. Report:

1. base/head commits and Design-contract commit used;
2. Flyway migration inventory with forward-correction notes;
3. endpoint-to-policy matrix and authentication behavior by profile;
4. exact commands/results for Maven, Testcontainers, Compose, diff-check, and restore/migration validation;
5. proof that test identity is unavailable in runtime/Compose and no real provider/token/contact/medical/SOS capability was added;
6. synthetic/redacted audit evidence; and
7. open decisions: identity-provider selection (D-02), encryption/key-management for protected fields, retention/legal policy, and S4 outbox transport.

Keep the PR unmerged for CTO/QA review.
