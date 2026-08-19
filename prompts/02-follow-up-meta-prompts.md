# Follow-up Meta Prompts

Use one prompt for one bounded task after the master prompt.

## Universal

```text
Continue RideJaunm. Read docs/10-design-to-code-react-native.md and implementation/task-manifest.md. Execute only [TASK ID — NAME]. Inspect the worktree first. Use semantic tokens, reusable components, typed interfaces and deterministic fixtures; do not touch unrelated architecture. Cover loading/error/offline/stale/a11y states. Run typecheck, lint, focused tests and the applicable build. Return files, states verified, test output and unverified native risk. Ask rather than invent a provider, secret, backend, or safety decision.
```

## Component audit

```text
Audit [COMPONENT] against the RideJaunm contract without editing it. Check semantic tokens, 48/56/72/88 dp targets, dynamic type, EN/NE/HI content, roles/labels/states, themes, connectivity states, and SOS ambiguity. Return prioritised findings with file/line references and tests.
```

## Screen

```text
Implement [SCREEN] only from existing RideJaunm components and documented view-model interfaces. Start from its fixture. Include online/offline/mesh/stale/loading/empty/error states as relevant. Never call SDKs directly from the screen. Verify map attribution, localisation, safe-area/keyboard behavior, a11y, and target sizes.
```

## Map

```text
Implement [MAP TASK] behind MapAdapter. Use routePresentation and preserve 2 dp dark casing. Add a deterministic fixture first. Cover no/stale GPS, offline/partial tiles, Day Glare and OSM attribution. Do not imply real navigation is validated until provider/device evidence exists.
```

## Offline

```text
Implement [OFFLINE TASK] with explicit ConnectivityState and DataFreshness—no scattered booleans. Show cached/partial/stale/queued/unavailable in UI. Persist safely, never auto-delete map regions, and test restart plus interrupted operation recovery.
```

## SOS

```text
Implement/review [SOS TASK] as safety-critical. Preserve 88 dp location, 3-second hold, early-release unwind, 10-second cancel, deliberate stand-down, VoiceOver/TalkBack labels and redundant feedback. Keep SOS separate from destructive UI. Report real delivery/ack only; unavailable/feature-flagged is required when unverified.
```

## R18 audit

```text
Perform R18. Create a traceability matrix from design requirement -> implementation -> automated/device evidence -> remaining risk. Test four themes, EN/NE/HI, Dynamic Type, screen reader semantics, glare/colour-blind route cues, offline/mesh/SOS states, and iOS/Android devices. Do not call safety transports release-ready without operational validation.
```
