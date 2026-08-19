# PHASE 1 — Brand Identity, Mood & Design Direction

> **Locked direction:** `Himalayan-Tactical Tech` — a rugged, expedition-grade tactical base
> carrying one high-energy neon accent. Rugged credibility where it saves lives (SOS, offline,
> telemetry); premium glow where it creates desire (map, social, trip planning).

---

## 1.1 Brand Concept & Void

### 1.1.1 The Name

**RideJaunm** — from Nepali *"Ride jaũ!"* / *"राइड जाऔं"* → **"Let's go for a ride."**
The name is an *invitation*, not a product noun. Every piece of copy in the product should
sound like a friend saying *"let's go"* — never like a utility saying *"configure your route."*

- **Pronunciation lock:** `ride-JOW-m` (rhymes with "now").
- **Wordmark rule:** always one word, capital R + capital J (`RideJaunm`). Never "Ride Jaunm",
  never "RideJaum", never all-lowercase in the logo lockup.
- **Tagline (primary):** *"Let's go. The road knows the way."*
- **Tagline (safety/SOS context):** *"Never ride alone."*
- **Tagline (Nepali, in-market):** *"राइड जाऔं — बाटो हामीलाई थाहा छ।"*

### 1.1.2 Brand Personality — the 5 Pillars

| # | Pillar | What it means | How it shows up in UI |
|---|--------|---------------|------------------------|
| 1 | **Adventurous** | The product exists for the ride, not the commute. It celebrates the detour. | "Supercurvy" is a *feature*, not an error. Curvature stats are trophies. Route previews are cinematic 3D flyovers. |
| 2 | **Rugged / Expedition-grade** | Built for gravel, rain, dust, 4,000 m passes and dead cell towers. | Chunky 48–56 px hit targets (glove-usable). High-contrast dark HUD. Offline-first messaging. Instrument-panel typography. |
| 3 | **Reliable / Instrument-honest** | It never lies about GPS accuracy, battery, mesh range, or map freshness. | Explicit confidence states: `GPS ±4 m`, `Map tiles 12 days old`, `Mesh: 3 peers / 1.2 km`. No fake progress bars, ever. |
| 4 | **Community-centric** | Nepali riding culture is inherently collective — Saturday group rides, dai/bhai convoys, WhatsApp coordination. | Squad is a first-class tab, not a sub-menu. Group state is always visible. Feed rewards *route sharing* over vanity metrics. |
| 5 | **Locally rooted, globally sharp** | Nepali soul, international craft. Not "developing-market app" aesthetics. | Devanagari is a first-class typographic citizen. Terrain, prayer-flag chromatics and monsoon reality are baked into the system — but the execution quality benchmarks against Strava/Rever/Polarsteps. |

### 1.1.3 Brand Personality Sliders

```
Playful      ●───────────────────○───────  Serious          (7/10 serious — lives are on the line)
Corporate    ○───────────────●───────────  Rebel            (7/10 rebel)
Minimal      ○──────────●────────────────  Maximal          (5/10 — dense data, calm layout)
Soft         ○────────────────●──────────  Hard-edged       (7/10 hard)
Local        ○──────────●────────────────  Global           (5/10 — proudly both)
Quiet        ○─────────────────●─────────  Loud             (7/10 in accent, 2/10 in chrome)
```

### 1.1.4 The Void — what nobody is serving

Research the competitive gap and name it explicitly on the Figma cover page:

1. **Global apps don't know Nepal.** Rever, Calimoto and Kurviger optimise curvature for the
   Alps and the Appalachians. They do not model landslide season, single-lane blacktop with
   1,000 m exposure, army checkpoints, or the fact that "the road exists on OSM" ≠ "the road
   is passable in Shrawan."
2. **Nepali apps don't know riders.** Local navigation and ride-hailing products are
   commute-shaped: A→B, shortest time, no curvature, no group state, no offline resilience.
3. **Nobody solves the dead-zone.** Above ~2,500 m in Mustang, Manang, Dolpa, Humla and much
   of Karnali there is no cellular coverage. Every safety feature on the market silently
   fails exactly where riders actually crash. **A dual-mode SOS that degrades gracefully to
   Bluetooth mesh / LoRa / walkie-talkie hand-off is the single most defensible thing this
   product can own.**
4. **Community is fragmented.** Nepali riding communities live in Facebook groups and
   WhatsApp threads where routes die as screenshots. There is no place where a route is a
   *shareable, importable, offline-downloadable object*.

