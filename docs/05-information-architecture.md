# PHASE 5 — Information Architecture & User Flows

---

## 5.1 Core App Architecture

### 5.1.1 Bottom Navigation — 5 tabs, one-handed

Designed around the **right-thumb arc** on a 6.1"–6.7" device. The most-used destination sits
centre-right; the least-used (Profile) sits at the far right where an intentional stretch is fine.

```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│                        [ CONTENT ]                            │
│                                                               │
├───────────────────────────────────────────────────────────────┤
│   🗺        🧭         ⬤          👥         👤              │
│  RIDE     PLAN      [SOS]      SQUAD     PROFILE              │
└───────────────────────────────────────────────────────────────┘
     1        2          3          4          5
```

| # | Tab | Icon (Phosphor) | Landing screen | Why here |
|---|---|---|---|---|
| 1 | **Ride** | `map-trifold` (fill when active) | Dashboard / Map Home with live HUD | The default. Opening the app should already show the map with GPS acquiring. |
| 2 | **Plan** | `compass` | Trip Planner (route modes, waypoints, saved trips) | Pre-ride intent. Second-most-used. |
| 3 | **SOS** | custom SOS glyph in a ring | Emergency Console | **Centre position = fastest average thumb reach.** Distinct treatment: slightly raised, `sos-500` ring, never volt. |
| 4 | **Squad** | `users-three` | Group list + live tracking + group chat | Social-coordination hub; badge shows unread + live-ride count. |
| 5 | **Profile** | `user-circle` | Profile, garage, stats, offline maps, settings | Least frequent; far-right stretch is acceptable. |

**Where's the Community feed?** Community lives as the **Feed** surface reached from a
persistent top-bar entry on the Ride tab *and* as the default sub-tab of Squad
(`Squad → Feed | Groups | Chat`). Rationale: putting a scrolling social feed in the primary
in-ride navigation invites riders to browse while riding. Social is deliberately one layer
deeper than the map. *(Alternative accepted in review: swap Profile → Feed and move Profile to
the top-right avatar. Document whichever you ship; do not run both.)*

**Navigation rules**
- Tab bar height 64 px + safe-area inset; `glass-map` blur over the map.
- Active state: volt filled icon + `caption-caps` volt label + 4 px top indicator bar.
- **The tab bar auto-hides in Ride Mode** (when speed > 15 km/h for 10 s) and returns on tap —
  the map earns the full screen while moving. The SOS tab does *not* hide; it collapses to a
  floating 88 px button.
- Badges: Squad (unread count), SOS (never badged — it must never look "notified").
- Long-press any tab → quick actions (e.g. long-press Plan → "Resume last route").

### 5.1.2 Full Screen Inventory (sitemap)

