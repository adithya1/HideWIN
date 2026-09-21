from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any

from services.api.db_models.user import User
from services.api.services.email_service import EmailNotificationService

class MarketingService:
    @staticmethod
    async def get_audience_emails(db: AsyncSession, audience_type: str, custom_emails: List[str] = None) -> List[str]:
        if audience_type == "custom" and custom_emails:
            return custom_emails
            
        query = select(User.email).filter(User.is_active == True, User.email_notifications == True)
        
        if audience_type == "premium_users":
            query = query.filter(User.is_premium == True)
        elif audience_type == "free_users":
            query = query.filter(User.is_premium == False)
        # "all_active_users" just uses the base query
        
        result = await db.execute(query)
        emails = result.scalars().all()
        return list(emails)

    @staticmethod
    async def dispatch_campaign(
        db: AsyncSession, 
        template_key: str, 
        audience_type: str, 
        custom_emails: List[str] = None,
        variables_override: Dict[str, Any] = None
    ) -> dict:
        emails = await MarketingService.get_audience_emails(db, audience_type, custom_emails)
        if not emails:
            return {"success": False, "message": "No recipients found for this audience.", "count": 0}
            
        success_count = 0
        vars_base = variables_override or {}
        
        for email in emails:
            # Customize variables per user (e.g. name extraction)
            user_vars = vars_base.copy()
            user_vars["firstName"] = email.split("@")[0]
            
            # In a real heavy-scale production system, this would be pushed to Celery.
            # Here it relies on the internal EmailService logic.
            try:
                # Fire and wait per user. Can be grouped into async tasks if performance is needed.
                res = await EmailNotificationService.dispatch(db, template_key, email, user_vars)
                if res:
                    success_count += 1
            except Exception as e:
                print(f"Error dispatching campaign to {email}: {e}")
                
        return {
            "success": True, 
            "message": f"Campaign dispatched to {success_count}/{len(emails)} recipients.",
            "count": success_count,
            "total_attempted": len(emails)
        }
