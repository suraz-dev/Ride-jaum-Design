# APPENDIX A — Nepal-Focused Offline Map Data Fields

> Requested as a full spec. This defines **what data the offline map region carries**, how it is
> surfaced in the UI, and how it degrades. This is the layer that makes RideJaunm a *Nepal* app
> rather than a translated Alpine one.

---

## A.1 Region Model — how a rider selects what to download

Three selection modes, in order of expected use:

| Mode | UX | Typical size |
|---|---|---|
| **Route Corridor** (default, recommended) | Auto-computed buffer of 15 km either side of the planned route, plus a 25 km radius around start/end and each waypoint. One tap: *"Download this route offline."* | 80–400 MB |
| **Administrative Region** | Province → District → Municipality drill-down. Nepali + English names. | 200 MB – 2.4 GB |
| **Custom Box** | Drag a rectangle on the map; live size estimate updates as you drag. | user-defined |

**Zoom-level tiers** (the rider chooses; this is the biggest size lever):

| Tier | Zooms | Contains | Size multiplier |
|---|---|---|---|
| `Essential` | z0–z12 | Highways, districts, major towns, contours | 1× |
| `Standard` (default) | z0–z14 | + rural roads, villages, POIs, fuel | 3.2× |
| `Detailed` | z0–z16 | + trails, buildings, fine contours, house numbers | 11× |
| `Satellite` | z0–z15 raster | Imagery layer (large) | +4–8× on top |

---

## A.2 Core Data Fields

### A.2.1 Region metadata

| Field | Type | UI surface | Notes |
|---|---|---|---|
| `region_id` | string | — | e.g. `np-gandaki-mustang` |
| `name_en` | string | Region card title | "Mustang District" |
| `name_np` | string (Devanagari) | Subtitle | "मुस्ताङ जिल्ला" |
| `province` | enum(1–7) | Breadcrumb | Koshi, Madhesh, Bagmati, Gandaki, Lumbini, Karnali, Sudurpashchim |
| `district` | string | Breadcrumb | 77 districts |
| `bbox` | geo | Map preview | — |
| `area_km2` | number | Card meta | — |
| `tile_count` | int | Download progress | Drives the tile-materialisation animation (MI-3) |
| `size_bytes` | int | Card meta + storage bar | Shown in MB/GB, tabular numerals |
| `zoom_range` | [min,max] | Tier chip | — |
| `downloaded_at` | timestamp | Freshness badge | — |
| `data_version` | string | Detail sheet | OSM extract date + our enrichment build |
| `freshness_state` | enum | Badge colour | `fresh` (<30 d, volt) · `aging` (30–90 d, none) · `stale` (>90 d, amber) · `expired` (>180 d, danger) |
| `elevation_range` | [min,max] m | Card meta | e.g. 1,190–8,167 m |

### A.2.2 Road & route attributes (per way segment)

| Field | Type | UI surface | Why Nepal needs it |
|---|---|---|---|
| `surface` | enum: `asphalt` · `chipseal` · `gravel` · `dirt` · `rock` · `riverbed` · `concrete` | Surface composition bar; dashed rendering for unpaved | "Road exists" ≠ "road is rideable on a 350" |
| `surface_quality` | enum: `good` · `fair` · `poor` · `broken` | Colour-coded overlay | Post-monsoon degradation is the norm |
| `width_class` | enum: `two-lane` · `single-lane` · `single-track` | Route warnings | Single-lane with a 600 m drop changes the ride |
| `curvature_score` | 0–100 per km | Feeds Curvy/Supercurvy routing | The core routing input |
| `bend_count` | int per segment | Route stats, "214 bends" | The trophy metric |
| `max_gradient_pct` | number | Warning chip | 20 %+ climbs matter on a loaded 350 |
| `exposure` | enum: `none` · `moderate` · `severe` | Hazard chip | Cliff exposure without barriers |
| `barrier_present` | bool | Hazard chip | Most Nepali mountain roads have none |
| `seasonal_status` | enum: `open` · `seasonal` · `closed` · `unknown` | Route blocking + advisory | — |
| `closure_months` | array | Advisory | e.g. Thorong-adjacent tracks, high passes Dec–Mar |
| `monsoon_risk` | enum: `low` · `medium` · `high` · `extreme` | Hazard overlay (amber hatch) | Shrawan–Bhadra landslide season |
| `landslide_zone` | bool + polygon | `map-hazard` overlay | Sindhupalchok, Myagdi, Rasuwa corridors |
| `river_crossing` | bool + depth estimate | Waypoint warning | Fords that vanish in monsoon |
| `bridge_type` | enum: `concrete` · `bailey` · `suspension` · `none` | POI + warning | Suspension bridges = walk the bike |
| `toll` | bool + amount NPR | Route options | — |
| `dor_road_code` | string | Detail sheet | Dept. of Roads reference (e.g. `H04`, `F045`) |
| `last_verified` | timestamp + source | Trust indicator | Community-verified vs OSM-only |

### A.2.3 Fuel & services (the range-anxiety layer)

