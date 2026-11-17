# Release review and local testing

The scanning release is version 1.1.0, dated November 17, 2026 in CHANGELOG.md. Package, lockfile, and manifest versions are synchronized with `npm run version:set -- 1.1.0`. No store submission, signing, tagging, or pushing is performed by local builds.

## Manual testing status

As of November 17, 2026, the user confirmed local desktop extension testing in Chrome, Edge, and Firefox. The user reconfirmed all three browsers after replacing the WASM decoder with the bundled `qr` JavaScript fallback, before the version-only bump to 1.1.0. Browser versions were not recorded. Edge was also retested after the popup-width fix. Chrome bookmarklet behavior was confirmed; Firefox correctly reports unavailable native scanning and offers the extension releases link. These are manual observations, not automated coverage of every browser or permission state.

Safari packaging, camera permissions in the containing app, and the current camera flow on Firefox for Android still require device testing before claiming those platforms are fully verified.

## Repeatable smoke test

1. Run `npm run release:check`.
2. Load `dist/extension` as an unpacked folder in Chrome/Edge. In Firefox use `about:debugging#/runtime/this-firefox` → Load Temporary Add-on → `dist/extension-firefox/manifest.json`. Keep all adjacent files. Unsigned local builds are not installed through `about:addons`.
3. On an ordinary HTTPS page, open QRick. Confirm the selected URL, immediate QR output, single-line desktop action labels, and no horizontal clipping. Try a long URL and both light/dark appearance.
4. Verify PNG/SVG downloads, Copy image where supported, tracking cleanup, and each error-correction option.
5. Choose Scan → Start camera. Allow access and scan a known HTTP(S) URL from another screen or paper. Check the exact decoded text, automatic camera stop, Copy text, Open link, and Generate QR.
6. Scan plain text and a `javascript:` payload. Both should remain text; neither should expose Open link or trigger navigation.
7. Start another scan; test Stop camera, switching to Generate, hiding the tab, and closing the tab. The camera indicator must stop. Also test cancellation while the camera permission prompt is pending.
8. Deny camera access and retry after changing the browser permission. Check the error is understandable and the scanner remains usable.
9. Confirm native QR support is preferred in browsers that provide it. Firefox without native QR support exercises the local JavaScript fallback. There should be no network request for decoder code or video.
10. Reinstall the generated bookmarklet. Confirm generation still works and QR scanning uses native APIs only. An unsupported browser should explain the limitation and link to extension releases without requesting camera access.

## Store assets

Run `npm run assets:store`, then `npm run validate:assets`. Inspect both 1280×800 screenshots and the 440×280 promotional tile at full size before upload. Screenshots render the shared production UI with a sample URL; the scanner screenshot shows the ready state and does not imply a live camera session. Use store-assets/README.md for file mapping.

## Reproduce the Firefox JavaScript bundle

The source ZIP contains this document, the application source, package-lock.json, build scripts, licenses, and store instructions. In a fresh extracted folder:

```bash
nvm use
npm ci
npm run build:extension
npm run validate:extension
```

The matching output is `dist/extension-firefox`. Dependencies are installed only through npm; runtime code makes no CDN requests. The JavaScript QR decoder is bundled from the locked npm package; no WASM or C++ build is needed.

Third-party review references for the current locked release:

- [uqr 0.1.3](https://www.npmjs.com/package/uqr/v/0.1.3) and [upstream source](https://github.com/unjs/uqr).
- [qr 0.7.2](https://www.npmjs.com/package/qr/v/0.7.2) and [upstream source](https://github.com/paulmillr/qr). The scanning fallback imports `qr/decode.js`; generation remains with `uqr`.

Provide version-specific library links in the AMO submission as required by Mozilla's [third-party library policy](https://extensionworkshop.com/documentation/publish/third-party-library-usage/). The QRick source archive reproduces the submitted bundle using `package-lock.json`.

## Publication remains manual

Version 1.1.0 is selected. Before submission, publish the matching privacy policy and sources, inspect screenshots, and provide the relevant account/store metadata. Firefox permanent distribution requires Mozilla signing; Safari requires conversion/signing and containing-app testing. Follow store-listing/ for fields and reviewer notes. Never upload source archives as installable add-ons.
