# PHASE 4 — Component Design Architecture (Figma Design System)

> Methodology: **Atomic Design + Figma Variables + Component Properties.**
> Rule: a component is only "done" when it has (a) all variants, (b) all states, (c) bound
> semantic variables (no raw hex), (d) Auto Layout that survives 200 % Dynamic Type, and
> (e) a documented usage/anti-usage note.

---

## 4.0 Naming, Structure & Conventions

### Component naming
```
[Category]/[Component]/[Variant]
e.g.  Button/Primary/Large
      Card/Telemetry/Compact
      Control/RouteMode/Supercurvy-Selected
```

### Mandatory Component Properties (Figma)
| Property | Type | Applies to |
|---|---|---|
| `state` | Variant | default · hover · pressed · focused · disabled · loading |
| `size` | Variant | sm (40) · md (48) · lg (56) · xl (64) |
| `theme` | Variant / Mode | night · day-glare · dusk · blackout |
| `icon-left` / `icon-right` | Boolean + Instance Swap | all buttons, inputs, rows |
| `label` | Text | all |
| `badge` | Boolean | nav items, cards |

### Sizing & grid law
- Base unit **4 px**. Component heights: 32 / 40 / 48 / 56 / 64.
- **Minimum tap target 48 × 48 px.** In-ride target **56 × 56 px**. SOS trigger **88 × 88 px**.
- Corner radii scale: `r-xs 4` · `r-sm 8` · `r-md 12` · `r-lg 16` · `r-xl 20` · `r-2xl 28` · `r-full 999`.
- Icon grid **24 px**, 2 px stroke (Phosphor). Large HUD icons 32 px, 2.5 px stroke.

### Layer hygiene
- Every component wrapped in Auto Layout with explicit padding tokens.
- All fills/strokes/text bound to **semantic variable aliases**.
- `.private/` prefix for sub-parts not meant for direct instancing.
- Every published component has a description + a link to its spec section here.

---

## 4.1 ATOMIC COMPONENTS (`🧩 Atoms & Components` page)

### 4.1.1 Buttons

#### `Button/Primary`
| Prop | Spec |
|---|---|
| Fill | `grad-volt` (`#B4FF39` → `#7FC40E`, 135°) |
| Label | `graphite-900`, `body-md-em` (15/600) — never white |
| Height | sm 40 · md 48 · **lg 56 (default in-ride)** · xl 64 |
| Radius | `r-md 12` (sm/md), `r-lg 16` (lg/xl) |
| Padding | 20 px horizontal (sm) → 28 px (xl); icon gap 8 px |
| States | default · hover (`volt-300`) · pressed (`volt-500`, scale 0.97, 60 ms) · focused (2 px `volt-a24` ring, 2 px offset) · **loading** (label swaps to 20 px spinner, width locked) · disabled (`graphite-600` fill, `graphite-400` label, no shadow) |
| Shadow | `glow-volt` at lg/xl only |
| Widths | hug · fill-container · fixed |

#### `Button/Secondary`
Transparent fill, 1.5 px `graphite-500` border, `graphite-050` label. Hover → border
`volt-400`, label `volt-400`. Same size/state matrix. Day-Glare mode → border 2 px.

#### `Button/Tertiary` (Ghost)
No fill, no border, `graphite-200` label, `volt-400` on hover. For low-priority inline actions.

#### `Button/Destructive`
`danger-400 #F2603C` outline (not filled — filled red is reserved). Filled variant only inside
a confirmation modal, and it uses `danger-400`, **never** `sos-500`.

#### `Button/Icon`
| Variant | Spec |
|---|---|
| `ghost` | 48×48, `r-full`, no fill, 24 px icon `graphite-200` |
| `filled` | 48×48, `graphite-800` fill, 1 px `graphite-600` border |
| `glass` | 48×48, `glass-map` (blur 24), for map overlay controls |
| `accent` | 56×56, `volt-400` fill, `graphite-900` icon |
Sizes 40 / 48 / **56 (map overlay default)** / 64. Optional 8 px badge dot, top-right.

#### `Button/FAB` — Start Ride
64×64 (expands to 180×64 pill on scroll-up), `volt-400`, `glow-volt`, `r-full`.
Long-press → radial menu (Quick Ride · Plan Trip · Join Squad).

