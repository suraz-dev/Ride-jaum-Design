# PHASE 3 — Color Palette & Theming (High-Visibility)

> Environments the palette must survive: **11 a.m. Himalayan sun at 100,000 lux**, **monsoon fog**,
> **dusk**, **full darkness at 4,000 m**, and **a cracked screen protector with rain on it**.
> Dark theme is the origin; light theme is the derivative.

---

## 3.0 Colour Philosophy

1. **Colour is a semantic channel, never decoration.**
2. **Never colour alone** — every state pairs colour with an icon, a shape, or a dash pattern.
3. **One accent owns "you / interactive."** Volt. Nothing else may borrow it.
4. **Red is reserved.** `SOS Red` appears in exactly one context: emergency. Destructive
   non-emergency actions (delete a trip) use a *desaturated* `Danger` tone, not SOS Red.
5. **No pure black, no pure white** in the app surface: `#000000` smears on OLED during map
   pans, `#FFFFFF` blooms under sun glare.
6. **Contrast floors:** body text ≥ 4.5:1, in-ride telemetry ≥ 7:1, SOS elements ≥ 10:1.

---

## 3.1 Core Color System

### 3.1.1 Primary Accent — **Volt** (movement / energy / interactive)

Derived from motorcycle hi-vis safety gear. Maximum retinal salience against grey asphalt,
green terraces and blue sky simultaneously — the one hue that is never camouflaged by Nepali terrain.

| Token | Hex | Use |
|---|---|---|
| `volt-50` | `#F3FFE0` | Faintest tint, light-theme hover wash |
| `volt-100` | `#E4FFB8` | Light-theme selected background |
| `volt-200` | `#D2FF85` | Light-theme borders |
| `volt-300` | `#C2FF4D` | Hover on dark |
| **`volt-400`** | **`#B4FF39`** | **PRIMARY ACCENT — buttons, active route, "you" marker, active tab** |
| `volt-500` | `#9FE81F` | Pressed state |
| `volt-600` | `#7FC40E` | Text-on-light variant (passes 4.5:1 on `#FFFFFF`? → use `volt-700` for text) |
| `volt-700` | `#5E930A` | Accent text on light backgrounds |
| `volt-800` | `#446B0B` | Deep accent, light-theme icons |
| `volt-900` | `#2E4A0A` | Darkest accent |
| `volt-a12` | `#B4FF39` @ 12 % | Glow halo, selected-row wash on dark |
| `volt-a24` | `#B4FF39` @ 24 % | Focus ring, ripple |

- Contrast `volt-400` on `graphite-900 (#0B0F0E)` = **15.8:1** ✅ (AAA)
- **Text on `volt-400` must be `graphite-900`, never white.**

### 3.1.2 Secondary — **Glacier Cyan** (information / terrain / GPS / data)

The cold counterweight. Used for informational overlays, GPS accuracy rings, elevation data,
terrain layers and map-native chrome — so information never competes with the Volt "action" channel.

| Token | Hex | Use |
|---|---|---|
| `cyan-50` | `#E6FBFF` | — |
| `cyan-100` | `#C0F4FF` | — |
| `cyan-200` | `#8AEAFF` | GPS accuracy ring fill |
| `cyan-300` | `#4FDBFB` | Hover |
| **`cyan-400`** | **`#22C9EE`** | **SECONDARY ACCENT — info, GPS lock, contour highlights, links** |
| `cyan-500` | `#0FA8CC` | Pressed |
| `cyan-600` | `#0B87A6` | Text on light |
| `cyan-700` | `#0A6A83` | — |
| `cyan-800` | `#0A5163` | — |
| `cyan-900` | `#083C4A` | — |

### 3.1.3 Neutral Dark — **Graphite** (the dark-mode / map-interface foundation)

Cool-neutral with a faint green cast (hue ≈ 165°) so it sits harmoniously under both Volt and
satellite imagery, and never reads as "cheap grey."

| Token | Hex | Role |
|---|---|---|
| `graphite-950` | `#050807` | Deepest well — modal scrim base, OLED-friendly true background |
| **`graphite-900`** | **`#0B0F0E`** | **App background (dark theme). Elevation 0.** |
| `graphite-850` | `#111716` | Elevation 1 — cards, sheets |
| `graphite-800` | `#171F1D` | Elevation 2 — raised cards, nav bar |
| `graphite-700` | `#202A27` | Elevation 3 — popovers, menus, inputs |
| `graphite-600` | `#2C3835` | Borders (strong), dividers on raised surfaces |
| `graphite-500` | `#3C4B47` | Borders (default), disabled fills |
| `graphite-400` | `#5A6D68` | Disabled text, tertiary icons |
| `graphite-300` | `#7E918C` | **Tertiary text** (min size 13 px) |
| `graphite-200` | `#A6B6B1` | **Secondary text** — 8.1:1 on `graphite-900` ✅ |
| `graphite-100` | `#CFDAD6` | High-emphasis secondary |
| `graphite-050` | `#E9EFED` | **Primary text on dark** — 16.4:1 ✅ (used instead of pure white) |

