# 🏍️ RideJaunm Design & System Repository — AI Agent Guidelines

> **Repository Role:** Single Source of Truth (SSOT) for Brand, Design System, Information Architecture, System Architecture, ADRs, and Codex Implementation Contracts for RideJaunm.
> **App Domain:** Motorcycle navigation and rider community platform engineered for Nepal's Himalayan terrain, mountain passes, offline cellular dead zones, and emergency mesh communication.

---

## 🎯 1. Core Principles for AI Agents

1. **Design & Architecture SSOT**:
   - This repository holds the **decisions, specifications, and contracts**.
   - Do NOT write mobile app build code or native binaries inside this repo; application code lives in companion repositories (e.g. `RideJaunm-Mobile`).
   - Every specification in `docs/` is written to be transcribable into Figma and directly implementable in code.

2. **Himalayan-Tactical Tech Design Invariants**:
   - **Primary Accent**: Volt (`#B4FF39`) for interactive elements, user location, and Curvy route.
   - **Secondary Accent**: Glacier Cyan (`#22C9EE`) for telemetry, GPS, and Straight route.
   - **Supercurvy Route Accent**: Ultra Magenta (`#C25CFF`).
   - **Strict Safety Rule**: **SOS Red (`#FF1F3D`) is strictly reserved for emergencies** and must NEVER be used for general errors, destructive dialogs, or decorative UI.
   - **Dark is the Origin**: Dark mode is the primary interface. Day-Glare mode (`snow-050`) is a high-contrast derivative for direct mountain sunlight.

3. **Safety & SOS Non-Negotiables**:
   - The emergency subsystem must **never claim false delivery** (e.g., never display "Help Dispatched" unless verified by human/provider receipt).
   - SOS trigger requires a **3-second deliberate hold** to arm, with radial progress, haptic feedback, and a **10-second cancellation window**.
   - Channel cascade order: `Local GPS ➔ BLE Mesh Relay ➔ Nepal Cellular ➔ Queued SMS Breadcrumb`.

---

## 📂 2. Repository Structure & Key Documents

```
Ride-jaum-Design/
├── docs/
│   ├── 01-brand-identity.md           # Brand pillars, voice, moodboard specs
│   ├── 02-typography.md               # Space Grotesk, Inter, Mukta, JetBrains Mono
│   ├── 03-color-system.md             # Color roles, 4 themes, route quad-coding
│   ├── 04-component-architecture.md   # Atoms & molecules (88px SOS, 56px in-ride button)
│   ├── 05-information-architecture.md # 5-tab sitemap, center SOS, critical flows
│   ├── 06-lofi-wireframes.md          # Layout blueprints for 16 core screens
│   ├── 07-hifi-specifications.md      # Glassmorphism, elevation, micro-interactions
│   ├── 08-figma-setup-roadmap.md      # Figma file hierarchy and token setup
│   ├── 09-nepal-offline-data-spec.md  # ~90 Nepal offline fields (landslides, fuel gaps, LZs)
│   ├── 10-design-to-code-react-native.md # React Native contract & quality gates
│   ├── 11-system-design.md to 14-...  # System Design, HLD, LLD, Full Architecture
│   ├── 15-adr-register.md to 25-...   # ADRs (ADR-001 to ADR-009) & Threat Model
│   ├── 26-s0-readiness.md to 29-...   # S0 readiness, S1 API & Event catalogues
│   └── 30-mobile-execution-log-r0-r5.md # Mobile build log & verified checklist
├── contracts/
│   └── openapi/v1.yaml                # OpenAPI 3.1.0 machine-readable specification
├── tokens/
│   └── ridejaunm.tokens.json          # Canonical W3C DTCG design token source
├── implementation/
│   ├── react-native-tokens.ts         # TypeScript token adapter for React Native
│   ├── task-manifest.md               # Mobile tasks (R0 to R18)
│   └── system-design-task-manifest.md # Backend system tasks (S0 to S13)
├── codex/
│   └── codex.md                       # Codex / AI agent implementation playbook
└── prompts/                           # Master prompts for mobile and backend builds
```

---

## 🧭 3. Rules When Modifying Specifications

- **Preserve Traceability**: Always update the respective ADR or design doc if a technical constraint changes.
- **Maintain W3C DTCG Token Compatibility**: Changes to colors, spacing, typography, or timing must be reflected in `tokens/ridejaunm.tokens.json` and `implementation/react-native-tokens.ts`.
- **API Changes**: All REST endpoint modifications must be updated in `contracts/openapi/v1.yaml` and `docs/28-s1-domain-api-schema-catalogue.md`.
- **Always update the Build Log**: When implementing tasks, record completion evidence and test results in `docs/` and `implementation/task-manifest.md`.
