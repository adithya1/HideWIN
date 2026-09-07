from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from services.api.core.database import get_db
from services.api.db_models.ai_config import AppSetting
from pydantic import BaseModel

router = APIRouter(tags=["system"])

class RemoteControlEvent(BaseModel):
    type: str

@router.get("/system/dns")
async def get_public_dns_settings(db: AsyncSession = Depends(get_db)):
    res_ip = await db.execute(select(AppSetting).where(AppSetting.setting_key == "dns_ip"))
    res_port = await db.execute(select(AppSetting).where(AppSetting.setting_key == "dns_port"))
    res_domain = await db.execute(select(AppSetting).where(AppSetting.setting_key == "dns_domain"))
    
    ip_setting = res_ip.scalars().first()
    port_setting = res_port.scalars().first()
    domain_setting = res_domain.scalars().first()
    
    return {
        "dnsIP": ip_setting.setting_value if ip_setting else "127.0.0.1",
        "dnsPort": port_setting.setting_value if port_setting else "8000",
        "dnsDomain": domain_setting.setting_value if domain_setting else ""
    }

@router.post("/system/remote-control")
async def handle_remote_control(event: RemoteControlEvent, db: AsyncSession = Depends(get_db)):
    if event.type == "screenshot_and_analyze":
        return {"status": "unsupported_in_api", "message": "Remote control tasks have been moved to dedicated background services."}
    raise HTTPException(status_code=400, detail="Invalid remote control event")
