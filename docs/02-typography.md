# PHASE 2 — Typography & Font Selection

> Design principle: **Glanceable typography.** A rider reads the screen in 0.6–0.8 s, at arm's
> length, through a visor, at 60 km/h, on a vibrating handlebar mount. Type must survive that.

---

## 2.1 Font Selection

### 2.1.1 The Stack

| Role | Family | Source | Why |
|---|---|---|---|
| **Primary — UI & Display** | **Space Grotesk** | Google Fonts (Variable 300–700) | Geometric grotesque with slightly quirky, wide apertures and a tall x-height. Reads as *technical instrument* rather than *corporate SaaS*. Distinct `1 / 7 / 9`, unmistakable `G`. Carries display weight at 40 px and still works at 14 px. |
| **Secondary — Body & Long-form** | **Inter** | Google Fonts (Variable 100–900) | The most extensively hinted, screen-optimised neo-grotesque available. Huge x-height, low-contrast strokes, excellent at 13–17 px in the community feed. Ships `tnum`, `case`, `ss01` OpenType features. |
| **Numeric / Telemetry** | **Inter — `tnum` + `cv` variants** (`font-variant-numeric: tabular-nums`) | Google Fonts | Tabular figures prevent digit-jitter as speed/ETA/distance tick. **Mandatory for every changing number.** |
| **Devanagari (नेपाली)** | **Mukta** (UI) + **Noto Sans Devanagari** (fallback) | Google Fonts | Mukta is geometric, open-countered and optically matched to Inter's weight; Noto guarantees full glyph coverage for edge-case conjuncts and place names. |
| **Code / Coordinates / Mono** | **JetBrains Mono** | Google Fonts | Lat/long, grid refs, mesh node IDs, GPX debug. Only in developer-adjacent and coordinate surfaces. |

**Fallback stack (for handoff / web / RN):**

```css
--font-display: "Space Grotesk", "Inter", "SF Pro Display", "Roboto", system-ui, sans-serif;
--font-body:    "Inter", "Mukta", "SF Pro Text", "Roboto", system-ui, sans-serif;
--font-np:      "Mukta", "Noto Sans Devanagari", "Inter", sans-serif;
--font-mono:    "JetBrains Mono", "SF Mono", "Roboto Mono", ui-monospace, monospace;
```

### 2.1.2 Runner-up options (documented so the decision isn't relitigated)

| Alternative | Verdict |
|---|---|
| **Chakra Petch** | Perfect "tactical" flavour, but the angled terminals hurt legibility below 14 px. **Use for the wordmark only, never for UI.** |
| **Barlow / Barlow Condensed** | Excellent condensed telemetry option; keep `Barlow Condensed SemiBold` as an approved *overflow* face for long Nepali place names in tight HUD chips. |
| **Manrope** | Beautiful, but too soft/friendly for the instrument tone. |
| **Archivo / Archivo Expanded** | Strong display alternative; hold as the marketing-site display face. |
| **IBM Plex Sans** | Great engineering tone; loses to Inter purely on screen hinting at small sizes. |
| **Rajdhani / Orbitron** | ❌ Rejected — sci-fi cliché, poor Devanagari companionship, bad at small sizes. |

### 2.1.3 Glanceability Rules (the vibration doctrine)

1. **No weight below 400 anywhere.** Light/Thin weights disappear under glare and vibration.
2. **In-ride surfaces: minimum 500 (Medium).** Telemetry values are 600–700.
3. **Minimum in-ride type size: 14 px.** Minimum anywhere: 11 px (and 11 px only for
   non-critical map labels and legal microcopy).
4. **Tabular numerals mandatory** on every value that changes at runtime.
5. **Letter-spacing widens as size shrinks** (see the matrix) — small optical sizes need air.
6. **Uppercase only for labels ≤ 12 px**, always with ≥ 0.06 em tracking. Never uppercase a
   sentence, never uppercase Devanagari.
7. **Line length 45–75 characters** in the feed; hard-truncate to 2 lines in cards.
8. **Never centre-align** anything longer than 3 words in an in-ride surface — the eye needs a
   fixed left rag to reacquire after looking at the road.
9. **Devanagari runs ~4 % taller**; Nepali strings get +2 px line-height and are allowed to
   drop one size step before truncating.