```
RideJaunm
│
├── 0. ONBOARDING (first-run only)
│   ├── 0.1 Splash / brand moment
│   ├── 0.2 Value carousel (3 cards: Curvier routes · Ride together · Never alone)
│   ├── 0.3 Auth (Phone OTP · Google · Apple) + Nepali/English language pick
│   ├── 0.4 Permission primers (Location "Always" → Bluetooth → Notifications → Battery-opt-out)
│   ├── 0.5 Rider profile (name, photo, bike from a Nepal-market garage list)
│   ├── 0.6 Emergency contacts (min 2, Nepal +977 validation)
│   └── 0.7 First offline region suggestion (based on district)
│
├── 1. RIDE  🗺
│   ├── 1.1 Map Home / Dashboard (HUD)
│   ├── 1.2 Ride Mode (active navigation, full-screen)
│   │   ├── 1.2.1 Turn-by-turn card
│   │   ├── 1.2.2 HUD sheet (peek / half / full)
│   │   └── 1.2.3 Blackout night mode
│   ├── 1.3 Layers & map style sheet
│   ├── 1.4 Search / destination
│   ├── 1.5 Ride summary (post-ride: stats, map, curvature score, share composer)
│   └── 1.6 Community Feed entry (top bar) → 4.1
│
├── 2. PLAN  🧭
│   ├── 2.1 Trip Planner (mode switch + waypoints + preview)
│   │   ├── 2.1.1 Route mode comparison (Straight | Curvy | Supercurvy)
│   │   ├── 2.1.2 Waypoint editor (reorder, add fuel/food/photo stops)
│   │   ├── 2.1.3 Route options (avoid unpaved, avoid tolls, max altitude, round-trip)
│   │   └── 2.1.4 Elevation & surface breakdown
│   ├── 2.2 Trip type: Solo | Group
│   │   └── 2.2.1 Group setup (name, invite, roles, rally point, rules)
│   ├── 2.3 Saved trips / My routes
│   ├── 2.4 Discover routes (curated + community, filter by district/curviness)
│   ├── 2.5 Offline maps manager
│   │   ├── 2.5.1 Region browser (province → district → custom box)
│   │   ├── 2.5.2 Download queue
│   │   └── 2.5.3 Storage manager
│   └── 2.6 Pre-ride checklist (fuel, tyres, permits, weather, tiles, battery)
│
├── 3. SOS  ⬤
│   ├── 3.1 Emergency Console (status + trigger)
│   ├── 3.2 Signal diagnostics (Cellular · GPS · Mesh · Satellite)
│   ├── 3.3 SOS Active (broadcasting, full-screen takeover)
│   ├── 3.4 Offline mesh console (peer list, topology, PTT walkie-talkie)
│   ├── 3.5 Emergency contacts & medical card (blood group, allergies, insurance)
│   └── 3.6 Nepal emergency directory (Police 100 · Ambulance 102 · Tourist Police 1144 ·
│           Nepal Police Traffic 103 · nearest hospital / health post / army post)
│
├── 4. SQUAD  👥
│   ├── 4.1 Feed (Following | Nearby | Routes)
│   │   ├── 4.1.1 Post detail + comments
│   │   ├── 4.1.2 Composer (photo/video/route/text)
│   │   └── 4.1.3 Rider profile (public)
│   ├── 4.2 Groups (my groups, discover, create)
│   │   ├── 4.2.1 Group detail (members, live map, chat, planned trips)
│   │   └── 4.2.2 Live group tracking map
│   ├── 4.3 Chat (group + DM, with offline/mesh fallback)
│   └── 4.4 Events / rides near you
│
└── 5. PROFILE  👤
    ├── 5.1 Profile & stats (total km, passes crossed, curvature score, badges)
    ├── 5.2 Garage (bikes, service log, fuel log)
    ├── 5.3 Ride history
    ├── 5.4 Offline maps (shortcut → 2.5)
    ├── 5.5 Settings (units, language, map style, privacy, data-saver, battery)
    ├── 5.6 Safety settings (crash detection, auto-check-in, SOS cadence, contacts)
    └── 5.7 Help, about, attribution
```

### 5.1.3 Global Surfaces (present across tabs)

| Surface | Behaviour |
|---|---|
| **Connectivity banner** | Slim persistent bar when offline / mesh-only / SOS-active. Priority: SOS > Mesh > Offline > Sync. |
| **SOS floating trigger** | Available on Ride, Plan, Squad. Collapses to an 88 px FAB in Ride Mode. |
| **Ride-in-progress pill** | If a ride is active and the user navigates away, a persistent pill (`● RIDING · 18.4 km`) returns them to the HUD. |
| **Voice/PTT overlay** | When mesh PTT is enabled, a floating 72 px PTT button docks bottom-left. |

---

## 5.2 Critical User Flow Maps

### FLOW A — Create a Group Trip with a Supercurvy Route

**Actor:** Sabin, 29, Kathmandu, RE Himalayan 450. Organising a 6-rider weekend ride to Daman
via the Tribhuvan Rajpath.
**Goal:** Plan a maximum-bends route, invite 5 riders, ensure everyone has offline tiles.
**Success metric:** ≤ 90 s from tab-open to invites sent. ≤ 8 taps to route selection.

