"""Check project-local Codex skill YAML, discovery fields, and local links.

This is a fast repository consistency check, not a security or live-agent eval.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path
from urllib.parse import unquote

import yaml

ROOT = Path(__file__).resolve().parents[1]
NAME = re.compile(r"[a-z0-9]+(?:-[a-z0-9]+)*")
LINK = re.compile(r"\]\(([^)]+)\)")


def check_skill(folder: Path) -> list[str]:
    """Return actionable errors without requiring tools from an agent's home."""
    errors: list[str] = []
    manifest = folder / "SKILL.md"
    if not manifest.is_file():
        return [f"{manifest}: missing SKILL.md"]
    content = manifest.read_text(encoding="utf-8")
    lines = content.splitlines()
    if not lines or lines[0] != "---":
        return [f"{manifest}: expected YAML frontmatter"]
    try:
        end = lines.index("---", 1)
        frontmatter = yaml.safe_load("\n".join(lines[1:end]))
    except (ValueError, yaml.YAMLError) as exc:
        return [f"{manifest}: invalid frontmatter: {exc}"]
    if not isinstance(frontmatter, dict):
        return [f"{manifest}: frontmatter must be a mapping"]
    name = frontmatter.get("name")
    if not isinstance(name, str) or not NAME.fullmatch(name) or name != folder.name:
        errors.append(f"{manifest}: name must match its kebab-case folder")
    description = frontmatter.get("description")
    if not isinstance(description, str) or not description.strip():
        errors.append(f"{manifest}: description must be a nonempty string")
    metadata = frontmatter.get("metadata", {})
    if not isinstance(metadata, dict) or any(
        not isinstance(key, str) or not isinstance(value, str)
        for key, value in metadata.items()
    ):
        errors.append(f"{manifest}: metadata must map strings to strings")
    for document in folder.rglob("*.md"):
        for match in LINK.finditer(document.read_text(encoding="utf-8")):
            target = match.group(1).strip().split("#", 1)[0]
            if not target or re.match(r"[a-zA-Z][a-zA-Z0-9+.-]*:", target):
                continue
            # The project's Markdown links use bare paths or <space-containing paths>.
            target = unquote(target.removeprefix("<").removesuffix(">"))
            if not (document.parent / target).exists():
                errors.append(f"{document}: missing local link target {target}")
    ui = folder / "agents" / "openai.yaml"
    if ui.is_file():
        try:
            data = yaml.safe_load(ui.read_text(encoding="utf-8"))
            interface = data.get("interface") if isinstance(data, dict) else None
            if not isinstance(interface, dict):
                errors.append(f"{ui}: interface must be a mapping")
            else:
                for field in ("display_name", "short_description"):
                    value = interface.get(field)
                    if not isinstance(value, str) or not value.strip():
                        errors.append(f"{ui}: {field} must be a nonempty string")
        except yaml.YAMLError as exc:
            errors.append(f"{ui}: invalid YAML: {exc}")
    return errors


def main() -> int:
    """Validate the current collection and fail if any skill is undiscoverable."""
    root = ROOT / ".agents" / "skills"
    if not root.is_dir():
        print(f"No project skill directory at {root}", file=sys.stderr)
        return 1
    folders = sorted(path for path in root.iterdir() if path.is_dir())
    if not folders:
        print(f"No project skills found in {root}", file=sys.stderr)
        return 1
    errors = [error for folder in folders for error in check_skill(folder)]
    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1
    print(
        f"Validated {len(folders)} Codex skills: YAML, discovery fields, local links."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
