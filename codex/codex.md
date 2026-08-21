# RideJaunm Delivery Operating Model

> **Lead workspace:** this repository (`Ride-jaum-Design`) is where product, design, architecture, scope, acceptance criteria, QA evidence, and release decisions are managed.
> **Implementation workspace:** the sibling repository `RideJaunm-Mobile` is the active React Native application. Google Antigravity is the primary implementation agent there.

The lead (Codex) does not make speculative application changes in the mobile repository. It plans a bounded R/S task here, supplies implementation-ready acceptance criteria and constraints, then reviews Antigravity's completed work against the contracts before the next task is released.

## Responsibilities

| Role | Accountabilities |
|---|---|
| Product / CTO / PM / System Architecture lead (Codex in this repo) | roadmap, UX/system decisions, ADRs, task decomposition, dependencies, safety/privacy boundaries, acceptance criteria, release gates, QA review |
| Antigravity (mobile repo) | implement the approved bounded mobile task, add/update tests, run simulator/device checks, report implementation evidence and deviations |
| Project owner | approve scope, provider/cost/legal choices, production/safety claims, named owners, and release decisions |

## Handoff and QA loop

1. Lead selects the next dependency-ready task from the manifest and writes its implementation brief here.
2. Antigravity implements only that approved task in `RideJaunm-Mobile`, preserving the design/system contracts.
3. Antigravity reports changed files, tests, simulator/device evidence, known gaps, and decisions it could not make.
4. Lead performs a read-only QA review against design tokens, UX flow, API/system contracts, accessibility, offline behavior, privacy, and SOS evidence wording.
5. The lead either accepts the task, records remediation, or blocks the next dependent task. No safety capability is represented as real until its evidence gate is passed.

Use one bounded task at a time. That is the safest way to keep the app, geospatial data, and SOS system consistent.

1. Keep the design repo as the source of truth.

Your design repository is:

[Ride-jaum-Design](/Users/surajshrestha/Documents/Ride%20Jaum/Ride-jaum-Design)

Do not build the app directly inside it. Create/open a sibling mobile-app folder, for example:

```text
/Users/surajshrestha/Documents/Ride Jaum/RideJaunm-Mobile
```

2. Start a new Codex task in `RideJaunm-Mobile`.

Paste this before the master prompt:

```text
The RideJaunm design/system source is at:
/Users/surajshrestha/Documents/Ride Jaum/Ride-jaum-Design

Read its README, docs, implementation manifests, prompts, and token files before editing this mobile-app workspace.
```

Then paste the [React Native master prompt](/Users/surajshrestha/Documents/Ride%20Jaum/Ride-jaum-Design/prompts/01-master-prompt.md).

3. Let Codex perform only `R0` first.

It should inspect the workspace, propose the React Native tooling, create the baseline project, and verify iOS/Android builds. It should not jump directly into maps, social, or SOS UI.

4. Resolve the critical decisions Codex identifies.

Before real integrations, decide—or ask Codex to document assumptions—for:

- Map tiles and routing provider
- Backend/cloud platform
- Authentication provider
- Push/SMS provider
- Which SOS transports are actually in scope for v1
- Data/privacy/retention policy for rider locations

If you are not ready to choose, tell Codex: “Document this as an ADR and use a fixture/fake adapter for now.”

5. Build the mobile app in manifest order.

Use the [mobile build manifest](/Users/surajshrestha/Documents/Ride%20Jaum/Ride-jaum-Design/implementation/task-manifest.md). For each new Codex task, paste the [universal follow-up prompt](/Users/surajshrestha/Documents/Ride%20Jaum/Ride-jaum-Design/prompts/02-follow-up-meta-prompts.md) and replace `[TASK ID — NAME]`.

Recommended sequence:

| Milestone | Mobile tasks |
|---|---|
| Foundations | `R0–R5` |
| Offline/domain/map base | `R6–R9` |
| Trip planner and downloads | `R10–R12` |
| Community and profile | `R13–R14` |
| SOS UI, then verified safety services | `R15–R16` |
| QA and release audit | `R17–R18` |

6. Build the backend/system in parallel after foundations.

In a separate Codex task, paste the [system-design master prompt](/Users/surajshrestha/Documents/Ride%20Jaum/Ride-jaum-Design/prompts/03-system-design-master-prompt.md).

Start only with `S0`, then work through the [system build manifest](/Users/surajshrestha/Documents/Ride%20Jaum/Ride-jaum-Design/implementation/system-design-task-manifest.md).

The key alignment points are:

- Mobile `R6–R12` ↔ system `S4–S7` for routes, maps, and offline packs
- Mobile `R13–R14` ↔ system `S8–S9` for groups, chat, and social
- Mobile `R15–R16` ↔ system `S10–S11` for SOS and notifications

7. Review every completed task before continuing.

Ask Codex for:

```text
Review the completed [R# / S#] task against the RideJaunm design and system contracts. Do not change code yet. Report missing states, accessibility issues, offline behavior gaps, tests, and safety risks.
```

Only then ask it to fix the findings.

8. Treat SOS as a release gate.

Do not enable real SOS marketing or “help notified” UI until device testing proves the configured channel. The UI must distinguish:

```text
Device sent → Peer acknowledged → Provider accepted → Human confirmed
```

9. Finish with `R18` and `S12–S13`.

Those audits cover themes, Nepali/Hindi/English, offline mode, accessibility, map attribution, privacy, backups, failure handling, and device testing.

This incremental approach matches the official Codex emphasis on iterative engineering and verified operations. [Official Codex use cases](https://developers.openai.com/codex/use-cases)
