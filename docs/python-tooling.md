# Python support tooling

QRick remains a TypeScript application built and tested with npm. Python is development-only support for maintaining project skills; it is not bundled into the extension or bookmarklet and is not required by users.

The setup follows the useful parts of the Python cookbook reference: uv-managed environments, a committed lockfile, Ruff lint/format checks, and ty type checking. The main project uses Python **3.15 or newer**, with 3.15 selected by default. NVIDIA evaluation tools remain in an independent Python 3.13 project because their pinned release does not support 3.15.

## Local consistency checks

Install uv, then run from the repository root:

```bash
uv sync --locked
uv run --locked python scripts/check_skills.py
uv run --locked ruff check scripts/check_skills.py tests/test_skill_tooling.py
uv run --locked ruff format --check scripts/check_skills.py tests/test_skill_tooling.py
uv run --locked ty check
uv run --locked python -m unittest discover -s tests -p 'test_*.py'
```

`.python-version` selects Python 3.15. `pyproject.toml` sets a minimum of 3.15 without an upper cap and `uv.lock` pins resolved dependencies. uv can download the compatible interpreter if needed. The ignored `.venv` is project-local; no shell activation or global pip install is needed. These commands require no API keys and no camera.

`scripts/check_skills.py` checks project-local `SKILL.md` frontmatter, folder/name agreement, string descriptions/metadata, local Markdown file links, and the existing Codex UI metadata. Its link check supports the repository's current inline Markdown path convention; it does not validate anchors, remote URLs, arbitrary Markdown syntax, security, or live-agent behavior. Use SkillEvaluator for the wider static review.

Python 3.15.2 is the verified runtime for the current helper/tests. Newer Python versions are permitted by the manifest, but must be tested before claiming compatibility. Ruff targets 3.15 syntax and ty infers the same minimum. Ruff 0.16.10 currently warns that Python 3.15 support is under development; the checks pass, but this warning is retained rather than hidden by enabling preview mode solely to suppress it.

The `dev` group contains only the tools needed by these checks. Ruff and ty inspect the first-party Python helper/tests, not the TypeScript app or downloaded evaluator code. VS Code recommends Python, Ruff, and ty and uses `.venv` as its interpreter directory. The dedicated `skill-tooling` CI job runs the same local checks; the existing npm job remains independent.

## Isolated NVIDIA SkillEvaluator project

`tools/skill-evaluation/` is a separate non-workspace uv project, with its own `pyproject.toml`, `.python-version`, lockfile, and ignored `.venv`. It pins the reviewed NVIDIA source commit and matching released SkillSpector wheel. Its Python 3.13 constraint does not affect root development tools:

```bash
uv sync --project tools/skill-evaluation --locked
uv run --project tools/skill-evaluation --locked python --version
uv run --project tools/skill-evaluation --locked skillevaluator --version
uv run --project tools/skill-evaluation --locked skillspector --version
```

The pinned SkillEvaluator declares `>=3.12,<3.15`; forcing it into Python 3.15 would violate its supported range. Both evaluator and scanner are installed beside Python 3.13 in the nested environment, with no custom scanner override or patched rules. Do not bypass their Python requirements to unify interpreter versions.

Run these commands **from the repository root**. `--project` selects the nested environment while the following relative skill/report paths remain relative to the working directory:

```bash
uv run --project tools/skill-evaluation --locked skillevaluator quality-check \
  .agents/skills/qrick-testing -r cli -r json -o dist/skill-evaluation/qrick-testing
uv run --project tools/skill-evaluation --locked skillevaluator tier1 \
  .agents/skills/qrick-testing --no-llm -r cli -r json \
  -o dist/skill-evaluation/qrick-testing/static
uv run --project tools/skill-evaluation --locked skillevaluator harness-check \
  .agents/skills --harness codex --json dist/skill-evaluation/harness.json
```

Tier 1 accepts one skill folder; repeat it for the other two skills. Harness-check accepts the collection. The quality command creates its output directory before the collection JSON is written in this example. The former root `skill-evaluation` dependency group has been removed; use `--project` instead of `--group`.

The keyless static gate may provision additional scanner runtimes on its first run, so it needs network access and any applicable execution approval. These commands explicitly disable model-backed checks; semantic deduplication and live-agent A/B runs need separate provider/sandbox setup and authorization. Read actual exit codes, scan completeness, findings, and Codex outcomes: a quality score or harness-check exit 0 alone is not a full review pass.

Retain historical evaluation reports under `docs/skill-evaluation/` only when requested or useful for a review record. Routine output belongs in ignored `dist/skill-evaluation/`. Earlier reports are snapshots of the skills evaluated then, not evidence for later edits.

## Maintain the environment

Use `uv lock` after an intentional change to root Python dependencies and review `uv.lock`. For evaluator changes, use `uv lock --project tools/skill-evaluation` and review its separate lockfile. Use `uv sync --locked` and `uv run --locked` for verification; do not silently refresh the lockfile to bypass an incompatibility. Preserve `package = false`: this support environment is not a distributable Python library.

Before updating the evaluator or scanner, check their compatible Python versions and security-runtime requirements. Keep both versions and the source commit explicit, rerun relevant checks, and retain a clear account of skipped or incomplete stages.

The browser/source packaging script includes both projects’ configuration/lockfiles, skills, and helper tests in the source archive. Python environment folders/caches are excluded. No Python package enters the installable browser archives.