> **Positioning statement (put this on the cover frame):**
> *For Nepali motorcycle riders who treat the road as the destination, RideJaunm is the
> expedition companion that plans curvier rides, keeps the squad visible, and keeps calling
> for help after the network stops. Unlike commute navigation and Alpine-tuned route apps,
> RideJaunm is engineered for Himalayan reality — offline-first, group-native, and
> hostile-terrain-ready.*

### 1.1.5 Voice & Tone Matrix

| Context | Tone | Example copy | Never say |
|---|---|---|---|
| Onboarding | Warm, inviting | "Let's go. Where are we riding?" | "Welcome to your journey management platform" |
| Trip planning | Confident, playful | "Supercurvy: 142 bends, 68 km. Worth it." | "Route generated successfully" |
| In-ride HUD | Silent, glanceable | `18 km` · `ETA 4:12` · `2,190 m` | Any sentence at all |
| Group / Squad | Familiar, collective | "Bibek is 3.2 km back." | "Participant 4 has deviated from geofence" |
| Weak signal | Honest, calm | "No cell service. Mesh is holding — 3 riders in range." | "Something went wrong" |
| SOS armed | Absolute, unambiguous | "SOS ACTIVE. Broadcasting your location every 30 s." | Emojis, exclamation marks, humour |
| Errors | Accountable, actionable | "Tiles for Mustang are 41 days old. Refresh over Wi-Fi?" | "Oops!" |

### 1.1.6 Brand Anti-Patterns (put on the cover page as a "DON'T" frame)

- ❌ No stock "extreme sports" bro-culture. Nepali riding is family, dai/bhai and chiya stops.
- ❌ No poverty-porn or exoticised Himalaya imagery. Riders, machines, roads — not tourism.
- ❌ No skeuomorphic leather/carbon-fibre textures. Tactical ≠ tacky.
- ❌ No red used decoratively. **Red belongs to SOS and to nothing else.**
- ❌ No thin 200/300 font weights anywhere in an in-ride surface.
- ❌ No pure-black `#000000` (OLED smear on pans) and no pure-white `#FFFFFF` fills on the map layer.

---

## 1.2 Visual Inspiration & Aesthetic Keywords

Seven keywords. Every moodboard image, icon and screen must be defensible against at least
two of them. Pin this list at the top of the `🖼️ Moodboard & Assets` Figma page.

| # | Keyword | Definition | Visual cues to hunt for |
|---|---|---|---|
| 1 | **Himalayan-Tech** | Alpine expedition instrumentation: altimeters, avalanche beacons, Garmin inReach, satellite messengers. | Contour lines, elevation profiles, hypsometric tints, beacon glyphs, ruggedised bezels. |
| 2 | **Tactical Glass** | Dark translucent panels floating over live terrain — like a fighter-jet HUD or a Formula-1 pit wall. | Frosted dark glass, hairline 1 px strokes, layered depth, data over imagery. |
| 3 | **Hi-Vis Volt** | The chromatic language of safety gear: fluorescent yellow-green, reflective tape, hazard chevrons. | Motorcycle hi-vis jackets, reflective piping, road-crew vests, night-photography glow. |
| 4 | **Instrument Cluster** | Premium motorcycle TFT dashboards (KTM 390 ADV, Himalayan 450, Ducati, Zero SR/F). | Tabular numerals, radial gauges, segmented arcs, negative-space dials, chunky mode badges. |
| 5 | **Topographic Brutalism** | Confident, unornamented structure. Big type, hard edges, honest grids, zero decoration. | Swiss/ISO map legends, survey sheets, mono labels, stencil numbering, thick rules. |
| 6 | **Prayer-Flag Chromatics** | The *one* place local colour enters: a restrained 5-hue accent spectrum (blue/white/red/green/yellow) reinterpreted as data-viz, never as decoration. | Lungta flags, Newar textile bands, route-difficulty spectrums, multi-rider colour coding. |
| 7 | **Monsoon Grit** | Real conditions: wet asphalt, fog, dust, mud spatter, low sun. Design must survive them. | High-contrast photography in rain/fog, glare tests, dusk imagery, muddy hands on a phone. |

**Sensory anchor (write it on the moodboard):**
*Matte anodised aluminium. Cold hands. A lime jacket in grey fog. A backlit TFT at 5 a.m. in
Besisahar. The click of a hard-shell case.*

### Visual Constitution — 8 non-negotiable rules

1. **Dark is default.** Light theme is a supported alternative, not the design origin.
2. **Colour is meaning.** Volt = interactive/you. Cyan = information/terrain. Amber = caution.
   Green = success/reachable. Red = SOS only. Magenta = Supercurvy.
