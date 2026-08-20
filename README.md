<div align="center">

# 🏍️ RideJaunm — Design System & UX Strategy

**राइड जाऔं — Let's go. The road knows the way.**

*A mobile app for motorcycle riders in Nepal — curvier routes, live squad tracking,
offline-first maps, and an SOS that keeps calling for help after the network stops.*

`Design Direction: Himalayan-Tactical Tech` · `Platform: iOS + Android` · `Design Tool: Figma`

</div>

---

## 📖 What this repository is

This is the **design-operations repository** for RideJaunm — the single source of truth for the
brand, design system, information architecture, user flows, wireframe blueprints, hi-fi
specifications and Figma project strategy.

Figma holds the pixels. **This repo holds the decisions and Codex implementation contract.**

Every specification here is written to be *transcribable* — a designer should be able to open a
document and build the corresponding Figma page without inventing anything, and an engineer
should be able to read the same document and know what the thing must do.

---

## 🗂️ Repository structure

```
Ride-jaum-Design/
├── README.md                          ← you are here
├── LICENSE
├── .gitignore
├── docs/
│   ├── 01-brand-identity.md           PHASE 1 · Brand, mood, reference aggregation
│   ├── 02-typography.md               PHASE 2 · Fonts + full type scale matrix
│   ├── 03-color-system.md             PHASE 3 · Palette, theming, route colours
│   ├── 04-component-architecture.md   PHASE 4 · Atoms + molecules (Figma library)
│   ├── 05-information-architecture.md PHASE 5 · IA, navigation, critical flows
│   ├── 06-lofi-wireframes.md          PHASE 6 · Screen blueprints + validation
│   ├── 07-hifi-specifications.md      PHASE 7 · Visual styling + micro-interactions
│   ├── 08-figma-setup-roadmap.md      PHASE 8 · Figma structure + 10-week roadmap
│   └── 09-nepal-offline-data-spec.md  APPENDIX A · Nepal offline map data fields
└── tokens/
    └── ridejaunm.tokens.json          Machine-readable design tokens (W3C DTCG format)
```

## 🤖 React Native implementation guide

The Codex-facing implementation contract is now available alongside the design source:

- [Design-to-Code Guidelines](docs/10-design-to-code-react-native.md) — architecture, component and UX contracts, offline/SOS boundaries, and quality gates.
- [React Native token adapter](implementation/react-native-tokens.ts) — typed values derived from the DTCG source; UI code imports these rather than adding raw colours.
- [Build manifest](implementation/task-manifest.md) — dependency-ordered modular work items.
- [Master prompt](prompts/01-master-prompt.md) and [follow-up prompts](prompts/02-follow-up-meta-prompts.md).

The backend, geospatial, realtime, offline-pack, privacy and safety-service architecture is documented in the [System Design](docs/11-system-design.md), [High-Level Design](docs/12-system-hld.md), [Low-Level Design](docs/13-system-lld.md), [Full System Architecture](docs/14-full-system-architecture.md), [ADR register](docs/15-architecture-decision-records.md), [risk/threat/environment baseline](docs/16-system-risk-threat-environment.md), [S0 architecture-readiness record](docs/26-s0-architecture-readiness.md), [S1 API/event contract foundations](docs/27-s1-api-event-contract-foundations.md), [S1 domain/API schema catalogue](docs/28-s1-domain-api-schema-catalogue.md), [S1 event-schema catalogue](docs/29-s1-event-schema-catalogue.md), and machine-readable [OpenAPI v1 foundation](contracts/openapi/v1.yaml), [ADR-001 geospatial decision packet](docs/17-adr-001-geospatial-decision-packet.md), [ADR-002 identity/device decision packet](docs/18-adr-002-identity-device-decision-packet.md), [ADR-003 cloud/network/recovery decision packet](docs/19-adr-003-cloud-network-recovery-decision-packet.md), [ADR-004 eventing/realtime decision packet](docs/20-adr-004-eventing-realtime-decision-packet.md), [ADR-005 encrypted-mobile-store decision packet](docs/21-adr-005-mobile-encrypted-store-decision-packet.md), [ADR-006 media/moderation/retention decision packet](docs/22-adr-006-media-moderation-retention-decision-packet.md), [ADR-007 safety-channel/evidence decision packet](docs/23-adr-007-safety-channel-evidence-decision-packet.md), [ADR-008 Nepal consent/emergency-copy decision packet](docs/24-adr-008-nepal-consent-emergency-copy-decision-packet.md), and [ADR-009 country-configuration/expansion decision packet](docs/25-adr-009-country-configuration-expansion-decision-packet.md), with its own [system build manifest](implementation/system-design-task-manifest.md), [master prompt](prompts/03-system-design-master-prompt.md), and [follow-up prompts](prompts/04-system-design-follow-up-meta-prompts.md).

