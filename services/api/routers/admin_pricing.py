from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List, Optional
from pydantic import BaseModel

from services.api.core.security import get_current_user, get_db
from services.api.db_models.user import User
from services.api.db_models.billing import Package, CountryPricing, PaymentMethod

router = APIRouter(prefix='/admin/pricing', tags=['Admin Pricing'])

def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != 'ADMIN':
        raise HTTPException(status_code=403, detail='Not authorized')
    return current_user

@router.get('/methods')
async def get_payment_methods(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    res = await db.execute(select(PaymentMethod))
    return {'items': res.scalars().all()}

class MethodUpdate(BaseModel):
    is_active: bool

@router.put('/methods/{id}')
async def update_payment_method(id: int, req: MethodUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    res = await db.execute(select(PaymentMethod).filter(PaymentMethod.id == id))
    method = res.scalars().first()
    if not method:
        raise HTTPException(status_code=404, detail='Not found')
    method.is_active = req.is_active
    await db.commit()
    return {'status': 'success'}

@router.get('/packages')
async def get_packages(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    res = await db.execute(select(Package).order_by(Package.display_order))
    return {'items': res.scalars().all()}

class PackageCreate(BaseModel):
    name: str
    credits: int
    base_price: float
    discount_percentage: float
    active: bool
    display_order: int

@router.post('/packages')
async def create_package(req: PackageCreate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    pkg = Package(**req.dict())
    db.add(pkg)
    await db.commit()
    return {'status': 'success'}

@router.put('/packages/{id}')
async def update_package(id: int, req: PackageCreate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    res = await db.execute(select(Package).filter(Package.id == id))
    pkg = res.scalars().first()
    if not pkg: raise HTTPException(404)
    for k, v in req.dict().items():
        setattr(pkg, k, v)
    await db.commit()
    return {'status': 'success'}

@router.delete('/packages/{id}')
async def delete_package(id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    res = await db.execute(select(Package).filter(Package.id == id))
    pkg = res.scalars().first()
    if not pkg: raise HTTPException(404)
    await db.delete(pkg)
    await db.commit()
    return {'status': 'success'}

@router.get('/rules')
async def get_pricing_rules(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    from sqlalchemy.orm import selectinload
    res = await db.execute(select(CountryPricing).options(selectinload(CountryPricing.package)))
    return {'items': res.scalars().all()}
