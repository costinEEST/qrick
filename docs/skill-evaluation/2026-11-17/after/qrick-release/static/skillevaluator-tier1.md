# SkillEvaluator Validation Report

**Status:** ✅ PASSED
**Publication status:** ⚠️ INCOMPLETE
**Profile:** default
**Policy digest:** `sha256:64a069b8853f7123049a675d6853ef8d8b424792bb9a2a5157a73ec312f38ed4`
**Quality config:** packaged, `sha256:298ff2bf62132c8154217b7aa59fc1fd04f28cf75372f55620a2cbcd951d6549`, min score 70
**Generated:** November 17, 2026 at 12:45 PM UTC

## Summary

| Metric | Value |
|--------|-------|
| Validator Results | 13 |
| Validators Run | 13 |
| ✅ Passed | 13 |
| ❌ Failed | 0 |
| ⚠️ Incomplete | 0 |
| Total Issues | 8 unique findings (3 medium) / 8 occurrences / 8 raw records; 3 warnings without a finding |
| Duplicate Occurrences Reconciled | 0 |

## Finding Reconciliation

| Finding ID | Severity | Finding | Occurrences | Validators |
|------------|----------|---------|-------------|------------|
| `SEF-2ab016a817c566724ba9` | MEDIUM | Missing recommended section: '&#35;&#35; Instructions' | 1 | Schema &amp; Repository Governance |
| `SEF-9d2eb197d337c5f2a6ae` | MEDIUM | claude-code: Claude Code reads only .claude/skills and ~/.claude/skills; .agents/skills is not scanned. | 1 | Harness Compatibility |
| `SEF-f82db3d8e11d5fb9f66e` | MEDIUM | MCP Rug Pull: npx commands without a version suffix (e.g. &#64;1.0.0) create a rug-pull risk if the upstream server is compromised and pub | 1 | Security Scan |
| `SEF-03e029934351881ba688` | INFO | opencode: Skill list and text are cached at startup; edits need a restart. | 1 | Harness Compatibility |
| `SEF-23a3342a2dfd0cb48068` | INFO | hermes: Project skills are invisible until the repo is trusted (&#96;hermes skills trust&#96;, skills.trusted&#95;project&#95;dirs). | 1 | Harness Compatibility |
| `SEF-3661379ea9e5c1072875` | INFO | copilot-cli: New skills appear only after &#96;/skills reload&#96; or a restart; edits to existing skills apply at once. | 1 | Harness Compatibility |
| `SEF-a310db16cf9a31b52fb0` | INFO | Author has no email address: QRick contributors | 1 | Schema &amp; Repository Governance |
| `SEF-e843862971441e2bf711` | INFO | hermes: 1 files outside references/, templates/, assets/ and scripts/ (agents) are left out of the skill's file list; the model finds them only if SKILL.md names their paths. | 1 | Harness Compatibility |

## Quality Score

| Skill | Score | Grade | Type | Correctness | Discoverability | Reliability | Efficiency |
|-------|-------|-------|------|-------------|-----------------|-------------|------------|
| qrick-release | 100.0 | A | guide-only | 100.0 | 100.0 | 100.0 | 100.0 |

## Results

### ✅ Schema & Repository Governance
*Validate SKILL.md frontmatter and repository structure*

- [OK] **manifest_exists**: Found skill manifest: SKILL.md
- [OK] **frontmatter_valid**: Valid frontmatter for skill 'qrick-release'
- [OK] **folder_hierarchy**: Valid general skill structure: skills/qrick-release/
- [OK] **naming_convention**: Folder name 'qrick-release' follows kebab-case convention
- [OK] **line_count**: SKILL.md within line limit (95/500)
- [OK] **body_heading**: Body contains a top-level heading
- [OK] **body_recommended_section**: Found recommended section: '## Examples'
- [OK] **optional_files**: Found optional supporting files: agents
- [OK] **name_consistency**: Directory name matches frontmatter: 'qrick-release'

**Non-blocking findings: 2**

| Severity | Issue | Location |
|----------|-------|----------|
| [MED] MEDIUM | Missing recommended section: '## Instructions' | <code>/Users/costi/Desktop/github/url-to-qr/.agents/skills/qrick-release/SKILL.md</code> |
| [INFO] INFO | Author has no email address: QRick contributors | <code>/Users/costi/Desktop/github/url-to-qr/.agents/skills/qrick-release/SKILL.md</code> |

<details>
<summary>View Details</summary>

**1. Missing recommended section: '## Instructions'**
- File: `/Users/costi/Desktop/github/url-to-qr/.agents/skills/qrick-release/SKILL.md`
- Check: `body_recommended_section`
- Finding ID: `SEF-2ab016a817c566724ba9`
- Occurrence ID: `SEO-12dee9c6942116dba596`
- Fix: Consider adding a '## Instructions' or '## Usage' section. Per agentskills.io the body format is unrestricted, so this is a convention nudge — it also gives the quality scorer a stable anchor for instruction-quality heuristics.

**2. Author has no email address: QRick contributors**
- File: `/Users/costi/Desktop/github/url-to-qr/.agents/skills/qrick-release/SKILL.md`
- Check: `author_without_email`
- Finding ID: `SEF-a310db16cf9a31b52fb0`
- Occurrence ID: `SEO-08c224f2e0a1bb8bc807`
- Content: `author: QRick contributors`
- Fix: A name is accepted as attribution unless the profile requires a contact address (such as 'registry'); then use 'Name <email@example.com>'

</details>


### ✅ Semantic Version Validation
*Validate optional metadata.version labels and require strict bumps*

- [OK] **version_optional**: No semantic version label present; resource will use commit-hash history

### ✅ Security Scan
*Detect security vulnerabilities and PII/secrets*

- [OK] **skillspector**: Security scan completed - 1 advisory finding(s) (no critical/high issues)

**Non-blocking findings: 1**

| Severity | Issue | Location |
|----------|-------|----------|
| [MED] MEDIUM | MCP Rug Pull: npx commands without a version suffix (e.g. @1.0.0) create a rug-pull risk if the upstream server is compromised and pub | <code>SKILL.md:17</code> |

<details>
<summary>View Details</summary>

**1. MCP Rug Pull: npx commands without a version suffix (e.g. @1.0.0) create a rug-pull risk if the upstream server is compromised and pub**
- File: `SKILL.md:17`
- Check: `Unknown (RP1)`
- Finding ID: `SEF-f82db3d8e11d5fb9f66e`
- Occurrence ID: `SEO-529ae690ccb3420c8c72`
- Fix: npx commands without a version suffix (e.g. @1.0.0) create a rug-pull risk if the upstream server is compromised and publishes a malicious update. Pin the version: npx @scope/server@1.2.3

</details>


### ✅ PII Scan
*Detect PII and local identifiers*

- [OK] **pii_scan_start**: Scanning 2 files for PII
- [OK] **pii_detection**: No PII detected in 2 files (emails, SSNs, phone numbers, paths)

### ✅ License Compliance
*Validate license compliance for Skills, Rules, and Workflows*

- [OK] **license_compliance**: License compliance scan completed (not detected)

### ✅ Code Risk Analysis
*Static code analysis using Bandit and packaged Semgrep rules*

- [OK] **code_file_discovery**: No code files found - code risk analysis is not applicable

### ✅ Secrets Detection
*Detect hardcoded secrets, API keys, and credentials using Gitleaks*

- [OK] **gitleaks**: No secrets detected by Gitleaks

### ✅ Code Integrity & Hygiene
*Validate dead links, dependencies, and static Python test-file discovery*

- [OK] **dead_links_scan**: Checking 1 markdown files for dead links
- [OK] **dead_links**: All relative links valid in 1 markdown file(s)
- [OK] **dependencies**: No dependency files found (requirements.txt, pyproject.toml)
- [OK] **test_discovery**: No standard Python test-file candidates found; target tests were not executed and coverage was not measured. Consider adding tests.

### ✅ Dependency Vulnerability Audit
*Scan dependencies for CVE vulnerabilities using pip-audit and Safety*

- [OK] **dependency_file_discovery**: No dependency files found - vulnerability audit is not applicable

### ✅ Unicode Smuggling Detection
*Detect invisible Unicode characters and ASCII smuggling*

- [OK] **unicode_scan**: No invisible Unicode characters detected in 2 file(s)

### ✅ A QUALITY
*Skill quality scoring across Correctness (35%), Discoverability (25%), Reliability (25%), and Efficiency (15%)*

**Overall: 100.0/100 (Grade: A)** | Skill Type: guide-only

| Dimension | Score | Weight |
|-----------|-------|--------|
| Correctness | 100.0 | 35% |
| Discoverability | 100.0 | 25% |
| Reliability | 100.0 | 25% |
| Efficiency | 100.0 | 15% |

- [OK] **quality_score**: Score: 100.0/100 (Grade: A)

### ✅ SCRIPT_LINT
*AST-based code quality checks for skill scripts*

- [OK] **lint**: No scripts/ or tools/ directory found

### ✅ Harness Compatibility
*Advisory: whether each agent harness loads, degrades or drops the skill*

- All checks passed

**Non-blocking findings: 5**

| Severity | Issue | Location |
|----------|-------|----------|
| [MED] MEDIUM | claude-code: Claude Code reads only .claude/skills and ~/.claude/skills; .agents/skills is not scanned. | <code>/Users/costi/Desktop/github/url-to-qr/.agents/skills/qrick-release/SKILL.md</code> |
| [INFO] INFO | copilot-cli: New skills appear only after &#96;/skills reload&#96; or a restart; edits to existing skills apply at once. | <code>/Users/costi/Desktop/github/url-to-qr/.agents/skills/qrick-release/SKILL.md</code> |
| [INFO] INFO | hermes: Project skills are invisible until the repo is trusted (&#96;hermes skills trust&#96;, skills.trusted_project_dirs). | <code>/Users/costi/Desktop/github/url-to-qr/.agents/skills/qrick-release/SKILL.md</code> |
| [INFO] INFO | hermes: 1 files outside references/, templates/, assets/ and scripts/ (agents) are left out of the skill's file list; the model finds them only if SKILL.md names their paths. | <code>/Users/costi/Desktop/github/url-to-qr/.agents/skills/qrick-release/SKILL.md</code> |
| [INFO] INFO | opencode: Skill list and text are cached at startup; edits need a restart. | <code>/Users/costi/Desktop/github/url-to-qr/.agents/skills/qrick-release/SKILL.md</code> |

<details>
<summary>View Details</summary>

**1. claude-code: Claude Code reads only .claude/skills and ~/.claude/skills; .agents/skills is not scanned.**
- File: `/Users/costi/Desktop/github/url-to-qr/.agents/skills/qrick-release/SKILL.md`
- Check: `CC-ROOT`
- Finding ID: `SEF-9d2eb197d337c5f2a6ae`
- Occurrence ID: `SEO-d6911c955963df833d51`
- Fix: Install it under .claude/skills or ~/.claude/skills (a symlink from .agents/skills works).

**2. copilot-cli: New skills appear only after `/skills reload` or a restart; edits to existing skills apply at once.**
- File: `/Users/costi/Desktop/github/url-to-qr/.agents/skills/qrick-release/SKILL.md`
- Check: `CP-RELOAD`
- Finding ID: `SEF-3661379ea9e5c1072875`
- Occurrence ID: `SEO-2dad48cf27132e108159`

**3. hermes: Project skills are invisible until the repo is trusted (`hermes skills trust`, skills.trusted_project_dirs).**
- File: `/Users/costi/Desktop/github/url-to-qr/.agents/skills/qrick-release/SKILL.md`
- Check: `HM-TRUST`
- Finding ID: `SEF-23a3342a2dfd0cb48068`
- Occurrence ID: `SEO-84ade0bac67c27c14333`
- Fix: Install under ~/.hermes/skills, or run `hermes skills trust` only in a repo whose skills you would run as your own (trust admits every project skill).

**4. hermes: 1 files outside references/, templates/, assets/ and scripts/ (agents) are left out of the skill's file list; the model finds them only if SKILL.md names their paths.**
- File: `/Users/costi/Desktop/github/url-to-qr/.agents/skills/qrick-release/SKILL.md`
- Check: `HM-LINKED-LAYOUT`
- Finding ID: `SEF-e843862971441e2bf711`
- Occurrence ID: `SEO-842d7a2bd97594902095`
- Fix: Move supporting files under references/, templates/, assets/ or scripts/.

**5. opencode: Skill list and text are cached at startup; edits need a restart.**
- File: `/Users/costi/Desktop/github/url-to-qr/.agents/skills/qrick-release/SKILL.md`
- Check: `OC-RELOAD`
- Finding ID: `SEF-03e029934351881ba688`
- Occurrence ID: `SEO-f087e7f190ac5d1852bb`

</details>


---
*Generated by SkillEvaluator*