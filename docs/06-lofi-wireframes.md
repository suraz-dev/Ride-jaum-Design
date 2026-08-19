# PHASE 6 — Low-Fidelity Wireframing Blueprint

> **Lo-fi discipline:** greyscale only (`#FFFFFF`, `#E5E5E5`, `#9E9E9E`, `#4A4A4A`, `#1A1A1A`),
> boxes with an X for media, `Inter Regular` for everything, no icons (labelled squares instead),
> no shadows, no radii above 8 px. The only permitted colour is a single magenta annotation
> layer for designer notes. **If a layout works in lo-fi, colour cannot save it later; if it
> fails in lo-fi, colour will only hide the failure.**

---

## 6.0 Frame & Grid Setup

| Setting | Value |
|---|---|
| Primary frame | **iPhone 15 Pro — 393 × 852 px** (the design origin) |
| Secondary frames | 360 × 800 (Android baseline — the Nepali market majority), 430 × 932 (Pro Max) |
| Safe areas | Top 59 px (status + notch), bottom 34 px (home indicator) |
| Layout grid | 4-column, 16 px margins, 16 px gutters (mobile) |
| Baseline | 4 px vertical grid |
| Thumb zones | Overlay guides: **Easy** bottom 0–45 %, **Stretch** 45–72 %, **Hard** 72–100 % |
| Naming | `LF-[Screen#]-[Name]-[State]` e.g. `LF-01-MapHome-GPSAcquiring` |

Each screen below is specified as **zones from top to bottom, with pixel heights**, so wireframing
is transcription rather than invention.

---

## 6.1 SCREEN 1 — Dashboard / Map Home (HUD View)

**Purpose:** The app's home. Answers, at a glance: *Where am I? Is GPS locked? Where's my squad?
Can I start riding right now?*

```
┌─────────────────────────────────────────────────┐  393 × 852
│ ░░░░ STATUS BAR (system) ░░░░░░░░░░░░░░░  9:41  │  0–59      Z0
├─────────────────────────────────────────────────┤
│ ▓ CONNECTIVITY BANNER (conditional, 32px)     ▓ │  59–91     Z1
│   "OFFLINE · MESH ACTIVE · 3 riders"            │
├─────────────────────────────────────────────────┤
│  [◉]        ┌──────────────────────┐      [🔔]  │  91–147    Z2
│  avatar     │ Search: Where to?    │      bell   │  TOP BAR 56px
│  40px       └──────────────────────┘      40px   │  floating on scrim
│             (glass pill, 56px tall)              │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────────────────────────┐                  │  147–215   Z3
│  │ NEXT TURN (conditional)   │           ┌───┐  │  turn card 96px
│  │ [↰] 400 m                 │           │ ⊕ │  │  LEFT column
│  │     Naubise Bazaar        │           └───┘  │
│  └───────────────────────────┘           ┌───┐  │  RIGHT column:
│                                          │ ◎ │  │  map controls
│                                          └───┘  │  56px each,
│              M A P   C A N V A S         ┌───┐  │  12px gap
│              (satellite / 3D)            │ ⧉ │  │  Z4
│                                          └───┘  │
│                                          ┌───┐  │
│         ● YOU (heading cone)             │ ⬇ │  │
│                                          └───┘  │
│         ◉ ◉  squad bubbles                      │
│                                                 │
│  ┌─────────────────┐                            │  Z5 floating
│  │ ◉◉◉ SQUAD · 3   │                    ┌─────┐ │  squad strip
│  │ nearest 1.2 km  │                    │     │ │  (bottom-left,
│  └─────────────────┘                    │ SOS │ │  152×64)
│  [scale bar] © OSM                      │ 88px│ │  Z6 SOS FAB
│                                         └─────┘ │  (bottom-right)
├─────────────────────────────────────────────────┤
│  ══ (drag handle)                               │  632–752   Z7
│  ┌───────────────────────────────────────────┐  │  HUD SHEET
│  │ ▲2,190M      [CURVY]            ⛽118KM   │  │  peek = 120px
│  │───────────────────────────────────────────│  │
│  │   68          18.4          4:12          │  │
│  │  KM/H       KM LEFT          ETA          │  │
│  └───────────────────────────────────────────┘  │
│         ┌─────────────────────────┐             │
│         │   ▶  START RIDE         │             │  (idle state only —
│         └─────────────────────────┘             │   replaces HUD row)
├─────────────────────────────────────────────────┤
│  🗺       🧭        ⬤        👥        👤      │  752–818   Z8
│ RIDE     PLAN     SOS     SQUAD   PROFILE       │  NAV 64px
├─────────────────────────────────────────────────┤
│ ░░░░ HOME INDICATOR ░░░░░░░░░░░░░░░░░░░░░░░░░░ │  818–852
└─────────────────────────────────────────────────┘
```

