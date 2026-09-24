"""Deprecated one-off Docker generator.

Use the maintained root compose files instead; this script intentionally does
not rewrite project files or create obsolete service folders.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

if __name__ == "__main__":
    compose_files = (ROOT / "docker-compose.yml", ROOT / "docker-compose.dev.yml")
    missing = [str(path.name) for path in compose_files if not path.is_file()]
    if missing:
        raise SystemExit(f"Maintained compose files missing: {', '.join(missing)}")
    print("Compose files are already maintained at the repository root.")