#### `Button/SOS` ⚠️ SAFETY-CRITICAL COMPONENT
The single most important component in the system. Spec it obsessively.

| Aspect | Spec |
|---|---|
| Geometry | 88 × 88 px circle (`r-full`), 4 px `sos-600` ring, 12 px `graphite-900` outer separation ring so it can never be visually confused with a neighbouring control |
| Fill | `grad-sos` radial (`#FF4D64` → `#B00A20`) |
| Content | `SOS` in Space Grotesk 700 / 24 px / `snow-000`, +0.06 em tracking; 20 px siren glyph above |
| **Idle** | Slow breathing glow: `glow-sos` opacity 0.35 → 0.55 → 0.35 over 2.4 s (disabled under Reduce Motion) |
| **Long-press (3.0 s)** | Conic-gradient progress ring fills clockwise, `snow-000` over `sos-900`. Live countdown `3 · 2 · 1` in `tel-xl`. Haptic: light tick at 0 s, medium at 1 s, medium at 2 s, **heavy at 3 s**. Audio: rising 3-tone chirp. |
| **Release before 3 s** | Ring unwinds in 240 ms, subtle "cancelled" haptic, toast: *"SOS cancelled."* |
| **Armed (fired)** | Full-screen takeover, `sos-900` background wash, 2× expanding pulse rings @1.2 s, persistent header `SOS ACTIVE`, 10-second **"Cancel SOS"** window with its own countdown |
| **Broadcasting** | Header bar becomes a persistent `sos-500` strip across every screen with `● SOS ACTIVE · 04:12` timer; cannot be dismissed, only stood down via a 3 s long-press on `Stand Down` |
| Placement rules | Always bottom-right of the HUD in the thumb arc; **never** within 24 px of any other tappable element; never inside a scrolling container; present on Map, Squad and SOS tabs; reachable in ≤ 2 taps from anywhere |
| Accessibility | `accessibilityLabel="Emergency SOS. Press and hold three seconds."`, `accessibilityTraits: button`, exempt from Reduce Motion for its progress ring (safety feedback), works with VoiceOver double-tap-and-hold |
| Anti-patterns | ❌ never a single tap · ❌ never swipe-to-activate (wet gloves fail) · ❌ never edge-adjacent (palm rejection) · ❌ never themed away in Blackout mode |

#### `Button/PTT` (Push-To-Talk, offline walkie-talkie)
72 × 72 px, `cyan-400` fill when idle, `success-400` while transmitting with a live 5-bar
amplitude ring. Press-and-hold semantics (no toggle). Shows peer count badge. Releases with a
"over" beep.

---

### 4.1.2 Input Fields

#### `Input/Search-Destination`
| Aspect | Spec |
|---|---|
| Height | 56 px · radius `r-lg 16` · fill `graphite-800` · 1 px `graphite-600` border |
| Leading | 24 px search icon; swaps to a 20 px spinner while geocoding |
| Trailing | Clear (✖), Voice (🎙), Map-pin picker — max 2 shown |
| Placeholder | `"Where to? Try Muktinath"` — `body-md`, `graphite-400` |
| Focus | Border `volt-400` 2 px + `volt-a12` glow; keyboard-avoiding sheet lifts |
| **Offline variant** | Border `warning-400`, helper: *"Searching downloaded maps only"*, offline glyph in the leading slot |
| Results dropdown | `elev-3`, max 5 rows, each row = icon + name + district + distance + `⬇ offline` badge if cached |
| Nepali input | Devanagari-aware, transliteration hints (`muktinath → मुक्तिनाथ`), fuzzy match on common romanisations (Pokhara/Pokhra) |

#### `Input/Text`
40 / 48 / 56 heights, floating label (`caption` when raised), helper text row, character counter,
error state (`danger-400` border + icon + message), success state (`success-400` check).

#### `Input/Textarea-Post` (community composer)
Min 120 px, auto-grows to 320 px then scrolls. Bottom toolbar: 📷 photo · 🎬 video · 🗺 attach
route · 📍 location · #️⃣ tag. Character counter appears at 80 % of 2,200. Draft auto-save
indicator (`caption`, `graphite-400`). Offline → *"Will post when you're back online"* with a
queued badge.

