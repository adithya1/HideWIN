# models.py — Compatibility shim
# ================================
# This file exists ONLY to keep the compiled `routers/admin.pyc` working.
# admin.pyc was compiled against `import db_models as models` and cannot be changed.
#
# All NEW code should import from `db_models` directly, e.g.:
#   from db_models import User, Session, AiProviderKey
#
# When admin.pyc is eventually replaced with a .py source, delete this shim.

from db_models import *           # re-export all ORM classes
from db_models.base import Base   # re-export Base for metadata access
