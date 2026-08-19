# PHASE 7 — High-Fidelity UI Interface Specifications

---

## 7.1 Visual Styling — Lo-Fi → Hi-Fi Transition

### 7.1.1 The Transition Protocol (do it in this order, never freestyle)

| Step | Action | Why this order |
|---|---|---|
| **1. Duplicate & lock** | Copy the lo-fi page → `✨ Hi-Fi Screens`. Keep lo-fi frozen as the structural contract. | Structure must stop moving before surface starts. |
| **2. Apply tokens, nothing else** | Swap greys for `graphite-*` semantic variables, apply text styles. **No effects yet.** | Proves the palette carries the hierarchy on its own. |
| **3. Instance the components** | Replace every hand-drawn box with a library instance. | Any box that has no component reveals a gap in Phase 4. |
| **4. Real content** | Real Nepali place names, real rider names, real distances, real photography. **Never lorem ipsum, never stock white-guy-on-a-Ducati.** | Real content breaks fake layouts; that's the point. |
| **5. Depth pass** | Elevation shadows, glass blurs, borders — one system at a time, screen-wide. | Applying depth per-screen produces inconsistency. |
| **6. Accent pass** | Volt/cyan/magenta applied last, sparingly. Audit: accent should cover < 10 % of pixels. | Accent is punctuation, not paint. |
| **7. Map integration** | Drop in real map renders (Mapbox/MapLibre styled to the `map-*` tokens) behind glass. | Glass legibility can only be judged over real terrain noise. |
| **8. Stress & audit** | Contrast, glare, colour-blind, Dynamic Type, longest-string, empty/error/offline. | Ship-gate. |

### 7.1.2 Elevation & Depth System

Depth in RideJaunm means **"how far above the map is this?"** — a literal spatial metaphor, not decoration.

| Layer | z | Surface | Shadow | Border | Example |
|---|---|---|---|---|---|
| **L0 — World** | 0 | The map itself | none | none | Terrain, satellite, routes |
| **L1 — Ground chrome** | 1 | `graphite-850` @ 92 % | `0 1px 2px rgba(0,0,0,.40)` | top inner `rgba(255,255,255,.04)` | List rows, inline cards |
| **L2 — Floating glass** | 2 | `glass-map` (blur 24, fill `rgba(11,15,14,.62)`) | `0 4px 12px rgba(0,0,0,.45)` | 1 px `rgba(255,255,255,.08)` | Map controls, search pill, squad strip |
| **L3 — Sheets & bars** | 3 | `graphite-800` @ 96 % + blur 32 | `0 -12px 40px rgba(0,0,0,.55)` | 1 px top hairline | HUD sheet, bottom nav, app bar |
| **L4 — Popovers** | 4 | `graphite-700` | `0 8px 24px rgba(0,0,0,.50)` | 1 px `rgba(255,255,255,.06)` | Menus, tooltips, dropdowns |
| **L5 — Modals** | 5 | `graphite-800` + `scrim-modal` behind | `0 16px 48px rgba(0,0,0,.60)` | — | Confirmations, pickers |
| **L6 — Emergency** | 6 | `sos-900` full-bleed | `glow-sos` | 2 px `sos-500` pulsing | SOS takeover — **overrides everything** |

**Shadow doctrine:** shadows are always **pure black at varying alpha**, never coloured — coloured
shadows over live satellite imagery turn to mud. Glow (`glow-volt`, `glow-sos`) is a *separate*
effect used only on interactive accents, never on containers.

### 7.1.3 Glassmorphism — the rules that keep it legible

Glass is the signature treatment, and it is also the easiest way to destroy readability over a
moving satellite map. Therefore:

| Rule | Spec |
|---|---|
| **Blur floor** | Never below 20 px. Map imagery is high-frequency noise; weak blur reads as dirt. |
| **Fill floor** | Never below 55 % opacity on the fill. Text over glass needs a substrate, not a hint. |
| **Adaptive strength** | Sample the underlying map luminance; if mean luminance > 0.45 (snow, desert, day-glare), auto-switch to `glass-map-strong` (blur 32, fill 80 %). |
| **Border always** | Every glass surface has a 1 px `rgba(255,255,255,.08)` top/left inner border — this is what makes it read as *glass* rather than *fog*. |
| **Never nest glass** | A glass panel inside a glass panel becomes opaque sludge. Inner elements use `graphite-700` solid. |
| **Never glass behind body text** | Glass carries labels, values and icons. Paragraphs (feed, settings) live on solid surfaces. |
| **Noise overlay** | 2 % monochrome noise on large glass surfaces kills banding on cheap Android panels. |
| **Performance fallback** | Below a device-tier threshold, glass degrades to `graphite-850` @ 94 % solid. Design both. |
| **Day-Glare mode** | Glass is **disabled entirely** — replaced with solid `snow-000` @ 96 % + a 1 px `snow-300` border. Blur + sunlight = illegible. |