```
[ENTRY] Plan tab  ──or──  Ride tab › "Plan a trip" CTA  ──or──  deep-link from a Feed route card
   │
   ▼
┌─ A1 · TRIP PLANNER (empty) ────────────────────────────────────┐
│ Map fills screen. Bottom sheet at HALF detent.                 │
│ • "Start" pre-filled = current location (chip, tappable)       │
│ • "Where to?" search field, focused-on-open                    │
│ • Trip-type segmented control:  [ SOLO ] [ GROUP ]  ← SOLO     │
│ • Recent + saved destinations list beneath                     │
└────────────────────────────────────────────────────────────────┘
   │ taps GROUP                            ← 1 tap, before routing,
   ▼                                         so group context shapes the whole flow
┌─ A2 · TRIP TYPE = GROUP ───────────────────────────────────────┐
│ Sheet morphs (240 ms): a "Squad" strip appears above search.   │
│ • [+ Invite riders]  · shows "Just you" avatar for now         │
│ • Micro-hint: "Group trips sync routes and live location."     │
└────────────────────────────────────────────────────────────────┘
   │ types "Daman"
   ▼
┌─ A3 · DESTINATION SEARCH ──────────────────────────────────────┐
│ Live results (debounce 250 ms):                                │
│  📍 Daman, Makwanpur · 78 km · ⬇ offline available             │
│  📍 Daman View Tower · 79 km                                   │
│  🗺 Drop a pin on the map                                      │
│ Offline note if no cell: "Searching downloaded maps only."     │
└────────────────────────────────────────────────────────────────┘
   │ selects "Daman, Makwanpur"
   ▼
┌─ A4 · ROUTE MODE SELECTION  ⭐ the signature moment ───────────┐
│ Map animates to fit bounds (700 ms ease-out) and draws         │
│ ALL THREE routes simultaneously, colour-coded:                 │
│   ── cyan solid      STRAIGHT     58 km · 2h 10m ·  38 bends   │
│   ── volt solid      CURVY        74 km · 2h 55m · 121 bends   │
│   ── magenta dashed  SUPERCURVY   96 km · 3h 50m · 214 bends   │
│                                                                │
│ Sheet shows Control/RouteMode (3-way switch), CURVY preselected│
│ Below it: live stat strip + elevation profile + surface bar    │
│   "↑ 2,320 m · ↓ 980 m · 82% paved · 18% gravel"               │
│ Hazard chips if any: "⚠ Landslide-prone: km 41–46"             │
└────────────────────────────────────────────────────────────────┘
   │ taps SUPERCURVY (or swipes the switch right)
   ▼
┌─ A5 · SUPERCURVY SELECTED ─────────────────────────────────────┐
│ • Indicator pill slides to segment 3 (320 ms spring)           │
│ • Other two routes fade to route-alt grey @60% (300 ms)        │
│ • Magenta route thickens 7→8 px, dash animation starts flowing │
│ • Camera does a 1.2 s cinematic flyover of the curviest section│
│ • CurvatureMeter animates 0 → 87 "Curviness Score"             │
│ • Haptic: selection tick. Badge: "214 bends · Top 5% in Nepal" │
│ • Warning chip if applicable: "Supercurvy adds 38 km & 1h 40m" │
└────────────────────────────────────────────────────────────────┘
   │ (optional) taps "Waypoints" ────────────────────────────────┐
   │                                                             ▼
   │                              ┌─ A5a · WAYPOINT EDITOR ──────────────┐
   │                              │ Drag-reorder list. Suggested stops:  │
   │                              │  ⛽ Naubise fuel (last before climb) │
   │                              │  ☕ Tistung chiya · 📷 Daman viewpoint│
   │                              │ Add stop → map long-press or search  │
   │                              │ Route re-computes with a 400 ms morph│
   │                              └──────────────────────────────────────┘
   ▼
┌─ A6 · INVITE SQUAD ────────────────────────────────────────────┐
│ Sheet → FULL detent. Tabs: [Contacts] [My Groups] [Link]       │
│ • "Kathmandu Curve Chasers" group → Select all (5)             │
│ • Per-rider row shows: has-app? · has-offline-tiles? · bike    │
│ • Roles: Lead (Sabin, default) · Sweep (assignable) · Rider    │
│ • Rally point + departure time picker (BS/AD toggle)           │
│ • Share link fallback for riders without the app (SMS/WhatsApp)│
└────────────────────────────────────────────────────────────────┘
   │ taps "Send invites"
   ▼
┌─ A7 · PRE-RIDE READINESS ──────────────────────────────────────┐
│ Auto-generated checklist, per rider where known:               │
│  ✅ Route saved & shared with 5 riders                         │
│  ⚠️  Offline maps: 2 of 6 riders missing Makwanpur tiles       │
│      → [Nudge them]  (sends a deep-link to download 214 MB)    │
│  ✅ Weather: clear, 9°C at Daman, 05:40 sunrise                │
│  ⚠️  Fuel: last pump at Naubise, km 26 — 70 km dry stretch     │
│  ✅ Emergency contacts set for 6 of 6                          │
│  ℹ️  Mesh SOS will auto-arm above 2,000 m                      │
│                                                                │
│ [ Download my offline maps ]   [ Done ]                        │
└────────────────────────────────────────────────────────────────┘
   │
   ▼
[EXIT] Trip appears in "Saved trips" + on every invited rider's Squad tab
       with a "Ride starts in 2 days" card and a one-tap "Start Ride" on the day.
```

