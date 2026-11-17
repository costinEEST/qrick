# QRick skill evaluation — November 17, 2026

Reviewed the three project-local Codex skills using [NVIDIA SkillEvaluator](https://github.com/NVIDIA/SkillEvaluator), version 0.9.0 from source commit [`64b237f017264e7a82447d7e1a217d8893ed7e84`](https://github.com/NVIDIA/SkillEvaluator/tree/64b237f017264e7a82447d7e1a217d8893ed7e84). The isolated evaluator used Python 3.13.18. No application dependencies, CI workflows, browser settings, or model credentials were changed.

## Results

| Skill | Before quality | After quality | Keyless Tier 1 | Codex profile |
| --- | --- | --- | --- | --- |
| qrick-development | 88.5 / B | 100.0 / A | Pass, exit 0 | Loads |
| qrick-testing | 88.5 / B | 100.0 / A | Pass, exit 0 | Loads |
| qrick-release | 88.5 / B | 100.0 / A | Pass, exit 0 | Loads |

These are static rubric and scan results, not an estimate of task success or proof of improved agent behavior. The original quality checks also passed (exit 0). All three Codex skill-creator validators and project-local reference checks passed after editing.

Raw evidence:

- `before/<skill>/skillevaluator-quality.{json,md}` and `before/harness.json`.
- `after/<skill>/skillevaluator-quality.{json,md}`, `after/<skill>/static/skillevaluator-tier1.{json,md}`, and `after/harness.json`.
- `before/commands.json` and `after/commands.json`: command arguments and per-command exit codes. The batch driver's success alone is not an evaluation pass.
- `after/diagnostics/testing-browser-toggle-finding.json`: the intermediate security finding and input digest before clarifying its browser-UI context.

## Changes made

- Shortened descriptions from 743 combined characters to 353, retaining distinct development, testing, and release triggers.
- Added project-contributor attribution and string-valued tags, without inventing a person's email or identity.
- Made setup requirements, task-specific examples, known limits, and troubleshooting easier to find.
- Kept native-only bookmarklet scanning, native-first extension fallback, local WASM, minimal permissions, and camera cancellation boundaries intact.
- Preserved the difference between guidance, mocked tests, rendered previews, installed-extension checks, and actual hardware verification.
- Clarified that Chrome/Edge Developer mode is the extension-manager page's toggle. SkillSpector initially classified the phrase “enable Developer mode” as an agent instruction override. The final wording names the browser page and toggle; no suppression baseline or lowered severity was used.

Some initial advice was organizational: the original skills already discussed limitations and prerequisites in other sections. The updates make those details discoverable and add concrete examples; the score increase should not be mistaken for newly proven behavior.

## Commands and runtime

For each skill folder, the final checks were:

```bash
skillevaluator quality-check .agents/skills/qrick-development \
  -r json -r markdown -o docs/skill-evaluation/2026-11-17/after/qrick-development
skillevaluator tier1 .agents/skills/qrick-development --no-llm \
  -r json -r markdown -o docs/skill-evaluation/2026-11-17/after/qrick-development/static
```

The same commands ran for `qrick-testing` and `qrick-release`, substituting the matching target and output folder. Quality and final Tier 1 commands all exited 0. The collection-level command was:

```bash
skillevaluator harness-check .agents/skills --harness codex \
  --json docs/skill-evaluation/2026-11-17/after/harness.json
```

It exited 0, and each skill's reported Codex outcome is `loads`. Harness checks are advisory, so the JSON outcome matters in addition to the exit code. The packaged Codex profile was verified against Codex CLI 0.166.0 on Linux on November 1, 2026; it is profile-based compatibility, not a fresh end-to-end agent trial on this Mac.

The first `tier1 .agents/skills` attempt exited 2: unlike harness-check, Tier 1 requires an individual skill folder. Subsequent diagnostics caught and corrected an intermediate YAML quoting error. Retained final reports refer to the corrected files.

### Scanner interpreter correction

The managed scanner launcher selected host Python 3.15.2, which failed to build `yara-python==4.5.4` against the local OpenSSL headers. Those initial static attempts exited 1 with security marked incomplete; they were not treated as passing scans.

Provisioning the same pinned SkillSpector 2.13.4 wheel with `uv tool run --python 3.13` succeeded. The final Tier 1 commands used `SKILLEVALUATOR_SKILLSPECTOR_PATH` pointing directly to that environment's verified executable. SkillEvaluator's supported override was used; its source and security rules were not modified. Runtime selection is recorded in `after/commands.json`.

To reproduce this correction after installing the pinned evaluator source and provisioning its managed wheel:

```bash
uv tool run --python 3.13 --quiet --from /path/to/skillspector-2.13.4-py3-none-any.whl \
  skillspector --version
```

Locate that environment's `skillspector` executable and set `SKILLEVALUATOR_SKILLSPECTOR_PATH` to its absolute path for the evaluator invocation. The scanner wheel's expected SHA-256 is defined by the pinned evaluator's `utils/scanner_install.py`. The evaluation's temporary checkout and virtual environment were removed; shared uv/scanner download caches were preserved.

## Remaining advisories and limits

- The schema suggests a literal `## Instructions` heading. The skills already have task-specific instruction sections; no redundant heading hierarchy was added just to satisfy that recommendation.
- Contributor attribution has no email. This is intentional; no personal contact information was invented.
- Generic cross-harness checks warn that `.agents/skills` is not a Claude Code discovery root. These skills are currently intended for Codex, as requested; no copies for other agents were added.
- Security scans warn about repository-context references outside each individual skill directory. Project-local link checks verified that those files exist, but external guides and unbundled repository references were not included in the scanner's security scope.
- Tier 2 semantic deduplication, Tier 1 model-backed review, and Tier 3 live-agent A/B evaluation were not run. They need additional provider/sandbox setup; no score or Skill Lift is claimed for them.
- All final reports retain `publication_status: incomplete`. Passing keyless Tier 1 does not establish the tool's full publication eligibility, and static 100/100 is not a certification of skill effectiveness.
