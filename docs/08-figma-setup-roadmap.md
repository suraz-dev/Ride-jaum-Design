# PHASE 8 — Figma Project Setup & Step-by-Step Strategy Plan

---

## 8.1 Figma File & Page Structure

### 8.1.1 Team / Project hierarchy

```
📁 RideJaunm (Figma Team)
│
├── 📂 00 · Brand & Research
│   ├── 🗂 RideJaunm — Research & Discovery      (FigJam)
│   ├── 🗂 RideJaunm — Moodboard & Competitive   (Figma)
│   └── 🗂 RideJaunm — User Flows                (FigJam)
│
├── 📂 01 · Design System
│   └── 🗂 RideJaunm — Design System  ⭐ PUBLISHED LIBRARY
│
├── 📂 02 · Product Design
│   ├── 🗂 RideJaunm — Core App (Ride · Plan · Squad · Profile)
│   ├── 🗂 RideJaunm — Safety & SOS   ⭐ separate file, separate review gate
│   └── 🗂 RideJaunm — Onboarding & Auth
│
├── 📂 03 · Prototypes
│   └── 🗂 RideJaunm — Prototypes & Motion
│
└── 📂 04 · Handoff & Archive
    ├── 🗂 RideJaunm — Dev Handoff
    └── 🗂 RideJaunm — Archive (deprecated explorations)
```

> **Why SOS lives in its own file:** it is safety-critical. Separate file = separate permissions,
> separate version history, separate sign-off, and no risk of a stray edit during a feed redesign.

### 8.1.2 Page sidebar structure (apply to the main product file)

This is the exact sidebar, in order, with emoji prefixes for scan-ability:

```
ℹ️  Cover & Specs
─────────────────────────────
🎨  Design System (Tokens)
🧩  Atoms & Components
🎛️  Complex Modules
─────────────────────────────
🖼️  Moodboard & Assets
✏️  Lo-Fi Wireframes
✨  Hi-Fi Screens
📱  Prototypes
─────────────────────────────
🚧  WIP / Scratch
🗄️  Archive
```

**Page-by-page contents:**

| Page | Contents | Owner |
|---|---|---|
| **ℹ️ Cover & Specs** | Cover art (1600×960 thumbnail), positioning statement, taglines, brand personality sliders, anti-patterns frame, voice & tone matrix, version history table, changelog, links (this repo, Jira/Linear, research drive, Rive files), team roster + contact, "how to use this file" instructions. | Design lead |
| **🎨 Design System (Tokens)** | Colour variables (4 modes), type styles + specimen + blur test, spacing & radius scales, effect styles (elevation/glass/glow/scrim), grid definitions, motion tokens, icon grid rules, accessibility audit frames (contrast / colour-blind / glare), the Nepal terrain palette board. | Design systems |
| **🧩 Atoms & Components** | All ~26 atoms from Phase 4.1, each with a playground frame showing every variant × state, plus a usage/anti-usage doc block. | Design systems |
| **🎛️ Complex Modules** | All ~18 molecules from Phase 4.2: Telemetry HUD, Rider Card, Feed Card, Map Controls, sheets, widgets (elevation, curvature, mesh topology), banners, nav bars. | Design systems |
| **🖼️ Moodboard & Assets** | Sections A–F from Phase 1.3 (~120 captioned references), the three Direction Boards + vote result, licensed photography, icon package, logo lockups, export-ready brand assets. | Brand / research |
| **✏️ Lo-Fi Wireframes** | Sections per flow: `Onboarding`, `Ride`, `Plan`, `Squad`, `SOS`, `Profile`. ~54 frames. Magenta annotation layer. Validation-protocol frames (blur/thumb/glove/content-stress). | UX |
| **✨ Hi-Fi Screens** | Same section structure as lo-fi, one section per feature area. Each section contains: hero frames (Night mode), a `▸ Modes` sub-section (Day-Glare / Dusk / Blackout), and a `▸ States` sub-section (loading/empty/error/offline). | UI |
| **📱 Prototypes** | Flow A (group + supercurvy), Flow B (offline SOS), onboarding, feed browse, offline download. Micro-interaction sandboxes for MI-1/2/3. Device-frame presentation setups for stakeholder review. | UX + motion |
| **🚧 WIP / Scratch** | Explicitly unreviewed. Anything here is deniable. Cleared every sprint. | Everyone |
| **🗄️ Archive** | Dated, labelled dead ends with a one-line "why we killed it". Never delete history — future you will re-propose the same bad idea. | Design lead |