#### `Input/Stepper`, `Input/Slider`, `Input/DateTime`
- Stepper: waypoint count, group size. 48 px targets, tabular numerals.
- Slider: curviness intensity, avoid-elevation threshold, download radius. Volt-filled track,
  28 px thumb, live value bubble, haptic detent every 10 %.
- DateTime: trip start scheduling, wheel picker, Nepali (Bikram Sambat) date **display toggle**.

---

### 4.1.3 Selection Controls

#### `Control/RouteMode` — the 3-way Straight / Curvy / Supercurvy switch ⭐ signature component
| Aspect | Spec |
|---|---|
| Container | 100 % width × 64 px, `graphite-800` fill, `r-2xl 28`, 4 px inner padding, 1 px `graphite-600` border |
| Segments | 3 equal, each 56 px tall, `r-2xl 24` |
| Indicator | Animated pill that slides on a 320 ms spring (stiffness 260, damping 24); fill = the selected mode's colour; carries `glow-*` of that mode |
| Segment content | 24 px icon (arrow-straight / wave-single / wave-double) **above** an 11 px caps label — icon+label is the redundant coding channel |
| Selected | Label `graphite-900` @700 (on volt/cyan) or `snow-000` (on magenta); icon filled |
| Unselected | `graphite-300` label @600, outline icon |
| Interaction | Tap any segment; **also swipeable** horizontally (glove-friendly); haptic `selection` on change; the map route re-draws with a 400 ms morph |
| Metadata row | Below the switch, a live stat strip updates per mode: `68 km · 2h 40m · 142 bends · ↑1,240 m` |
| Sizes | `full` (planner), `compact` 40 px (HUD chip, icon-only), `list` (stacked rows with descriptions, used in onboarding) |
| A11y | Rendered as a radiogroup; each segment announces `"Supercurvy route, 142 bends, 2 hours 40 minutes, option 3 of 3"` |

#### `Control/Toggle`
52 × 32, `r-full`. Off = `graphite-600` track / `graphite-300` knob. On = `volt-400` track /
`graphite-900` knob + 100 ms knob-scale bounce. Disabled = 38 % opacity.

#### `Control/Checkbox` & `Control/Radio`
24 px box (`r-xs 4`) / 24 px circle. Unchecked = 2 px `graphite-500` border. Checked =
`volt-400` fill + `graphite-900` glyph with a 160 ms draw-on animation. Indeterminate dash state.
48 px tap target via a transparent Auto-Layout padding wrapper.

#### `Control/Chip` (filter / tag)
32 px tall, `r-full`, `graphite-700` fill. Selected = `volt-a12` fill + `volt-400` border +
`volt-400` label. Optional leading icon, optional trailing ✖ for removable tags.
Used for: feed filters (All / Following / Nearby / Routes), surface filters (Paved / Gravel),
difficulty tags, Nepali region tags.

#### `Control/SegmentedTabs`
Generic 2–4 segment control for sub-navigation (Feed: `Following | Nearby | Routes`).
Underline indicator variant (not pill) to distinguish it from `Control/RouteMode`.

---

### 4.1.4 Remaining Atoms (build these too)

| Atom | Notes |
|---|---|
| `Avatar` | 24/32/40/56/72 px; ring colour = prayer-flag slot; status dot (online/riding/offline/SOS); fallback initials `micro`; "riding" state adds a subtle rotating dashed ring |
| `Badge` | dot (8 px) · count (16 px, `r-full`) · label (20 px pill). Variants: neutral/success/warning/danger/sos/volt |
| `StatusPill` | `LIVE` · `OFFLINE` · `MESH` · `GPS ±4m` · `RECORDING` — 24 px, `caption-caps`, always icon + text |
| `Divider` | 1 px `graphite-600`; inset (16) · full-bleed · with-label variants |
| `Icon` | 24 px Phosphor base; wrapper with size + colour + weight (regular/bold/fill) props |
| `Spinner` | 16/20/24/32; `volt-400` arc, 900 ms rotation |
| `ProgressBar` | 6 px `r-full`; determinate + indeterminate + segmented (multi-tile download) |
| `ProgressRing` | 40/56/88 px; used by SOS long-press, download tiles, mesh scan |
| `SignalBars` | 4-bar cellular + 5-bar mesh; each bar independently coloured; `--` state for none |
| `BatteryPill` | Icon + % + tabular numerals; `warning-400` < 20 %, `danger-400` < 10 % |
| `Tooltip` / `Coachmark` | `elev-3`, arrow, max 240 px wide, dismiss on tap-outside |
| `Toast` / `Snackbar` | 56 px, `elev-3`, icon + text + optional action; queued, max 1 visible, 4 s dismiss; SOS toasts never auto-dismiss |
| `Skeleton` | Shimmer at 1,400 ms, `graphite-800` → `graphite-700` |
| `EmptyState` | Illustration slot + `h3` + `body-md` + primary CTA; 6 named instances (no rides, no posts, no offline maps, no squad, no results, no signal) |
| `NavBar/Bottom` | 5 tabs; 64 px + safe area; blur `glass-map`; active = volt icon-fill + 4 px top indicator |
| `AppBar/Top` | 56 px; transparent-over-map variant with `scrim-map-top` |
| `Sheet/Handle` | 40 × 4 px `graphite-500` pill, 12 px top padding |