Mesh, crash detection, emergency delivery and satellite communication are intentionally capability-gated: their UI may be built, but it must never imply real-world delivery before native-device and operational validation.

---

## 🧭 The 8 Phases

| Phase | Document | What it decides |
|---|---|---|
| **1** | [Brand Identity, Mood & Direction](docs/01-brand-identity.md) | The 5 brand pillars, the market void, voice & tone, 7 aesthetic keywords, and a 6-section / ~120-image moodboard aggregation spec (competitors, Nepal terrain, UI patterns, accessibility stress boards). |
| **2** | [Typography](docs/02-typography.md) | Space Grotesk + Inter + Mukta + JetBrains Mono. A 17-step Latin scale, a 7-step **telemetry scale** with tabular numerals, and a Devanagari companion scale. The "vibration doctrine" for glanceable type. |
| **3** | [Colour System](docs/03-color-system.md) | **Volt** `#B4FF39` primary, **Glacier Cyan** `#22C9EE` secondary, **Graphite** dark neutrals, **Snowline** light neutrals, semantic system, and **SOS Red `#FF1F3D` — reserved, used nowhere else**. Plus 4 theme modes and the triple-mode route colours. |
| **4** | [Component Architecture](docs/04-component-architecture.md) | ~26 atoms and ~18 molecules for the Figma library, including the safety-critical `Button/SOS`, the signature `Control/RouteMode` 3-way switch, the Telemetry HUD, Rider Card, Feed Card and Map Controls. |
| **5** | [Information Architecture & Flows](docs/05-information-architecture.md) | A 5-tab bottom nav with **SOS in the centre**, a complete sitemap, and two fully-branched critical flows: *Group trip + Supercurvy route*, and *Offline SOS in a cellular dead zone*. |
| **6** | [Lo-Fi Wireframe Blueprint](docs/06-lofi-wireframes.md) | Zone-by-zone, pixel-height layout blueprints for the 4 core screens (Map HUD, Trip Planner, Community Feed, SOS Console) + 12 second-wave screens, and a 7-test wireframe validation protocol. |
| **7** | [Hi-Fi Specifications](docs/07-hifi-specifications.md) | The 8-step lo-fi→hi-fi transition protocol, a 7-layer elevation system, glassmorphism rules that survive a moving satellite map, radius language, and **3 mandatory micro-interactions**. |
| **8** | [Figma Setup & Roadmap](docs/08-figma-setup-roadmap.md) | The exact Figma team/file/page structure, naming conventions, permissions, plugin set, and a gated **10-week roadmap** (Foundations → Structure → Hi-Fi & Handoff). |
| **A** | [Nepal Offline Data Spec](docs/09-nepal-offline-data-spec.md) | ~90 Nepal-specific offline data fields: surface quality, monsoon/landslide risk, fuel gaps, permit zones, heli landing zones, cell dead-zones, BS calendar, bandh alerts. |

---

## 🎨 Design direction at a glance

### Himalayan-Tactical Tech

