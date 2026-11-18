# QRick

Generate and scan QR codes. Everything stays on your device. QRick is available as a browser extension and as a self-contained bookmarklet.

## Table of contents

- [Functionality](#functionality)
- [Install the bookmarklet](#install-the-bookmarklet)
- [Install the extension](#install-the-extension)
- [Test on Firefox for Android](#test-on-firefox-for-android)
- [Local development](#local-development)
- [Python support tooling](#python-support-tooling)
- [Build a release](#build-a-release)
- [Publish to extension stores](#publish-to-extension-stores)
- [Implementation](#implementation)
- [Browser and toolchain targets](#browser-and-toolchain-targets)
- [Limitations](#limitations)
- [Privacy and permissions](#privacy-and-permissions)
- [Changelog](#changelog)
- [License](#license)

## Functionality

Choose **Scan**, then **Start camera** to read a QR code live. The bookmarklet uses only the browser's native `BarcodeDetector` API and checks for QR support before asking for camera access. If native QR detection is unavailable, it explains that scanning requires the QRick extension; generation remains available.

The extension opens scanning in a dedicated tab and prefers native `BarcodeDetector` QR support, using bundled `qr` (paulmillr/qr) JavaScript decoding only when native QR detection is missing, lacks QR support, or cannot initialize. The decoder is included locally, with no CDN requests or WASM. Both surfaces process images on your device, stop the camera after a read, and let you copy the exact decoded text, explicitly open an HTTP(S) link, or generate a QR code from the result.

The bookmarklet needs HTTPS or localhost and a page that permits camera access. Camera permission belongs to that page's origin. Switching back to Generate, hiding the page, or closing the scanner stops the camera. If access is blocked, allow the camera in browser settings or try another HTTPS page.

Both surfaces open with the current URL selected and its QR code already rendered. You can replace the value with another URL or plain text and the QR code updates as you type.

- Copy the QR code as a PNG image when the browser permits clipboard image writes.
- Download an approximately 1024 px PNG or a scalable SVG.
- Select the exact QR error-correction level: L, M, Q, or H.
- Optionally remove common tracking parameters such as `utm_*`, `fbclid`, and `gclid`.
- Add `https://` to bare domain names and `http://` to bare IP addresses and localhost.
- Warn when a loopback address will not be reachable from a phone.
- Follow light or dark browser appearance while always rendering the QR plate black on white.
- Work with keyboard navigation and reduced-motion preferences.

## Install the bookmarklet

The bookmarklet includes QRick and `uqr` in one `javascript:` URL, with no WASM or scanning library. It makes no network request at runtime and generates QR codes on pages with restrictive Content Security Policy settings.

Choose either installation method:

1. Open [bookmarklet/install.html](bookmarklet/install.html) in a browser and drag the **QRick** button to the bookmarks bar.
2. Open [bookmarklet/qrick.bookmarklet.txt](bookmarklet/qrick.bookmarklet.txt), copy the entire line, create a bookmark, and paste the line into its URL/address field.

Press the saved bookmark on any normal web page. Press it again, click outside the panel, press Escape, or use the close button to dismiss it.

On mobile, create any bookmark and then replace its address with the contents of `qrick.bookmarklet.txt`. Bookmark synchronization from a desktop browser is often easier.

## Install the extension

Install version 1.1.0 from the [Chrome Web Store](https://chromewebstore.google.com/detail/qrick/plofdlfickiacjdmcfcejlabloejihfp) or [Mozilla Add-ons](https://addons.mozilla.org/firefox/addon/qrick/).

For local developer loading, build the extension first:

```bash
npm ci
npm run build
```

### Chrome and Chromium browsers

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose the entire `dist/extension` folder (not its manifest or ZIP).

For Edge, use `edge://extensions` and the same folder. Click Reload after rebuilding an already loaded extension.

The same build is intended for current Chrome, Edge, Brave, Arc, Opera, Vivaldi, and other current Chromium browsers.

### Firefox

1. Open `about:debugging#/runtime/this-firefox`.
2. Select **Load Temporary Add-on**.
3. Choose `dist/extension-firefox/manifest.json`.

Keep the whole output folder together. Use **Load Temporary Add-on** in `about:debugging`, rather than **Install Add-on From File** in `about:addons`; local builds are unsigned.

Temporary extensions disappear after Firefox restarts. Run `npm run package` to create a versioned Firefox package for signing or store submission.

## Test on Firefox for Android

QRick supports Firefox 155 or newer on Android. See the complete [Firefox for Android testing guide](docs/firefox-android.md) for USB debugging setup, Firefox package and version discovery, temporary installation, reloading, debugging, and troubleshooting commands.

Once the phone is authorized and Firefox Nightly is installed, the usual command is:

```bash
npx --yes web-ext@latest run \
  --source-dir dist/extension-firefox \
  --target firefox-android \
  --android-device YOUR_DEVICE_ID \
  --firefox-apk org.mozilla.fenix
```

### Safari

Safari Web Extensions must be wrapped in an app:

```bash
xcrun safari-web-extension-converter dist/extension-safari
```

Open the generated Xcode project, run its app, and enable QRick in Safari’s extension settings.

## Local development

QRick uses Node.js 26.8.2. With `nvm` installed:

```bash
nvm use
npm ci
npm run dev
```

Vite prints the localhost address, normally `http://localhost:5173`. The development page shows the shared panel inline and provides a button that opens the bookmarklet-style modal.

Useful commands:

```bash
npm run typecheck       # TypeScript without emitting files
npm test                # all unit and DOM tests once
npm run test:watch      # tests in watch mode
npm run build           # icons, extension variants, and bookmarklet
npm run smoke           # execute the built bookmarklet in jsdom
npm run verify          # typecheck, tests, build, smoke, package invariants
npm run assets:promo    # export the retained promotional master at 440x280
npm run assets:store    # capture generation and scanner screenshots in Chrome
npm run validate:assets # verify screenshot, tile, and icon dimensions/formats
npm run package         # create browser/source archives and checksums
npm run release:check   # complete pre-release validation, including AMO lint
```

## Python support tooling

Optional project-skill tooling uses Python 3.15+, uv, Ruff, and ty. Start with `uv sync --locked`, then `uv run --locked python scripts/check_skills.py`. It is separate from the npm app toolchain. See [Python tooling](docs/python-tooling.md) for lint/type/test commands, the isolated Python 3.13 NVIDIA SkillEvaluator project, and CI details.

## Build a release

See [release review and manual testing](docs/release-review.md) for the tested desktop browsers, outstanding Safari/Android checks, and source-reproduction steps. Version 1.1.0 adds camera scanning; see [the changelog](CHANGELOG.md) for release notes.

Update every version-bearing file together:

```bash
npm run version:set -- 1.1.0
```

Commit the version change, then build and inspect a complete release:

```bash
npm run release:check
```

The resulting files are:

```text
dist/qrick-chrome-v1.1.0.zip
dist/qrick-firefox-v1.1.0.zip
dist/qrick-safari-v1.1.0.zip
dist/qrick-source-v1.1.0.zip
dist/SHA256SUMS.txt
```

The source archive includes reviewer instructions and third-party library provenance. It lets Mozilla reproduce the minified Firefox package. It contains the locked dependencies, source, tests, configuration, build scripts, privacy policy, and build instructions, without `node_modules`, `.git`, or `dist`.

After verifying the archives, tag the version and push it:

```bash
git tag v1.1.0
git push origin main --follow-tags
```

The tag triggers `.github/workflows/release.yml`, repeats the complete validation on Node 26.8.2, and creates a GitHub Release with all archives and SHA-256 checksums. Normal pushes and pull requests run `.github/workflows/ci.yml`.

## Publish to extension stores

Version 1.1.0 is approved in the [Chrome Web Store](https://chromewebstore.google.com/detail/qrick/plofdlfickiacjdmcfcejlabloejihfp) and on Mozilla Add-ons.

For normal Firefox installation, use the [Mozilla Add-ons listing](https://addons.mozilla.org/firefox/addon/qrick/). The [Mozilla-signed 1.1.0 XPI](https://addons.mozilla.org/firefox/downloads/file/5267185/qrick-1.1.0.xpi) is also available. The generated Firefox ZIP is unsigned and intended for store submission or temporary developer loading.

Version-specific GitHub release notes live in [`docs/releases/`](docs/releases/). The release workflow uses the matching tag's Markdown file when present, otherwise it generates notes automatically. The [1.1.0 notes](docs/releases/v1.1.0.md) distinguish installation downloads from submission and source archives.

Copy-ready descriptions, privacy answers, permission justifications, and reviewer instructions live in [`store-listing/`](store-listing/). Required and reusable images live in [`store-assets/`](store-assets/). The public [privacy policy](PRIVACY.md) must be available from the repository's default branch before submitting.

- **Chrome Web Store:** upload the versioned Chrome ZIP, complete the listing and Privacy tabs from `store-listing/chrome.md`, and upload the 128 px icon, 1280×800 screenshot, and 440×280 promotional tile.
- **Firefox Add-ons:** choose a listed release, upload the Firefox ZIP, declare that source is required, and upload the matching source ZIP. The generated manifest declares no data collection and retains a stable Firefox extension ID.
- **Microsoft Edge Add-ons:** upload the same Chrome ZIP and complete Partner Center using `store-listing/edge.md`.
- **Safari:** upload the dedicated Safari ZIP to App Store Connect's Safari Web Extension Packager or pass `dist/extension-safari` to `xcrun safari-web-extension-converter`, test through TestFlight, then submit the containing app.

Store submissions remain manual. Chrome and Firefox have published listings; first-time publication to other stores still requires account verification, agreements, listing review, and permanent item IDs. Store-upload automation should only be added after those IDs exist; credentials belong in repository secrets, never in source files.

## Implementation

QRick uses ESM, TypeScript, native HTML/CSS/DOM APIs, Vite, and Vitest. [`uqr`](https://github.com/unjs/uqr) generates QR codes and [`qr`](https://github.com/paulmillr/qr) provides the extension’s local JavaScript scanning fallback.

```text
bookmarklet/
  install.html              generated drag-and-drop installer
  qrick.bookmarklet.txt     generated copy-and-paste bookmarklet
demo/                       localhost development page
store-assets/               store screenshots, promotional artwork, and sources
store-listing/              copy-ready fields for each extension store
scripts/                    build, packaging, icon, and smoke-test scripts
src/
  bookmarklet/              in-page dialog entry point
  core/                     shared QR, URL, panel, and style modules
  extension/                extension popup and manifest
tests/                      Vitest unit and DOM tests
PRIVACY.md                  public no-data-collection policy
```

The extension and bookmarklet use the same `createPanel()` implementation. The extension supplies the active tab URL; the bookmarklet supplies `location.href` and mounts the panel in a shadow root and native `<dialog>`.

The bookmarklet avoids `innerHTML` and other HTML-injection sinks. Its SVG uses `createElementNS`, while its styles use constructable stylesheets with a `<style>` fallback. This keeps it compatible with pages that enforce Trusted Types and isolates it from page CSS.

Generated build output lives in ignored `dist/`. The two files in `bookmarklet/` are tracked release artifacts and are regenerated by `npm run build:bookmarklet`.

## Browser and toolchain targets

The following are the declared minimum browser and toolchain versions (they are not a claim about today’s latest stable releases):

| Platform | Target |
| --- | --- |
| Chrome and Chromium | Chrome 153-equivalent or newer |
| Firefox desktop and Android | Firefox 155 or newer |
| Safari | Safari 26.6 or newer |
| Node.js | Node.js 26.8.2 or newer |
| TypeScript | 7.0.2 |

Source and builds use ESM and an `esnext` compilation target. Older browser versions are outside the supported scope.

## Limitations

- Bookmarklets cannot run on browser-owned pages such as `chrome://` and `about:` pages, extension stores, or pages where the browser disables JavaScript bookmark URLs.
- Extensions cannot expose a useful shareable URL for browser-owned pages or local `file:` URLs, so the popup opens with an empty editable field there.
- A phone cannot resolve `localhost`, `127.0.0.1`, or `[::1]` on the computer. Use the computer’s LAN address, such as `192.168.1.20:5173`, and ensure the development server listens on the network.
- QR codes have finite capacity. Long input can require a lower correction level or a shorter URL.
- Clipboard image writing depends on browser support, a secure context, and user permission. PNG and SVG downloads remain available when copying is unavailable.
- Firefox temporary add-ons must be reloaded after restarting Firefox.
- Safari packaging requires macOS and Xcode.
- Browser vendors may impose bookmark URL-length limits; the drag-and-drop installer is generally more reliable than pasting into an address bar.

## Privacy and permissions

QRick performs QR generation and camera decoding entirely on the device. Camera permission is requested only after Start camera; video is not recorded or uploaded. It sends no URL or text to a server, stores no history, and includes no analytics.

The extension requests only `activeTab`. That temporary permission lets it read the active page URL after the user invokes the extension. It has no host permissions, background service worker, or content script.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history.

## License

[BSD Zero Clause License (0BSD)](LICENSE) for QRick source, copyright 2026 Constantin Câmpean. The license text comes from [Choose a License](https://choosealicense.com/licenses/0bsd/) and is also published by the [Open Source Initiative](https://opensource.org/license/0bsd). Bundled dependencies retain their own licenses; see [third-party notices](THIRD-PARTY-NOTICES.txt).