---

## 4.2 MOLECULAR COMPONENTS (`🎛️ Complex Modules` page)

### 4.2.1 `Card/TelemetryHUD` ⭐

The instrument cluster. Three variants share one spec.

**Variant A — `Compact` (default in-ride, bottom sheet peek, 120 px tall)**
```
┌──────────────────────────────────────────────────────┐
│  ▲ 2,190 M            [ CURVY ]           ⛽ 118 KM  │  ← 32px status strip
├──────────────────────────────────────────────────────┤
│                                                      │
│     68            18.4            4:12               │  ← tel-lg, tabular
│   KM/H          KM LEFT           ETA                │  ← tel-unit
│                                                      │
└──────────────────────────────────────────────────────┘
   glass-map fill · r-2xl 28 (top corners) · elev-4
```

**Variant B — `Expanded` (sheet half-detent, 320 px)** adds:
- Elevation profile sparkline (80 px tall) with a "you are here" marker and `grad-altitude` fill
- Secondary grid: avg speed · max speed · moving time · elapsed · curves taken / total · ↑gain / ↓loss
- Next-turn instruction card (icon + distance + street name, in Devanagari when available)
- Squad mini-strip (avatars + relative distances)

**Variant C — `Blackout` (night, minimal)** — only speed (`tel-xxl`) + next-turn + SOS,
everything else `graphite-400`, chrome opacity 40 %.

| Rule | Spec |
|---|---|
| Data density | Compact = exactly 3 primary values. Never more. |
| Priority order | Speed → Distance remaining → ETA → Altitude → Fuel range |
| Numerals | `tel-*` styles with `tnum`. **Values never reflow the layout.** Reserve max-width. |
| Unit placement | Below-value (stacked) in Compact; inline-right in Expanded |
| Stale data | If GPS is > 5 s old, values dim to 50 % + a `caption-caps` `STALE` pill appears |
| No-GPS | Values show `--`, `warning-400` border, banner *"Searching for satellites…"* |
| Tap | Compact ↔ Expanded (drag the sheet); long-press a tile → swap which metric it shows |
| Configurability | User picks the 3 Compact metrics from 12 options; stored per-profile |

---

### 4.2.2 `Card/Rider` (group tracking) ⭐

Three variants.

**`List` (Squad tab, 88 px row)**
```
┌────────────────────────────────────────────────────────────┐
│ ◉  Bibek Shrestha            🔵 3.2 KM BACK        ⋮      │
│ 56 [Lungta Blue ring]        62 km/h · 2,140 m             │
│    🔋 74%   📶 ●●●○   ⏱ 12s ago                            │
└────────────────────────────────────────────────────────────┘
```
- Avatar 56 px with prayer-flag ring; ring animates (rotating dash) while the rider is moving.
- Name `h4`; relative position `tel-sm` with a direction chip (`AHEAD` / `BACK` / `HERE`).
- Live stats row: speed, altitude, battery (`BatteryPill`), signal (`SignalBars`), last-seen age.
- **Status system:** `RIDING` (green pulse) · `STOPPED` (amber, shows duration) · `OFFLINE`
  (grey, shows last-seen timestamp + last-known-location button) · `MESH-ONLY` (cyan, "via
  mesh, 1.2 km") · `SOS` (full card turns `sos-900` with a red pulsing border — overrides
  everything and sorts to the top).
