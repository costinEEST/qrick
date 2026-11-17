---
name: qrick-release
description: "Use for QRick release preparation: bundles, store listings, privacy disclosures, branding assets, and reproducible sources."
metadata:
  author: "QRick contributors"
  tags: "qrick, releases, store-assets"
---

# QRick release preparation

## Purpose

Use the repository's scripts as the packaging implementation. Read `package.json`, [release review](../../../docs/release-review.md), and the relevant documents below. Commands and source paths are relative to the repository root.

## Python support tooling

For changes to Python helpers or skill files, use the project-local Python 3.15+ environment in `pyproject.toml` and `uv.lock`; see [Python tooling](../../../docs/python-tooling.md). Run `uv sync --locked` when setup is needed, then `uv run --locked python scripts/check_skills.py`. Do not use global pip installs or copy an interpreter choice from another project. The root `.python-version` defaults to 3.15; newer interpreters are allowed by the manifest but need verification before claiming support. Normal application work still uses npm and does not require Python.

When reviewing the source archive, include both projects’ `.python-version`, `pyproject.toml`, and `uv.lock` files, `.agents/skills`, and the Python helper/tests. Exclude `.venv` and caches, and keep Python dependencies out of installable browser packages. If the skills change after a retained evaluation, treat previous reports as historical; use the locked isolated evaluator project for a fresh review when requested.

## Prerequisites

Use `.nvmrc`, the locked npm dependencies, and commands from the repository root. Packaging needs `zip` and archive inspection needs `unzip`; screenshot capture needs Chrome or an explicit `CHROME_PATH`. First-time dependency downloads and Mozilla lint may require network access. Resolve release dependencies through `package-lock.json` and the version-pinned tool commands in `package.json`; use the project scripts rather than introducing unversioned package executables. Local preparation needs no store credentials. Signing or publishing needs the target store's account, credentials, and authorization for that action.

## Store and web guidance