10. **Respect OS Dynamic Type** up to 200 %: HUD scales to a 130 % cap (layout integrity),
    Feed and Settings scale fully.

---

## 2.2 Type Scale Matrix

Base = **16 px**, ratio ≈ **1.25 (Major Third)** in the display range, compressed to ~1.14 in
the body range for information density. All values in **px** (design at 1×; @375 pt iPhone
frame). LH = line-height, LS = letter-spacing.

### 2.2.1 Master Scale

| # | Token | Figma Style Name | Family | Weight | Size | LH (px / ratio) | LS | Case | Usage |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `display-hero` | `Display/Hero` | Space Grotesk | 700 Bold | **48** | 52 / 1.08 | −0.02 em | Sentence | Splash, onboarding hero, "SOS ACTIVE" full-screen state |
| 2 | `display-1` | `Display/D1` | Space Grotesk | 700 Bold | **40** | 46 / 1.15 | −0.02 em | Sentence | Screen heroes, big empty-states, trip-summary title |
| 3 | `h1` | `Heading/H1` | Space Grotesk | 700 Bold | **32** | 38 / 1.19 | −0.015 em | Sentence | Page titles (Trip Planner, Community), post-ride stats headline |
| 4 | `h2` | `Heading/H2` | Space Grotesk | 600 SemiBold | **24** | 30 / 1.25 | −0.01 em | Sentence | Section headers, bottom-sheet titles, modal titles |
| 5 | `h3` | `Heading/H3` | Space Grotesk | 600 SemiBold | **20** | 26 / 1.30 | −0.005 em | Sentence | Card titles, route names, rider names in Squad list |
| 6 | `h4` | `Heading/H4` | Inter | 600 SemiBold | **17** | 24 / 1.41 | 0 | Sentence | Sub-card titles, list-group headers, settings rows |
| 7 | `body-lg` | `Body/Large` | Inter | 400 Regular | **17** | 26 / 1.53 | 0 | Sentence | Feed post body, long descriptions, onboarding paragraphs |
| 8 | `body-lg-em` | `Body/Large Emphasis` | Inter | 600 SemiBold | **17** | 26 / 1.53 | 0 | Sentence | Inline emphasis, author names in feed |
| 9 | `body-md` | `Body/Medium` | Inter | 400 Regular | **15** | 22 / 1.47 | 0 | Sentence | **Default body.** List items, sheet content, form labels |
| 10 | `body-md-em` | `Body/Medium Emphasis` | Inter | 600 SemiBold | **15** | 22 / 1.47 | 0 | Sentence | Selected states, key values in rows |
| 11 | `body-sm` | `Body/Small` | Inter | 400 Regular | **13** | 20 / 1.54 | +0.005 em | Sentence | Secondary/meta text, timestamps, helper text |
| 12 | `body-sm-em` | `Body/Small Emphasis` | Inter | 500 Medium | **13** | 20 / 1.54 | +0.005 em | Sentence | Chip labels, tab labels, badge text |
| 13 | `caption` | `Caption/12` | Inter | 500 Medium | **12** | 16 / 1.33 | +0.02 em | Sentence | Map POI labels, card footnotes, field hints |
| 14 | `caption-caps` | `Caption/12 Caps` | Inter | 600 SemiBold | **12** | 16 / 1.33 | +0.08 em | UPPER | Overlines, section eyebrows, `OFFLINE` / `LIVE` badges |
| 15 | `micro` | `Micro/11` | Inter | 500 Medium | **11** | 14 / 1.27 | +0.03 em | Sentence | Dense map labels, legend text, avatar initials |
| 16 | `micro-caps` | `Micro/11 Caps` | Inter | 700 Bold | **11** | 14 / 1.27 | +0.10 em | UPPER | Telemetry unit labels (`KM/H`, `ETA`, `ALT`), status pills |
| 17 | `legal` | `Micro/10 Legal` | Inter | 400 Regular | **10** | 14 / 1.40 | +0.02 em | Sentence | Attribution ("© OpenStreetMap"), legal, version strings |

### 2.2.2 Telemetry Scale (separate family — the instrument cluster)

These are **not** general headings. They exist only inside the HUD, gauges and stat blocks, and
they always use `tnum` tabular figures. Optimised for 0.6 s recognition.

