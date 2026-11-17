---
name: qrick-development
description: "Use for QRick feature changes: generation, scanning, shared UI, bookmarklet behavior, and extension entry points."
metadata:
  author: "QRick contributors"
  tags: "qrick, development, browser-extensions"
---

# QRick development

## Purpose

Work from the repository root. Read the relevant source before editing; the paths below locate responsibilities, not frozen implementation details. Preserve the requested scope and existing user changes.

## Python support tooling

For changes to Python helpers or skill files, use the project-local Python 3.15+ environment in `pyproject.toml` and `uv.lock`; see [Python tooling](../../../docs/python-tooling.md). Run `uv sync --locked` when setup is needed, then `uv run --locked python scripts/check_skills.py`. Do not use global pip installs or copy an interpreter choice from another project. The root `.python-version` defaults to 3.15; newer interpreters are allowed by the manifest but need verification before claiming support. Normal application work still uses npm and does not require Python.

## Prerequisites

Use the Node version in `.nvmrc` (`nvm use`) and the existing npm lockfile. Run from the repository root. Install dependencies with `npm ci` only when needed; first-time installs and guidance retrieval require network access. No model or camera credentials are needed to edit or build the app. Camera behavior requires a supported browser, a camera, and runtime user permission to verify.

## Platform guidance

Before changing extension manifests, permissions, CSP, popup behavior, or browser APIs, read the installed `chrome-extensions` skill and its task-relevant references ([upstream skill](https://github.com/GoogleChrome/modern-web-guidance/tree/main/skills/chrome-extensions)).

For HTML/CSS, DOM, camera/web APIs, accessibility, and shared UI, use the installed `modern-web-guidance` skill's search/retrieve workflow before implementation ([upstream skill](https://github.com/GoogleChrome/modern-web-guidance/tree/main/skills/modern-web-guidance)). Extension popup UI can require both skills; bookmarklet-only web features generally need the web guidance rather than Chrome extension rules.

Discover installed skill paths through the session's skill catalog; do not hardcode a contributor's home directory. If a guide is unavailable, consult its upstream instructions and relevant primary documentation, and identify that fallback. These guides supplement QRick's constraints and verification; they do not supersede the user's request or prove browser compatibility.

Check platform-specific claims against current official docs before changing architecture or permissions. In particular, QRick's user-invoked `activeTab` grant permits reading that tab's URL; do not add `tabs` solely because a general guide says `tab.url` always requires it. See Chrome's [activeTab documentation](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab). Use Mozilla/Apple documentation for Firefox/Safari differences instead of applying Chromium requirements universally.

## Instructions

### Find the maintained source

- `src/core/panel.ts` builds the shared Generate/Scan interface. `panel.css` and `styles.ts` own shared presentation.
- `src/core/scanner.ts` owns camera sessions, results, and native QR feature detection. The detector factory is injected through panel options.
- `src/core/scanner-decoder.ts` supplies the extension's native-first selection and bundled JavaScript fallback.
- `src/core/qr.ts` handles generation and image output; `link.ts` owns URL resolution and tracking cleanup.
- `src/bookmarklet/entry.ts` mounts the shared panel inside a shadow root and modal dialog.
- `src/extension/popup.ts` obtains the active tab URL and opens the dedicated scanner tab. `popup.html` owns the popup document's initial dimensions.
- `demo/` previews shared source modules; it is not an installed extension.

### Preserve the surface boundaries

The bookmarklet is native-only. Do not introduce a runtime import of `scanner-decoder.ts`, `qr/decode.js`, or another fallback decoder into its dependency graph. Unsupported native QR detection should explain the limitation and link to extension releases without requesting camera access. Generation remains available.

Extensions prefer native QR support. Use the local `qr` JavaScript decoder when the native API is missing, lacks `qr_code`, or cannot initialize. Do not construct the fallback detector on the successful native path. Keep all decoder code bundled locally, without CDN requests or WASM.

Request camera access only after Start camera. Stop tracks on success, Stop camera, switching to Generate, page hiding, and teardown. Treat pending permission and detection results as cancellable: late completions must not resurrect a closed session or expose stale results.

Show decoded content as text. Opening a result requires an explicit action and an HTTP(S) URL; QR contents must never execute as HTML or script.

### UI and packaging constraints

- Build DOM with safe native APIs; preserve compatibility with Trusted Types, host-page CSS isolation, keyboard use, dark mode, and reduced motion.
- Desktop extension popups need a definite initial width. Avoid sizing the popup from the viewport it creates. Size QR plates from their container rather than popup `vmin`; retain mobile responsiveness.
- The extension currently requests only `activeTab`. Camera permission is requested at runtime. Additional permissions or background components need a concrete feature requirement and matching privacy/store updates.
- Edit maintained sources, then regenerate tracked `bookmarklet/install.html` and `bookmarklet/qrick.bookmarklet.txt` with `npm run build:bookmarklet`. Do not patch generated bundles directly. The build enforces Firefox's bookmark URL limit.

### Verify the change

Use the project Node version from `.nvmrc` and npm's lockfile. Choose checks that exercise the changed behavior; inspect `package.json` for current scripts. Shared scanning changes usually need `npm run typecheck`, relevant Vitest suites, and both extension/bookmarklet builds. Layout bugs need rendered-browser measurements; jsdom cannot establish layout correctness.

Before handoff, state which surfaces changed, what checks ran, and any browser checks still pending. Use [the testing skill](../qrick-testing/SKILL.md) for browser investigation or camera regressions and [release review](../../../docs/release-review.md) when the change affects public behavior or store disclosures.

## Examples

- Request: “Fix scanning after I close the bookmarklet while permission is pending.” Inspect `scanner.ts` and bookmarklet teardown; preserve native-only imports and verify late-track cleanup with `tests/scanner.test.ts` and `tests/bookmarklet.test.ts`.
- Request: “The extension popup is clipped in Edge.” Measure the installed popup or label any preview substitute, inspect `popup.html` and shared grid sizing, and verify the container boundaries after correction.

For a scanner change, a focused starting point is:

```bash
npm run typecheck
npm test -- tests/scanner.test.ts tests/scanner-decoder.test.ts
```

Regenerate the affected extension/bookmarklet artifacts after source changes. The commands are examples of scoped verification, not a requirement to run the entire release process for every edit.

## Limitations

A native-only bookmarklet cannot provide scanning in a browser without native QR support; adding a fallback decoder there violates the current product boundary. Mock camera tests establish session logic, not device permissions or scan quality. UI text-only changes do not require inventing new regression tests; use existing checks and inspect affected rendering.

## Troubleshooting

- Missing native QR support: preserve the unsupported-browser explanation in the bookmarklet; inspect the injected factory for extensions instead of adding a remote decoder.
- A decoder update fails offline decoding: check the locked `qr` version and real-image regression before changing bundle validation.
- A popup remains squeezed: check computed body/panel widths and viewport-dependent sizing; clipping overflow hides the defect instead of fixing the sizing dependency.
