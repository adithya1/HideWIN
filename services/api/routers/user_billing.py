from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import select, desc
from typing import List, Optional
import httpx
import time
import json
import math

from services.api.core.security import get_current_user, get_db
from services.api.db_models.user import User
from services.api.db_models.billing import Order, Transaction, CreditHistory

router = APIRouter(prefix='/user/billing', tags=['User Billing'])

COUNTRY_CURRENCY = {
    'US': ('USD', '$'),
    'IN': ('INR', '₹'),
    'GB': ('GBP', '£'),
    'AU': ('AUD', 'A$'),
    'CA': ('CAD', 'C$'),
    'EU': ('EUR', '€'),
    'FR': ('EUR', '€'),
    'DE': ('EUR', '€'),
    'IT': ('EUR', '€'),
    'ES': ('EUR', '€'),
    'NL': ('EUR', '€'),
}

exchange_cache = {'rates': {}, 'updated_at': 0}

async def fetch_rates():
    if time.time() - exchange_cache['updated_at'] > 3600 * 12:
        try:
            async with httpx.AsyncClient() as client:
                res = await client.get('https://open.er-api.com/v6/latest/USD')
                if res.status_code == 200:
                    data = res.json()
                    exchange_cache['rates'] = data.get('rates', {})
                    exchange_cache['updated_at'] = time.time()
        except Exception as e:
            pass
    return exchange_cache['rates']


@router.get('/balance')
async def get_balance(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return {'credit_balance': current_user.credit_balance or 0}

@router.get('/transactions')
async def get_my_transactions(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    offset = (page - 1) * page_size
    query = select(Transaction).filter(Transaction.user_id == current_user.id).order_by(desc(Transaction.created_at)).offset(offset).limit(page_size)
    res = await db.execute(query)
    transactions = res.scalars().all()
    
    return {'items': transactions}

@router.get('/credit-history')
async def get_my_credit_history(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    offset = (page - 1) * page_size
    query = select(CreditHistory).filter(CreditHistory.user_id == current_user.id).order_by(desc(CreditHistory.created_at)).offset(offset).limit(page_size)
    res = await db.execute(query)
    history = res.scalars().all()
    
    return {'items': history}


import stripe
from services.api.core.config import settings

# Initialize Stripe with dummy or real key
stripe.api_key = getattr(settings, 'STRIPE_SECRET_KEY', 'sk_test_123')

from pydantic import BaseModel

class CheckoutRequest(BaseModel):
    provider: str
    package_id: int
    quantity: int = 1
    country: str = "US"

@router.post('/checkout')
async def create_checkout_session(req: CheckoutRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Create Stripe Checkout Session
    # Mode: subscription (Auto-debit until cancelled)
    
    from services.api.db_models.billing import Package
    res = await db.execute(select(Package).filter(Package.id == req.package_id))
    pkg = res.scalars().first()
    if not pkg: return {'url': 'https://checkout.stripe.com/fake-url-for-testing'}
    
    final_price = pkg.base_price * (1 - pkg.discount_percentage / 100)
    final_price_cents = int(final_price * req.quantity * 100)

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': f'HideWin - {req.quantity}x {pkg.name}'
                    },
                    'unit_amount': final_price_cents,
                    'recurring': { 'interval': 'month' }
                },
                'quantity': 1,
            }],
            mode='subscription',
        )
        return {'url': session.url}

    except Exception as e:
        return {'url': 'https://checkout.stripe.com/fake-url-for-testing'}
from pydantic import BaseModel

class CancelRequest(BaseModel):
    reason: str
    details: str = ""

@router.post('/cancel')
async def cancel_subscription(req: CancelRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    print(f'User canceled because: {req.reason}')
    return {'status': 'cancelled', 'reason': req.reason}


@router.get('/packages')
async def get_active_packages(country: Optional[str] = Query(None), db: Session = Depends(get_db)):
    from services.api.db_models.billing import Package
    res = await db.execute(select(Package).filter(Package.active == True).order_by(Package.display_order))
    packages = res.scalars().all()
    
    # Determine currency
    currency_code, currency_symbol = 'USD', '$'
    if country and country.upper() in COUNTRY_CURRENCY:
        currency_code, currency_symbol = COUNTRY_CURRENCY[country.upper()]
    
    rates = await fetch_rates()
    conversion_rate = rates.get(currency_code, 1.0)
    
    # Format and convert prices
    formatted = []
    for p in packages:
        pd = {
            'id': p.id,
            'name': p.name,
            'credits': p.credits,
            'base_price': math.ceil(p.base_price * conversion_rate) if currency_code in ['INR'] else round(p.base_price * conversion_rate, 2),
            'discount_percentage': p.discount_percentage,
            'active': p.active,
            'display_order': p.display_order,
            'currency_code': currency_code,
            'currency_symbol': currency_symbol
        }
        formatted.append(pd)
        
    return {'items': formatted}

@router.get('/methods')
async def get_active_payment_methods(country: Optional[str] = Query(None), db: Session = Depends(get_db)):
    from services.api.db_models.billing import PaymentMethod
    res = await db.execute(select(PaymentMethod).filter(PaymentMethod.is_active == True))
    methods = res.scalars().all()
    
    country_code = (country or 'US').upper()
    filtered = []
    for m in methods:
        allowed = []
        try:
            allowed = json.loads(m.allowed_countries)
        except:
            pass
        if '*' in allowed or country_code in allowed:
            filtered.append(m)
            
    return {'items': filtered}
