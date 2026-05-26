from __future__ import annotations

import base64

from cryptography.fernet import Fernet

from app.config import settings


def _get_fernet() -> Fernet:
    key = settings.ENCRYPTION_KEY
    if not key:
        key = base64.urlsafe_b64encode(b"glork-dev-key-32-bytes-padding!!").decode()
    return Fernet(key.encode() if isinstance(key, str) else key)


def encrypt(value: str) -> str:
    f = _get_fernet()
    return f.encrypt(value.encode()).decode()


def decrypt(value: str) -> str:
    f = _get_fernet()
    return f.decrypt(value.encode()).decode()
