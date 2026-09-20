from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from pydantic import BaseModel

from services.api.core.database import get_db
from services.api.core.security import get_current_user
from services.api.models.user import User
from services.api.db_models.billing import Order, Payment
from services.api.api.admin.router import verify_admin

admin_router = APIRouter(prefix="/admin/orders", tags=["Admin Orders"])
user_router = APIRouter(prefix="/user/orders", tags=["User Orders"])

class OrderOut(BaseModel):
    id: int
    amount: float
    status: str
    payment_method: Optional[str]
    class Config:
        orm_mode = True

# --- ADMIN ENDPOINTS ---
@admin_router.get("/", response_model=List[OrderOut])
async def admin_get_all_orders(db: AsyncSession = Depends(get_db), _: User = Depends(verify_admin)):
    """Admin: Fetch all orders across all users."""
    result = await db.execute(select(Order))
    return result.scalars().all()

# --- USER ENDPOINTS ---
@user_router.get("/", response_model=List[OrderOut])
async def user_get_my_orders(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """User: Fetch orders specific to the currently logged in user."""
    result = await db.execute(select(Order).filter(Order.user_id == current_user.id))
    return result.scalars().all()

@user_router.post("/")
async def user_create_order(amount: float, payment_method: str = "card", db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """User: Create a new order."""
    new_order = Order(user_id=current_user.id, amount=amount, status="pending", payment_method=payment_method)
    db.add(new_order)
    await db.commit()
    await db.refresh(new_order)
    return new_order

