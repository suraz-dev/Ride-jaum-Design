# Design-to-Code Guidelines — React Native

> Implementation contract for Codex agents building the RideJaunm iOS/Android client. Read this with the source [README](../README.md), the Phase 1–9 documents, and [DTCG tokens](../tokens/ridejaunm.tokens.json). The typed adapter is [implementation/react-native-tokens.ts](../implementation/react-native-tokens.ts).

## Product contract

RideJaunm is an offline-first companion for Nepali motorcycle riders: terrain-first maps, three route personalities, group coordination, cache-backed travel, community, and a deliberately guarded emergency experience.

The priority is trust while riding:

1. **Map is hero:** normal in-ride chrome uses no more than ~35% of the viewport.
2. **Honest degradation:** show cached, stale, partial, queued, relayed, or unavailable—never a false “live” state.
3. **Glove first:** targets are 48 dp generally, 56 dp in-ride, 72 dp PTT, and 88 dp SOS.
4. **Route modes:** `Straight`, `Curvy`, `Supercurvy`. *Supercurvy* is the design system's name for the requested Adventurous option. Use hue + line pattern + icon + label, never hue alone.
5. **Safety is real, not implied:** mesh, satellite, hardware trigger, crash detection, PTT, and emergency delivery remain feature-gated until native/device/operational validation proves them.

### Brand, copy, and localisation

- Product spelling is **RideJaunm**. Tagline: *“Let's go. The road knows the way.”* Safety: *“Never ride alone.”*
- Direction is **Himalayan-Tactical Tech**: tactical glass floating over terrain; data like a motorcycle instrument cluster; high-energy accent used as punctuation.
- Dark is the origin. Volt is movement/interaction; Cyan is data/GPS; Magenta is Supercurvy; SOS red is emergency only. Orange `danger` is the ordinary destructive colour.
- Locales: English, Nepali, Hindi; Latin + Devanagari; `Asia/Kathmandu`; km/m/km-h by default, NPR, and AD/BS date display. Test long Nepali place names from the start.

## Delivery architecture