| Field | Type | UI surface |
|---|---|---|
| `fuel_station.name` | string | Map POI + planner list |
| `fuel_station.brand` | enum: `NOC` · `private` · `bottle` | Icon variant — **`bottle`** = informal roadside jerrycan sellers, critical in Karnali/Mustang |
| `fuel_station.petrol` / `.diesel` | bool | Filter |
| `fuel_station.hours` | string | POI sheet |
| `fuel_station.reliability` | enum: `reliable` · `intermittent` · `shortage-prone` | Warning colour |
| `fuel_station.last_confirmed` | timestamp | Trust indicator |
| **`fuel_gap_km`** | computed | **Route warning: "70 km dry stretch after Naubise"** |
| `mechanic` / `puncture_shop` | POI | Layer toggle — *punchar* shops are the real roadside network |
| `tyre_shop`, `ev_charger` | POI | Layer toggle |
| `atm` / `bank` | POI | Cash-only regions matter |
| `mobile_coverage` | enum: `ntc` · `ncell` · `both` · `none` + polygon | **Coverage overlay — directly feeds the SOS mesh logic** |

### A.2.4 Safety & emergency infrastructure ⭐ (feeds the SOS subsystem)

| Field | Type | UI surface |
|---|---|---|
| `hospital.name` / `.level` | enum: `central` · `zonal` · `district` · `PHC` · `health_post` | SOS directory, nearest-facility routing |
| `hospital.trauma_capable` | bool | **Prioritised in SOS routing** |
| `hospital.phone` | string | One-tap call (queued if offline) |
| `hospital.coords` | geo | Offline navigation target |
| `police_post.coords` / `.phone` | geo/string | SOS directory |
| `army_post.coords` | geo | Often the only rescue capability at altitude |
| `heli_pad` / `heli_landing_zone` | geo + suitability | **Critical for mountain evacuation** — flat ground above 3,000 m |
| `rescue_operator` | list | Heli-rescue companies + insurance-accepted flags |
| `checkpoint.type` | enum: `police` · `army` · `acap` · `tims` · `customs` · `permit` | Route advisory + document reminder |
| `permit_zone` | polygon + type | **Blocking advisory** — Upper Mustang, Upper Dolpa, Manaslu, Kanchenjunga, Humla |
| `permit.cost_npr` / `.issuing_office` | number/string | Pre-ride checklist |
| `restricted_area` | polygon | `map-restricted` red hatch — no routing through |
| `border_zone` | polygon | Advisory (Tibet/India frontier sensitivity) |
| `emergency_numbers` | static | Police 100 · Ambulance 102 · Fire 101 · Tourist Police 1144 · Traffic 103 · Nepal Red Cross 4270650 |
| `known_blackspot` | geo + description | Accident-history markers |
| `cell_dead_zone` | polygon | **Pre-warns riders where mesh SOS becomes the only channel** |

### A.2.5 Terrain & environment

| Field | Type | UI surface |
|---|---|---|
| `dem_tiles` | raster | 3D terrain, hillshade, elevation profile |
| `contour_interval_m` | int | Map style (20 m detailed / 100 m standard) |
| `pass_name` / `pass_elevation` | string/number | Named waypoint markers — Thorong La 5,416 m, Korala 4,660 m, Daman 2,322 m |
| `snowline_estimate_m` | number + month | `map-snowline` wash, seasonal |
| `altitude_warning_zones` | polygon >3,500 m | **AMS advisory: "You'll climb 2,100 m today — acclimatise"** |
| `oxygen_pct_at_altitude` | computed | Info chip (bike carburetion + rider health) |
| `avg_temp_by_month` | number | Gear advisory: "−4 °C at Muktinath in Poush" |
| `wind_advisory` | zone + typical hours | **Kali Gandaki valley: high winds after 11:00 — ride early** |
| `sunrise` / `sunset` | computed per coord/date | Daylight-remaining warning |
| `river_name_np` | string | Map labels in Devanagari |
| `protected_area` | polygon | ACAP, Sagarmatha, Chitwan, Langtang, Shey Phoksundo — entry fees & rules |

### A.2.6 Culture, stops & accommodation

| Field | Type | UI surface |
|---|---|---|
| `chiya_stop` / `bhatti` / `restaurant` | POI | The single most-used waypoint type in Nepali riding |
| `homestay` / `lodge` / `hotel` | POI + price band | Multi-day trip planning |
| `camping_spot` | POI + water availability | — |
| `viewpoint` | POI + best-time-of-day | Photo-stop waypoints |
| `temple` / `monastery` / `stupa` | POI | Cultural waypoints (Muktinath, Manakamana) |
| `festival_closure` | date range + region | **Roads genuinely close for Dashain/Tihar/Indra Jatra processions and bandhs** |
| `bandh_alert` | live when online, cached | Strike/road-block advisory — a real Nepali riding variable |
| `water_source` | POI + potable flag | High-altitude essential |
| `toilet` | POI | — |

### A.2.7 Localisation & units