A rugged, expedition-grade tactical base carrying one high-energy neon accent.
Rugged credibility where it saves lives; premium glow where it creates desire.

**Aesthetic keywords:** `Himalayan-Tech` · `Tactical Glass` · `Hi-Vis Volt` ·
`Instrument Cluster` · `Topographic Brutalism` · `Prayer-Flag Chromatics` · `Monsoon Grit`

### Core palette

| Role | Token | Hex | |
|---|---|---|---|
| Primary accent | `volt-400` | `#B4FF39` | ![](https://placehold.co/16x16/B4FF39/B4FF39.png) Movement, energy, "you", interactive |
| Secondary | `cyan-400` | `#22C9EE` | ![](https://placehold.co/16x16/22C9EE/22C9EE.png) Information, GPS, terrain |
| Dark base | `graphite-900` | `#0B0F0E` | ![](https://placehold.co/16x16/0B0F0E/0B0F0E.png) Dark-mode map interface |
| Light base | `snow-050` | `#F7F9F8` | ![](https://placehold.co/16x16/F7F9F8/F7F9F8.png) Day-glare mode |
| **SOS** | `sos-500` | `#FF1F3D` | ![](https://placehold.co/16x16/FF1F3D/FF1F3D.png) **Emergency only — never decorative** |

### The three routing modes

| Mode | Colour | Line | Icon | Meaning |
|---|---|---|---|---|
| **Straight** | `#22C9EE` Glacier Cyan | solid 6 px | ➔ | Fastest, most direct |
| **Curvy** | `#B4FF39` Volt | solid 7 px + glow | ∿ | The signature ride |
| **Supercurvy** | `#C25CFF` Ultra Magenta | animated dash 8 px + glow | ⌇⌇ | Maximum bends, maximum commitment |

Every mode is **quad-coded** — hue + line pattern + icon + label — so it survives sunlight,
peripheral vision and colour-blindness.

### Typography

| | Family | Use |
|---|---|---|
| Display / UI | **Space Grotesk** 400–700 | Headings, telemetry values |
| Body | **Inter** 400–700 (`tnum`) | Feed, lists, all changing numbers |
| Devanagari | **Mukta** + Noto Sans Devanagari | Nepali UI and place names |
| Mono | **JetBrains Mono** | Coordinates, mesh node IDs |

---

## 🧱 Non-negotiable design principles

1. **Dark is default.** Light theme is a derivative, not the origin.
2. **Colour is meaning, never decoration.** And **red belongs to SOS alone**.
3. **Never colour alone** — every state is coded twice (colour + icon/shape/pattern).
4. **The map is the hero.** Chrome never exceeds ~35 % of the viewport while riding.
5. **Thumb-zone law.** Everything a moving rider touches lives in the bottom 45 %.
6. **Glove-first sizing.** 48 px minimum, 56 px in-ride, 88 px for SOS.
7. **Honest states.** GPS accuracy, tile freshness, mesh peers and battery show real values.
8. **Offline is a designed state**, not an error screen.
9. **Degrade, never fail.** Cellular → Mesh → Walkie-talkie → Breadcrumb.
10. **Deliberate to arm, deliberate to disarm.** SOS takes a 3-second hold, both ways.

---

## 🚨 The SOS subsystem

The most defensible thing this product owns. Above ~2,500 m in Mustang, Manang, Dolpa, Humla
and much of Karnali there is no cellular coverage — which is exactly where riders crash.

```
Cellular/GPS  →  BLE Mesh (multi-hop, TTL 6)  →  Walkie-talkie PTT  →  Breadcrumb + queued SMS
     ✖                    ✔ 3 peers                  ○ standby              ⟳ retrying
```

Because it is safety-critical, the SOS work is deliberately isolated:
a **separate Figma file**, **restricted permissions**, and a **separate sign-off gate**.
See [Flow B](docs/05-information-architecture.md#flow-b--activate-offline-sos-in-a-cellular-dead-zone)
and the [SOS Console blueprint](docs/06-lofi-wireframes.md#64-screen-4--emergency-sos-console).

---

## 🗺️ Figma page structure

Mirror this exactly in the Figma sidebar from day one:

```
ℹ️  Cover & Specs          Project overview, version history, documentation links
🎨  Design System (Tokens) Grid settings, colour styles, typography styles, effects
🧩  Atoms & Components     Buttons, icons, inputs, tabs, status bars
🎛️  Complex Modules        Cards, map HUD overlays, routing switchers, menus
🖼️  Moodboard & Assets     Competitor screens, Nepal terrain references, icon packages
✏️  Lo-Fi Wireframes       Quick black-and-white layouts mapping user logic
✨  Hi-Fi Screens          Final high-fidelity UI polished with real content
📱  Prototypes             Micro-animations, clickable flows, transitions
🚧  WIP / Scratch          Explicitly unreviewed
🗄️  Archive                Dated dead ends with a one-line "why we killed it"
```

---

## 🛣️ Roadmap summary

| Stage | Weeks | Focus | Gate |
|---|---|---|---|
| 🥇 **Foundations** | 1–3 | Research, moodboard, brand lock, **all tokens**, publish Design System v1.0.0 | Test screen renders in all 4 theme modes |
| 🥈 **Structure** | 4–6 | All atoms + molecules, IA, both flows, **54 lo-fi frames**, rider test round 1 | Every lo-fi screen built from real component instances |
| 🥉 **Hi-Fi & Handoff** | 7–10 | 4 core screens × 4 modes, second wave, custom icons, MI-1/2/3, prototypes, stress audit, Dev Mode | An engineer can build any screen without asking a question |

Full detail: [Phase 8 roadmap](docs/08-figma-setup-roadmap.md#82-actionable-roadmap).

---

## ✅ Definition of Done (per screen)

1. Built entirely from published component instances — zero detached layers
2. All colours bound to semantic variables; all text uses published styles
3. Renders correctly in Night, Day-Glare, Dusk and Blackout modes
4. Loading, empty, error and **offline** states designed
5. Contrast passed — body ≥ 4.5:1, telemetry ≥ 7:1, SOS ≥ 10:1
6. Colour-blind simulation passed (deuteran / protan / tritan)
7. Glare test (40 % brightness) and 4 px blur test passed
8. In-ride targets ≥ 56 px, verified with the glove overlay
9. Real Nepali content, longest-string tested, Devanagari verified
10. Annotated with behaviour, edge cases and analytics events; marked **Ready for Dev**

---

## 🧪 How we validate

We do not validate designs in an office.

| Test | Where |
|---|---|
| 5-second test + clickable prototype | 6–8 riders from Kathmandu riding groups |
| Glare + glove test | Outdoors, midday sun, on the tester's own phone, wearing riding gloves |
| Hi-fi ride test | Mounted on a real handlebar, engine running, stationary |
| Offline test | Every screen re-drawn with the network disabled — no dead ends |
| Content stress | Longest realistic Nepali strings (e.g. `साङ्खुवासभा जिल्ला, खाँदबारी`) |

---

## 🤝 Contributing

1. Work on a branch; one phase document or one component area per PR.
2. **Never introduce a raw hex value** into a spec — reference a token from
   [`tokens/ridejaunm.tokens.json`](tokens/ridejaunm.tokens.json) or Phase 3.
3. Any change to a safety-critical surface (SOS, crash detection, emergency contacts,
   mesh broadcast) requires a second reviewer and a note in the PR describing the failure mode.
4. Keep binaries out of Git. `.fig`, `.psd`, raw photography, map tiles and video are ignored by
   design — link them from the shared drive instead.
5. Update the relevant Deliverables Checklist when you complete work.

---

## 📄 Licence

See [LICENSE](LICENSE). Map data © OpenStreetMap contributors (ODbL) — attribution is mandatory
on every map surface in the product.

---

<div align="center">

**Never ride alone.**

</div>