### 8.1.3 Frame, section & layer conventions

**Frame naming**
```
[Type]-[##]-[Feature]-[Screen]-[State]

LF-01-Ride-MapHome-GPSAcquiring
HF-01-Ride-MapHome-Night
HF-01-Ride-MapHome-DayGlare
HF-14-SOS-Console-MeshOnly
CMP-Button-SOS-Playground
```

**Section colours (Figma sections support colour)**
| Colour | Meaning |
|---|---|
| ⚪ Grey | Not started |
| 🔵 Blue | In progress |
| 🟡 Yellow | In review |
| 🟢 Green | Approved / ready for dev |
| 🔴 Red | Blocked or deprecated |

**Status stamps** — a `Doc/StatusStamp` component placed top-left of every frame:
`DRAFT` · `IN REVIEW` · `APPROVED` · `IN DEV` · `SHIPPED` · `DEPRECATED`, each with an owner
avatar and a date.

**Branching & versioning**
- Use **Figma branches** for any change to the Design System file. Branch naming:
  `ds/add-mesh-widget`, `fix/button-sos-contrast`.
- Semantic versioning on library publishes: `v1.4.0 — added Mesh Topology widget`.
- Named versions in history at every milestone (`M1 — Foundations locked`).
- Never edit the published library directly on a Friday. (Yes, this is a real rule.)

**Permissions**
| Role | Access |
|---|---|
| Design leads | Edit all |
| Designers | Edit product files, branch-only on Design System |
| Engineers | View + Dev Mode on all, comment |
| PM / stakeholders | View + comment on Product + Prototypes only |
| SOS file | Edit restricted to design lead + safety reviewer |

**Dev Mode readiness**
- Mark every approved section **Ready for Dev**.
- Variable names must match the code token names exactly (`color/action/primary`, not `Volt 400`).
- Attach a `Doc/Spec` annotation block to each screen: behaviour notes, edge cases, analytics
  events, API dependencies, offline behaviour.
- Publish tokens via the Figma REST API / Tokens Studio → `tokens/build/` in this repository.

### 8.1.4 Recommended plugins

| Plugin | Purpose |
|---|---|
| **Stark** | Contrast + colour-blindness simulation (mandatory in the ship gate) |
| **Tokens Studio** | Token management + Git sync to this repo |
| **Mapsicle / Mapbox** | Real map imagery inside frames |
| **Content Reel / Google Sheets Sync** | Real Nepali names, places, distances |
| **Rive / LottieFiles** | Micro-interaction embedding |
| **Similayer** | Bulk-select layers by property (essential during the token migration pass) |
| **Batch Styler** | Mass-edit text/colour styles |
| **Autoflow** | Flow arrows in FigJam |
| **Figma to Code / Dev Mode** | Handoff |
| **Instance Finder** | Detect detached instances before review |

---

## 8.2 Actionable Roadmap

**Assumptions:** 1 design lead + 1 product designer (+ part-time researcher/motion), a 10-week
runway to a dev-ready v1 design, 2-week sprints. Adjust durations, not order.

### 🥇 FIRST — Weeks 1–3 · FOUNDATIONS (nothing ships without these)

> **Goal:** a published, tokenised design system and validated structure. **Do not design a
> single hi-fi screen in this window.** Every day you delay the token layer multiplies the
> retrofit cost later.

