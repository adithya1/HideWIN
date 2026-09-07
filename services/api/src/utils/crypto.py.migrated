"""
utils/crypto.py
===============
Symmetric Fernet encryption for API keys stored in the database.

The MASTER_KEY is generated once and stored in a local `.master.key` file
(never in the DB or .env). Keys in the DB are encrypted bytes — useless
without this master key file.

Usage:
    from src.utils.crypto import encrypt_key, decrypt_key

    encrypted = encrypt_key("gsk_abc123...")     # store this in DB
    raw       = decrypt_key(encrypted)           # use this for API calls
"""

import os
import base64
from pathlib import Path
from cryptography.fernet import Fernet

_KEY_FILE = Path(__file__).parent.parent / ".master.key"


def _get_or_create_master_key() -> bytes:
    """Load or generate the Fernet master key. Creates .master.key on first run."""
    if _KEY_FILE.exists():
        return _KEY_FILE.read_bytes().strip()
    # First time: generate and persist
    key = Fernet.generate_key()
    _KEY_FILE.write_bytes(key)
    # Restrict file permissions (best-effort on Windows)
    try:
        import stat
        os.chmod(_KEY_FILE, stat.S_IRUSR | stat.S_IWUSR)
    except Exception:
        pass
    return key


_fernet = Fernet(_get_or_create_master_key())


def encrypt_key(raw_key: str) -> str:
    """Encrypt a plaintext API key → base64 token safe for DB storage."""
    if not raw_key:
        return ""
    token = _fernet.encrypt(raw_key.encode("utf-8"))
    return token.decode("utf-8")


def decrypt_key(encrypted: str) -> str:
    """Decrypt a stored token → plaintext API key for in-memory use."""
    if not encrypted:
        return ""
    try:
        return _fernet.decrypt(encrypted.encode("utf-8")).decode("utf-8")
    except Exception:
        return ""


def mask_key(raw_key: str) -> str:
    """Return a safe masked version for display in admin UI: ***last4."""
    if not raw_key or len(raw_key) < 4:
        return "***"
    return f"***{raw_key[-4:]}"
