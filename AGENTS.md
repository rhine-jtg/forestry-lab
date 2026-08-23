# Forestry Lab repository guidance

## Project map

- The main web game is `index.html`, `styles.css`, and `app.js`.
- UI experiments live in `ui-lab.html` and `ui-frameworks.html`.
- The 2.5D map prototypes are `map-grid-layout-test.html` and `map-layer-test.html`.
- Android mirrors the web runtime under `android/app/src/main/assets/`.
- Source map assets belong under `assets/map/`; incoming references should be copied to `assets/incoming/` before editing.

## Working rules

- Preserve unrelated and pre-existing user changes in the working tree.
- Do not build APK or EXE artifacts unless the user explicitly requests a build.
- Do not commit or push Git changes unless the user explicitly requests it.
- Prefer small, scoped edits and reuse the existing pixel-art UI language.
- Keep browser and Android layouts responsive; check narrow portrait and desktop widths after UI changes.
- Do not replace official Forestry assets unless the user explicitly approves a replacement.

## Validation

- Run `npm run check` after changing HTML, CSS, JavaScript, map layout JSON, or referenced assets.
- For visual changes, also inspect the affected page through `http://127.0.0.1:8000/` when browser control is available.
- Report any validation that could not run; do not silently treat a static check as visual verification.

