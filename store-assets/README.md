# QRick branding and store assets

QRick is the name for both generation and scanning. Keep the QR icon and cobalt-blue visual identity. The tagline is **Generate and scan QR codes. Everything stays on your device.** The Generate view is headed **Create a QR code**; the Scan view is headed **Scan a QR code**. The bookmarklet's native-only limitation must remain clear in its functionality description; the tagline does not imply every browser supports scanning.

## Maintained sources and exports

| Asset | Maintained source | Generated output |
| --- | --- | --- |
| Extension icons | `scripts/make-icons.mjs` (`MARK` and color constants) | `src/extension/public/icons/icon-{16,32,48,128}.png` |
| Generation screenshot | `demo/index.html`, `demo/main.ts`, shared panel sources/styles | `shared/screenshot-popup-1280x800.png` |
| Scanner screenshot | Same source, with `?store-shot=1&scan=1` | `shared/screenshot-scanner-1280x800.png` |
| Generation/scanning promo | `source/promo-generate-scan-generated.png` | `chrome/promo-small-440x280.png` |

Paths in the table are relative to this folder except `scripts/`, `src/`, and `demo/`, which are relative to the repository root. Screenshots and icons are rendered from code. The promotional artwork has a retained raster master and a documented prompt; it is not an editable SVG or a real screenshot. Do not recreate an SVG from its PNG and present it as the original source.

## Regenerate current exports

Use the project Node version and run commands from the repository root:

```bash
npm run icons
npm run assets:promo
npm run assets:store
npm run validate:assets
```

`assets:promo` uses **sharp-cli 5.2.0**, pinned in package.json's command. Its first run needs network access through npx, but it does not add a project dependency. It resizes the retained master to 440×280 with a center-cover fit and exports PNG. To run the same export directly:

```bash
npx --yes --package=sharp-cli@5.2.0 sharp \
  --input store-assets/source/promo-generate-scan-generated.png \
  --output store-assets/chrome/promo-small-440x280.png \
  --format png resize 440 280 --fit cover
```

`assets:store` runs Vite on a temporary localhost port, opens an isolated headless Chrome profile, and renders each screenshot at 1280×800 with device scale 1 and an sRGB color profile. It waits with a virtual-time budget for the real UI to load. Set `CHROME_PATH` if Chrome is not in the default location. The helper closes its server and removes its temporary browser profile when finished. No camera session is started for the scanner screenshot.

When changing UI wording, styles, or mode controls, edit maintained application/demo code first and regenerate both screenshots in the same task. Do not patch screenshot pixels. When replacing promotional art, retain the new source and exact prompt first, regenerate its final tile, and inspect both together. Changing one export never silently updates the others.

## Create a new promotional master

The current generation/scanning artwork was created on **November 17, 2026**, with the built-in imagegen tool, opaque background, using the exact prompt in [source/promo-generate-scan-prompt.txt](source/promo-generate-scan-prompt.txt). No API CLI or model identifier was selected. The prompt describes the intended aspect ratio; the delivered master's actual dimensions are authoritative for export.

To create a replacement:

1. Review current product behavior and both rendered screenshots. Keep generation and scanning equally visible, the blue/white/black palette, clear thumbnail shapes, and safe crop margins. Avoid invented UI, readable personal data, third-party logos, and implied platform claims.
2. Use the imagegen skill and built-in image tool with the retained prompt as a starting point. Record the final exact prompt and generation method. Regeneration is nondeterministic: the same prompt will not reproduce identical pixels.
3. Inspect the generated master before selecting it. Copy the selected file into `store-assets/source/`; do not leave a project asset only in an agent's generated-images directory. Preserve an existing master unless replacement was requested.
4. Export the selected master using the pinned command above. If the selected filename changes, update package.json's `assets:promo` input and this inventory together.
5. Compare master and 440×280 export: verify both cards, QR motifs, scanner brackets, arrows, and crop margins survive. These QR motifs are illustrative and must not be advertised as functional codes.

`source/promo-small-generated.png` is the retained earlier, generation/phone-sharing artwork. It is historical provenance and is no longer the input for the current store tile.

## Visual and automated checks

Use browser MCP to inspect the corresponding rendered generation/scanning pages and served PNG exports when available. Compare the current headings, mode buttons, actions, sample URL, colors, clipping, and content. Distinguish inspecting the master from inspecting the final downscaled tile; checking one cannot prove the other is current. A busy MCP profile should be handled with an isolated supported session, without closing an unrelated browser. If MCP is unavailable, state the limitation and identify any alternative image/browser inspection actually performed.

Inspect the promotional master and export at full size and thumbnail size. Verify that each screenshot is opaque, contains no personal URL or browser-profile information, and accurately shows the current UI. Conceptual promotional art need not reproduce screenshot geometry, but must not invent product capabilities. The scanner screenshot shows the ready state, not a live camera feed or fabricated result.

`npm run validate:assets` checks PNG signatures, dimensions, RGB format for screenshots/tiles, and icon sizes. It does not prove legibility, current wording, or platform compatibility. Run `npm run release:check` when preparing distributable bundles after branding changes.

## Upload mapping

- Chrome: `chrome/promo-small-440x280.png`, the 128 px icon, and both 1280×800 screenshots.
- Edge: the 128 px icon and shared screenshots; the promotional tile is optional.
- Firefox: the 128 px icon and shared screenshots. Include source/reviewer instructions from `store-listing/firefox.md` with the release.
- Safari: inspect screenshot suitability in the signed containing app before submission. This artwork does not establish Safari or mobile camera compatibility.

Keep uploaded store descriptions, README tagline, manifest descriptions, screenshots, and promotional art consistent. Check current primary store requirements before submission; local validation is not store approval.
