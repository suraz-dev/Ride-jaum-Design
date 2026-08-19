Use Codex one bounded task at a time. That is the safest way to keep the app, geospatial data, and SOS system consistent.

1. Keep the design repo as the source of truth.

Your design repository is:

[RideJaunm-Design](/Users/surajshrestha/Documents/Ride%20Jaum/RideJaunm-Design)

Do not build the app directly inside it. Create/open a sibling mobile-app folder, for example:

```text
/Users/surajshrestha/Documents/Ride Jaum/RideJaunm-Mobile
```

2. Start a new Codex task in `RideJaunm-Mobile`.

Paste this before the master prompt:

```text
The RideJaunm design/system source is at:
/Users/surajshrestha/Documents/Ride Jaum/RideJaunm-Design

Read its README, docs, implementation manifests, prompts, and token files before editing this mobile-app workspace.
```

Then paste the [React Native master prompt](/Users/surajshrestha/Documents/Ride%20Jaum/RideJaunm-Design/prompts/01-master-prompt.md).

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

Use the [mobile build manifest](/Users/surajshrestha/Documents/Ride%20Jaum/RideJaunm-Design/implementation/task-manifest.md). For each new Codex task, paste the [universal follow-up prompt](/Users/surajshrestha/Documents/Ride%20Jaum/RideJaunm-Design/prompts/02-follow-up-meta-prompts.md) and replace `[TASK ID — NAME]`.

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

In a separate Codex task, paste the [system-design master prompt](/Users/surajshrestha/Documents/Ride%20Jaum/RideJaunm-Design/prompts/03-system-design-master-prompt.md).

Start only with `S0`, then work through the [system build manifest](/Users/surajshrestha/Documents/Ride%20Jaum/RideJaunm-Design/implementation/system-design-task-manifest.md).

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