### Zone specification

| Zone | Height | Contents | Rules |
|---|---|---|---|
| Z1 Banner | 32 px (0 when nominal) | Connectivity / mesh / SOS state | Only ever one; priority SOS > Mesh > Offline > Sync |
| Z2 Top bar | 56 px | Avatar (→Profile), search pill, notifications | Floats over `scrim-map-top`, no solid bar. Avatar shows a ring when a group ride is live. |
| Z3 Turn card | 96 px | Manoeuvre icon, distance, street name (Devanagari + roman) | **Left column only.** Only during active navigation. |
| Z4 Map controls | 4 × 56 px | Compass, Recenter, Layers, Offline-download | **Right column only.** 24 px from edge. Vertically centred in the "stretch" zone. |
| Z5 Squad strip | 64 px | Up to 4 avatars + nearest distance | Tap → Squad live map. Hidden in solo rides. |
| Z6 SOS FAB | 88 px | The SOS trigger | Bottom-right, 24 px inset. **Minimum 24 px clearance from every other control.** Never scrolls. |
| Z7 HUD sheet | 120 / 384 / 784 px | Telemetry (see Phase 4) | 3 detents. Peek shows exactly 3 metrics. |
| Z8 Nav bar | 64 px | 5 tabs | Auto-hides in ride mode > 15 km/h. |

### States to wireframe (7 frames)

1. **Cold start / GPS acquiring** — map dimmed, radar-sweep placeholder, `SEARCHING FOR SATELLITES`, skeleton HUD showing `--`.
2. **Idle / GPS locked, no route** — full map, `START RIDE` CTA replacing telemetry, recent destinations chip row.
3. **Navigating solo** — turn card + full telemetry + route line, nav bar hidden.
4. **Navigating group** — adds squad bubbles + squad strip + a "rider falling behind" alert chip.
5. **Offline** — amber banner, greyed satellite layer (tiles unavailable at high zoom), `OFFLINE MAPS` badge on the tile area, download control highlighted.
6. **Blackout night mode** — everything except speed/turn/SOS dropped to the lowest luminance.
7. **SOS active** — persistent red header, all other chrome desaturated.

### Annotations to place (magenta layer)

- `⓵ Thumb-arc guide: SOS FAB centre sits at 78 % screen height, 82 % width — the natural right-thumb resting arc.`
- `⓶ Map visible area = 62 % of viewport in peek detent. Never below 55 %.`
- `⓷ All floating chrome uses 24 px screen inset; no element inside 16 px of an edge (palm rejection).`
- `⓸ Search pill collapses to a 56 px icon button once a route is active.`

---

## 6.2 SCREEN 2 — Trip Planner

**Purpose:** Choose *where*, *how curvy*, *with whom*, and *with what stops* — with the
consequences of each choice visible before committing.