- Swipe-left → Call / Message / Ping. Swipe-right → Navigate to rider.
- Tap → rider detail sheet (track history, share ETA, remove from group).

**`Map-Bubble`** — 40 px avatar in a teardrop marker, colour-coded, with a heading cone
(a 60° translucent arc showing bearing) and a name label that hides at low zoom / when clustered.

**`Compact-Strip`** — 32 px avatars in a horizontal scroller inside the HUD; distance badge
beneath each; a red-ringed avatar jumps to position 1 on SOS.

**Battery specification:** > 50 % `graphite-200` · 20–50 % `graphite-200` · < 20 % `warning-400`
+ icon change · < 10 % `danger-400` + pulse · charging = bolt glyph. A group member below 15 %
triggers a squad-wide non-intrusive notice: *"Bibek's phone is at 12 %."*

---

### 4.2.3 `Card/Feed` (community post) ⭐

```
┌──────────────────────────────────────────────────────────┐
│ ◉ Sushila Gurung  · Pokhara · 2h            [Follow] ⋮   │  ← header 64px
│   RE Himalayan 450 · 1,240 km this month                 │
├──────────────────────────────────────────────────────────┤
│                                                          │
│            [ MEDIA — 4:5 photo / 16:9 video ]            │  ← media block
│                                                          │
│  ▸ if route attached: mini-map strip 96px + stats bar    │
├──────────────────────────────────────────────────────────┤
│ Beni to Jomsom before the wind picks up. Second gear     │  ← body-lg, 3-line clamp
│ the whole way. #Mustang #Supercurvy      … more          │
├──────────────────────────────────────────────────────────┤
│ ♥ 248     💬 31     ↗ Share     ⬇ Save route      🔖     │  ← actions 56px
└──────────────────────────────────────────────────────────┘
```