3. **Never colour alone.** Every colour-coded state carries a second channel — icon, shape,
   dash pattern, or label. (Deutan/protan riders and low-sun glare both demand it.)
4. **The map is the hero; UI is glass on top of it.** Chrome never exceeds ~35 % of the
   viewport in ride mode.
5. **Thumb-zone law.** Anything a moving rider must touch lives in the bottom 45 % of the screen.
6. **Glove-first sizing.** Minimum interactive target 48 × 48 px; in-ride targets 56 × 56 px.
7. **Honest states.** Every asynchronous or degradable system (GPS, mesh, tiles, battery)
   displays its real confidence level.
8. **Offline is a first-class visual state**, styled deliberately — never a grey error screen.

---

## 1.3 Reference Aggregation Spec

Deliverable: the `🖼️ Moodboard & Assets` Figma page, organised in **six labelled sections**
(one section frame each, 2,400 px wide, 24 px gutters, captions in `Caption/12` under every
image). Target **~120 curated references**. Caption format:

```
[SOURCE] — [What to steal] — [Which keyword it serves]
e.g. "Rever iOS 3.4 — route-type chips as bottom sheet — Instrument Cluster"
```

### Section A — Direct & Adjacent Competitors (capture 8–12 screens each)

| App | Why it matters | Screens to capture |
|---|---|---|
| **Rever** | The category benchmark for route discovery + curvy scoring. | Route detail, ride recording HUD, offline map manager, challenge feed. |
| **Calimoto** | Best-in-class *curvy* routing UX and offline region purchase model. | Curvy slider, region download map, round-trip generator. |
| **Kurviger** | Pure curvature algorithm UI; excellent waypoint manipulation. | Waypoint list drag-reorder, curvature/no-highway toggles. |
| **Cardo Connect** | Intercom/group pairing mental models — direct analogue for our mesh SOS. | Pairing flow, group intercom roster, connection-strength UI. |
| **Garmin Explore / inReach** | Satellite SOS interaction patterns, message queueing, check-in cadence. | SOS arm/confirm/cancel flow, sync status, tracking interval settings. |
| **Relive** | 3D flyover route rendering and post-ride storytelling. | 3D replay, share card composition. |
| **Strava** | Segment/leaderboard social loops and activity feed density. | Feed card, activity detail, group/club screens. |
| **Polarsteps** | Trip-as-narrative structure and beautiful map typography. | Trip timeline, map styling, stats module. |
| **Life360 / Zenly (archive)** | Live multi-person tracking on a map with battery states. | Member bubbles, battery badges, place alerts. |
| **Google Maps + Organic Maps + OsmAnd** | Baseline navigation grammar and offline tile management. | Download-region flow, storage manager, layer toggles. |
| **Komoot** | Tour planning with surface/way-type breakdown bars. | Elevation + surface composition chart, waypoint editor. |
| **Zello / Bridgefy / Briar** | Walkie-talkie PTT and mesh-networking UI (the offline SOS analogue). | PTT button, channel list, peer-discovery/mesh status UI. |

For each: capture **light + dark**, **loading + empty + error** states. Annotate with
🟢 steal / 🟡 adapt / 🔴 avoid stickers.

### Section B — Motorcycle Instrument Clusters & Automotive HUD

- KTM 390/790 Adventure TFT, Royal Enfield Himalayan 450 (Tripper/round TFT), Ducati
  Multistrada, BMW GS Connected, Zero SR/F, Harley Pan America.
- Automotive: Polestar 2 OS, Rivian R1T driver display, Lucid Air, Porsche Taycan, Tesla
  navigation card, Mercedes MBUX AR-nav.
- Aviation/marine: Garmin G1000 PFD, ForeFlight, Navionics.
- **What to extract:** numeral treatment, gauge arc geometry, mode-badge design, day/night
  luminance strategy, glanceability hierarchy.

### Section C — Nepal Terrain, Riders & Road Reality (shoot or license, don't scrape blindly)

- **Roads:** Prithvi Highway, BP Highway, Mugling–Narayanghat, Kathmandu–Nagarkot, Kathmandu–
  Daman/Tribhuvan Rajpath, Sindhupalchok/Araniko, Mustang (Beni–Jomsom–Muktinath), Manang,
  Rara/Jumla, Ilam tea hills, Karnali Highway.
- **Machines:** RE Himalayan, Hunter 350, Classic 350, Pulsar NS200/RS200, Xpulse 200, KTM
  Duke/Adventure, Honda XL/CB, TVS Apache, CT100 (the workhorse).
- **Human truth:** gloved hands on phones, chiya stops, mud-caked panniers, tyre repair at a
  roadside *punchar* shop, riders in hi-vis over dhaka topi, dust masks, group photos at a pass.
