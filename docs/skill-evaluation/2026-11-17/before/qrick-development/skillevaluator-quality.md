# SkillEvaluator Validation Report

**Status:** ✅ PASSED
**Publication status:** ⚠️ INCOMPLETE
**Quality config:** packaged, `sha256:298ff2bf62132c8154217b7aa59fc1fd04f28cf75372f55620a2cbcd951d6549`, min score 70
**Generated:** November 17, 2026 at 12:25 PM UTC

## Summary

| Metric | Value |
|--------|-------|
| Validator Results | 1 |
| Validators Run | 1 |
| ✅ Passed | 1 |
| ❌ Failed | 0 |
| ⚠️ Incomplete | 0 |
| Total Issues | 8 unique findings (2 medium) / 8 occurrences / 8 raw records |
| Duplicate Occurrences Reconciled | 0 |

## Finding Reconciliation

| Finding ID | Severity | Finding | Occurrences | Validators |
|------------|----------|---------|-------------|------------|
| `SEF-bf2d85d8c9d7a282e7ad` | MEDIUM | SKILL&#95;SPEC recommended field missing: 'metadata.author' | 1 | QUALITY |
| `SEF-dd828fd8f6476dc5f3c7` | MEDIUM | SKILL&#95;SPEC recommended field missing: 'metadata.tags' | 1 | QUALITY |
| `SEF-0d2215183b14101ae2c2` | LOW | No examples provided | 1 | QUALITY |
| `SEF-378f24adfec67572e606` | LOW | No troubleshooting section documented | 1 | QUALITY |
| `SEF-4a6560f4aec006f302f9` | LOW | No prerequisites/requirements documented | 1 | QUALITY |
| `SEF-b6533ad44b39dbc6d0d2` | LOW | No '&#35;&#35; Purpose' section | 1 | QUALITY |
| `SEF-e29ed766b7358f826a10` | LOW | Description very long (229 chars, recommend 50-150) | 1 | QUALITY |
| `SEF-fc6fe3747c071963a76e` | LOW | No limitations documented | 1 | QUALITY |

## Quality Score

| Skill | Score | Grade | Type | Correctness | Discoverability | Reliability | Efficiency |
|-------|-------|-------|------|-------------|-----------------|-------------|------------|
| qrick-development | 88.5 | B | guide-only | 85.0 | 90.0 | 85.0 | 100.0 |

## Results

### ✅ B QUALITY
*Skill quality scoring across Correctness (35%), Discoverability (25%), Reliability (25%), and Efficiency (15%)*

**Overall: 88.5/100 (Grade: B)** | Skill Type: guide-only

| Dimension | Score | Weight |
|-----------|-------|--------|
| Correctness | 85.0 | 35% |
| Discoverability | 90.0 | 25% |
| Reliability | 85.0 | 25% |
| Efficiency | 100.0 | 15% |

- [OK] **quality_score**: Score: 88.5/100 (Grade: B)

**Non-blocking findings: 8**

| Severity | Issue | Location |
|----------|-------|----------|
| [LOW] LOW | No examples provided | <code>/Users/costi/Desktop/github/url-to-qr/.agents/skills/qrick-development/SKILL.md</code> |
| [MED] MEDIUM | SKILL_SPEC recommended field missing: 'metadata.author' | <code>/Users/costi/Desktop/github/url-to-qr/.agents/skills/qrick-development/SKILL.md</code> |
| [MED] MEDIUM | SKILL_SPEC recommended field missing: 'metadata.tags' | <code>/Users/costi/Desktop/github/url-to-qr/.agents/skills/qrick-development/SKILL.md</code> |
| [LOW] LOW | Description very long (229 chars, recommend 50-150) | <code>/Users/costi/Desktop/github/url-to-qr/.agents/skills/qrick-development/SKILL.md</code> |
| [LOW] LOW | No '## Purpose' section | <code>/Users/costi/Desktop/github/url-to-qr/.agents/skills/qrick-development/SKILL.md</code> |
| [LOW] LOW | No prerequisites/requirements documented | <code>/Users/costi/Desktop/github/url-to-qr/.agents/skills/qrick-development/SKILL.md</code> |
| [LOW] LOW | No limitations documented | <code>/Users/costi/Desktop/github/url-to-qr/.agents/skills/qrick-development/SKILL.md</code> |
| [LOW] LOW | No troubleshooting section documented | <code>/Users/costi/Desktop/github/url-to-qr/.agents/skills/qrick-development/SKILL.md</code> |

