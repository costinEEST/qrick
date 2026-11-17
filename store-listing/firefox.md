# Firefox Add-ons fields

Use the common copy in [shared.md](shared.md).

- Distribution: On addons.mozilla.org (listed)
- Platforms: Firefox desktop; enable Android distribution only after the current scan flow is device-tested
- Experimental: No
- Requires payment, non-free services, or extra hardware: No for generation; camera scanning requires a working camera
- Data collection: None; the manifest declares `required: ["none"]`
- License: Zero-Clause BSD for QRick; bundled libraries retain their MIT/Apache licenses (see THIRD-PARTY-NOTICES.txt)
- Category: Productivity
- Source code required: Yes, because the submitted bundle is minified
- Add-on package: `dist/qrick-firefox-vX.Y.Z.zip`
- Source package: `dist/qrick-source-vX.Y.Z.zip`
- Source build command: `nvm use && npm ci && npm run build:extension`
- Reviewer notes: use the shared reviewer instructions and mention that `dist/extension-firefox` is the matching build output

Keep the extension ID `qrick@costineest.dev` unchanged after the first release so updates remain associated with the same add-on.

## Approved version 1.1.0

Mozilla approved 1.1.0 on November 17, 2026. Use the [public listing](https://addons.mozilla.org/firefox/addon/qrick/) for current-version installation and the [Mozilla-signed 1.1.0 XPI](https://addons.mozilla.org/firefox/downloads/file/5267185/qrick-1.1.0.xpi) for that specific release. The unsigned Firefox ZIP remains the submission artifact, not the normal installation download. The signed file is externally hosted and is not covered by the generated ZIP checksums.

The [GitHub release notes](../docs/releases/v1.1.0.md) include both links. Confirm each future signed version's URL after Mozilla approval; do not reuse the 1.1.0 file link for another version.
