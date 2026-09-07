from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from services.api.core.database import get_db
from services.api.core.security import get_current_user
from services.api.models.user import User
from services.api.db_models.user import Device

router = APIRouter(prefix="/user/devices", tags=["devices"])

@router.get("")
async def list_my_devices(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Device).where(Device.user_id == current_user.id))
    devices = result.scalars().all()
    return {
        "success": True,
        "devices": [
            {"mac_address": d.mac_address, "last_used": str(d.last_used), "trial_hits": getattr(d, 'trial_hits', 0)}
            for d in devices
        ],
    }

@router.delete("/{mac_address}")
async def remove_device(
    mac_address: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Device).where(Device.mac_address == mac_address, Device.user_id == current_user.id)
    )
    device = result.scalars().first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
        
    await db.delete(device)
    await db.commit()
    return {"status": "success", "message": "Device removed"}

@router.post("/reset-hardware")
async def reset_my_hardware(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Device).where(Device.user_id == current_user.id))
    devices = result.scalars().all()
    for d in devices:
        await db.delete(d)
        
    # Would normally add to audit log here
    await db.commit()
    return {"status": "success", "message": "All devices removed from your account."}
