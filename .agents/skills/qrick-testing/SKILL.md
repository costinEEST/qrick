---
name: qrick-testing
description: "Use for QRick bug investigation and verification: camera lifecycle, popup layout, bookmarklets, and local extensions."
metadata:
  author: "QRick contributors"
  tags: "qrick, testing, browser-debugging"
---

# QRick testing

## Purpose

Run commands from the repository root using `.nvmrc` and `package-lock.json`. Read `package.json` for current commands, [the manual test guide](../../../docs/release-review.md), and the affected source/tests. Do not treat an old manual result as verification of new changes.

## Python support tooling

For changes to Python helpers or skill files, use the project-local Python 3.15+ environment in `pyproject.toml` and `uv.lock`; see [Python tooling](../../../docs/python-tooling.md). Run `uv sync --locked` when setup is needed, then `uv run --locked python scripts/check_skills.py`. Do not use global pip installs or copy an interpreter choice from another project. The root `.python-version` defaults to 3.15; newer interpreters are allowed by the manifest but need verification before claiming support. Normal application work still uses npm and does not require Python.

For Python helper changes, run locked Ruff lint/format, `ty check`, and the Python unittest command from the tooling guide. For an NVIDIA review, use `uv run --project tools/skill-evaluation --locked skillevaluator ...`; run Tier 1 per skill with `--no-llm` for keyless checks and keep reports outside skill directories. The separate evaluator project retains Python 3.13 because its pinned release requires a version below 3.15; it does not constrain root tooling. Do not force evaluator dependencies into the Python 3.15+ environment. Static results do not establish model-backed deduplication or live-agent effectiveness.

## Prerequisites

Use the project Node version (`nvm use`) and installed lockfile dependencies; run `npm ci` only if setup is needed. Automated suites require no camera or API keys. Local extension testing needs the current built output and the target browser. Hardware scanning needs a camera and runtime permission. Browser MCP is optional evidence tooling; when it is unavailable, continue relevant automated checks and state the browser gap.

## Guidance versus verification

