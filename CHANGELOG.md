# Changelog

All notable changes to QRick are documented here. The project follows [Semantic Versioning](https://semver.org/).

## 1.1.0 — 2026-11-17

- Added live camera QR scanning with native browser detection and a bundled `qr` JavaScript fallback in extensions; no WASM is required.
- Updated the tagline, Generate heading, and store artwork to represent both generation and scanning.
- Kept the bookmarklet native-only and enforced Firefox’s bookmark URL size limit.
- Added decoded-text copying, explicit HTTP(S) link opening, and QR generation from scan results.
- Stop camera tracks on success, cancellation, mode changes, hidden pages, and teardown.
- Added an extension download link and clearer styling for unsupported native scanning.
- Fixed desktop popup sizing in Edge and kept mobile layouts responsive.
- Updated store disclosures, reviewer instructions, screenshots, and release validation for scanning.

## 1.0.1 — 2026-09-13

- Fixed Firefox for Android scaling with an explicit mobile viewport and responsive popup width.
- Increased type and touch-target sizes on coarse-pointer mobile devices.
- Declared Firefox 155 as the minimum supported Android version and added release validation for it.
- Added a Firefox for Android setup, version-discovery, testing, and troubleshooting guide.

## 1.0.0 — 2026-09-13

- Added the QRick browser extension for current Chromium, Firefox, and Safari.
- Added the self-contained bookmarklet with the same editable QR interface.
- Added PNG, SVG, and clipboard image output.
- Added exact QR error-correction selection and optional tracking-parameter removal.
- Added local-only privacy guarantees and minimal `activeTab` permission usage.
- Added automated tests, package validation, versioned release archives, checksums, CI, and GitHub Release automation.