Use TypeScript in strict mode. Prefer an **Expo development build**, not an Expo Go-only app: it can include custom native libraries and configurations required for maps, background location and eventual transport work. [Expo development builds](https://docs.expo.dev/develop/development-builds/introduction/?buildenv=build-with-eas)

Use a native MapLibre integration behind a `MapAdapter` interface; MapLibre provides a React Native package and needs a native rebuild. [MapLibre React Native setup](https://maplibre.org/maplibre-react-native/docs/setup/react-native/)

```text
app/
  navigation/       tab shell, stacks, deep links, ride-mode guard
  features/         onboarding/ ride/ plan/ sos/ squad/ profile/ offline/
  components/
    primitives/     Button, IconButton, Text, Input, Badge, ProgressRing
    composites/     BottomSheet, TelemetryHUD, RouteMode, RiderCard, FeedCard
    map/            MapSurface, RouteLayer, markers, MapControls, MapAdapter
  design/           generated tokens + ThemeProvider
  domain/           route, ride, group, sos, region, connectivity models
  services/         location, map, offline, transport, notification, storage
  state/            feature stores, cache adapters, selectors
  i18n/             en.ts, ne.ts, hi.ts, formatters
  test/             fixtures, accessibility helpers, state-matrix tests
```

### Rules for architecture

- Screen/component code only receives view models and callbacks; no SDK/SQLite/BLE/HTTP calls in UI.
- Use interfaces plus realistic deterministic fakes for map, routing, location, offline storage, transport, notification, and API. A simulator must show truthful state without secrets or a backend.
- Persist route packs, trip drafts, active ride state, queued posts/messages, offline regions, and the last reliable location locally. Synchronisation is additive.
- Map/routing/identity/backend vendors are swappable adapters—not imports scattered across features.
- Do not create a “SOS ACTIVE” success state unless a configured transport has accepted/relayed a concrete packet. An unavailable capability must visibly say unavailable.

## Token and visual implementation rules

1. Import `theme`, `type`, `primitive`, `routePresentation`, and `safety`; do not add raw colours to JSX/styles.
2. Use 4 dp spacing increments and radii 4/8/12/16/20/28/full. Inner radius = outer radius minus padding.
3. Use Space Grotesk for display/telemetry, Inter for body, Mukta for Devanagari, JetBrains Mono for coordinates and mesh IDs. Telemetry uses tabular figures and reserved width.
4. Implement Night, Day Glare, Dusk, and Blackout. Day Glare replaces blur with near-solid Snow surfaces for sunlight readability.
5. Contrast floors: body >= 4.5:1, telemetry >= 7:1, SOS >= 10:1. A state must have label/icon/pattern as well as colour.
6. Glass is for short labels/values/icons over maps, never paragraphs or nested panels. It has >=55% fill, >=20 dp blur, a 1 dp inner border, and a low-tier solid fallback.
7. Accent occupies <10% of the screen. No gradient text/borders/cards. Sanctioned gradients: CTA, map scrim, elevation data, SOS dome.

| Mode | Visual contract | Meaning |
|---|---|---|
| Straight | cyan, solid 6 dp, arrow, dark 2 dp casing | direct/fastest |
| Curvy | volt, solid 7 dp + glow, single wave, casing | balanced bends |
| Supercurvy | magenta, dashed 8 dp + glow, double wave, casing | maximum bends/adventure |
| Alternative | blue-grey dashed 4 dp | viable option |
| Hazard | orange-red dashed 4 dp + hazard glyph | risk, never SOS |
| Detour | amber dashed 4 dp | temporary reroute |
| Off route | grey dashed 4 dp + question glyph | navigation state |

## Component contract

Build in dependency order; each interactive component has explicit `default`, `pressed`, `focused`, `disabled`, `loading`, and relevant connectivity/error states.

| Layer | Components | Required result |
|---|---|---|
| Foundations | `ThemeProvider`, `AppText`, `Icon`, `Avatar`, `Badge`, `StatusPill`, `SignalBars`, `BatteryPill`, `ProgressRing` | token styles, dynamic type, test IDs |
| Actions | `Button`, `IconButton`, `FAB`, `SOSButton`, `PTTButton` | targets 48/56/88/72 dp; geometry stays stable while loading |
| Input/control | `DestinationSearch`, `TextInput`, `PostComposer`, `Toggle`, `Checkbox`, `SegmentedTabs`, `RouteMode` | keyboard safe; error/offline states; semantic a11y role |
| Navigation | `BottomNav`, `AppBar`, `BottomSheet`, `ConnectivityBanner`, `RideInProgressPill` | 5 tabs; sheet detents 120/45%/92%; SOS banner wins |
| Map | `MapSurface`, route/waypoint/rider/group layers, `MapControls`, scale, compass | adapter-backed and fixture-tested |
| Domain cards | HUD, route summary, rider/feed/offline-region/waypoint cards, signal matrix, mesh topology | view-model only; every state explicit |
| Screens | assembled from documented components | online/offline/mesh/SOS matrix covered |

`Control/RouteMode` is an accessible radiogroup, not three unlabelled icons. It shows a selection haptic and live distance/time/bends/elevation metadata.

`SOSButton` is a dedicated safety component: 88 dp circular target, outer separation ring, 3,000 ms long press, progress/countdown, early-release unwind, then 10-second cancellation. It cannot be in a scrolling container or within 24 dp of another actionable item; normal destructive actions must never use it. React Native provides the role/label/state/action hooks needed for VoiceOver/TalkBack; apply them to custom controls. [React Native accessibility](https://reactnative.dev/docs/accessibility)

## Navigation and flow contract

Tabs: `Ride`, `Plan`, `SOS`, `Squad`, `Profile`, with SOS centred and visually unique. The Ride tab opens on Map Home; normal tabs hide after sustained motion but the SOS FAB remains. Feed lives beneath Squad (`Feed | Groups | Chat`) and a Ride top-bar entry; it is deliberately not a primary in-ride tab.

### Group trip plan

1. Map + half sheet: prefilled start, destination search, Solo/Group choice.
2. Group reveals squad context before route calculation.
3. Offline search searches downloaded regions only and says this in the field.
4. Destination draws three candidate routes simultaneously; Curvy is initially selected.
5. Supercurvy selection changes the route, visibility, statistics, elevation/surface/hazard summary and added distance/time disclosure.
6. Reorderable waypoints recompute the route. Suggest fuel, chiya, viewpoints, health, and permit stops.
7. Invite riders; assign Lead/Sweep/Rider; set rally point/departure (AD/BS); share a link fallback.
8. Readiness shows real tile, weather, fuel-gap, permit, emergency-contact, and capability data before start.

### Connectivity and SOS

Model `ConnectivityState = 'online' | 'offline' | 'mesh' | 'sosActive'` and `DataFreshness = 'fresh' | 'stale' | 'partial' | 'unavailable'`, rather than loose booleans. Banner priority is SOS > mesh > offline > sync. Record GPS and breadcrumbs locally when a ride starts.

Manual path: SOS tab/FAB -> signal matrix -> 3-second hold -> 10-second cancel window -> active incident that reports only real channel/acknowledgement status -> deliberate 3-second stand-down. The console separately reports Cellular, GPS, Mesh, Satellite and last-success times.

Crash detection, hardware activation, mesh relay, PTT, and emergency SMS are separate capability tracks. UI may show their feature-flagged/unavailable status initially. Production enablement requires device tests, privacy/legal review, operational runbooks, emergency-contact/dispatch validation, and second safety review.

## Offline data rules

- Cached routing, navigation, GPS, HUD telemetry, saved trips, cached reading, and drafts can work offline when data exists. Do not promise live traffic, uncached search, or remote location.
- A region has country/province/district/bounds, zoom range, storage, base tile freshness, hazard freshness, and Nepal-specific POI/hazard data. Hazard freshness expires faster.
- Partial downloads render actual covered tiles plus clear missing coverage/wireframe; never a blank silent map.
- Queue writes idempotently with local ID, status, retry policy and user-visible `Queued`. Never auto-delete region data.

## Definition of done for a task

- token-only styles; no raw hex/unexplained magic values;
- correct four-theme variant plus loading/empty/error/offline and relevant mesh/SOS state;
- target sizes and SOS spacing enforced;
- roles, labels, state/hints/actions, focus order and text scale; real EN/NE/HI content;
- contrast and redundant state encoding; OSM attribution on all map surfaces;
- unit/snapshot test plus device evidence for native map/location/safety behaviour;
- low-tier fallback for blur and a note of any unverified native behaviour.

## Agent protocol

Read this guide and [the task manifest](../implementation/task-manifest.md) before coding. Work exactly one task at a time. Inspect existing work and preserve unrelated changes. Establish typed interfaces and fixtures before vendor integrations. Record or ask for a decision before assuming backend, map/routing provider, identity, transport, or secret. At task end return: scope, files, interface changes, states, tests, and unverified device risk.

Fresh-start and continuation prompts are in [prompts/01-master-prompt.md](../prompts/01-master-prompt.md) and [prompts/02-follow-up-meta-prompts.md](../prompts/02-follow-up-meta-prompts.md).