### 7.1.4 Border Radius Language

Radii encode function — the rider learns shape as meaning.

| Radius | Token | Applied to | Meaning |
|---|---|---|---|
| 4 px | `r-xs` | Checkboxes, tags, tiny badges | Precision, data |
| 8 px | `r-sm` | Inline chips, small inputs, media thumbnails | Utility |
| 12 px | `r-md` | Buttons (sm/md), list cards, inputs | Standard interactive |
| 16 px | `r-lg` | Feed cards, large buttons, search pill, modals | Content containers |
| 20 px | `r-xl` | Map control cluster, floating panels | Floating over the world |
| 28 px | `r-2xl` | Bottom sheet top corners, route-mode switch | Major surfaces |
| 999 px | `r-full` | Avatars, FABs, toggles, status pills, SOS | Human, live, or urgent |

**Nesting law:** inner radius = outer radius − padding. A 16 px card with 12 px padding has 4 px
inner elements. Never place a 16 px radius inside a 12 px radius.

### 7.1.5 Gradient Usage

Gradients are used **sparingly and functionally**. Four sanctioned uses only:

1. **Scrims** (`grad-hud`, `scrim-map-top/bottom`) — legibility gradients over the map. Always
   vertical, always from the token set, never decorative.
2. **CTA fills** (`grad-volt`) — a maximum 12 % luminance delta, 135°. It should read as a
   subtly lit surface, not a rainbow.
3. **Data encoding** (`grad-altitude`) — elevation profile fill. Here the gradient *is* the data.
4. **Emergency** (`grad-sos`) — radial on the SOS button to create a physical "dome" affordance.

❌ Banned: gradient text, gradient borders, mesh gradients, iridescent/holographic effects,
gradients on cards, gradients in the nav bar.

### 7.1.6 Iconography Finalisation

- **Phosphor Icons**, 24 px grid, 2 px stroke, `regular` weight default, `fill` weight for
  active/selected states. 32 px / 2.5 px for HUD.
- **Custom icons required** (design these, ~18 glyphs): SOS ring-glyph, mesh-node, walkie-talkie
  PTT, route-straight / curvy / supercurvy waves, curvature meter, prayer-flag squad marker,
  offline-tile stack, landslide hazard, checkpoint/permit, fuel-range, dhaka-topi rider avatar
  fallback, Himalayan pass marker, monsoon-closure, bike-type glyphs (adventure/commuter/cruiser).
- Every icon exists in outline + filled, snapped to the pixel grid, exported as SVG at 24/32/48.

### 7.1.7 Imagery & Map Rendering

| Asset | Treatment |
|---|---|
| Feed photography | No filters. Riders shoot in harsh light; embrace it. Slight (4 %) black vignette only where text overlays. |
| Empty-state illustrations | Line-art in `graphite-500` with a single `volt-400` accent stroke. Terrain-derived (contour lines, passes, prayer flags). |
| Map style | Custom MapLibre/Mapbox style built from the `map-*` tokens. Four styles: Satellite-3D, Terrain-Dark, Terrain-Day, Minimal-Offline. |
| 3D terrain | Exaggeration 1.4×, hillshade at 35 % opacity, sky layer with a horizon gradient matching the theme mode. |
| Route rendering | Casing (2 px `graphite-900`) under every route line so it survives on both snow and forest. |
| Avatar fallbacks | Initials on a prayer-flag-slot coloured background. |

### 7.1.8 Hi-Fi Ship Gate (per screen)

- [ ] Every colour bound to a semantic variable (0 raw hex in the layer panel).
- [ ] Every text layer uses a published text style.
- [ ] Every repeated element is a component instance.
- [ ] Real Nepali content, longest-string tested.
- [ ] All 4 theme modes render correctly.
- [ ] Contrast audit passed (body ≥ 4.5:1, telemetry ≥ 7:1, SOS ≥ 10:1).
- [ ] Colour-blind simulation passed (3 filters).
- [ ] Glare simulation passed (40 % brightness + white overlay).
- [ ] Empty / loading / error / offline states designed.
- [ ] Glass legibility verified over at least 3 map backgrounds (snow, forest, desert).

