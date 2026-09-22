import json
import logging
import httpx
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
import urllib.parse

from services.api.db_models.user import User
from services.api.db_models.meeting import Meeting
from services.api.core.config import settings
from services.api.core.admin_config import get_admin_settings

logger = logging.getLogger(__name__)

def get_outlook_client_id(): return get_admin_settings().outlook_client_id
def get_outlook_client_secret(): return get_admin_settings().outlook_client_secret
OUTLOOK_REDIRECT_URI = "http://localhost:5173/settings/calendar/outlook/callback"


class OutlookCalendarService:
    @staticmethod
    def get_auth_url(state: str) -> str:
        base_url = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize"
        params = {
            "client_id": get_outlook_client_id(),
            "response_type": "code",
            "redirect_uri": OUTLOOK_REDIRECT_URI,
            "response_mode": "query",
            "scope": "offline_access Calendars.ReadWrite",
            "state": state
        }
        return f"{base_url}?{urllib.parse.urlencode(params)}"
        
    @staticmethod
    async def exchange_code(code: str) -> dict:
        token_url = "https://login.microsoftonline.com/common/oauth2/v2.0/token"
        data = {
            "client_id": get_outlook_client_id(),
            "scope": "offline_access Calendars.ReadWrite",
            "code": code,
            "redirect_uri": OUTLOOK_REDIRECT_URI,
            "grant_type": "authorization_code",
            "client_secret": get_outlook_client_secret()
        }
        async with httpx.AsyncClient() as client:
            resp = await client.post(token_url, data=data)
            if resp.status_code != 200:
                logger.error(f"Outlook Token Error: {resp.text}")
                raise HTTPException(status_code=400, detail="Failed to exchange Outlook code")
            return resp.json()
            
    @staticmethod
    async def refresh_token_if_needed(user: User, db: AsyncSession) -> str:
        if not user.outlook_refresh_token:
            raise ValueError("No Outlook refresh token")
            
        token_url = "https://login.microsoftonline.com/common/oauth2/v2.0/token"
        data = {
            "client_id": get_outlook_client_id(),
            "client_secret": get_outlook_client_secret(),
            "refresh_token": user.outlook_refresh_token,
            "grant_type": "refresh_token"
        }
        async with httpx.AsyncClient() as client:
            resp = await client.post(token_url, data=data)
            if resp.status_code == 200:
                token_data = resp.json()
                user.outlook_access_token = token_data["access_token"]
                db.add(user)
                await db.commit()
                return user.outlook_access_token
            else:
                logger.error(f"Failed to refresh Outlook token: {resp.text}")
                raise ValueError("Could not refresh token")
                
    @staticmethod
    async def create_event(user: User, meeting: Meeting, db: AsyncSession) -> str:
        if not user.outlook_access_token:
            return None
            
        access_token = await OutlookCalendarService.refresh_token_if_needed(user, db)
        
        event_payload = {
            "subject": meeting.title,
            "body": {
                "contentType": "HTML",
                "content": meeting.description or "Scheduled via HideWin"
            },
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
                "https://graph.microsoft.com/v1.0/me/events",
                headers=headers,
                json=event_payload
            )
            if resp.status_code == 201:
                data = resp.json()
                meeting.outlook_event_id = data.get("id")
                db.add(meeting)
                await db.commit()
                return meeting.outlook_event_id
            else:
                logger.error(f"Failed to create Outlook event: {resp.text}")
                return None

    @staticmethod
    async def update_event(user: User, meeting: Meeting, db: AsyncSession) -> bool:
        if not user.outlook_access_token or not meeting.outlook_event_id:
            return False
            
        access_token = await OutlookCalendarService.refresh_token_if_needed(user, db)
        
        event_payload = {
            "subject": meeting.title,
            "body": {
                "contentType": "HTML",
                "content": meeting.description or "Scheduled via HideWin"
            },
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
            resp = await client.patch(
                f"https://graph.microsoft.com/v1.0/me/events/{meeting.outlook_event_id}",
                headers=headers,
                json=event_payload
            )
            if resp.status_code == 200:
                return True
            else:
                logger.error(f"Failed to update Outlook event: {resp.text}")
                return False
