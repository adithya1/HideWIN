
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import select, func, desc
from typing import List, Optional
from fastapi.responses import StreamingResponse
import csv
import io
from datetime import datetime

from services.api.core.security import get_current_user, get_db
from services.api.db_models.user import User
from services.api.db_models.billing import Order, Transaction, Subscription, CreditHistory
from services.api.services.global_search_service import GlobalSearchService

router = APIRouter(prefix='/admin/billing', tags=['Admin Billing'])

from fastapi import Query
from services.api.core.config import settings
import jwt

async def get_admin_from_token(token: str = Query(...), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=["HS256"])
        email = payload.get("sub")
        res = await db.execute(select(User).filter(User.email == email))
        user = res.scalars().first()
        if not user or user.role != 'ADMIN':
            raise HTTPException(status_code=403, detail="Not authorized")
        return user
    except:
        raise HTTPException(status_code=403, detail="Invalid token")

def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != 'ADMIN':
        raise HTTPException(status_code=403, detail='Not authorized')
    return current_user

@router.get('/overview')
async def get_billing_overview(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    total_orders_query = await db.execute(select(func.count(Order.id)))
    total_orders = total_orders_query.scalar() or 0
    
    total_revenue_query = await db.execute(select(func.sum(Transaction.amount)).filter(Transaction.type == 'Credit Purchase'))
    total_revenue = total_revenue_query.scalar() or 0.0
    
    active_subs_query = await db.execute(select(func.count(Subscription.id)).filter(Subscription.status == 'active'))
    active_subs = active_subs_query.scalar() or 0
    
    return {
        'total_orders': total_orders,
        'total_revenue': total_revenue,
        'active_subscriptions': active_subs
    }

@router.get('/orders')
async def get_orders(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=250),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    offset = (page - 1) * page_size
    query = select(Order).order_by(desc(Order.created_at)).offset(offset).limit(page_size)
    res = await db.execute(query)
    orders = res.scalars().all()
    
    count_query = await db.execute(select(func.count(Order.id)))
    total_count = count_query.scalar() or 0
    
    return {
        'items': orders,
        'total': total_count,
        'page': page,
        'page_size': page_size,
        'total_pages': (total_count + page_size - 1) // page_size
    }

@router.get('/orders/export')
async def export_orders(token: str, db: Session = Depends(get_db), current_user: User = Depends(get_admin_from_token)):
    res = await db.execute(select(Order).order_by(desc(Order.created_at)))
    orders = res.scalars().all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['Order ID', 'User ID', 'Amount', 'Currency', 'Status', 'Stripe Session', 'Created At'])
    
    for order in orders:
        writer.writerow([
            order.id, 
            order.user_id, 
            order.amount, 
            order.currency, 
            order.status, 
            order.stripe_session_id, 
            order.created_at.strftime('%Y-%m-%d %H:%M:%S') if order.created_at else ''
        ])
    
    output.seek(0)
    response = StreamingResponse(iter([output.getvalue()]), media_type="text/csv")
    response.headers["Content-Disposition"] = f"attachment; filename=orders_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    return response

@router.get('/transactions')
async def get_transactions(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=250),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    offset = (page - 1) * page_size
    query = select(Transaction).order_by(desc(Transaction.created_at)).offset(offset).limit(page_size)
    res = await db.execute(query)
    transactions = res.scalars().all()
    
    count_query = await db.execute(select(func.count(Transaction.id)))
    total_count = count_query.scalar() or 0
    
    return {
        'items': transactions,
        'total': total_count,
        'page': page,
        'page_size': page_size,
        'total_pages': (total_count + page_size - 1) // page_size
    }

@router.get('/search')
async def global_search(q: str, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    return await GlobalSearchService.search(db, q)

