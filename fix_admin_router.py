import re

file_path = "services/api/api/admin/router.py"
with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

import_marketing = """from services.api.schemas.marketing_schema import CampaignDispatchRequest
from services.api.services.marketing_service import MarketingService
"""

endpoint = """@router.post("/email-campaigns/dispatch")
async def dispatch_marketing_campaign(
    payload: CampaignDispatchRequest, 
    db: AsyncSession = Depends(get_db), 
    _: User = Depends(verify_admin)
):
    try:
        result = await MarketingService.dispatch_campaign(
            db, 
            payload.template_key, 
            payload.audience, 
            payload.custom_emails, 
            payload.variables_override
        )
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["message"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
"""

if "dispatch_marketing_campaign" not in text:
    text = text.replace("@router.get(\"/email-logs\")", import_marketing + "\n" + endpoint + "\n@router.get(\"/email-logs\")")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Injected marketing campaign dispatch into admin router!")