| Order | Task | Output | Days |
|---|---|---|---|
| 1 | Set up team, files, page structure, permissions, naming conventions | Empty but perfectly organised workspace | 0.5 |
| 2 | Competitive audit + moodboard Sections A–F | ~120 captioned refs, 3 Direction Boards, vote | 4 |
| 3 | **Rider research** — interview 8–10 Nepali riders (Kathmandu groups, a Mustang tour operator, one crash survivor) | Insight deck, 3 personas, 1 journey map, **verified dead-zone reality** | 4 |
| 4 | Brand direction lock: positioning, voice, anti-patterns → Cover page | Cover page complete | 1 |
| 5 | **Colour variables** — all primitives + semantic aliases + 4 modes | `color` variable collection published | 2 |
| 6 | **Type styles** — 24 Latin + 7 Devanagari + specimen + blur test | Text styles published | 1.5 |
| 7 | Spacing, radius, elevation, glass, glow, motion tokens | Effect + number variable collections | 1 |
| 8 | Accessibility audit frames (contrast / colour-blind / glare) | 3 audit frames, all passing | 1 |
| 9 | Icon system decision + custom glyph list scoped | Phosphor imported, 18 custom icons briefed | 1 |
| 10 | **Publish Design System v1.0.0** | Library live, consumed by product files | 0.5 |

**🚦 Gate 1 (end of week 3):** the design system file publishes cleanly; a test screen built
purely from tokens renders correctly in all 4 modes. *If not, do not proceed.*

---

### 🥈 SECOND — Weeks 4–6 · STRUCTURE & COMPONENTS

> **Goal:** every atom and molecule exists, and the whole product is wireframed and
> rider-validated in greyscale.

| Order | Task | Output | Days |
|---|---|---|---|
| 11 | Atoms: Icon, Avatar, Badge, StatusPill, Divider, Spinner, ProgressRing/Bar | 8 components | 2 |
| 12 | **Button family** — Primary → Secondary → Tertiary → Icon → FAB → **SOS** → PTT | 7 components; SOS reviewed separately | 2 |
| 13 | Inputs + **Control/RouteMode** (the signature control) + toggles/chips/checkboxes | 9 components | 2.5 |
| 14 | SignalBars, BatteryPill, Toast, Banner, EmptyState, Skeleton, Tooltip | 7 components | 1.5 |
| 15 | Sheets, NavBar, AppBar, Modal | 4 components | 1 |
| 16 | **IA + sitemap + both critical flows in FigJam** | Sitemap, Flow A, Flow B, offline-state matrix | 2 |
| 17 | **Lo-fi: 4 core screens × all states** (30 frames) | Screens 1–4 wireframed | 3 |
| 18 | Lo-fi: second-wave 12 screens (24 frames) | Full product wireframed | 3 |
| 19 | Validation protocol: blur / thumb / glove / squint / content-stress | 5 audit overlays | 1 |
| 20 | **Rider test round 1** — clickable lo-fi prototype with 6–8 riders, outdoors, gloved | Findings doc + prioritised fixes | 2 |
| 21 | Molecules: Telemetry HUD → Rider Card → Feed Card → Map Controls | 4 hero molecules | 3 |
| 22 | Widgets: Elevation profile, Curvature meter, Mesh topology, Signal matrix | 4 widgets | 2 |
| 23 | **Publish Design System v1.1.0** | Full component library live | 0.5 |

**🚦 Gate 2 (end of week 6):** every lo-fi screen is built from real component instances;
rider test round 1 findings are triaged; no structural questions remain open.

---

### 🥉 THIRD — Weeks 7–10 · HI-FI, MOTION & HANDOFF

> **Goal:** a polished, stress-tested, dev-ready design in four theme modes, with prototypes
> that prove the two flows that matter.

