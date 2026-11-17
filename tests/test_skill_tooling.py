"""Regressions for failures encountered during project skill evaluation."""

from pathlib import Path
from tempfile import TemporaryDirectory
from unittest import TestCase, main

from scripts.check_skills import check_skill


class SkillChecks(TestCase):
    def test_valid_skill_with_repository_reference(self) -> None:
        with TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "guide.md").write_text("# Guide\n", encoding="utf-8")
            skill = root / "sample-skill"
            skill.mkdir()
            (skill / "SKILL.md").write_text(
                '---\nname: sample-skill\ndescription: "Use for local checks."\n'
                'metadata:\n  tags: "testing"\n---\n[Guide](../guide.md)\n',
                encoding="utf-8",
            )
            self.assertEqual(check_skill(skill), [])

    def test_unquoted_colon_is_rejected(self) -> None:
        with TemporaryDirectory() as directory:
            skill = Path(directory) / "sample-skill"
            skill.mkdir()
            (skill / "SKILL.md").write_text(
                "---\nname: sample-skill\ndescription: Use for tests: broken YAML\n---\n",
                encoding="utf-8",
            )
            self.assertIn("invalid frontmatter", check_skill(skill)[0])

    def test_missing_reference_is_reported(self) -> None:
        with TemporaryDirectory() as directory:
            skill = Path(directory) / "sample-skill"
            skill.mkdir()
            (skill / "SKILL.md").write_text(
                "---\nname: sample-skill\ndescription: Use for tests\n---\n"
                "[Guide](missing.md)\n",
                encoding="utf-8",
            )
            self.assertIn("missing local link target", check_skill(skill)[0])


if __name__ == "__main__":
    main()