### 3.1.4 Neutral Light — **Snowline** (light theme / high-glare mode)

Warm-neutral off-whites. Under direct sun, pure white causes veiling glare; a 2–4 % warm grey
reduces it measurably while keeping contrast.

| Token | Hex | Role |
|---|---|---|
| `snow-000` | `#FFFFFF` | Pure white — **only** for elevated card fills in light theme, never full-screen |
| **`snow-050`** | **`#F7F9F8`** | **App background (light theme)** |
| `snow-100` | `#EEF2F1` | Subtle fill, input background |
| `snow-200` | `#E1E7E5` | Borders (light) |
| `snow-300` | `#CBD4D1` | Dividers, disabled fills |
| `snow-400` | `#A3B0AC` | Disabled text |
| `snow-500` | `#7A8783` | Tertiary text on light |
| `snow-600` | `#54615D` | Secondary text on light — 7.3:1 ✅ |
| `snow-700` | `#39443F` | — |
| `snow-800` | `#232C29` | — |
| `snow-900` | `#0F1513` | Primary text on light — 17.2:1 ✅ |

### 3.1.5 Semantic System

| Semantic | Token | Hex (dark theme) | Hex (light theme) | Icon | Usage |
|---|---|---|---|---|---|
| **Success** | `success-400` | `#2FD07A` | `#128A4C` | ✔ check-circle | Route saved, tiles downloaded, rider checked in, mesh peer connected |
| **Success bg** | `success-a12` | `#2FD07A` @12% | `#E4F8ED` | — | Toast / banner background |
| **Warning** | `warning-400` | `#FFB020` | `#B26A00` | ▲ triangle | Low battery, stale tiles, weather alert, fuel range, approaching hazard |
| **Warning bg** | `warning-a12` | `#FFB020` @12% | `#FFF3DC` | — | — |
| **Info** | `info-400` | `#22C9EE` (= cyan-400) | `#0B87A6` | ⓘ circle | Neutral system messages, tips, sync notices |
| **Info bg** | `info-a12` | `#22C9EE` @12% | `#E1F7FC` | — | — |
| **Danger** (non-emergency destructive) | `danger-400` | `#F2603C` | `#C23B1B` | ✖ x-circle | Delete trip, remove rider, leave group, discard draft |
| **SOS Red** (emergency only) | `sos-500` | **`#FF1F3D`** | **`#FF1F3D`** | ⬤ SOS glyph | The SOS trigger, armed state, emergency broadcast UI |
| `sos-400` (glow) | | `#FF4D64` | | — | Pulse outer ring, glow bloom |
| `sos-600` (pressed) | | `#D80D28` | | — | Pressed / held state |
| `sos-900` (bed) | | `#3D0209` | | — | Full-bleed emergency background wash |

**SOS Red specification — treat as a safety-critical component:**
- `#FF1F3D` on `graphite-900` = **6.3:1**; when used as text it is always ≥ 17 px @ 700 weight,
  or paired with `snow-000` text on an `sos-500` fill (**4.6:1**, plus a 2 px `sos-600` border).
- The SOS surface is the **only** place in the entire product where red appears.
- SOS states are always **triple-coded**: colour + the SOS glyph + a haptic/audio pattern.
- SOS Red is exempt from theming: it is **identical in dark and light**, and it ignores
  reduced-brightness/night mode dimming.

### 3.1.6 Theming Modes (4 modes, built as Figma Variable Modes)

| Mode | Trigger | Behaviour |
|---|---|---|
| **Night** (default) | Default / sunset→sunrise | `graphite-900` base, Volt at full saturation, map dark-terrain style, overall luminance ceiling 70 % |
| **Day-Glare** | High ambient light sensor, or manual | `snow-050` base, **all strokes +1 px**, all text +1 weight step, accent shifts to `volt-600/700` for contrast on light, shadows replaced by borders |
| **Dusk** | Auto, ±45 min of civil twilight | Graphite base with warm-shifted map tiles, chrome opacity −10 %, reduces blue light |
| **Blackout** (in-ride night) | Manual toggle in HUD | `graphite-950` base, everything non-essential drops to `graphite-400`, only speed + next-turn + SOS retain full luminance. Red-free so night vision is preserved (uses `warning-400` amber for alerts instead). |

### 3.1.7 Map Surface Colours (separate from UI chrome)