```
┌─────────────────────────────────────────────────┐
│ ░░░░ STATUS BAR ░░░░░░░░░░░░░░░░░░░░░░░░░ 9:41 │
├─────────────────────────────────────────────────┤
│  [←]        PLAN A TRIP              [⋯]        │  56px  APP BAR
├─────────────────────────────────────────────────┤
│                                                 │
│              M A P   P R E V I E W              │  ~300px
│                                                 │  Three routes drawn
│   ╭─── cyan ───╮                                │  simultaneously.
│   │  ╭ volt ╮  ╰──── magenta ─────╮             │  Selected one is
│   ●──╯       ╰────────────────────●             │  bold; others 60%.
│  START                          DAMAN           │
│                                                 │
│                                    [⛶ expand]   │
├─────────────────────────────────────────────────┤
│ ══                                              │  BOTTOM SHEET
│ ┌─────────────────────────────────────────────┐ │  (half detent,
│ │ ● Kathmandu, Maitidevi          [swap ⇅]   │ │   drag to full)
│ │ ● Daman, Makwanpur                          │ │  A/B fields 2×48px
│ │ [+ Add stop]                                │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │  TRIP TYPE 48px
│ │      [ SOLO ]        [ GROUP ]              │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ ROUTE MODE                                      │  overline 12px
│ ┌─────────────────────────────────────────────┐ │  ROUTE MODE
│ │  [→]      │   [∿]     │    [⌇⌇]            │ │  SWITCH 64px
│ │ STRAIGHT  │  CURVY    │  SUPERCURVY        │ │  ⭐ hero control
│ └─────────────────────────────────────────────┘ │
│                                                 │
│  96 km   ·   3h 50m   ·   214 bends             │  STAT STRIP 40px
│  ↑2,320m ↓980m  ·  82% paved / 18% gravel       │  (tabular numerals)
│                                                 │
│ ┌─────────────────────────────────────────────┐ │  ELEVATION
│ │      ╱╲      ╱╲╱╲                           │ │  PROFILE 88px
│ │    ╱    ╲__╱      ╲___                      │ │  scrubbable
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ ⚠ Landslide-prone: km 41–46      [details]      │  HAZARD 40px
│ ⛽ Last fuel: Naubise, km 26                     │  (conditional)
│                                                 │
│ [ Avoid unpaved ]  [ Round trip ]  [ Max alt ]  │  OPTION CHIPS 32px
│                                                 │
├─────────────────────────────────────────────────┤
│  [ ⬇ Offline ]      [   START RIDE   ]          │  ACTION BAR 72px
├─────────────────────────────────────────────────┤    (sticky, above nav)
│  🗺   🧭   ⬤   👥   👤                          │
└─────────────────────────────────────────────────┘
```

### Layout rules
- **Map : sheet ratio** = roughly 38 : 62 at the half detent; dragging the sheet down reveals a
  full-screen map with the route-mode switch floating as a compact 40 px chip.
- The **route-mode switch is the visual centre of gravity** — the widest, tallest, highest-contrast
  element in the sheet. Everything above it is *input*; everything below is *consequence*.
- **Consequence-first ordering:** stats → elevation → hazards → options. A rider sees the cost of
  Supercurvy (time, gravel, altitude) before they can start.
- `START RIDE` is always reachable without scrolling (sticky action bar).

### States to wireframe (8 frames)
1. Empty (no destination) — recent + saved list fills the sheet.
2. Searching — results list, keyboard up, sheet at full.
3. Routes computed — the canonical frame above.
4. Supercurvy selected — with the "adds 38 km & 1h 40m" advisory chip.
5. Group mode — squad strip + roster + rally-point row inserted above the route mode.
6. Waypoint editor — full-detent drag-reorder list.
7. Offline — "Routing from downloaded maps" banner; Supercurvy may be limited if tile detail is insufficient.
8. No route possible — empty state with a suggested alternative destination.

---

## 6.3 SCREEN 3 — Social Community Feed

**Purpose:** Make Nepali riding culture visible, and make routes a shareable object rather than a screenshot.

```
┌─────────────────────────────────────────────────┐
│ ░░░░ STATUS BAR ░░░░░░░░░░░░░░░░░░░░░░░░░ 9:41 │
├─────────────────────────────────────────────────┤
│  COMMUNITY                    [🔍]   [✎]        │  56px APP BAR
├─────────────────────────────────────────────────┤
│  [ Following ]  [ Nearby ]  [ Routes ]          │  44px SEGMENTED
├─────────────────────────────────────────────────┤  (underline indicator)
│  ◉  ◉  ◉  ◉  ◉  ◉   ← live/riding-now stories   │  88px STORY RAIL
│  You Bib Nis Pra ...    (green ring = riding)   │  (horizontal scroll)
├─────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────┐ │
│ │ ◉ Sushila Gurung · Pokhara · 2h    [+][⋮]  │ │  64px  HEADER
│ │   RE Himalayan 450 · 1,240 km this month    │ │
│ ├─────────────────────────────────────────────┤ │
│ │                                             │ │
│ │        ╳  M E D I A   4:5  ╳                │ │  ~470px MEDIA
│ │                                             │ │  (aspect-locked)
│ │                                    [1/3]    │ │
│ ├─────────────────────────────────────────────┤ │
│ │ ▭▭▭ route strip: Beni → Jomsom          ⬇  │ │  96px  ROUTE
│ │ 68 km · 142 bends · ↑1,240m · SUPERCURVY   │ │  ATTACHMENT ⭐
│ ├─────────────────────────────────────────────┤ │
│ │ Beni to Jomsom before the wind picks up.    │ │  BODY (3-line
│ │ Second gear the whole way. #Mustang         │ │  clamp) ~72px
│ ├─────────────────────────────────────────────┤ │
│ │  ♥ 248    💬 31    ↗ Share    ⬇ Save    🔖 │ │  56px ACTIONS
│ └─────────────────────────────────────────────┘ │
│                    12px gap                     │
│ ┌─────────────────────────────────────────────┐ │
│ │ next card…                                  │ │
├─────────────────────────────────────────────────┤
│  🗺   🧭   ⬤   👥   👤                          │
└─────────────────────────────────────────────────┘
```

