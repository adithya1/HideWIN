from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class CampaignDispatchRequest(BaseModel):
    template_key: str
    audience: str # "all_active_users", "premium_users", "free_users", "custom"
    custom_emails: Optional[List[str]] = []
    variables_override: Optional[Dict[str, Any]] = {}