---

## 7.2 Interactive Micro-Interactions

Three are mandatory. Four more are listed as high-value follow-ups.

### ⭐ MI-1 — GPS Lock Ripple (the "the app is alive" moment)

**Trigger:** App launch, GPS re-acquisition after signal loss, or manual recenter.

| Stage | Duration | Behaviour |
|---|---|---|
| Searching | loop | The "you" marker is a hollow `cyan-400` ring at 40 % opacity. A **radar sweep** — a 60° conic-gradient arc — rotates 360° every 2 s. Accuracy radius circle breathes 80 → 140 px. Label: `SEARCHING… ±—` |
| Narrowing | 400 ms | As accuracy improves, the radius circle contracts with a spring (stiffness 180, damping 22). Label ticks down: `±48 m → ±12 m → ±6 m` with tabular numerals so the digits don't jitter. |
| **Lock** | 600 ms | Radar sweep stops → a single `volt-400` ripple expands from the marker to 3× and fades (cubic-bezier .16,1,.3,1). Marker morphs from hollow ring to a solid `volt-400` chevron with a heading cone. **Haptic: medium impact.** Optional 120 ms rising two-tone chirp. |
| Locked idle | loop | Slow 2 s breathing pulse on the accuracy ring at 12 % opacity — proof of life without distraction. |
| Degraded | — | If accuracy worsens past 25 m, the ring turns `warning-400` and the pulse speeds to 1 s. **Never silently pretend.** |

**Why it matters:** GPS acquisition is the app's most common wait state and the moment a rider
decides whether to trust it. Making the *uncertainty itself* visible builds more trust than a
spinner ever could.
**Implementation:** Rive (preferred, for the conic sweep) or Lottie. Respect Reduce Motion → the
sweep becomes a static ring with a text-only accuracy readout.

---

### ⭐ MI-2 — SOS Long-Press Commitment Ring (the safety-critical interaction)

**Trigger:** Press and hold the SOS button.

| Time | Visual | Haptic | Audio |
|---|---|---|---|
| 0 ms | Button scales to 0.94, `glow-sos` intensifies, screen edges gain a subtle red vignette | Light impact | — |
| 0 → 3,000 ms | A conic-gradient ring (`snow-000` on `sos-900`) fills clockwise from 12 o'clock. Ring stroke thickens 4 → 8 px as it fills. Centre label counts `3 · 2 · 1` in `tel-xl`. Background progressively washes to `sos-900` (0 → 70 % opacity). | Medium ticks at 1,000 and 2,000 ms | Rising 3-tone chirp, one note per second |
| 3,000 ms | Ring completes → 200 ms white flash → full-screen takeover | **Heavy impact** | Confirmation tone |
| Early release | Ring unwinds counter-clockwise over 240 ms; button returns to idle; toast *"SOS cancelled"* | Light "failure" pattern | Descending tone |

**Design intent — this is deliberately effortful.** Three seconds is long enough that no pocket,
no glove brush, no panic-tap can fire it, and short enough that an injured rider can complete it
one-handed. The countdown converts a scary irreversible action into a *reversible, legible*
commitment. The unwind animation is as important as the fill: it proves cancellation worked.

**Accessibility:** exempt from Reduce Motion (the ring *is* the feedback). VoiceOver announces
`"Emergency SOS. Press and hold for three seconds. Three… two… one… SOS sent."` A settings
option lets riders with limited dexterity reduce the hold to 1.5 s (with a longer 20 s cancel window).

---

### ⭐ MI-3 — Offline Tile Download — Progressive Map Materialisation

**Trigger:** Downloading an offline region.

Instead of a generic progress bar, **the map itself renders in as it downloads.**

