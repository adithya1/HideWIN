"""Deprecated API organizer; current API domains already live under services/api/api."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
API_ROOT = ROOT / "services" / "api" / "api"

if __name__ == "__main__":
    if not API_ROOT.is_dir():
        raise SystemExit("Current API package was not found; no files were moved.")
    print("API domains are already organized under services/api/api; no files changed.")