The map style is its own token set so map and chrome never fight.

| Token | Hex | Use |
|---|---|---|
| `map-bg-night` | `#0A0E0D` | Base landmass, dark style |
| `map-bg-day` | `#EDF1EF` | Base landmass, day style |
| `map-water` | `#0E2A33` / `#C9E4EC` | Rivers (Kali Gandaki, Trishuli, Karnali), lakes |
| `map-contour` | `#1E2C28` / `#D6DEDA` | Contour lines |
| `map-contour-index` | `#2C4038` / `#B9C6C0` | Index contours (every 5th) |
| `map-road-hwy` | `#4A5A55` / `#FFFFFF` | Highways (Prithvi, BP, Araniko) |
| `map-road-minor` | `#33403C` / `#F2F5F4` | District/rural roads |
| `map-road-unpaved` | dashed `#5A4A33` | Gravel / off-road — **always dashed**, never solid |
| `map-snowline` | `#DFF6FF` @ 18 % | > 4,000 m hypsometric wash |
| `map-restricted` | `#FF1F3D` @ 10 % + hatch | Restricted / permit-required zones (Upper Mustang, Dolpa) |
| `map-hazard` | `#FFB020` @ 15 % + hatch | Landslide-prone segments, monsoon-closure zones |

---

## 3.2 Triple-Mode Routing Visuals

Three route modes must be identifiable **in under 0.5 seconds, in peripheral vision, on
satellite imagery, in bright sun, and by a colour-blind rider.** Therefore every mode is
**quad-coded**: hue + line pattern + icon + label.

| Mode | Colour token | Hex | Line style | Icon | Badge label | Semantics |
|---|---|---|---|---|---|---|
| **STRAIGHT** (shortcut) | `route-straight` | **`#22C9EE`** Glacier Cyan | **Solid**, 6 px, 2 px `graphite-900` casing | ➔ arrow-straight | `STRAIGHT` | Efficient, direct, minimum time. Cool = calm/utility. |
| **CURVY** | `route-curvy` | **`#B4FF39`** Volt | **Solid**, 7 px, subtle 8 px outer glow @ 20 % | ∿ wave-single | `CURVY` | The signature ride. Brand accent = the default joy. |
| **SUPERCURVY** | `route-super` | **`#C25CFF`** Ultra Magenta | **Solid, 8 px, animated flowing dash** (12/6 px, 40 px/s), 12 px glow @ 28 % | ⌇⌇ wave-double | `SUPERCURVY` | Maximum bends, maximum commitment. Rare hue = "this is the special one." |

### Supporting route colours

| Element | Token | Hex | Style |
|---|---|---|---|
| Alternate / unselected route | `route-alt` | `#5A6D68` | Solid 5 px, 60 % opacity, sits under active |
| Traversed portion | `route-done` | `#3C4B47` | Solid 6 px, behind active |
| Detour / rerouted segment | `route-detour` | `#FFB020` | Dashed 6 px (10/6) |
| Hazard override on any route | `route-hazard` | `#F2603C` | Overlays active colour, 8 px, hatched |
| Off-route (dead-reckoning) | `route-lost` | `#7E918C` | Dotted 4 px + pulsing |
| Group member track | `route-peer-1..6` | prayer-flag spectrum ↓ | Solid 4 px, 70 % opacity |

### Prayer-Flag Spectrum — group member colour coding

The one place Nepali cultural colour enters, reinterpreted as data-viz. Assigned in order,
guaranteed distinguishable in deuteranopia:

| Slot | Name | Hex |
|---|---|---|
| 1 | Lungta Blue | `#3D8BFF` |
| 2 | Lungta White | `#E9EFED` |
| 3 | Lungta Red* | `#FF7A5C` (*deliberately shifted to coral — true red is SOS-reserved) |
| 4 | Lungta Green | `#2FD07A` |
| 5 | Lungta Yellow | `#FFD028` |
| 6 | Newar Indigo | `#8A6BFF` |

### Colour-blindness verification (run in Figma → Stark)

| Mode pair | Deuteranopia | Protanopia | Tritanopia | Rescued by |
|---|---|---|---|---|
| Straight (cyan) vs Curvy (volt) | ✅ distinct (blue vs yellow) | ✅ | ⚠️ closer | line weight + icon |
| Curvy (volt) vs Supercurvy (magenta) | ✅ (yellow vs grey-blue) | ✅ | ✅ | animated dash + glow |
| Straight (cyan) vs Supercurvy (magenta) | ✅ | ✅ | ⚠️ | dash animation + icon |
| Any route vs SOS Red | ✅ (SOS always full-screen chrome, never map-line-only) | ✅ | ✅ | glyph + haptic |

### Route legend component

