# R14 — Fixture Profile, Garage, History, Settings, and Locale Preview

> **Status:** Ready for implementation
>
> **Scope boundary:** R14 is a local fixture presentation. Do not add account/auth APIs, profile or vehicle editing persistence, service/fuel logs, data export, privacy enforcement, actual settings writes, language packs, calendar conversion, or any real ride history claim.

## Objective

Replace the remaining Profile placeholder with a truthful profile and settings foundation: fixture rider/garage/history views plus a local EN/NE/HI and AD/BS preview. It establishes reusable view models and accessibility patterns without claiming the whole app is localized or a profile has been saved.

## Required contracts and fixture states

Create typed screen-independent fixtures for `FixtureRiderProfile`, `FixtureMotorcycle`, `FixtureRideHistoryItem`, and `FixturePreferencePreview`.

- Stable fixture IDs only; no runtime-generated IDs.
- Every profile, vehicle, statistic, history entry, service/fuel reminder, and preference contains source/version and a synthetic disclosure.
- Include an empty history state, a stale/unknown maintenance state, a local-unsaved preference state, a long Devanagari location/name, and an unavailable privacy/safety capability state.

## Required UI

Use the existing Profile tab and accessible inner tabs: `Profile`, `Garage`, `History`, `Settings`.

- Profile: fixture rider identity, non-live statistics, badges, and a permanent “Synthetic profile preview — not an account” disclosure.
- Garage: 1–2 fixture motorcycles; maintenance and fuel values must be fixture estimates, not telemetry or service records. Edit/delete actions are disabled or display “Preview only — nothing was saved.”
- History: fixture ride cards with route/mode/date metadata; never claim GPS-recorded rides. Include empty history and cached/stale fixture states.
- Settings: local-only preview controls for language (`English`, `नेपाली`, `हिन्दी`), AD/BS display, units, data saver, and privacy. Any selection changes only current component state and displays “Preview only — app settings were not saved.”
- Language preview changes R14-owned labels/copy only. It must not claim full app localization.
- Date preview must show pre-authored AD and BS strings; do not implement calendar conversion.

## Truth and safety

- Never render real phone/email/contact/precise location/vehicle registration data. Use clearly synthetic values.
- No setting may enable live GPS, tracking, mesh, SOS, background service, notification, or data sharing. Such controls are disabled with an unavailable/fixture explanation.
- Do not use SOS Red for profile/settings/history warnings or destructive controls.
- No storage write/remove/clear, AppState mutation, queue/outbox mutation, network/API request, deep link, analytics, or external share action.

## Accessibility and validation

- All controls are at least 48dp, with `tablist`/`tab` and radio/checkbox semantics as appropriate.
- State is conveyed through words/icons as well as token color; labels describe local-preview status.
- Test all four themes, EN/NE/HI preview, AD/BS strings, long Devanagari content, empty/stale/unknown states, disabled safety/privacy settings, and no-save feedback.
- Required commands: `npm run typecheck`, `npm test -- --runInBand`, `git diff --check dev...HEAD`, plus simulator walkthrough.

## Explicitly excluded

Backend identity/profile endpoints; account lifecycle; real motorcycle management/history/service/fuel data; persistence; global i18n rollout; calendar conversion; notifications; safety/native feature flags; R15–R18 work.

## Antigravity completion report

Report touched files; fixture/domain contracts; locale/state matrix; proof of no persistence/network; a11y/touch evidence; four-theme screenshots; test output; and deferred backend/native risks. Open a PR against mobile `dev`; do not merge it.