| Field | Value |
|---|---|
| `language` | `en` / `ne` — full UI + place names, switchable without restart |
| `script` | Latin + Devanagari; place labels render both (`Jomsom / जोमसोम`) |
| `calendar` | Gregorian (AD) + **Bikram Sambat (BS)** toggle for trip dates |
| `units` | km / metres / km-h (default); miles supported for tourists |
| `currency` | NPR, `रू` symbol |
| `timezone` | `Asia/Kathmandu` (UTC+05:45) — the app must handle the 45-minute offset correctly in ETAs and SOS timestamps |
| `phone_format` | `+977 9XXXXXXXXX` validation on emergency contacts |
| `coordinates` | Decimal degrees default; DMS + MGRS available for rescue coordination |

---

## A.3 Offline Maps UI — screen specification

```
┌─────────────────────────────────────────────────┐
│  [←]      OFFLINE MAPS              [+ Add]     │
├─────────────────────────────────────────────────┤
│  Storage:  3.2 GB used · 12.8 GB free           │
│  ▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░               │  segmented by region
├─────────────────────────────────────────────────┤
│  [ All ]  [ Downloading ]  [ Stale ]            │
├─────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────┐ │
│ │ ▭▭▭  Mustang District                       │ │  96px card
│ │ ▭▭▭  मुस्ताङ जिल्ला                          │ │
│ │      214 MB · z0–14 · 12 days ago    ✅ FRESH│ │
│ │      Fuel 6 · Health posts 4 · Heli 2       │ │  ← the Nepal fields
│ │      ⚠ Permit zone: Upper Mustang           │ │     surfaced as value
│ │                                    [⋯]      │ │
│ └─────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────┐ │
│ │ ▭▭▭  Kathmandu Valley + Rajpath             │ │
│ │      ⟳ 68% · 142/380 tiles · 2 min left     │ │  ← MI-3 materialisation
│ │      ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░           [⏸]     │ │
│ └─────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────┐ │
│ │ ▭▭▭  Sindhupalchok                          │ │
│ │      184 MB · 97 days ago         ⚠ STALE   │ │
│ │      Landslide data may be outdated         │ │  ← honest degradation
│ │                              [ Update ]     │ │
│ └─────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────┤
│  ⓘ Auto-update over Wi-Fi         [ toggle ]    │
│  ⓘ Keep route corridors fresh     [ toggle ]    │
└─────────────────────────────────────────────────┘
```

### Behavioural rules

| Rule | Detail |
|---|---|
| **Never silently stale** | A region past 90 days shows an amber badge everywhere it appears, including on the map itself (a subtle desaturation of that area). |
| **Hazard data expires faster than base maps** | Landslide, closure and bandh data carry a 14-day freshness clock even if the tiles are fresh. Show them separately. |
| **Partial downloads are usable** | A 68 %-complete region works for the tiles it has; the missing area renders as wireframe, not as a blank void. |
| **Wi-Fi-first** | Default to Wi-Fi-only downloads with an explicit "use mobile data" override showing the estimated cost. Nepali mobile data is metered and precious. |
| **Storage guardian** | Warns at 90 % device storage; suggests the least-recently-used region for deletion; never auto-deletes. |
| **Route corridor auto-refresh** | If a saved trip's corridor is stale and the trip start date is within 7 days, prompt a refresh. |
| **What works offline** | ✅ Full routing (all 3 modes), navigation, HUD telemetry, GPS, SOS mesh, walkie-talkie, breadcrumb recording, saved trips, cached feed reading, post drafting. ❌ New search beyond cached, live traffic, feed refresh, live group location beyond mesh range. **This list must appear verbatim in the app's Help section.** |

---

## A.4 Data Sourcing & Trust

| Layer | Source | Refresh |
|---|---|---|
| Base map | OpenStreetMap (Nepal extract via Geofabrik) | Weekly |
| Elevation / DEM | SRTM 30 m + ALOS 30 m | Static |
| Satellite imagery | Mapbox / Esri / Sentinel-2 | Quarterly |
| Road surface & quality | OSM tags + **community verification** + Dept. of Roads data | Continuous |
| Curvature | Computed in-house from OSM geometry | On base-map refresh |
| Landslide / closure | Nepal DoR bulletins + NDRRMA + community reports | Daily in monsoon |
| Fuel stations | OSM + NOC listings + community | Monthly |
| Health/police/army posts | MoHP facility registry + community | Quarterly |
| Permit zones | Dept. of Immigration / NTB / ACAP | Annually |
| Weather | Open-Meteo / DHM Nepal | Live, cached 6 h |
| Bandh / strike alerts | Community + news feed | Live only |

**Trust UI:** every community-sourced field displays its source and age
(`Verified by 12 riders · 4 days ago`). Riders can confirm or dispute any POI in one tap from
the map — this is how the dataset stays alive, and it is also a community-engagement loop that
feeds the social feature.

**Attribution:** `© OpenStreetMap contributors` must be visible on every map view (bottom-left,
`micro`, `graphite-300`) — a licence requirement, not a nicety.