### Layout rules
- **Card width = full bleed minus 16 px margins**, radius 16 px. Vertical gap 12 px.
- **One card ≈ one screen.** A single post should roughly fill the viewport so the feed feels
  considered, not infinite-scroll slot-machine.
- **The route strip is the differentiator** — it must appear above the caption, not buried in
  the actions, because "what road is this?" is the first question a rider asks.
- Media never exceeds 4:5 (portrait) so the action row stays above the fold.
- FAB composer (`✎`) lives in the app bar, not floating, to avoid competing with the SOS FAB.

### States to wireframe (7 frames)
1. Loading — 3 skeleton cards.
2. Populated — mixed card types (photo / video / route / text / check-in).
3. Offline — cached posts with an amber banner; composer shows "will post when online".
4. Empty (new user) — "Follow riders near Kathmandu" with suggested-rider chips.
5. Composer — media picker, route attach, tags, audience selector.
6. Post detail — full media, full caption, comment thread, comment composer docked.
7. Routes sub-tab — a grid/list of shared routes with filter chips (district, curviness, distance, surface).

---

## 6.4 SCREEN 4 — Emergency SOS Console

**Purpose:** Tell the truth about connectivity, then let an injured, gloved, panicking rider
call for help in one deliberate gesture.

```
┌─────────────────────────────────────────────────┐
│ ░░░░ STATUS BAR ░░░░░░░░░░░░░░░░░░░░░░░░░ 9:41 │
├─────────────────────────────────────────────────┤
│  [←]         EMERGENCY               [⚙]        │  56px APP BAR
├─────────────────────────────────────────────────┤
│                                                 │
│  CONNECTION STATUS                              │  overline
│ ┌─────────────────────────────────────────────┐ │
│ │ 📶 Cellular    ✖ NO SERVICE      41 min ago │ │  56px each
│ │ 🛰 GPS         ✔ LOCKED ±6m      28.78°N…   │ │  SIGNAL MATRIX
│ │ 📡 Mesh        ✔ 3 PEERS         1.5 km     │ │  ⭐ the honesty
│ │ 🛰 Satellite   ✖ NOT PAIRED      [Pair]     │ │  panel — 224px
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ MODE: OFFLINE MESH                          │ │  64px MODE CARD
│ │ Cellular unavailable — using rider mesh     │ │  (auto-selected,
│ │                              [change ⌄]     │ │   overridable)
│ └─────────────────────────────────────────────┘ │
│                                                 │
│                                                 │
│              ┌───────────────┐                  │
│              │               │                  │  TRIGGER ZONE
│              │      ⬤        │                  │  88px button,
│              │     SOS       │                  │  centred, sits
│              │               │                  │  at ~62% height
│              └───────────────┘                  │  (thumb arc)
│           HOLD 3 SECONDS TO SEND                │
│                                                 │
│                                                 │
│ ┌─────────────────┐   ┌─────────────────┐       │  SECONDARY 64px
│ │  🎙 WALKIE      │   │  ⚠ I'M STOPPED  │       │  (non-emergency
│ └─────────────────┘   └─────────────────┘       │   alternatives)
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ MY EMERGENCY CARD                     [edit]│ │  88px MEDICAL
│ │ Aayush Thapa · O+ · Allergy: penicillin     │ │  CARD
│ │ Contacts: Ama (+977…) · Bibek (+977…)       │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│  Nepal Police 100 · Ambulance 102 · Tourist 1144│  32px DIRECTORY
├─────────────────────────────────────────────────┤
│  🗺   🧭   ⬤   👥   👤                          │
└─────────────────────────────────────────────────┘
```

