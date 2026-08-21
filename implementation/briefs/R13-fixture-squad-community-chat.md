# R13 — Fixture Squad, Community Feed, and Chat Presentation

> **Status:** Ready for implementation
>
> **Scope boundary:** R13 is a local, deterministic presentation layer. It must not implement live location, GPS, BLE/mesh discovery, presence, calls, PTT, chat delivery, media upload, social posting, reactions, server queries, WebSockets, push notifications, or outbox writes. No UI may claim that a rider is live, a message was sent/delivered/read, a post was published, or media was uploaded.

## 1. Objective

Replace the current Squad placeholder with a fixture-backed coordination and community surface. It demonstrates how a squad roster, map presence, cached feed, composer draft, and group chat will behave once backend and native capabilities exist—while maintaining explicit evidence boundaries today.

## 2. Required domain contracts and fixtures

Create screen-independent view models under `src/domain/` and stable deterministic fixture data under `src/fixtures/`. Reuse existing R6 connectivity and R8 map overlay contracts; do not add service clients or provider payloads.

```ts
type FixturePresenceState = 'cached' | 'last_known' | 'unavailable' | 'mesh_preview';
type FixtureMessageState = 'cached' | 'local_draft' | 'preview_queued' | 'failed_preview';
type FixturePostState = 'cached' | 'media_unavailable' | 'local_draft' | 'hidden_preview';

interface FixtureSquadPresence {
  memberId: string;
  displayName: string;
  presence: FixturePresenceState;
  observedAt: string;
  relativePosition?: 'ahead' | 'behind' | 'nearby';
  sourceVersion: string;
  syntheticDisclosure: string;
}

interface FixtureCommunityPost {
  id: string;
  author: string;
  state: FixturePostState;
  body: string;
  routeSummary?: string;
  mediaKind?: 'image_placeholder' | 'video_placeholder';
  sourceVersion: string;
  syntheticDisclosure: string;
}

interface FixtureChatMessage {
  id: string;
  author: string;
  body: string;
  state: FixtureMessageState;
  createdAt: string;
  syntheticDisclosure: string;
}
```

Fixture data must include cached, last-known, unavailable, mesh-preview, media-unavailable, local-draft, preview-queued, and failed-preview cases. Identifiers and timestamps are pre-authored—not generated at render time.

## 3. Required presentation

Use the existing **Squad** primary tab and add accessible internal tabs: `Feed`, `Groups`, and `Chat`.

### Feed

- Render pre-authored cached posts with author, location/time fixture labels, body, optional static route summary, and placeholder media—not remote images/video.
- Include filters `Following`, `Nearby`, and `Routes` with tab semantics.
- Low-data mode must suppress media placeholders and visibly say **“Low-data fixture preview — no media loaded.”**
- A composer may edit component-local text only. “Publish preview” must return **“No post was published or queued.”**
- Reaction/share/save controls, if shown, must be disabled or produce fixture-only disclosures. Do not mutate outbox state.

### Groups / squad context

- Show a deterministic roster and an R8 `MapSurface`/marker preview only when it is marked **“Fixture presence preview — not live rider tracking.”**
- Presence labels must be `Cached fixture`, `Last-known fixture`, `Unavailable`, or `Mesh preview`; never `Live`, `online now`, or real distance/heading claims.
- Map preview uses `cache_only` unconditionally, fixture provenance, and no GPS/current-location copy.
- Any call, ping, navigate, or member-action affordance is disabled or says capability unavailable in this preview.

### Chat

- Render a cached fixture transcript with cached, local-draft, preview-queued, and failed-preview states.
- The composer edits only local component state. “Send preview” must say **“No message was sent, queued, or delivered.”**
- Offline/mesh/dead-zone states retain cached fixtures and explicitly state that no delivery/relay occurred.

## 4. Truth and safety rules

- Every screen/tab carries a permanent **Synthetic / local preview** disclosure; individual posts, roster states, messages, routes, and map previews carry provenance where ambiguity remains.
- Do not imply people consented to tracking, are nearby, received communications, joined a group, or can be contacted.
- No actual user content, images, video, location, address book, contact, or message data may be read, persisted, logged, or sent.
- Never use SOS Red for feed moderation, chat errors, unavailable presence, queue preview, or ordinary warnings.
- No factual permit, weather, traffic, hazard, fuel, road, or safety-service information can be rendered as live/current/verified.

## 5. Accessibility, theme, and localization

- 48dp minimum targets for all controls; maintain the safety spacing around the centre SOS tab.
- Use `tablist`/`tab` semantics for Squad and Feed filters. Roster/mapping controls require descriptive labels that include fixture state.
- Messages and posts announce author, fixture status, and failure/unavailable state without relying only on colour.
- Test long Devanagari names and English/Nepali/Hindi placeholder strings. Do not claim complete localization.
- All additions use design tokens across Night, Day Glare, Dusk, and Blackout.

## 6. Explicitly excluded

- backend/API, auth, WebSocket, GraphQL, messaging provider, remote media, CDN, upload/download, push, analytics, contact import, share sheet, deep links, or persistence/outbox mutation;
- live GPS, background location, BLE/mesh, peer discovery, live group tracking, rider routing, calls, PTT, safety dispatch, or any capability claim;
- creating/joining/leaving groups, invitations, membership/role persistence, saved routes/trips, reactions, social moderation, actual post/message delivery, and read receipts;
- R14 profile/localization completion, R15 SOS UI, R16 native safety services, and R17 motion/analytics work.

## 7. Acceptance criteria

1. Domain contracts and stable fixtures cover every required cached/unavailable/preview state with unit coverage.
2. Squad tab navigation, Feed filters, Groups roster/map preview, and Chat transcript/composer are accessible and local-only.
3. Low-data, dead-zone, and mesh-preview states remain explicit with no delivery, tracking, or remote-content implication.
4. All map previews are fixture-provenanced and `cache_only`; no API/client/SDK/network capability is introduced.
5. Composer, post, reaction, and message interactions give permanent no-send/no-publish/no-queue truth copy and do not write AppState or storage.
6. Four themes, 48dp controls, tab/radio semantics, long Devanagari content, and existing R6–R12 regressions are tested.
7. `npm run typecheck`, `npm test -- --runInBand`, `git diff --check dev...HEAD`, and a simulator walkthrough pass.

## Required Antigravity completion report

Report touched files; domain and fixture contracts; state matrix; proof of no network/storage/outbox mutations; accessibility/touch evidence; all-theme simulator screenshots/video; exact validation output; and deferred backend/native risks. Open a PR against mobile `dev`; do not merge it.
