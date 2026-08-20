# ADR-009 Decision Packet — Country Configuration and Expansion

> **Decision:** Keep the Nepal launch configuration explicit while making each future country a versioned, reviewable configuration—not a fork of mobile or backend logic.  
> **Status:** Accepted — architecture boundary (2026-08-19).  
> **Scope:** product configuration and operational gates only. This is not approval to launch in any country other than Nepal.

## 1. Decision statement

Adopt a **versioned country-configuration model**. A country profile declares supported territory, locales, time/calendar presentation, units, routing/offline-data coverage, emergency-resource content, policy/copy versions, provider bindings, licences/attribution, and feature flags. The mobile client and backend resolve this profile through stable contracts; neither uses country-name conditionals for product behavior.

Launch with one approved Nepal configuration (`NP`). Future territories remain disabled until their own profile, source/licence review, content/legal review, operational owner, and validation evidence are accepted.

Use canonical BCP 47-style locale identifiers in API/configuration contracts (for example `en-NP`, `ne-NP`, and `hi-NP`) and an IANA time-zone identifier such as `Asia/Kathmandu`, rather than invented locale or fixed-offset values. Unicode documents BCP 47-compatible identifiers and recommends the hyphenated form; IANA maintains the time-zone database. [Unicode locale identifiers](https://www.unicode.org/reports/tr35/) · [IANA time-zone database](https://data.iana.org/time-zones/tz-link.html)

## 2. Configuration contract

```ts
type CountryProfile = {
  schemaVersion: 1;
  countryCode: 'NP' | string; // ISO-style country code; validated catalog value
  configVersion: string;
  state: 'draft' | 'review' | 'active' | 'suspended' | 'retired';
  supportedTerritory: GeoBoundaryRef[];
  defaults: {
    locale: string; // BCP 47, e.g. en-NP
    timeZone: string; // IANA, e.g. Asia/Kathmandu
    calendar: 'gregory' | 'bikram-sambat';
    distanceUnit: 'km';
  };
  locales: Array<{ tag: string; messageCatalogVersion: string; reviewState: 'approved' }>;
  routing: {
    coverageVersion: string;
    profiles: RouteProfileAvailability[];
    packCatalogVersion: string;
    licenceNotices: LicenceNoticeRef[];
  };
  emergencyResources: Array<{
    resourceId: string;
    regionRef?: string;
    displayCopyKey: string;
    action: 'manual_dial' | 'manual_link' | 'information_only';
    sourceUrl: string;
    lastVerifiedAt: string;
  }>;
  policy: { privacyVersion: string; safetyCopyVersion: string; retentionPolicyRef: string };
  providers: ProviderBinding[]; // reference/region/capability only; never secret material
  features: Record<string, 'off' | 'pilot' | 'on'>;
  review: { owner: string; approvedAt?: string; evidenceRefs: string[] };
};
```

Rules:

1. Profiles are immutable once active. A change creates a new `configVersion`, a review record, and a rollout/rollback plan.
2. Secrets and credentials stay in the server-side secret manager; country configuration holds only safe provider references and capability switches.
3. A server-assigned country/profile context is authoritative for protected services. The client can request a profile but cannot claim eligibility by sending `countryCode`.
4. The active profile is cached with an expiry and signature/checksum. If it is stale, invalid, or unavailable, the client fails closed for newly enabled regional capabilities and preserves only previously validated offline data.
5. Every incident, consent receipt, route/pack request, and audit event records the effective `countryCode` and `configVersion` where relevant.

## 3. Nepal launch profile

`NP` is the sole launch profile and starts with the product-supported English, Nepali, and Hindi locale catalogues. It supports kilometer-based routing, `Asia/Kathmandu` time presentation, and Bikram Sambat/Gregorian display where the UX requires it. A Gregorian timestamp remains the canonical persisted instant; local or Bikram Sambat representations are display-only.

The profile must bind only map/routing/pack coverage actually validated for Nepal. An unavailable region, pack, provider, language version, or emergency resource is shown as unavailable—never silently substituted and never described as supported.

Emergency resources are informational/manual actions with a source and last-verification date. They are not provider bindings and do not indicate public emergency dispatch. This preserves ADR-007’s evidence boundary and ADR-008’s safety-copy boundary.

## 4. Expansion gate

No country moves to `active` until all of the following are recorded:

| Gate | Required evidence |
|---|---|
| Territory and coverage | geofence/administrative boundary source, search/routing/pack coverage, route-quality field validation |
| Data and licences | current source terms, attribution, graph/pack provenance and refresh owner |
| Localization | approved message catalogue, plural/date/number/Devanagari-or-relevant-script tests, accessibility review |
| Legal and policy | country-specific privacy/consent, emergency content, retention and cross-border-transfer review |
| Safety operations | manual resource verification, SOS channel capability review, limitations copy, escalation/on-call owner |
| Providers | regional availability, data residency, cost, outage and fallback assessment; secrets separately approved |
| Product controls | feature flags default off, unsupported-state UX, support runbook, release/rollback plan |
| Observability | country/profile/version dimensions, redaction review, alert ownership, audit retention rule |

A territory can be `pilot` for explicitly consented testers, but it is not a public launch until all production gates are complete.

## 5. Runtime behavior and failure modes

```text
account/session + device location (optional)
          │
          ├─ server resolves eligible CountryProfile@version
          │      ├─ active + capability on → return scoped configuration
          │      ├─ pilot + eligible tester → return scoped pilot configuration
          │      └─ unsupported/suspended → return safe unsupported state
          │
mobile client validates cached/current profile
          ├─ route/offline pack → coverage + licence + profile capability
          ├─ SOS display → reviewed safety copy + manual resources + ADR-007 evidence state
          └─ social/location → profile policy + ADR-008 consent policy
```

- **Unsupported territory:** clearly state which capability is unavailable; offer no fabricated route, pack, emergency or provider guarantee.
- **Suspended country profile:** stop new regional work, retain legal/safety evidence according to approved policy, and present supported alternatives/copy.
- **Invalid profile:** reject it on the server and client validation layers, alarm operations, and continue using the last known good signed profile only within its expiry.
- **Offline client:** use the profile that was bundled with or verified alongside an offline pack; show its freshness and capability limits. It cannot acquire a new country or enable a newly flagged feature offline.

## 6. Architecture boundaries

| Area | Required boundary |
|---|---|
| Mobile | `CountryConfigRepository` and `CapabilityResolver`; feature modules consume capability values rather than country names |
| API | country/profile context in request metadata; policy middleware validates eligibility and version |
| Routing/packs | catalog keyed by coverage/profile/version; attribution included in pack metadata and UI |
| Safety | `EmergencyResourceResolver` supplies reviewed manual content only; delivery providers remain governed by ADR-007 |
| Localization | stable message IDs and BCP 47 tags; do not branch on display strings or locale labels |
| Data | region-scoped records use explicit coverage/territory references; no inferred regulatory claims from GPS alone |
| Operations | configuration publishing is audited, staged, reversible, and separated from application deployment |

The initial implementation needs a synthetic second-country fixture (`XX`) in automated tests. It must prove that a configuration with different locale, time zone, flags, coverage and resources resolves correctly without `if (country === 'NP')` branches.

## 7. Acceptance tests

- schema rejects invalid/unrecognized locale, time-zone, state transition, provider reference, missing source URL, or expired emergency resource;
- only an active, reviewed Nepal profile can enable launch capabilities;
- changing a profile creates a new version and preserves historical event/consent/incident references;
- the synthetic `XX` fixture runs route, pack, localization, policy and unsupported-state tests without application country branches;
- server policy denies a client-selected country that is not eligible for the account/request/resource;
- offline pack metadata shows matching country/profile/coverage/licence version and fails safe on mismatch;
- invalid, revoked or expired profile behavior is observable and rolls back to a defined last-known-good version;
- EN/NE/HI rendering, Nepal local date/time presentation, and canonical instant storage are covered by automated and manual accessibility tests;
- SOS surfaces only resources/copy enabled by the resolved profile and do not claim dispatch or delivery without ADR-007 evidence.

## 8. Options and recommendation

| Option | Assessment |
|---|---|
| Versioned, reviewed country profiles with capability resolution | **Recommended** — controlled expansion, auditable changes, one product codebase |
| Country checks scattered through mobile/backend code | rejected — forks behavior, hides policy changes, and makes rollback/audit impractical |
| One global profile with informal regional overrides | rejected — makes licences, emergency copy, safety channels, and policy ownership ambiguous |
| Launch new regions via feature flag only | rejected — a flag does not provide coverage, localization, policy, safety, or operational evidence |

## 9. Approval record and scope

**Approved on 2026-08-19:** country configuration is versioned data with staged capability gates; Nepal is the only active launch profile; future-country launch requires its own evidence and approval record.

This decision does **not** approve another country, choose providers, set legal retention periods, or authorize public emergency-service dispatch.