For Manifest V3, package permissions/CSP, Chrome Web Store listing fields, privacy answers, and submission preparation, consult the installed `chrome-extensions` skill and its relevant publishing references ([upstream skill](https://github.com/GoogleChrome/modern-web-guidance/tree/main/skills/chrome-extensions)). Locate it using the session skill catalog. If unavailable, use upstream and primary store docs and disclose the substitution.

When release preparation requires changes to screenshot-page HTML/CSS, shared web UI, accessibility, or camera code, also use the installed `modern-web-guidance` skill's search/retrieve workflow ([upstream skill](https://github.com/GoogleChrome/modern-web-guidance/tree/main/skills/modern-web-guidance)). Do not run web modernization scans for an ordinary packaging or copy-only request.

Neither guide replaces package validation, installed-extension testing, or store review. Check current Chrome/Edge, Mozilla, and Apple requirements in their respective primary documentation; do not assume a Chrome submission checklist covers every store. Preserve QRick's minimal `activeTab` access unless the feature actually needs more; Chrome's [activeTab documentation](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab) permits reading the invoked tab's URL without a blanket `tabs` permission.

## Instructions

### Choose the requested output

- Local extension bundles/ZIPs: `npm run build:extension -- --zip`.
- Browser/source archives and SHA-256 checksums: `npm run package`.
- Full release validation: `npm run release:check`.
- Store copy: [shared listing](../../../store-listing/shared.md) plus the target store's file in `store-listing/`.
- Screenshot regeneration and image requirements: [store assets](../../../store-assets/README.md).

Building local artifacts does not imply permission to publish, sign, tag, push, or send messages. Follow the user's requested scope and existing authorization. Complete the concrete build/review work before seeking any required final approval; do not create a repeated approval ritual for already authorized actions.

### Keep the public description accurate

Review README.md, PRIVACY.md, CHANGELOG.md, package/manifest descriptions, and target store fields when behavior changes. Preserve the distinction between native-only bookmarklet scanning and native-first extension scanning with local JavaScript fallback. Explain camera permission and local processing, automatic camera stop, decoded-text actions, and the absence of recording/history/uploads. `activeTab` remains the manifest permission unless the maintained manifest shows an intentional change.

Reviewer notes should describe the dedicated scanner tab, native and fallback paths, permission denial, known-URL and plain-text scans, and how to observe camera shutdown. Generation needs no camera; scanning does. Do not copy generation-only disclosures into a scanning release.

Record manual browser checks with their evidence and date. Do not infer Safari or Android readiness from desktop Chrome/Edge/Firefox testing. Safari's containing-app conversion, signing, camera permission, and device testing remain separate from generating its ZIP.

### Versions and generated files

Read the current version and changelog before changing them. Use `npm run version:set -- X.Y.Z` when a version change is in scope; do not hand-edit only one version-bearing file. A rebuilt archive with the existing version is a local test artifact, not proof that a new release number was selected. Do not publish an Unreleased feature set over an existing store version.

`npm run build` regenerates all extension variants and tracked bookmarklet installer/text artifacts. `dist/` contains ignored build outputs. Preserve third-party notices in extension packages and the matching source archive. Do not edit generated files to fix maintained-source defects.

### Branding and asset provenance

For tagline, UI naming, icons, screenshots, or promotional artwork, read [the maintained asset workflow](../../../store-assets/README.md) before editing. It is the source of truth for master/export relationships, the exact image prompt, pinned export command, capture environment, and upload mapping; do not duplicate those procedures here.

Keep QRick's generation and scanning positioning consistent across maintained UI, README, manifests, store copy, and screenshots. Retain promotional raster masters and prompts, regenerate final tiles from the selected master, and regenerate screenshots from application/demo sources. Treat AI image generation as nondeterministic; an exact prompt is provenance, not a promise of identical pixels. Do not represent a raster master as editable vector source or conceptual promotional art as a real screenshot.

Compare the real page, retained master where relevant, and final export. Use browser MCP when available and distinguish that evidence from static image inspection or dimensions-only checks. Report unavailable browser evidence honestly. Preserve historical masters unless removal is requested; old sources must be clearly marked as inactive when superseded.

### Validate packages and artwork

`npm run release:check` covers tests, type checking, builds, bookmarklet smoke/size checks, extension bundle checks, image dimensions/formats, archive contents, checksums, and Mozilla lint. Inspect script output: warnings or failures need an explanation before calling the release validated. If a prerequisite is unavailable, identify the specific gap rather than reporting a full pass.

When the UI changes, use `npm run assets:store` and inspect both real rendered screenshots. `npm run validate:assets` checks dimensions and RGB format, not legibility or current content. Keep sample URLs nonpersonal. Do not fabricate live camera frames or imply that the ready-state screenshot is an actual scan. Existing promotional artwork need not be regenerated for unrelated code changes.

For Firefox source review, ensure the source ZIP includes the lockfile, maintained code, build configuration/scripts, notices, reviewer docs, and resources required by validation. For build/dependency changes or source-package fixes, extract to a fresh task-owned directory, install locked dependencies with the declared Node toolchain, rebuild, and compare all Firefox package files byte-for-byte. Keep temporary extraction separate from the working tree.

The extension bundles `qr/decode.js` as its JavaScript scanning fallback. Preserve version-specific dependency references in `docs/release-review.md` and the MIT attribution in `THIRD-PARTY-NOTICES.txt`; update both with intentional dependency changes. Follow current store requirements when preparing submission and check primary store documentation for requirements that may have changed.

### Handoff

Report archive paths, version, performed checks, source-reproduction results when checked, and outstanding platform/store-account work. Local validation is not store approval. Keep signing credentials out of source and avoid claiming an unsigned Firefox bundle is permanently installable through the normal add-on installer.

## Examples

- Request: “Bundle the extensions for local testing.” Build the browser variants and ZIPs; report the output folders and temporary loading instructions. Do not bump versions, sign, or publish as an incidental part of bundling.
- Request: “Prepare the scanning update for the stores.” Review descriptions, permissions/privacy, both screenshots, third-party notices, and version selection, then run the release gate and state remaining platform/account steps.

For a local bundle request:

```bash
npm run build:extension -- --zip
npm run validate:extension
```

For a release-readiness request use `npm run release:check`; it is broader and regenerates browser/source archives and checksums.

## Limitations

Static validation and reproducible archives do not guarantee store acceptance. The source archive reproduces the JavaScript decoder bundle from the locked npm dependencies. Retained historical manual tests do not verify a new build, and image generation cannot promise identical future pixels.

## Troubleshooting

- A script reports a missing prerequisite: identify the executable, browser path, or network access needed and finish independent review work; do not call an incomplete release check a pass.
- Source reproduction differs: compare the selected Node version, lockfile, source archive contents, and all output-file hashes before changing the package or claiming reproducibility.
- Store copy and assets disagree: update maintained UI/copy or the selected artwork master, regenerate the affected exports, and inspect them together. Do not edit final screenshot pixels to conceal stale sources.
