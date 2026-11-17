# QRick skill review after Python tooling changes

Reviewed all three project skills on November 17, 2026 with [NVIDIA SkillEvaluator](https://github.com/NVIDIA/SkillEvaluator), version 0.9.0 at commit `64b237f017264e7a82447d7e1a217d8893ed7e84`, and SkillSpector 2.13.4. The locked evaluator environment uses Python 3.13; the project's Python 3.15 tooling remains separate. See [Python tooling](../../python-tooling.md) for setup.

## Results

| Skill | Quality before → after | Keyless Tier 1 after | Codex compatibility |
| --- | --- | --- | --- |
| qrick-development | 100/A → 100/A | Passed | Loads |
| qrick-release | 100/A → 100/A | Passed | Loads |
| qrick-testing | 100/A → 100/A | Passed | Loads |

Every evaluation command exited 0. Exact arguments and exits are retained in [before/commands.json](before/commands.json) and [after/commands.json](after/commands.json), alongside the JSON and Markdown reports. Earlier review reports remain unchanged in the neighboring date directory.

## Changes supported by findings

- Grouped each skill's existing workflow sections under an explicit `Instructions` heading, resolving the schema advisory without expanding the workflow.
- Clarified the release prerequisites: use dependencies resolved through `package-lock.json` and version-pinned commands in `package.json`. The prior generic “npm/npx dependencies” wording triggered SkillSpector's unpinned-command advisory; the updated guidance resolves it. This was a clarification, not removal of an executable vulnerability.

The score was already 100 before these edits. No scores or scanner severities were overridden, and no suppressions were added.

## Reproduce

From the repository root, repeat the first two commands for each skill:

```sh
uv run --project tools/skill-evaluation --locked skillevaluator quality-check .agents/skills/qrick-development -r json -r markdown -o /tmp/qrick-quality
uv run --project tools/skill-evaluation --locked skillevaluator tier1 .agents/skills/qrick-development --no-llm -r json -r markdown -o /tmp/qrick-tier1
uv run --project tools/skill-evaluation --locked skillevaluator harness-check .agents/skills --harness codex --json /tmp/qrick-harness.json
```

The project skill checker, skill-creator's `quick_validate.py` for each skill, and `git diff --check` also passed after the edits. The project checker verifies YAML, discovery fields, Codex metadata, and local reference paths.

## Scope and remaining advisories

These are static, keyless checks. No model-backed Tier 2/3 evaluation, live Codex comparison, or measured task-performance improvement is claimed. The reports' publication status remains `incomplete`; passing Tier 1 does not establish publication readiness.

The dedicated Codex compatibility report lists all three skills as loading with no findings. It uses the evaluator's packaged compatibility profile (Codex CLI 0.166.0, verified November 1, 2026), rather than a fresh live trial on this Mac.

The full Tier 1 reports retain non-blocking attribution and other-agent advisories: the author has no email address, and other harnesses have different discovery paths, trust requirements, or reload behavior. Codex is the requested target, so no fabricated contact details or additional agent installations were added.

Security scanning covers the files within each skill directory. Linked repository documents and externally installed guidance skills are not transitively security-audited by this review; local reference checks establish path existence only.
