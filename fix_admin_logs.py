# -*- coding: utf-8 -*-
import re

file_path = "services/api/api/admin/router.py"
with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

analytics_endpoint = """@router.get("/email-analytics")
async def get_email_analytics(db: AsyncSession = Depends(get_db), _: User = Depends(verify_admin)):
    res = await db.execute(select(EmailLog.status))
    statuses = res.scalars().all()
    
    total = len(statuses)
    delivered = sum(1 for s in statuses if s in ("DELIVERED", "SENT"))
    failed = sum(1 for s in statuses if s == "FAILED")
    
    return {
        "total_attempted": total,
        "total_delivered": delivered,
        "total_failed": failed,
        "success_rate": f"{(delivered/total*100):.1f}%" if total > 0 else "0%"
    }
"""

retry_endpoint = """@router.post("/email-logs/{log_id}/retry")
async def retry_email_log(log_id: int, db: AsyncSession = Depends(get_db), _: User = Depends(verify_admin)):
    from services.api.services.email_service import EmailNotificationService
    
    res = await db.execute(select(EmailLog).filter(EmailLog.id == log_id))
    log = res.scalars().first()
    
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
        
    if "OTP" in log.template_key.upper():
        raise HTTPException(status_code=400, detail="Expired authentication email - cannot retry.")
        
    if log.status == "DELIVERED":
        raise HTTPException(status_code=400, detail="Email was already delivered successfully.")
        
    try:
        success = await EmailNotificationService.dispatch(
            db, 
            log.template_key, 
            log.recipient, 
            {"firstName": log.recipient.split('@')[0]}
        )
        return {"success": success, "message": "Retry successful" if success else "Retry failed again"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
"""

if "get_email_analytics" not in text:
    text = text.replace("@router.get(\"/email-logs\")", analytics_endpoint + "\n" + retry_endpoint + "\n@router.get(\"/email-logs\")")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Injected Email Analytics and Retry endpoints into Admin API!")
