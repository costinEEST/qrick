# Shared QRick store listing

## Name

QRick

## Short description

Generate and scan QR codes. Everything stays on your device.

## Full description

QRick creates and reads QR codes in your browser. Generate a code for the current page, another link, or plain text—or scan a code with your camera. Everything stays on your device.

The current URL and QR code appear immediately. You can edit the value, paste another URL or plain text, remove common tracking parameters, and choose the exact QR error-correction level. The result can be copied as an image or downloaded as PNG or SVG.

Choose Scan to open a dedicated scanner tab, then press Start camera and allow camera access. QRick prefers native browser QR detection and uses a bundled WebAssembly decoder when native QR support is unavailable. After reading a code, it stops the camera and shows the decoded text. Copy the text, explicitly open an HTTP(S) link, or generate another QR code from it.

Camera frames and decoded content are processed locally, without recording or uploading video. The camera also stops when you press Stop camera, switch to Generate, hide the tab, or close it.

QRick works entirely on your device. It has no analytics, accounts, advertising, remote code, network requests, or browsing-history storage. Its only browser permission is `activeTab`, used after you click the extension to read the current tab URL.

## Category

Productivity

## Search terms

QR code, URL, share page, send to phone, scan, productivity

## Support URL

https://github.com/costinEEST/url-to-qr/issues

## Homepage URL

https://github.com/costinEEST/url-to-qr

## Privacy policy URL

https://github.com/costinEEST/url-to-qr/blob/main/PRIVACY.md

## Single-purpose statement

QRick creates and reads QR codes locally, helping users transfer links and text between devices.

## Permission justification

`activeTab` is used only after the user opens QRick. It allows the extension to read the active tab URL and generate its QR code locally. QRick does not monitor tabs in the background.

## Remote-code declaration

QRick does not use remote code. All JavaScript, the `uqr` QR-generation library, and the `qr` JavaScript scanning fallback are included in the submitted package. There are no CDN requests or WASM assets. The extension CSP permits only local scripts and does not permit JavaScript `eval`.

## Data-use declaration

QRick does not collect or transmit user data. The active URL, edited text, camera frames, and decoded content are processed temporarily and locally. Video is not recorded, stored, or uploaded. No history is persisted after the popup or scanner tab closes. Camera access is requested at runtime only after Start camera.

## Reviewer instructions

1. Open any ordinary HTTPS page.
2. Click the QRick toolbar icon.
3. Confirm that a QR code for the active tab URL appears immediately.
4. Edit the value and confirm that the QR code updates.
5. Open Options to test tracking-parameter removal and error-correction levels.
6. Choose Scan. Confirm a scanner tab opens, then press Start camera and allow camera access.
7. Present a QR code on another screen or on paper. Confirm the camera stops and the exact decoded text appears. Verify Copy text, Generate QR, and Open link (shown only for HTTP(S)).
8. Restart scanning, then test Stop camera, Generate, switching to another tab, and closing the scanner. The camera indicator should turn off each time.
9. Firefox without native QR support exercises the bundled JavaScript fallback. Browsers with native QR support should use that implementation.
10. No account, network service, region, payment, or test credentials are required. Camera scanning requires a working camera and runtime permission; generation does not.

## Third-party sources for review

Dependencies are unmodified releases installed with `npm ci` from `package-lock.json`:

- [uqr 0.1.3](https://www.npmjs.com/package/uqr/v/0.1.3): QR generation.
- [qr 0.7.2](https://www.npmjs.com/package/qr/v/0.7.2): local JavaScript QR scanning fallback. See [review build instructions](../docs/release-review.md) for upstream source and reproduction.

Include these links in the AMO reviewer notes, as required by Mozilla's [third-party library guidance](https://extensionworkshop.com/documentation/publish/third-party-library-usage/).

## Release notes — 1.1.0 (2026-11-17)

Generate and scan QR codes with QRick. Scan using your camera, copy decoded text, open web links explicitly, or turn a scan result into a new QR code. Camera images stay on your device, and the camera stops after a successful scan. This update also improves Edge popup sizing and refreshes the generation and scanning artwork.

Local desktop testing was confirmed by the user in Chrome, Firefox, and Edge after the decoder update. Safari and Firefox for Android camera testing remain pending; see [release review](../docs/release-review.md).
