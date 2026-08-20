# ADR-008 Decision Packet — Nepal Consent, Emergency Copy, and Data Policy

> **Decision:** Define the product boundary for consent, protected data, localization, and safety copy in the Nepal-first release.  
> **Status:** Accepted — architecture boundary (2026-08-19).  
> **Important:** This is an architecture and product-policy design document, not Nepal legal advice.

## 1. Decision statement

Adopt a **purpose-specific, explicit, revocable consent model**. Collect and use only the data needed for the requested product purpose; retain a versioned consent receipt; make precise location, emergency-contact, medical-card, community visibility, analytics, and marketing separate scopes. Present material consent and SOS limitation copy in English, Nepali, and Hindi with professional/local review before release.

No emergency screen may imply RideJaunm has contacted public emergency services unless an approved, tested, and legally reviewed integration produced matching evidence.

Nepal’s Privacy Act, 2075 (2018) addresses confidentiality of personal data and consent/purpose disclosure when collecting and using personal information. The product must obtain Nepal counsel’s interpretation for its exact operating model. [Nepal Privacy Act (official English PDF)](https://nic.gov.np/files/new_files/the-privacy-act-2075-2018.pdf)

## 2. Data and consent purposes

| Purpose | Data minimum | Consent / trigger | Revocation effect |
|---|---|---|---|
| Account and security | account identifier, device session, language | required to create/use account | account deletion workflow; session revocation |
| Route planning/offline packs | origin/destination, selected route/region, download metadata | rider initiates plan/download | delete saved route/pack metadata subject to policy |
| Active group location | current location, accuracy, freshness, active ride/group scope | explicit start-sharing action per active ride or clearly configured persistent setting | stop sharing immediately; mark future presence unavailable |
| Safety profile | emergency contacts; optional health/medical information | separate, explicit safety-profile consent | disable future use; preserve prior incident evidence only under approved policy |
| SOS incident | deliberate SOS action, selected available location/capability snapshot, approved contact scope | deliberate activation plus safety-profile scope | affects future contact attempts; does not rewrite immutable existing incident facts |
| Community/media | post/content/visibility choice | submit/publish action; separate visibility selection | logical removal/deletion workflow |
| Product analytics | minimized, pseudonymous operational signals | explicit non-essential analytics choice | stop future collection/processing where feasible |
| Marketing | contact channel/language | separate opt-in | immediate unsubscribe/suppression |

Silence, a pre-ticked box, or a generic “I agree” cannot stand in for a separate safety/medical/location consent scope.

## 3. Consent receipt and policy versioning

```ts
type ConsentReceipt = {
  id: string;
  userId: string;
  purpose: ConsentPurpose;
  state: 'granted' | 'revoked' | 'expired';
  policyVersion: string;
  contentHash: string;
  locale: 'en' | 'ne' | 'hi';
  grantedAt?: string;
  revokedAt?: string;
  source: 'onboarding' | 'settings' | 'sos_activation';
  actorDeviceSessionId?: string;
};
```

Rules:

1. A material policy/copy change creates a new version; it does not alter historical consent receipts.
2. API policy checks evaluate current consent plus the action’s purpose, resource scope, and incident state.
3. Revocation stops future discretionary processing and sharing immediately where technically possible, then schedules downstream cleanup/deletion according to the approved policy.
4. An immutable incident audit record retains the consent/purpose context that applied at the time; it does not permit future disclosure beyond law/policy.
5. Consent receipts contain no unnecessary medical/contact content.

## 4. Emergency and SOS copy rules

### Required product boundaries

- Say what occurred and what evidence exists: local record, server accepted, provider accepted, delivery unknown, or recipient acknowledgement.
- Say what RideJaunm cannot verify: public-service notification, physical response, network delivery, peer relay, location accuracy, or recipient awareness where evidence does not exist.
- Keep a visible manual emergency-help option sourced from the country configuration and periodically verified; its presence is information/a dial action—not evidence that RideJaunm contacted anyone.
- Treat contact/medical details as protected data. Do not display complete details on a lock screen, push payload, generic group feed, or diagnostic log.
- Require a deliberate SOS activation and stand-down interaction with accessible equivalent paths.

### Copy review matrix

| Surface | Required review | Example constraint |
|---|---|---|
| Onboarding/privacy notice | legal/privacy + professional localization | explain purpose, data categories, sharing, and revocation in plain language |
| Location-sharing start/stop | UX/accessibility + localization | state active group/ride scope and stop effect |
| Safety profile | legal/privacy + safety owner | separate consent for emergency contacts and optional medical data |
| SOS active status | safety/legal + physical-device test | exact evidence wording; no unsupported outcome claim |
| Offline/no signal | UX/safety + localization | distinguish queued, local, and unavailable channels |
| Emergency-resource list | country operations + legal | source, date verified, regional limitations, manual-use wording |

Nepal Police publicly lists emergency contact resources, including police control contact information, but RideJaunm must treat any displayed number/resource as country-configured content with source and verification date—not as an automatic dispatch integration. [Nepal Police emergency contacts](https://nepalpolice.gov.np/stations/emergency-contacts/)

## 5. Localization and regional configuration

```text
country configuration
  ├─ legal/policy version links
  ├─ locale catalog: EN, NE, HI
  ├─ calendar/time-zone: Nepal +05:45 and AD/BS presentation support
  ├─ emergency-resource content: source, last verified, visibility, manual action
  ├─ routing/data licences and attribution
  └─ feature/channel flags and unsupported-state copy
```

- The implementation uses stable message IDs, not hard-coded English strings or `if country == Nepal` product branches.
- Nepali text must support Devanagari correctly; Hindi is a supported product locale, not a substitute for Nepali legal/local review.
- Test longest strings, low-literacy/plain-language comprehension, assistive technology labels, and date/time presentation.
- Country configuration changes undergo content, legal, accessibility, and release review before becoming active.

## 6. Privacy engineering controls

| Area | Required control |
|---|---|
| Collection | data inventory and purpose mapping; no hidden collection |
| Access | server resource policies; purpose-bound emergency/medical access audit |
| Use/share | explicit scope, least disclosure, short-lived signed URLs, no generic-feed precise location |
| Storage | encrypted protected fields; encrypted mobile local store; environment separation |
| Retention | category-based policy, scheduled deletion, legal/safety hold model, backup lifecycle |
| User rights/workflows | access/export/delete/correct/contact path documented after counsel review |
| Observability | PII redaction, consent/change audit, no token/contact/medical/location payloads in routine logs |
| Vendors | data-processing/security review, contract and cross-border assessment before production data transfer |

## 7. Legal and operational review gates

Before enabling production riders, obtain and record review of:

1. Privacy Act/other applicable Nepal requirements, age/account requirements, and data-processing basis.
2. Emergency wording, country emergency-resource display, contact/medical consent, incident export, and retention/deletion approach.
3. Cross-border data transfer, cloud/provider contracts, map-data licence/attribution, and support/on-call responsibilities.
4. EN/NE/HI material consent and safety copy by qualified reviewers.
5. Accessibility and rider comprehension test evidence for location and SOS flows.

The Electronic Transactions Act provides a Nepal legal framework for electronic records and transactions, but product-specific compliance still requires counsel. [Nepal Electronic Transactions Act](https://lawcommission.gov.np/content/13397/electronic--electronic--traded-international-act--2063/)

## 8. Acceptance tests

- consent screens show purpose, categories, scope, locale, policy version, and a real decline/revoke path;
- location sharing stops immediately for future presence when revoked/stopped;
- medical/emergency information is unavailable without correct purpose/policy and appears in audit;
- a changed policy produces a new consent requirement without overwriting receipt history;
- EN/NE/HI text renders correctly with long strings and accessible labels;
- SOS copy maps exactly to stored evidence state in online/offline/no-signal/zero-peer cases;
- country emergency resources have a source, verification date, and manual-use wording;
- analytics/marketing opt-out stops future non-essential collection/send;
- export/deletion workflow is tested with approved policy assumptions and excludes immutable evidence only where policy/law requires.

## 9. Alternatives

| Option | Decision |
|---|---|
| Separate, versioned, revocable purpose consent | **recommended** |
| One blanket consent for location, medical, social, and marketing | rejected |
| English-only material safety/privacy copy | rejected |
| Static emergency numbers hard-coded in the app | rejected |
| Product copy claiming public dispatch without integration evidence | rejected |
| Retention periods invented by engineering | rejected; requires legal/product decision |

## 10. Approval record and scope

**Approved on 2026-08-19:** the consent and copy architecture.

This does **not** constitute legal approval, set final retention periods, approve emergency-service integrations, or replace Nepal counsel review.
