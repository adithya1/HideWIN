# Hide-WIN Architecture

> Last updated: 2026-09-07 | 536/536 frontend tests passing

## Overview

Hide-WIN is a full-stack Electron + FastAPI application for AI-powered stealth assistance.
Architecture follows Domain-Driven Design (DDD) with clear separation between the desktop
frontend (Electron/LitElement) and cloud backend (FastAPI + async SQLAlchemy 2.0).

---

## Repository Layout

`
Hide-WIN/
├── Hide-Win-Master/          # Electron desktop app
│   └── src/
│       ├── index.js          # Entry point — lifecycle only (~7 KB)
│       ├── ipc-handlers.js   # 45 ipcMain handler registrations
│       ├── storage.js        # Electron-side config/credential storage
│       ├── preload.js        # Electron context bridge
│       ├── components/
│       │   ├── app/
│       │   │   ├── HideWinApp.js            # State shell + router (47 KB)
│       │   │   ├── HideWinApp.styles.js     # Global CSS token sheet
│       │   │   ├── HideWinAppEvents.js      # connectedCallback IPC bindings
│       │   │   └── HideWinAppRenderers.js   # renderCurrentView / renderTopToolbar
│       │   └── views/                       # One .js + .styles.js per view
│       │       ├── MainView.js + MainView.styles.js
│       │       ├── AssistantView.js + .styles.js + AssistantViewRenderers.js
│       │       ├── NotesView.js + .styles.js + NotesViewRenderer.js
│       │       ├── CustomizeView.js + .styles.js + CustomizeViewRenderer.js
│       │       ├── HistoryView.js + HistoryView.styles.js
│       │       ├── AICustomizeView.js + AICustomizeView.styles.js
│       │       ├── AuthView.js, OnboardingView.js, BrowseView.js ...
│       │       └── sharedPageStyles.js      # Shared Lit CSS design tokens
│       └── utils/
│           ├── gemini.js            # Gemini session orchestrator
│           ├── gemini.audio.js      # macOS/Windows audio capture (extracted)
│           ├── gemini.textutils.js  # Pure text formatting helpers (extracted)
│           ├── window.js            # Window creation (13 KB)
│           ├── window.shortcuts.js  # Keybinds + window IPC handlers (extracted)
│           ├── prompts.js           # Prompt builder logic (5 KB)
│           ├── prompts.data.js      # Prompt templates — data only, no logic
│           ├── renderer.js          # Renderer process bootstrap
│           ├── audioUtils.js        # WAV/PCM buffer utilities (extracted)
│           ├── cloud.js, localai.js, ai_proxy_client.js, vad-bundle.js, tray.js

├── services/api/             # FastAPI backend
│   ├── main.py               # Single entry point — mounts ALL routers
│   ├── core/
│   │   ├── config.py         # Pydantic BaseSettings
│   │   ├── database.py       # AsyncSession factory + get_db dependency
│   │   └── security.py       # JWT, get_current_user, get_current_user_ws
│   ├── models/user.py        # Core SQLAlchemy User model
│   ├── db_models/            # All ORM models by domain
│   │   ├── user.py, billing.py, session.py, workflow.py
│   │   ├── system.py, ai_config.py, email_template.py
│   │   └── __init__.py       # Re-exports all models
│   ├── schemas/              # Pydantic schemas
│   └── api/                  # Domain routers — one package per domain
│       ├── authentication/   │
│       ├── users/            │  Each contains:
│       ├── devices/          │    __init__.py
│       ├── notifications/    │    router.py   (FastAPI APIRouter)
│       ├── system/           │    schemas.py  (optional)
│       ├── billing/          │
│       ├── vendor/           │
│       ├── calendar/         │
│       ├── ai_config/        │
│       ├── resume/           │
│       ├── code_pilot/       │
│       ├── context/          │
│       ├── integrations/     │
│       ├── reports/          │
│       ├── admin/            │
│       ├── team/             │  (Third-Eye WS)
│       └── guest/            │  (Guest collaboration WS)

├── deleted/                  # Reversibly archived code and development artifacts
├── _archive/                 # Older retained repository history

├── scripts/
│   ├── setup/                # create_admin.py, create_docker.py
│   └── maintenance/          # cleanup utilities

└── AGENTS.md                 # AI memory policy (read before every session)
`

---

## Backend: Domain Routing Convention

Every domain under services/api/api/ follows:

`python
# api/<domain>/router.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from services.api.core.database import get_db
from services.api.core.security import get_current_user
from services.api.models.user import User

router = APIRouter(prefix="/<domain>", tags=["<domain>"])

@router.get("/")
async def list_items(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Item).filter(Item.user_id == current_user.id))
    return result.scalars().all()
`

All routers mounted in main.py:
`python
app.include_router(users_router)
app.include_router(billing_router)
# etc.
`

### Database Access — CRITICAL

Always use **AsyncSession** (SQLAlchemy 2.0 style):

`python
# CORRECT
result = await db.execute(select(User).filter(User.id == uid))
user = result.scalars().first()

# WRONG — will raise AttributeError at runtime
user = db.query(User).filter(User.id == uid).first()
`

### Authentication

| Context | Dependency | Returns |
|---------|-----------|---------|
| HTTP routes | Depends(get_current_user) | User ORM object |
| WebSocket | wait get_current_user_ws(token) | User \| None |

---

## Frontend: View Component Convention

`
views/<Name>.js           # LitElement class — state, lifecycle, small methods
views/<Name>.styles.js    # Exported appStyles / viewStyles CSS literal
views/<Name>Renderer.js   # Delegated render() if original >8 KB
`

Render delegation pattern (keeps component testable):
`js
// In MyView.js
import { render } from './MyViewRenderer.js';

class MyView extends LitElement {
    render() { return render.call(this); }
}
`

---

## Design Rules (Non-negotiable)

1. **Files describe WHAT THEY ARE.** ix_auth.py ❌ → pi/authentication/router.py ✅
2. **Never permanently delete production code.** Rename .migrated or move to deleted/ or _archive/.
3. **Git history is the source of truth** for any recovery.
4. **services/api/src/ is fully retired.** All files renamed *.migrated.
5. **Security:** Never log or return API keys to the frontend. Mask all credentials.
6. **Always verify:** python -c "from services.api.main import app; print('OK')" after backend changes.
7. **Always verify:** 
pm run test (536 tests) after frontend changes.
