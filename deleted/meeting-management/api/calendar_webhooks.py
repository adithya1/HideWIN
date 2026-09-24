from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
import logging

from services.api.core.database import get_db

router = APIRouter(prefix="/webhooks/calendar", tags=["calendar_webhooks"])
logger = logging.getLogger(__name__)

@router.post("/google")
async def google_calendar_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Endpoint for Google Calendar Push Notifications.
    Google sends a POST request here when a subscribed calendar changes.
    """
    # Extract headers
    channel_id = request.headers.get("X-Goog-Channel-ID")
    resource_id = request.headers.get("X-Goog-Resource-ID")
    resource_state = request.headers.get("X-Goog-Resource-State")
    
    logger.info(f"Received Google Webhook: channel_id={channel_id}, state={resource_state}")
    
    # In a full implementation, you would:
    # 1. Look up the user by channel_id (stored in DB when subscription was created)
    # 2. Call Google Calendar API `events.list` with `syncToken` to get what changed
    # 3. Update the corresponding HideWin meeting in the DB
    
    return {"status": "received"}

@router.post("/outlook")
async def outlook_calendar_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Endpoint for Microsoft Graph API Subscriptions.
    Microsoft sends a POST request here when an event is created/updated/deleted.
    """
    # Handle subscription validation request
    validation_token = request.query_params.get("validationToken")
    if validation_token:
        return validation_token
        
    payload = await request.json()
    logger.info(f"Received Outlook Webhook: {payload}")
    
    # In a full implementation, you would:
    # 1. Parse payload['value'] for the event ID and change type
    # 2. Look up the HideWin meeting by outlook_event_id
    # 3. Apply the changes to the DB
    
    return {"status": "received"}