Use the installed `chrome-extensions` skill for extension-specific investigation and reviews of manifest permissions, CSP, browser APIs, and popup behavior ([upstream skill](https://github.com/GoogleChrome/modern-web-guidance/tree/main/skills/chrome-extensions)). Use `modern-web-guidance` for browser layout, HTML/CSS/DOM, accessibility, and camera API investigations ([upstream skill](https://github.com/GoogleChrome/modern-web-guidance/tree/main/skills/modern-web-guidance)); follow its search/retrieve procedure when implementing a web fix. Reading a guide is not a passing test.

Resolve installed paths through the session skill catalog. If unavailable, use upstream guidance and primary docs and disclose the substitution. Verify questionable guide assertions against official browser documentation. Preserve QRick's user-invoked `activeTab` access rather than adding broad `tabs` permission as a troubleshooting shortcut. Chrome extension guidance does not establish Firefox/Safari behavior; use their own documentation and installed-browser testing for those platforms.

Keep existing Vitest, artifact smoke checks, validators, and manual camera/browser checks as the actual verification evidence. Do not replace them with a guide checklist or report compatibility based solely on guide compliance.

## Instructions

### Match checks to the behavior

| Change or question | Useful checks |
| --- | --- |
| URL handling or QR output | `tests/link.test.ts`, `tests/qr.test.ts` |
| Shared panel modes, generation from results, camera teardown | `tests/panel.test.ts`, `tests/scanner.test.ts` |
| Native preference, JavaScript fallback, local decoding | `tests/scanner-decoder.test.ts`; preserve the real QR decode with network access blocked |
| Bookmarklet dialog lifecycle | `tests/bookmarklet.test.ts`, then `npm run build:bookmarklet` and `npm run smoke` for the actual artifact |
| Popup sizing, clipping, focus, appearance | Rendered browser checks; jsdom has no useful layout engine |
| Complete application verification | `npm run verify` |
| Store/release readiness | `npm run release:check`; this also rebuilds archives and runs Mozilla lint |

For a focused suite use `npm test -- tests/scanner.test.ts` (substitute the relevant file). Add regression tests for observable failures, especially camera resource leaks, rather than merely checking implementation wording.

### Exercise local builds

Build extensions with `npm run build:extension`; add `-- --zip` only when ZIPs are wanted. In Chrome/Edge, open `chrome://extensions` or `edge://extensions`. Use that page’s **Developer mode** toggle to reveal **Load unpacked**, then select the **entire `dist/extension` folder**. Reload the installed extension after rebuilding.

In Firefox use `about:debugging#/runtime/this-firefox` → Load Temporary Add-on → `dist/extension-firefox/manifest.json`, preserving adjacent files. `about:addons` → Install Add-on From File is not the temporary-install path for an unsigned local build. Do not change signing preferences merely to test.

For the built bookmarklet, serve the repository root with `python3 -m http.server 8000 --bind 127.0.0.1`, open `/bookmarklet/install.html`, and replace the saved bookmark. Check the installable URL length, not only whether its JavaScript executes. Localhost supports camera access; arbitrary LAN HTTP origins do not supply the same secure context.

`npm run dev` previews source modules and the bookmarklet-style dialog. It does not test saving the generated bookmark or extension APIs. A normal tab showing `dist/extension/popup.html` over HTTP can establish layout behavior, but is not a toolbar popup or an installed extension.

### Browser MCP evidence

Start with `list_pages`, then reuse an appropriate test page or open a new one. For layout, record viewport/body/panel bounds, overflowing elements, action-label wrapping, and screenshots when available. Distinguish browser window minimum widths from the actual extension-popup viewport. Check light/dark appearance and narrow/mobile layouts when affected.

A blocked MCP profile is not an application failure. Retry the connection, then prefer an isolated supported session. Do not close a user's browser, terminate unknown processes, or delete profile locks as routine recovery. If recovery needs those actions, identify the exact target and use existing authorization or obtain it. If tools remain unavailable, report the exact blocker and continue source/automated checks without claiming rendered verification.

MCP running Chrome or Edge does not establish Firefox or Safari behavior. Likewise, injected mocks and synthetic camera frames validate only the paths exercised; they do not prove hardware permissions or camera quality.

### Camera regressions

Use the manual guide for the full matrix. Prioritize native QR support, missing/unsupported native detection, extension JavaScript decoding without CDN requests, permission denial/retry, exact decoded text, safe result links, and track cleanup. Include cancellation while permission, decoder initialization, or detection is pending when changing asynchronous flow.

Keep user-requested testing sessions available while the user tests. Stop task-owned servers/browser sessions when finished unless the user wants them left running; preserve unrelated sessions and generated deliverables. Report automated results, actual browser observations, user-reported checks, and remaining gaps separately.

## Examples

- Request: “Firefox says the extension is corrupt.” Confirm whether the user used `about:addons` or temporary loading in `about:debugging`; inspect the correct output manifest and run Mozilla lint when an actual package defect is suspected.
- Request: “The camera keeps running after I switch tabs.” Reproduce the visibility transition, inspect track cleanup, and distinguish a real camera indicator from a mock-track assertion.

For a focused asynchronous-camera regression:

```bash
npm test -- tests/scanner.test.ts tests/panel.test.ts
npm run build:bookmarklet
npm run smoke
```

Choose the subset relevant to the bug. If the user asks only to explain a static report, read that report; launching a browser or rebuilding packages is not automatically necessary.

## Limitations

A passing unit test, local preview, or guidance checklist does not establish installed-extension behavior across browsers. Permission prompts, camera availability, and scan quality remain environment-dependent. Report pending hardware or platform checks explicitly; no test in this skill certifies store approval.

## Troubleshooting

- Browser MCP profile in use: reuse a working connection or supported isolated session. A profile lock is a tooling blocker, not evidence of an application defect; use the recovery boundaries in Browser MCP evidence above.
- Bookmark disappears on save: inspect the serialized generated URL and build-size check before debugging its runtime code. Successful JavaScript execution alone does not prove a browser can save it.
- Camera permission denied: verify permission/context and retry behavior. Do not change browser signing or security preferences to force a pass.
