import json
import logging
import httpx
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException
import urllib.parse

from services.api.db_models.user import User
from services.api.db_models.meeting import Meeting
from services.api.core.config import settings
from services.api.core.admin_config import get_admin_settings

logger = logging.getLogger(__name__)

# Dynamic getters
def get_google_client_id(): return get_admin_settings().google_client_id
def get_google_client_secret(): return get_admin_settings().google_client_secret
GOOGLE_REDIRECT_URI = f"{settings.WEB_BASE_URL.rstrip('/')}/settings/calendar/google/callback"


class GoogleCalendarService:
    @staticmethod
    def get_auth_url(state: str) -> str:
        base_url = settings.GOOGLE_OAUTH_AUTHORIZE_URL
        params = {
            "client_id": get_google_client_id(),
            "redirect_uri": GOOGLE_REDIRECT_URI,
            "response_type": "code",
            "scope": "https://www.googleapis.com/auth/calendar.events",
            "access_type": "offline",
            "prompt": "consent",
            "state": state
        }
        return f"{base_url}?{urllib.parse.urlencode(params)}"
        
    @staticmethod
    async def exchange_code(code: str) -> dict:
        token_url = settings.GOOGLE_OAUTH_TOKEN_URL
        data = {
            "code": code,
            "client_id": get_google_client_id(),
            "client_secret": get_google_client_secret(),
            "redirect_uri": GOOGLE_REDIRECT_URI,
            "grant_type": "authorization_code"
        }
        async with httpx.AsyncClient() as client:
            resp = await client.post(token_url, data=data)
            if resp.status_code != 200:
                logger.error(f"Google Token Error: {resp.text}")
                raise HTTPException(status_code=400, detail="Failed to exchange Google code")
            return resp.json()
            
    @staticmethod
    async def refresh_token_if_needed(user: User, db: AsyncSession) -> str:
        if not user.google_refresh_token:
            raise ValueError("No Google refresh token")
            
        token_url = settings.GOOGLE_OAUTH_TOKEN_URL
        data = {
            "client_id": get_google_client_id(),
            "client_secret": get_google_client_secret(),
            "refresh_token": user.google_refresh_token,
            "grant_type": "refresh_token"
        }
        async with httpx.AsyncClient() as client:
            resp = await client.post(token_url, data=data)
            if resp.status_code == 200:
                token_data = resp.json()
                user.google_access_token = token_data["access_token"]
                db.add(user)
                await db.commit()
                return user.google_access_token
            else:
                logger.error(f"Failed to refresh Google token: {resp.text}")
                raise ValueError("Could not refresh token")
                
    @staticmethod
    async def create_event(user: User, meeting: Meeting, db: AsyncSession) -> str:
        if not user.google_access_token:
            return None
            
        access_token = await GoogleCalendarService.refresh_token_if_needed(user, db)
        
        event_payload = {
            "summary": meeting.title,
            "description": meeting.description or "Scheduled via HideWin",
            "start": {
                "dateTime": meeting.start_time.isoformat(),
                "timeZone": meeting.timezone or "UTC"
            },
            "end": {
                "dateTime": meeting.end_time.isoformat(),
                "timeZone": meeting.timezone or "UTC"
            }
        }
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                settings.GOOGLE_CALENDAR_EVENTS_URL,
                headers=headers,
                json=event_payload
            )
            if resp.status_code == 200:
                data = resp.json()
                meeting.google_event_id = data.get("id")
                db.add(meeting)
                await db.commit()
                return meeting.google_event_id
            else:
                logger.error(f"Failed to create Google event: {resp.text}")
                return None

    @staticmethod
    async def update_event(user: User, meeting: Meeting, db: AsyncSession) -> bool:
        if not user.google_access_token or not meeting.google_event_id:
            return False
            
        access_token = await GoogleCalendarService.refresh_token_if_needed(user, db)
        
        event_payload = {
            "summary": meeting.title,
            "description": meeting.description or "Scheduled via HideWin",
            "start": {
                "dateTime": meeting.start_time.isoformat(),
                "timeZone": meeting.timezone or "UTC"
            },
            "end": {
                "dateTime": meeting.end_time.isoformat(),
                "timeZone": meeting.timezone or "UTC"
            }
        }
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        async with httpx.AsyncClient() as client:
            resp = await client.put(
                f"{settings.GOOGLE_CALENDAR_EVENTS_URL}/{urllib.parse.quote(meeting.google_event_id, safe='')}",
                headers=headers,
                json=event_payload
            )
            if resp.status_code == 200:
                return True
            else:
                logger.error(f"Failed to update Google event: {resp.text}")
                return False