**Edge cases to wireframe:**
| Case | Handling |
|---|---|
| No Supercurvy route exists (straight terai roads) | Segment disabled with a caption: *"Not enough bends here. Try the hills."* + suggests a nearby curvy region |
| Supercurvy crosses a restricted zone (Upper Mustang) | Blocking chip: *"Permit required — Upper Mustang. [Learn more]"* with reroute option |
| Rider offline while invited | Invite queues; delivers on reconnect; shows `PENDING` on the roster |
| Route crosses a monsoon-closed segment | Route auto-flags `warning-400` hazard overlay + suggests an alternate |
| Group exceeds 20 riders | Suggests splitting into sub-squads with separate leads |

---

### FLOW B — Activate Offline SOS in a Cellular Dead Zone

**Actor:** Aayush, riding Beni → Jomsom. Low-side crash at ~2,600 m on gravel. No cellular
service. Two squad members are 4 km ahead; one is 1.5 km behind.
**Goal:** Get help without a network.
**Success metric:** ≤ 3 s to arm, ≤ 10 s to first mesh acknowledgement, works with gloves on, works one-handed on the ground.

```
[PRE-CONDITION — automatic, before anything goes wrong]
   App detects: cellular = none for > 60 s  AND  altitude > 2,000 m  AND  ride active
      → Silently enables OFFLINE RESILIENCE MODE:
         • Bluetooth LE mesh advertising ON, scan interval 15 s
         • Peer discovery of squad members within ~150–300 m LOS (BLE),
           extended via multi-hop relay through riders
         • Last-known-good GPS fix cached every 30 s to local store
         • Breadcrumb trail written to disk
         • Connectivity banner: "OFFLINE · MESH ACTIVE · 3 riders in range" (cyan)
   No modal. No interruption. The rider is told, not asked.

┌─ B0 · CRASH DETECTION (parallel path) ─────────────────────────┐
│ Accelerometer + gyro detect >4 g impact followed by 12 s of    │
│ zero motion  →  full-screen auto-SOS countdown:                │
│                                                                │
│        ┌────────────────────────────────┐                      │
│        │   CRASH DETECTED               │                      │
│        │                                │                      │
│        │            ⏱  27               │  ← tel-xxl countdown │
│        │   Sending SOS to your squad    │                      │
│        │                                │                      │
│        │   [ I'M OK — CANCEL ]  ← 88px  │                      │
│        └────────────────────────────────┘                      │
│ Loud siren + max-brightness screen + continuous heavy haptics. │
│ 30 s to cancel. Silence-able but not dismissible.              │
└────────────────────────────────────────────────────────────────┘
        │ (not cancelled → jumps straight to B4)
        │
[MANUAL PATH]
   │
   ▼
┌─ B1 · TRIGGER ─────────────────────────────────────────────────┐
│ Any of:                                                        │
│  • 88 px SOS FAB on the map (bottom-right thumb arc)           │
│  • SOS tab (centre of the bottom bar)                          │
│  • Hardware: 5× rapid power-button press (OS-level shortcut)   │
│  • Voice: "RideJaunm, emergency"  (works offline, on-device)   │
│  • Bluetooth helmet-intercom button, 3 s hold                  │
└────────────────────────────────────────────────────────────────┘
   │
   ▼
┌─ B2 · EMERGENCY CONSOLE ───────────────────────────────────────┐
│ Full-screen. graphite-950 base. NO map (saves battery & attention)│
│                                                                │
│  SIGNAL MATRIX (the honesty panel — this is the whole point):  │
│   📶 Cellular   ✖  NO SERVICE        last seen 41 min ago      │
│   🛰 GPS        ✔  LOCKED  ±6 m      28.7823°N, 83.6402°E      │
│   📡 Mesh       ✔  3 PEERS           nearest 1.5 km (2 hops)   │
│   🛰 Satellite  ✖  NOT PAIRED        [Pair inReach/Zoleo]      │
│                                                                │
│  → Mode auto-selected: OFFLINE MESH  (bordered cyan, labelled  │
│    "Cellular unavailable — using rider mesh")                  │
│                                                                │
│         ┌───────────────────┐                                  │
│         │       ⬤ SOS       │  ← 88 px, hold 3 s               │
│         │   HOLD 3 SECONDS  │                                  │
│         └───────────────────┘                                  │
│                                                                │
│  Secondary: [ 🎙 Walkie-talkie ]  [ ⚠ Non-urgent: "I'm stopped"]│
└────────────────────────────────────────────────────────────────┘
   │ press & hold
   ▼
┌─ B3 · LONG-PRESS ARMING (3.0 s) ───────────────────────────────┐
│ • Conic progress ring fills white over sos-900                 │
│ • Countdown 3 · 2 · 1 in tel-xl                                │
│ • Haptics: light @0s, medium @1s, medium @2s, HEAVY @3s        │
│ • Rising 3-tone chirp                                          │
│ • Screen brightness ramps to 100%                              │
│ • Release early → 240 ms unwind + "SOS cancelled" toast        │
└────────────────────────────────────────────────────────────────┘
   │ completes
   ▼
┌─ B4 · 10-SECOND CANCEL WINDOW ─────────────────────────────────┐
│ Full-screen sos-900 wash, pulsing red border.                  │
│   "SOS ARMING — 10"  large countdown                           │
│   [ CANCEL ]  ← full-width 64 px, the ONLY control             │
│ Prevents pocket-fires and panic-taps.                          │
└────────────────────────────────────────────────────────────────┘
   │ elapses
   ▼
┌─ B5 · SOS ACTIVE — MULTI-CHANNEL BROADCAST ────────────────────┐
│ ● SOS ACTIVE · 00:14  (persistent red header, undismissible)   │
│                                                                │
│ TRANSMISSION LADDER (all attempted in parallel, shown live):   │
│  1. 📡 BLE Mesh broadcast ......... ✔ SENT · 3 peers · 2 ACK   │
│       Packet: {id, name, blood group, lat/lon, alt, time,      │
│                battery, "CRASH"} — 512-byte encrypted payload  │
│       Re-broadcast every 30 s. Peers relay outward (TTL 6 hops)│
│  2. 🎙 Walkie-talkie ............. ○ STANDBY  [ Hold to talk ] │
│       Opens a live half-duplex voice channel over the mesh     │
│  3. 📶 Cellular ................... ⟳ RETRYING every 60 s      │
│       Queues an SMS to 2 emergency contacts + a data POST;     │
│       fires the instant a single bar appears                   │
│  4. 🛰 Satellite .................. ✖ Not paired               │
│                                                                │
│ MY STATUS CARD                                                 │
│   Aayush Thapa · O+ · Allergy: penicillin                      │
│   28.7823°N 83.6402°E · 2,614 m · 14:22 NPT                    │
│   Battery 61% · [ Enable battery-saver broadcast ]             │
│                                                                │
│ RESPONDERS (live, updates as ACKs arrive)                      │
│   ◉ Bibek   ✔ ACKNOWLEDGED · 1.5 km behind · ETA 4 min         │
│   ◉ Prakash ✔ ACKNOWLEDGED · 4.1 km ahead · turning back       │
│   ◉ Nisha   ○ relayed, no ACK yet                              │
│                                                                │
│ [ 🎙 HOLD TO TALK ]        [ STAND DOWN — hold 3 s ]           │
└────────────────────────────────────────────────────────────────┘
   │
   ├──► If ANY cellular returns for even 5 s:
   │      • SMS to contacts + Nepal Police 100 / Ambulance 102 template
   │      • Full incident payload uploaded
   │      • Banner: "Cellular reached — help notified at 14:31"
   │
   ├──► Peer devices receive: full-screen red alert, siren, one-tap
   │      "I'M COMING" (relays an ACK back through the mesh) +
   │      turn-by-turn navigation to the victim's coordinates,
   │      routed on their OFFLINE tiles
   │
   ├──► Battery guardian: below 15 %, broadcast interval stretches
   │      30 s → 120 s, screen dims to 10 %, all non-SOS features
   │      suspend. Estimated broadcast endurance shown in hours.
   │
   ▼
┌─ B6 · STAND DOWN ──────────────────────────────────────────────┐
│ Requires a deliberate 3 s hold (never a single tap).           │
│ Confirmation: "Are you safe? This stops the broadcast."        │
│ Sends an "ALL CLEAR" packet across the mesh + SMS when online. │
│ Generates an incident report: timeline, coordinates, responders│
│ ACK log, exportable as PDF/GPX for insurance or police.        │
└────────────────────────────────────────────────────────────────┘
```

