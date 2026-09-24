import secrets
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from services.api.db_models.system import InviteToken
from services.api.models.user import User
from services.api.core.config import settings

class InvitationService:
    @staticmethod
    async def send_invites(emails: List[str], current_user: User, db: AsyncSession) -> dict:
        created = []
        for email in emails:
            token = secrets.token_urlsafe(24)
            invite = InviteToken(
                token=token,
                invited_email=email,  # Schema uses invited_email, not email
                vendor_id=current_user.id if getattr(current_user, 'role', '') == "VENDOR" else None,
            )
            db.add(invite)
            invite_link = f"{settings.WEB_BASE_URL.rstrip('/')}/invite?token={token}"
            created.append({"email": email, "link": invite_link})
        
        await db.commit()
        return {"success": True, "invited": created}