| Order | Task | Output | Days |
|---|---|---|---|
| 24 | **Hi-fi Screen 1 — Map Home / HUD** (the hardest; solve glass-over-map here and everything else inherits it) | 1 screen × 4 modes × 7 states | 3 |
| 25 | **Hi-fi Screen 4 — SOS Console + Active + Responder** (do safety early, while energy is high) | 8 frames + separate safety review | 3 |
| 26 | **Hi-fi Screen 2 — Trip Planner** incl. all three route renderings | 8 frames | 2.5 |
| 27 | **Hi-fi Screen 3 — Community Feed** + composer + detail | 7 frames | 2 |
| 28 | Hi-fi second wave: offline maps, squad live map, group detail, ride summary, onboarding, profile, settings | ~20 frames | 5 |
| 29 | Custom icon set (18 glyphs) + illustrations for 6 empty states | Icon + illustration packs | 2 |
| 30 | **MI-1 GPS Lock Ripple** (Rive) | Prototype + exported video | 1 |
| 31 | **MI-2 SOS Commitment Ring** (Rive) | Prototype + exported video | 1 |
| 32 | **MI-3 Offline Tile Materialisation** (Rive) | Prototype + exported video | 1.5 |
| 33 | MI-4…MI-7 secondary motion | Smart Animate prototypes | 1.5 |
| 34 | **Clickable prototypes: Flow A + Flow B end-to-end** | 2 presentable prototypes | 2 |
| 35 | Full stress board: contrast, colour-blind, glare, Dynamic Type 200 %, longest Nepali strings, all 4 modes | Audit page, all passing | 1.5 |
| 36 | **Rider test round 2** — hi-fi prototype, outdoors, on a real bike (stationary), with gloves | Findings + fixes | 2 |
| 37 | Dev Mode prep: annotations, spec blocks, edge cases, analytics events, token export to repo | Handoff file ready | 2 |
| 38 | **Publish Design System v2.0.0 + design QA checklist for engineering** | Signed-off v1 design | 1 |

**🚦 Gate 3 (end of week 10):** an engineer can build any screen from Dev Mode without asking a
clarifying question; the SOS flow has a written safety sign-off; both prototypes run start-to-finish.

---

### Post-v1 (weeks 11+)

| Priority | Item |
|---|---|
| P0 | Design QA during implementation — sit with engineering, review builds on real devices in real sun |
| P0 | Localisation pass: full Nepali UI review with a native copywriter (not machine translation) |
| P1 | Tablet / large-screen layouts; handlebar-mount landscape HUD |
| P1 | Wear OS / watch companion (SOS trigger + turn prompts on the wrist) |
| P1 | Helmet-intercom (Cardo/Sena) integration UI |
| P2 | Dark-sky "astro mode" for night touring; heated-grip / bike-telemetry integrations |
| P2 | Marketplace: mechanics, homestays, fuel stops along a route |
| P2 | Route marketplace / creator profiles for tour operators |

---

### Anti-patterns to avoid on this roadmap

| ❌ Don't | ✅ Do |
|---|---|
| Design hi-fi screens before the token layer exists | Foundations first, always |
| Build the Feed before the HUD | The map is the product; social is retention |
| Treat SOS as "one more screen" | It's a subsystem with its own file, review and sign-off |
| Test only in an office | Test outdoors, in sun, with gloves, on the tester's own phone |
| Use lorem ipsum and stock photos | Real Nepali names, real roads, real riders |
| Design only the happy path | Offline, error and degraded states are the actual product here |
| Let the component library drift from production | Weekly parity check; version the library |
| Add red anywhere decorative | Red = SOS. Nothing else. |

---

## 8.3 Definition of Done (per screen)

A screen is done when **all** of the following are true:

1. Built entirely from published component instances (zero detached layers).
2. All colours bound to semantic variables; all text uses published styles.
3. Renders correctly in Night, Day-Glare, Dusk and Blackout modes.
4. Loading, empty, error and **offline** states designed.
5. Passes contrast (body 4.5:1 / telemetry 7:1 / SOS 10:1) and colour-blind simulation.
6. Passes the glare test (40 % brightness) and the 4 px blur test.
7. All in-ride targets ≥ 56 px, verified with the glove overlay.
8. Real Nepali content, longest-string tested, Devanagari verified.
9. Annotated with behaviour notes, edge cases and analytics events.
10. Marked **Ready for Dev** with an owner and a date on the status stamp.

---

## 8.4 Deliverables Checklist — Phase 8

- [ ] Figma team, 4 projects, 8 files created with the exact page structure above.
- [ ] Naming conventions, section colours and status stamps in use.
- [ ] Permissions configured (SOS file restricted).
- [ ] Branching + semantic-versioning policy documented on the cover page.
- [ ] Plugin set installed team-wide.
- [ ] Roadmap loaded into Linear/Jira with the three gates as milestones.
- [ ] Definition of Done pinned on the cover page.