<details>
<summary>View Details</summary>

**1. No examples provided**
- File: `/Users/costi/Desktop/github/url-to-qr/.agents/skills/qrick-development/SKILL.md`
- Check: `quality_correctness`
- Finding ID: `SEF-0d2215183b14101ae2c2`
- Occurrence ID: `SEO-3adcbcfa26e9b0f4cd12`
- Fix: Add example usage with code blocks

**2. SKILL_SPEC recommended field missing: 'metadata.author'**
- File: `/Users/costi/Desktop/github/url-to-qr/.agents/skills/qrick-development/SKILL.md`
- Check: `quality_correctness`
- Finding ID: `SEF-bf2d85d8c9d7a282e7ad`
- Occurrence ID: `SEO-f55e716ab717993d2ca3`
- Fix: Add 'author' under metadata: — Author name or team (under metadata:)

**3. SKILL_SPEC recommended field missing: 'metadata.tags'**
- File: `/Users/costi/Desktop/github/url-to-qr/.agents/skills/qrick-development/SKILL.md`
- Check: `quality_correctness`
- Finding ID: `SEF-dd828fd8f6476dc5f3c7`
- Occurrence ID: `SEO-4c428b0ec46171c82c88`
- Fix: Add 'tags' under metadata: — Categorization tags (under metadata:, list of 1-5 items)

**4. Description very long (229 chars, recommend 50-150)**
- File: `/Users/costi/Desktop/github/url-to-qr/.agents/skills/qrick-development/SKILL.md`
- Check: `quality_discoverability`
- Finding ID: `SEF-e29ed766b7358f826a10`
- Occurrence ID: `SEO-fce2ea3d67fb148a03cb`
- Fix: Keep descriptions concise for progressive disclosure

**5. No '## Purpose' section**
- File: `/Users/costi/Desktop/github/url-to-qr/.agents/skills/qrick-development/SKILL.md`
- Check: `quality_discoverability`
- Finding ID: `SEF-b6533ad44b39dbc6d0d2`
- Occurrence ID: `SEO-260d348aa1a6d5e4f09d`
- Fix: Add purpose section to clarify use cases

**6. No prerequisites/requirements documented**
- File: `/Users/costi/Desktop/github/url-to-qr/.agents/skills/qrick-development/SKILL.md`
- Check: `quality_reliability`
- Finding ID: `SEF-4a6560f4aec006f302f9`
- Occurrence ID: `SEO-1e953443807362fdf830`
- Fix: Document dependencies, API keys, or setup needed

**7. No limitations documented**
- File: `/Users/costi/Desktop/github/url-to-qr/.agents/skills/qrick-development/SKILL.md`
- Check: `quality_reliability`
- Finding ID: `SEF-fc6fe3747c071963a76e`
- Occurrence ID: `SEO-cdef40b05ea731c5ab27`
- Fix: Add '## Limitations' section with known issues/constraints

**8. No troubleshooting section documented**
- File: `/Users/costi/Desktop/github/url-to-qr/.agents/skills/qrick-development/SKILL.md`
- Check: `quality_reliability`
- Finding ID: `SEF-378f24adfec67572e606`
- Occurrence ID: `SEO-eed5df64e97dac7b760d`
- Fix: Add '## Troubleshooting' with Error/Cause/Solution patterns

</details>


---
*Generated by SkillEvaluator*