| Stage | Behaviour |
|---|---|
| Queued | The selected region is shown as a `cyan-400` dashed rectangle over a desaturated map. Size estimate and zoom range shown. |
| Downloading | The region is divided into a visible tile grid. Each completed tile **fades from grey wireframe to full-colour map imagery** with a 200 ms stagger, filling in a spiral from the route centre outward. A `volt-400` progress ring on the download button shows the overall %. Below: `142 / 380 tiles · 84 MB / 214 MB · 2 min left` in tabular numerals. |
| Paused | Grid freezes at 60 % opacity; completed tiles stay colour. `RESUME` button. Explicitly states data is kept. |
| Complete | A final `volt-400` sweep passes across the region left→right (400 ms), the dashed border becomes a solid volt line, a check-mark stamps in with a spring, **haptic: success pattern**. Toast: *"Mustang ready offline · 214 MB · valid 90 days."* |
| Failed / interrupted | Incomplete tiles show as amber wireframe. Copy: *"38 tiles missing. Retry over Wi-Fi?"* — never silently "done". |
| Stale (> 30 days) | Tiles subtly desaturate over the region; an amber badge appears on the download control. |

**Why it matters:** Offline download is a long, boring, anxiety-inducing wait on slow Nepali
mobile data — and it is the feature the rider is *depending on* when they lose signal three days
later. Materialising the actual map makes progress feel tangible and, crucially, makes *coverage*
visible: the rider can literally see what they will and won't have.

---

### Secondary micro-interactions (build after the three above)

| # | Interaction | Spec |
|---|---|---|
| MI-4 | **Route Mode morph** | Switching Straight → Curvy → Supercurvy: the pill slides (320 ms spring), the map route **morphs** along interpolated geometry rather than cutting, unselected routes fade to 60 % grey, the camera flies to fit the new bounds (700 ms ease-out), and the stat strip's numbers **roll** (odometer style, tabular). Haptic selection tick. |
| MI-5 | **Map zoom physics** | Pinch-zoom with inertia and rubber-band limits. Crossing zoom 14 triggers a 300 ms cross-fade from vector-terrain to satellite. 3D pitch transitions ease over 600 ms with the sky layer fading in. Double-tap zooms with a spring overshoot of 4 %. Rotation snaps to north within ±5° with a haptic detent. |
| MI-6 | **Squad member arrival pulse** | When a group member's status changes (stopped → riding, or enters/leaves range), their avatar bubble pulses once in their prayer-flag colour and their row in the squad list slides to re-sort with a 240 ms spring. Falling-behind alerts slide in as a chip, never a modal. |
| MI-7 | **Post-ride stat reveal** | On finishing a ride, stats count up from zero (800 ms, ease-out) — distance, bends, elevation — and the curvature meter sweeps to its score with a satisfying arc. The route draws itself onto the summary map over 1.2 s. This is the shareable dopamine moment that drives the feed. |

### Motion Token Set

| Token | Value | Use |
|---|---|---|
| `dur-instant` | 100 ms | State changes, toggles |
| `dur-fast` | 200 ms | Hover, small transitions |
| `dur-base` | 320 ms | Standard transitions, pill slides |
| `dur-slow` | 600 ms | Sheet detents, camera pitch |
| `dur-cinematic` | 1,200 ms | Route flyovers, reveals |
| `ease-standard` | `cubic-bezier(.4, 0, .2, 1)` | Most transitions |
| `ease-out-expo` | `cubic-bezier(.16, 1, .3, 1)` | Entrances, ripples |
| `ease-in-out-back` | `cubic-bezier(.68,-.4,.32,1.4)` | Playful (feed likes only) |
| `spring-ui` | stiffness 260, damping 24 | Pills, toggles, sheets |
| `spring-map` | stiffness 180, damping 22 | Camera, accuracy rings |

**Reduce Motion policy:** all animation drops to opacity cross-fades at `dur-fast`, **except**
the SOS commitment ring and the GPS accuracy readout, which remain (they carry safety information).

---

## 7.3 Deliverables Checklist — Phase 7

- [ ] 4 core screens at hi-fi, in all 4 theme modes = 16 hero frames.
- [ ] Second-wave screens at hi-fi (~20 frames).
- [ ] Depth/elevation specimen frame (L0–L6 side by side over a real map).
- [ ] Glass legibility test frame (3 map backgrounds × 2 glass strengths).
- [ ] Radius language specimen.
- [ ] Custom icon set (~18 glyphs) in outline + filled, exported.
- [ ] MI-1, MI-2, MI-3 prototyped in Rive or Figma Smart Animate + exported reference videos.
- [ ] Motion token table published as a Figma variable collection.
- [ ] Full stress-test board (contrast / colour-blind / glare / Dynamic Type / longest-string).