### Layout rules
- **No map on this screen.** It burns battery and attention. Coordinates are shown as text.
- **The Signal Matrix sits above the trigger** — the rider learns *which channel will carry
  their call* before they make it. This is the single most trust-building element in the app.
- The trigger is **centred horizontally** (reachable with either hand — the rider may have an
  injured arm) and vertically placed in the easy thumb zone.
- Secondary actions are visually quieter and physically separated by ≥ 32 px so a panicked
  thumb cannot hit them by accident.
- The screen is fully functional with **zero network**.

### States to wireframe (8 frames)
1. Nominal (cellular OK) — mode = `ONLINE`, matrix all green.
2. Degraded (no cellular, mesh OK) — the canonical frame above.
3. Fully isolated (no cellular, no mesh, GPS only) — advisory copy + breadcrumb option.
4. Long-press in progress — ring at ~60 %, countdown `2`.
5. 10-second cancel window.
6. SOS Active / broadcasting — transmission ladder + responder list.
7. Responder view — incoming alert (this is a *different rider's* screen; wireframe it, it's half the feature).
8. Stand-down + incident report.

---

## 6.5 Additional Lo-Fi Screens (second wave, 12 frames)

| # | Screen | Why it matters |
|---|---|---|
| 5 | Offline Maps Manager (region browser + queue + storage) | Core promise; complex enough to need structure early |
| 6 | Squad Live Map (multi-rider tracking) | Proves the Rider Card + map-bubble system |
| 7 | Group Detail (members, chat, planned trips) | Coordination hub |
| 8 | Ride Summary / post-ride | The share loop that drives growth |
| 9 | Onboarding — permission primers | Location "Always" is the hardest consent in the app |
| 10 | Profile & Garage | Identity and credibility |
| 11 | Composer (post creation) | Feed input side |
| 12 | Settings — Safety (crash detection, SOS cadence, contacts) | Configures the safety-critical system |
| 13 | Mesh Console / Walkie-talkie | The offline peer view |
| 14 | Pre-ride Checklist | The Nepal-specific readiness gate |
| 15 | Search / Destination results (offline variant) | Offline parity proof |
| 16 | Notifications / Activity | Standard, but needs a home |

---

## 6.6 Wireframe Validation Protocol

Before any pixel of colour is applied, each lo-fi screen must pass:

| Test | Method | Pass condition |
|---|---|---|
| **Blur test** | 4 px Gaussian on the frame | Primary action still identifiable in < 1 s |
| **Thumb test** | Overlay the reach guides | 100 % of in-ride actions in the "Easy" zone |
| **Squint test** | Squint at 50 cm | Visual hierarchy reads in 3 clear tiers |
| **Glove test** | 56 px circle stamps on every in-ride target | No overlaps, no near-misses |
| **Content stress** | Longest realistic Nepali strings (e.g. "साङ्खुवासभा जिल्ला, खाँदबारी") | No truncation of critical data, no layout break |
| **Offline test** | Every screen re-drawn with no network | No dead ends, no blank screens |
| **5-second test** | Show a frame for 5 s, ask "what can you do here?" | ≥ 4 of 5 testers correct |

**Recommended testing group:** 6–8 real riders recruited from Kathmandu riding groups; test on
their own phones, outdoors, in daylight, wearing gloves.

---

## 6.7 Deliverables Checklist — Phase 6

- [ ] 4 core screens × all listed states = **30 lo-fi frames**.
- [ ] 12 second-wave screens = ~24 additional frames.
- [ ] Thumb-zone, blur-test and glove-test overlay frames.
- [ ] A clickable lo-fi prototype covering Flow A and Flow B end-to-end.
- [ ] Annotation layer on every frame (magenta, numbered).
- [ ] Content-stress frames with real Nepali strings.
- [ ] Written findings from the 5-second test with 6–8 riders.