| Token | Figma Style Name | Family | Weight | Size | LH | LS | Usage |
|---|---|---|---|---|---|---|---|
| `tel-xxl` | `Telemetry/XXL` | Space Grotesk | 700 | **64** | 64 / 1.0 | −0.03 em | Primary speed readout, full-screen HUD |
| `tel-xl` | `Telemetry/XL` | Space Grotesk | 700 | **44** | 46 / 1.05 | −0.025 em | Speed in compact HUD card, SOS countdown timer |
| `tel-lg` | `Telemetry/Large` | Space Grotesk | 700 | **32** | 34 / 1.06 | −0.02 em | Distance remaining, altitude, primary stat tiles |
| `tel-md` | `Telemetry/Medium` | Space Grotesk | 600 | **24** | 28 / 1.17 | −0.01 em | ETA, secondary stat tiles, group-member distance |
| `tel-sm` | `Telemetry/Small` | Inter | 600 | **17** | 22 / 1.29 | 0 | Inline stats in cards, elevation gain, curve count |
| `tel-unit` | `Telemetry/Unit` | Inter | 700 | **12** | 14 / 1.17 | +0.10 em | Unit suffix — always UPPERCASE, always ≥ 1 step below its value, 60 % opacity |
| `tel-label` | `Telemetry/Label` | Inter | 600 | **11** | 14 / 1.27 | +0.10 em | Field labels above values (`REMAINING`, `AVG SPEED`) |

**Pairing rule:** value + unit are one component. `88` at `tel-xxl` pairs with `KM/H` at
`tel-unit`, baseline-aligned, 4 px gap, unit at `text-tertiary` opacity.

### 2.2.3 Devanagari Companion Scale

Apply to any string containing Devanagari. Same sizes, adjusted vertical metrics.

| Latin token | Devanagari override |
|---|---|
| `h1` → | Mukta 700, 32 px, **LH 44** (+6), LS 0 |
| `h2` → | Mukta 700, 24 px, **LH 34** (+4), LS 0 |
| `h3` → | Mukta 600, 20 px, **LH 30** (+4), LS 0 |
| `body-lg` → | Mukta 400, 17 px, **LH 30** (+4), LS 0 |
| `body-md` → | Mukta 400, 15 px, **LH 26** (+4), LS 0 |
| `body-sm` → | Mukta 400, 13 px, **LH 22** (+2), LS 0 |
| `caption` → | Mukta 500, 12 px, **LH 18** (+2), LS 0 |

> Devanagari never takes negative tracking and never takes `-caps` variants.

### 2.2.4 Figma Implementation Notes

- Create every row above as a **Text Style**, named exactly as the "Figma Style Name" column,
  so the sidebar auto-groups into `Display / Heading / Body / Caption / Micro / Telemetry / NP`.
- Add a `Telemetry/*` style variant with **OpenType `tnum` enabled** in Type Details.
- Build a **Type Specimen frame** on the `🎨 Design System (Tokens)` page: every style rendered
  in Latin + Devanagari + digits `0123456789` + a real string
  (`"Jomsom → Muktinath · 22 km · 2,190 m"`).
- Build a **Blur Test frame**: duplicate the specimen, apply 3 px Layer Blur. Anything you can't
  identify is too small or too light for in-ride use.
- Set the `Display` and `Telemetry` styles to **Optical Sizing: Auto** where the variable axis exists.
- Line-height is entered in **px, never %**, so vertical rhythm stays on the 4 px grid.

### 2.2.5 Vertical Rhythm

All line-heights are multiples of **2 px** and snap to a **4 px baseline grid**. Spacing scale:

```
2 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96   (px)
```

Paragraph spacing = `0.5 × line-height`, rounded to the nearest 4 px.

---

## 2.3 Deliverables Checklist — Phase 2

- [ ] 5 font families activated in the Figma team library.
- [ ] 24 Latin text styles + 7 Devanagari overrides published.
- [ ] Type Specimen frame (Latin + Devanagari + numerals + real strings).
- [ ] Blur Test frame passing at 3 px.
- [ ] Tabular-numeral variant verified on all `Telemetry/*` styles.
- [ ] Dynamic Type behaviour documented per surface (HUD 130 % cap, Feed 200 %).