- **Terrain palettes:** monsoon green terraces, winter brown mid-hills, Mustang ochre desert,
  glacier white-blue, dusk indigo. Sample these into a `Terrain Palette` swatch board — they
  drive the map style, not the UI chrome.
- **Signage & vernacular:** Nepali road signs, DoR km markers, Devanagari signage, prayer flags,
  suspension bridges, army/police checkposts, ACAP/TIMS boards.

### Section D — UI Pattern Library (pattern-level, not app-level)

Collect **10–15 examples of each pattern**, cropped tight:

1. Bottom sheets with 3 detents (peek / half / full) over a live map.
2. Segmented / 3-way mode switchers with animated pill indicators.
3. Long-press-to-confirm destructive triggers (radial fill timers).
4. Glassmorphic overlays *on photography* (the hard case — legibility over noise).
5. Telemetry/HUD stat clusters and elevation-profile charts.
6. Live-tracking avatar clusters + follow/recenter controls.
7. Download/queue managers with per-item progress + pause/resume.
8. Signal-strength, mesh-topology and peer-list visualisations.
9. Social feed cards with mixed media (photo / video / route map / GPX attachment).
10. Empty, offline, permission-denied, degraded-GPS and low-battery states.
11. Onboarding permission primers (location "Always", Bluetooth, notifications, battery opt-out).
12. Map layer switchers (satellite / terrain / hybrid / traffic) and 3D pitch/bearing controls.

### Section E — Typography, Iconography & Motion References

- Type-in-the-wild: expedition equipment labelling, ISO/Swiss map legends, aviation charts,
  race timing boards, Devanagari wayfinding done well.
- Icon sets to evaluate: **Phosphor** (chosen candidate), Lucide, Remix Icon, Material Symbols
  (rounded, filled+outline duotone capability, 24 px grid, 2 px stroke).
- Motion references: Rive/Lottie map-pin drops, radar sweeps, GPS-lock ripples, progress rings,
  haptic-synced long-press fills. Save as MP4/GIF in the shared drive, embed thumbnails only.

### Section F — Accessibility, Environment & Stress-Test Board

This is the section that separates a pretty design from a safe one.

- **Glare board:** every hero screen re-rendered at 40 % brightness behind a white overlay,
  simulating direct 11 a.m. Himalayan sun.
- **Colour-blindness board:** key screens run through deuteranopia, protanopia and tritanopia
  filters (Figma plugin: *Stark* or *Color Blind*).
- **Glove board:** 56 px target overlays + a 10 mm-diameter "thumb blob" stamp placed on every
  in-ride control to prove reachability.
- **Rain/vibration board:** blurred (2–4 px Gaussian) screenshots to test glanceability at
  motion — if a rider can't parse it blurred in 0.8 s, the hierarchy is wrong.
- **Contrast audit:** every text/background pair labelled with its ratio; body ≥ 4.5:1,
  in-ride telemetry ≥ 7:1, SOS ≥ 10:1.

### Aggregation Workflow (how the team actually does it)

1. **Collect** → Figma plugin *Insert Big Image* / browser clipper into a `_INBOX` frame.
2. **Cull** → weekly 30-min review; anything unlabelled after 7 days gets deleted. No hoarding.
3. **Label** → move into Section A–F, add caption + keyword tag + 🟢🟡🔴 sticker.
4. **Distil** → produce **three 1-page "Direction Boards"** (A: Tactical Instrument,
   B: Neon Glass, C: Himalayan Warm) → team dot-votes → the winner becomes the Phase 3 palette
   validation. *(Given the locked direction, Board A + B are pre-merged; Board C survives only
   as the accent-spectrum donor.)*
5. **Lock** → export the winning board as `moodboard-v1.pdf` into the shared drive and link it
   from the Figma cover page and this repo's README.

---

## 1.4 Deliverables Checklist — Phase 1

- [ ] Cover frame: positioning statement, taglines, personality sliders, anti-patterns.
- [ ] `🖼️ Moodboard & Assets` page with Sections A–F populated and captioned.
- [ ] ~120 curated references, all labelled 🟢🟡🔴.
- [ ] Terrain Palette swatch board (12 sampled colours from Nepal photography).
- [ ] Three Direction Boards + dot-vote result documented.
- [ ] Voice & Tone matrix as a text frame on the cover page.
- [ ] `moodboard-v1.pdf` exported and linked in `README.md`.

**Exit criteria:** any designer joining the project can read the cover page for 10 minutes and
correctly reject an off-brand screen without asking a question.