**Design principles proven by this flow**
1. **Degrade, never fail.** Cellular → Mesh → Walkie-talkie → Breadcrumb. Something always works.
2. **Never lie about connectivity.** The Signal Matrix shows raw truth with timestamps.
3. **Deliberate to arm, deliberate to disarm.** 3 s hold both ways; 10 s cancel window between.
4. **Battery is a safety resource.** The app actively rations it once SOS is live.
5. **The rider may be injured.** One-handed, high-contrast, huge targets, audio + haptic
   redundancy, works with a cracked screen and gloves.

**Edge cases to wireframe:**
| Case | Handling |
|---|---|
| Zero peers in mesh range | State: *"No riders in range. Broadcasting anyway — your phone will keep trying."* Shows breadcrumb + "last seen by squad" and a walk-uphill hint: *"Higher ground may reach a peer."* |
| GPS also lost | Falls back to last-known fix + dead-reckoning estimate, clearly labelled `LAST KNOWN 14:09 · ±400 m` |
| Phone at 4 % | Ultra-low-power mode: black screen, single red pixel-pulse, broadcast every 5 min, coordinates cached |
| False alarm | 10 s cancel window + 3 s stand-down + a friendly "no harm done" confirmation |
| Rider is the responder | Receives alert → offline navigation to victim → an in-mesh chat thread → a "reached victim" state |
| Solo rider, no squad | Mesh broadcasts to **any** RideJaunm user in range (opt-in "Good Samaritan" setting), plus the queued-SMS ladder |