A persistent, collapsible legend chip in the Trip Planner shows all three modes with
swatch + pattern + icon + label — so the mapping is *learned*, not guessed.

---

## 3.3 Elevation, Glass & Effect Tokens

| Token | Spec (dark theme) |
|---|---|
| `elev-0` | `graphite-900`, no shadow |
| `elev-1` | `graphite-850` + `0 1px 2px rgba(0,0,0,.40)` + inner top border `rgba(255,255,255,.04)` |
| `elev-2` | `graphite-800` + `0 4px 12px rgba(0,0,0,.45)` + `0 0 0 1px rgba(255,255,255,.05)` |
| `elev-3` | `graphite-700` + `0 8px 24px rgba(0,0,0,.50)` + `0 0 0 1px rgba(255,255,255,.06)` |
| `elev-4` (sheet) | `graphite-800` + `0 -12px 40px rgba(0,0,0,.55)` |
| `glass-map` | fill `rgba(11,15,14,.62)` + background-blur 24 px + 1 px `rgba(255,255,255,.08)` border |
| `glass-map-strong` | fill `rgba(11,15,14,.80)` + blur 32 px (used when the map beneath is high-noise satellite) |
| `glow-volt` | `0 0 24px rgba(180,255,57,.32)` |
| `glow-sos` | `0 0 32px rgba(255,31,61,.55)` + animated 2× scale ring |
| `scrim-modal` | `rgba(5,8,7,.72)` |
| `scrim-map-top` | linear-gradient `rgba(11,15,14,.85)` → transparent, 160 px |
| `scrim-map-bottom` | linear-gradient transparent → `rgba(11,15,14,.90)`, 220 px |

### Signature gradients

| Token | Definition | Use |
|---|---|---|
| `grad-volt` | 135°, `#B4FF39` → `#7FC40E` | Primary CTA fill (subtle, 12 % delta only) |
| `grad-super` | 135°, `#C25CFF` → `#6B4DFF` | Supercurvy badge, hero moments |
| `grad-hud` | 180°, `rgba(11,15,14,0)` → `rgba(11,15,14,.92)` | Bottom HUD scrim |
| `grad-sos` | radial, `#FF4D64` → `#B00A20` | SOS trigger button |
| `grad-altitude` | `#0E2A33` → `#2FD07A` → `#FFD028` → `#F2603C` → `#E9EFED` | Elevation-profile chart fill (0 → 8,000 m hypsometric) |

---

## 3.4 Contrast Audit Table (must be reproduced as a Figma frame)

| Foreground | Background | Ratio | Verdict |
|---|---|---|---|
| `graphite-050 #E9EFED` | `graphite-900 #0B0F0E` | 16.4:1 | AAA ✅ |
| `graphite-200 #A6B6B1` | `graphite-900` | 8.1:1 | AAA ✅ |
| `graphite-300 #7E918C` | `graphite-900` | 4.9:1 | AA ✅ (≥13 px only) |
| `volt-400 #B4FF39` | `graphite-900` | 15.8:1 | AAA ✅ |
| `graphite-900` | `volt-400` (button) | 15.8:1 | AAA ✅ |
| `cyan-400 #22C9EE` | `graphite-900` | 8.9:1 | AAA ✅ |
| `sos-500 #FF1F3D` | `graphite-900` | 6.3:1 | AA ✅ (≥17px/700) |
| `snow-000 #FFFFFF` | `sos-500 #FF1F3D` | 4.6:1 | AA ✅ |
| `snow-900 #0F1513` | `snow-050 #F7F9F8` | 17.2:1 | AAA ✅ |
| `snow-600 #54615D` | `snow-050` | 7.3:1 | AAA ✅ |
| `warning-400 #FFB020` | `graphite-900` | 10.4:1 | AAA ✅ |
| `success-400 #2FD07A` | `graphite-900` | 9.6:1 | AAA ✅ |

---

## 3.5 Deliverables Checklist — Phase 3

- [ ] All colour tokens created as **Figma Variables** in collection `color`, with 4 modes
      (Night / Day-Glare / Dusk / Blackout).
- [ ] Semantic aliases layered on primitives (`bg/surface`, `text/primary`, `border/default`,
      `action/primary`, `route/supercurvy`, …) — components bind to *aliases only*, never raw hex.
- [ ] Effect styles for all elevation, glass, glow and scrim tokens.
- [ ] Route legend component built and placed in the Trip Planner.
- [ ] Contrast audit frame with every pair labelled.
- [ ] Colour-blindness simulation frame (3 filters × 4 key screens).
- [ ] Glare-test frame (40 % brightness + white overlay).
- [ ] Written rule on the cover page: **"Red = SOS. Nothing else."**