| Element | Spec |
|---|---|
| Header | Avatar 40 · name `body-lg-em` · location + relative time `body-sm graphite-300` · bike + monthly-km line `caption` (this is the rider-credibility signal, and it's what makes the feed feel like *riders*, not Instagram) |
| Media | Aspect-locked containers: 1:1, 4:5, 16:9, and a 2/3/4-up grid with a `+N` overlay. Video: muted autoplay in view, tap-to-unmute, duration pill bottom-right, **data-saver mode shows a poster + play button only** |
| **Route attachment** | The differentiator. A 96 px static map strip rendering the GPX in its mode colour + a stat bar (`68 km · 142 bends · ↑1,240 m · SUPERCURVY` badge) + a `⬇ Save route` action that imports it straight into the Trip Planner |
| Body | `body-lg`, 3-line clamp, "… more" expands in place; hashtags and @mentions in `cyan-400` |
| Actions | 4 primary + overflow. 56 px row, 48 px targets. Like = heart fill + particle burst + haptic. |
| Variants | `photo` · `video` · `route` · `text-only` · `check-in` · `group-ride-recap` (auto-generated multi-rider summary) · `sos-resolved` (a somber, non-celebratory variant used when a squad shares a safety incident) |
| States | loading skeleton · media-failed · offline-queued (`warning-400` left border + `QUEUED` pill) · reported/hidden |
| Density | Compact list mode for low-data users (no media autoload) |

---

### 4.2.4 `Overlay/MapControls` ⭐

A right-edge vertical stack of 56 px `glass-map` icon buttons, 12 px gaps, anchored 24 px from
the right edge, vertically centred in the upper thumb zone.

| Control | Behaviour |
|---|---|
| **Compass** | Rotates live with map bearing. Tap → snap to north (300 ms spring). Auto-hides when bearing = 0 for > 3 s. Shows a bearing readout (`NE 042°`) in `micro-caps` on long-press. |
| **Recenter / Follow** | Tri-state: `free` (outline) → `follow` (volt-filled, centred) → `follow+heading` (volt-filled with a heading cone, map rotates with the bike). Auto-drops to `free` on user pan; a "Recenter" pill appears at the bottom to return. |
| **Layers** | Opens a sheet: base style (Satellite 3D / Terrain / Standard / Dark) + overlays (traffic, hazards, fuel, ACAP checkpoints, mesh peers, contour lines, snowline). Each overlay is a toggle row with an icon and a data-freshness caption. |
| **3D / Pitch** | Toggles 0° ↔ 60° pitch with a 600 ms eased camera animation; drag vertically to fine-tune. Shows `3D` badge when active. |
| **Offline Download** | ⬇ icon with a state machine: `available` (outline) → `queued` (dashed ring) → `downloading` (progress ring + %) → `done` (volt check) → `stale` (amber, > 30 days) → `failed` (retry). Long-press → the download manager. |
| **Zoom ± ** | Optional (default hidden; pinch preferred). Shown in an accessibility/glove mode. |
| **Scale bar + attribution** | Bottom-left, `micro`, `graphite-300`, mandatory OSM attribution. |

Positioning rule: controls occupy the **right column only**; the left column stays clear for
the next-turn card. Nothing is placed in the bottom 220 px (HUD sheet zone) or the top 100 px
(status/notch).

---

### 4.2.5 Additional Molecules

| Component | Purpose / key spec |
|---|---|
| `Sheet/BottomSheet` | 3 detents: peek 120 · half 45 % · full 92 %. Drag handle, spring physics, scrim above half. Content slot. Backdrop blur ramps with detent. |
| `Card/RouteSummary` | Mode badge, distance, duration, bends count, elevation profile, surface composition bar (paved/gravel/rough %), hazard warnings, `Start` CTA. |
| `Card/OfflineRegion` | Region name (Nepali + English), thumbnail, size (MB), zoom range, download date, freshness state, storage bar, actions (update / delete / pause). |
| `Card/Waypoint` | Drag-handle, index, name, ETA, distance-from-previous, fuel/food/photo type icon, remove ✖. Reorderable list with drop animation. |
| `Widget/ElevationProfile` | SVG chart, `grad-altitude` fill, x = distance, y = altitude, current-position marker, tap-to-scrub with a value tooltip, grade-colour coding. |
| `Widget/CurvatureMeter` | Radial gauge 0–100 "curviness score" + bend histogram; the trophy element that makes Supercurvy feel earned. |
| `Widget/MeshTopology` | Node-graph visual for offline SOS: you at centre, peers as orbiting nodes, edge thickness = link quality, hop-count labels, animated packet dots travelling the edges. |
| `Widget/SignalMatrix` | 4-row status: Cellular · GPS · Bluetooth Mesh · Satellite. Each with a bar meter, plain-language state and a last-success timestamp. |
| `Modal/Confirm` | Title, body, cancel + confirm. Destructive variant. SOS variants use full-screen takeover, not this. |
| `Nav/BottomBar` | 5 tabs (see Phase 5), 64 px + safe area, blur, badge support, centre-tab emphasis. |
| `Header/Group` | Group name, member avatars stack, live status, invite button, leave action. |
| `Row/Setting` | Icon, label, description, control slot (toggle/chevron/value), chevron. |
| `Banner/Connectivity` | Persistent slim bar: `OFFLINE — using downloaded maps` (amber) / `MESH ACTIVE — 3 riders` (cyan) / `SOS ACTIVE` (red). Stacks in priority order; SOS always wins. |

---

## 4.3 Component Build Order (dependency-correct)

```
1. Variables & styles (Phase 2 + 3 tokens)          ← blocks everything
2. Icon · Avatar · Badge · Divider · StatusPill · Spinner
3. Button family (Primary → Icon → SOS → PTT)
4. Input family · Control family (RouteMode last — it's the hardest)
5. ProgressRing · SignalBars · BatteryPill · ProgressBar
6. Sheet/BottomSheet · Nav/BottomBar · AppBar
7. Card/Telemetry → Card/Rider → Card/Feed
8. Overlay/MapControls → Widget/* (Elevation, Curvature, Mesh)
9. Banner · Toast · EmptyState · Skeleton · Modal
10. Screen templates assembled from the above
```

---

## 4.4 Deliverables Checklist — Phase 4

- [ ] ~26 atoms and ~18 molecules published to a **shared team library**.
- [ ] Every component: all states, bound variables, Auto Layout, description, anti-usage note.
- [ ] A "Component Playground" frame per molecule showing every variant side-by-side.
- [ ] Dynamic-Type stress frame at 200 %.
- [ ] Glove-target overlay frame (56 px stamps on all in-ride controls).
- [ ] `Button/SOS` reviewed and signed off separately by product + engineering (safety-critical).