---

## 5.3 Cross-Cutting IA Rules

| Rule | Detail |
|---|---|
| **Depth limit** | No destination is more than 3 taps from its tab root. SOS is ≤ 2 taps from anywhere. |
| **Back behaviour** | Sheets dismiss to their previous detent before popping the screen. |
| **Offline parity** | Every screen has a defined offline state. Plan, Ride and SOS are **fully** functional offline. Squad/Feed degrade to cached + queued. |
| **State persistence** | An interrupted ride resumes with a full state restore, including waypoint progress. |
| **Deep links** | `ridejaunm://route/{id}`, `://group/{id}/join`, `://sos/{incident}` (responder link), `://offline/{region}`. |
| **Language** | Every string has a Nepali translation; language is switchable without restart; place names show Devanagari + romanised. |

---

## 5.4 Deliverables Checklist — Phase 5

- [ ] Sitemap frame (FigJam or Figma) with all 5 tabs expanded.
- [ ] Bottom-nav component with all 5 tabs × 4 states + hidden/ride-mode variant.
- [ ] Flow A mapped as a clickable FigJam flow with every edge case branched.
- [ ] Flow B mapped, including the crash-detection parallel path and 6 edge cases.
- [ ] Offline-state matrix: every screen × (online / offline / mesh-only / SOS-active).
- [ ] Thumb-reach heatmap overlay on the bottom-nav and HUD frames.
