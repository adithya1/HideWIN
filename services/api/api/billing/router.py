from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from datetime import datetime, timedelta
from pydantic import BaseModel

from services.api.core.database import get_db
from services.api.core.security import get_current_user
from services.api.db_models.billing import Plan, Subscription
from services.api.db_models.ai_config import ApiConfig
from services.api.models.user import User
from services.api.core.config import settings

router = APIRouter(prefix="/billing", tags=["billing"])

async def _get_stripe_secret(db: AsyncSession) -> Optional[str]:
    result = await db.execute(select(ApiConfig).filter(ApiConfig.key == "stripe_secret_key"))
    cfg = result.scalars().first()
    return cfg.value if cfg else None

def _get_stripe():
    try:
        import stripe
        return stripe
    except ImportError:
        return None

@router.get("/plans")
async def list_plans(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Plan).filter(Plan.is_active == True))
    plans = result.scalars().all()
    return {
        "success": True,
        "plans": [
            {
                "id": p.id,
                "slug": p.slug,
                "name": p.name,
                "price_monthly": p.price_monthly,
                "price_annual": p.price_annual,
                "features": p.features,
                "is_active": p.is_active
            }
            for p in plans
        ]
    }

@router.get("/my-plan")
async def get_my_plan(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sub = current_user.subscription
    if not sub:
        return {"success": True, "has_subscription": False, "plan": "Free"}
    return {
        "success": True,
        "has_subscription": True,
        "plan": sub.plan.name if sub.plan else "Unknown",
        "status": sub.status,
        "next_billing": str(sub.next_billing_at) if sub.next_billing_at else None
    }

@router.get("/history")
async def billing_history(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return {
        "success": True,
        "history": [
            {"date": "2026-03-01", "amount": ".00", "status": "Paid", "invoice_url": "#"},
            {"date": "2026-02-01", "amount": ".00", "status": "Paid", "invoice_url": "#"}
        ]
    }

class SubscribeRequest(BaseModel):
    plan_slug: str
    stripe_payment_method_id: Optional[str] = None

@router.post("/subscribe")
async def subscribe(
    body: SubscribeRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Plan).filter(Plan.slug == body.plan_slug, Plan.is_active == True))
    plan = result.scalars().first()
    if not plan:
        raise HTTPException(status_code=400, detail="Invalid plan selected")
        
    stripe_secret = await _get_stripe_secret(db)
    stripe = _get_stripe()
    
    stripe_cust_id = current_user.stripe_customer_id
    stripe_sub_id = None
    next_billing = datetime.utcnow() + timedelta(days=30)
    
    if stripe and stripe_secret and body.stripe_payment_method_id and plan.stripe_price_id:
        stripe.api_key = stripe_secret
        try:
            if not stripe_cust_id:
                cust = stripe.Customer.create(email=current_user.email, payment_method=body.stripe_payment_method_id, invoice_settings={"default_payment_method": body.stripe_payment_method_id})
                stripe_cust_id = cust.id
                current_user.stripe_customer_id = stripe_cust_id
            
            sub = stripe.Subscription.create(customer=stripe_cust_id, items=[{"price": plan.stripe_price_id}])
            stripe_sub_id = sub.id
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
            
    existing_sub = current_user.subscription
    if existing_sub:
        existing_sub.plan_id = plan.id
        existing_sub.status = "active"
        existing_sub.next_billing_at = next_billing
        if stripe_sub_id:
            existing_sub.stripe_subscription_id = stripe_sub_id
        if stripe_cust_id:
            existing_sub.stripe_customer_id = stripe_cust_id
    else:
        new_sub = Subscription(
            user_id=current_user.id,
            plan_id=plan.id,
            stripe_subscription_id=stripe_sub_id,
            stripe_customer_id=stripe_cust_id,
            status="active",
            next_billing_at=next_billing,
        )
        db.add(new_sub)
        
    current_user.is_premium = plan.price_monthly > 0
    await db.commit()
    
    return {"success": True, "message": f"Successfully subscribed to {plan.name}", "plan": plan.name}

@router.post("/cancel")
async def cancel_subscription(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sub = current_user.subscription
    if not sub or sub.status != "active":
        raise HTTPException(status_code=400, detail="No active subscription to cancel")
        
    stripe_secret = await _get_stripe_secret(db)
    stripe = _get_stripe()
    if stripe and stripe_secret and sub.stripe_subscription_id:
        stripe.api_key = stripe_secret
        try:
            stripe.Subscription.delete(sub.stripe_subscription_id)
        except Exception:
            pass
            
    sub.status = "cancelled"
    sub.cancelled_at = datetime.utcnow()
    current_user.is_premium = False
    await db.commit()
    return {"success": True, "message": "Subscription cancelled successfully"}

SEAT_PACKAGES = [
    {"seats": 5,   "price_usd": 25,  "label": "Starter Pack - 5 seats"},
    {"seats": 10,  "price_usd": 45,  "label": "Team Pack - 10 seats"},
    {"seats": 25,  "price_usd": 100, "label": "Business Pack - 25 seats"},
    {"seats": 50,  "price_usd": 180, "label": "Enterprise Pack - 50 seats"},
    {"seats": 100, "price_usd": 300, "label": "Unlimited Pack - 100 seats"},
]

@router.get("/seat-packages")
async def get_seat_packages():
    return {"success": True, "packages": SEAT_PACKAGES}

class BuySeatRequest(BaseModel):
    seats: int
    stripe_payment_method_id: Optional[str] = None

@router.post("/vendor/checkout")
async def vendor_create_checkout(
    body: BuySeatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "VENDOR":
        raise HTTPException(status_code=403, detail="Only vendors can use this")
        
    package = next((p for p in SEAT_PACKAGES if p["seats"] == body.seats), None)
    if not package:
        raise HTTPException(status_code=400, detail="Invalid package")
        
    stripe_secret = await _get_stripe_secret(db)
    stripe = _get_stripe()
    if not stripe or not stripe_secret:
        raise HTTPException(status_code=503, detail="Stripe not configured")
        
    stripe.api_key = stripe_secret
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "product_data": {"name": package["label"]},
                    "unit_amount": int(package["price_usd"] * 100),
                },
                "quantity": 1,
            }],
            mode="payment",
            success_url=f"{settings.WEB_BASE_URL.rstrip('/')}/vendor/billing?success=true",
            cancel_url=f"{settings.WEB_BASE_URL.rstrip('/')}/vendor/billing?canceled=true",
            customer_email=current_user.email,
            metadata={"vendor_id": current_user.id, "seats": body.seats}
        )
        return {"success": True, "url": session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/vendor/portal")
async def vendor_create_portal(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "VENDOR":
        raise HTTPException(status_code=403, detail="Only vendors can use this")
        
    if not current_user.stripe_customer_id:
        raise HTTPException(status_code=400, detail="No Stripe customer found for this vendor")
        
    stripe_secret = await _get_stripe_secret(db)
    stripe = _get_stripe()
    if not stripe or not stripe_secret:
        raise HTTPException(status_code=503, detail="Stripe not configured")
        
    stripe.api_key = stripe_secret
    try:
        session = stripe.billing_portal.Session.create(
            customer=current_user.stripe_customer_id,
            return_url=f"{settings.WEB_BASE_URL.rstrip('/')}/vendor/billing",
        )
        return {"success": True, "url": session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook/stripe")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    stripe_secret = await _get_stripe_secret(db)
    stripe = _get_stripe()
    if not stripe or not stripe_secret:
        raise HTTPException(status_code=503, detail="Stripe not configured")
        
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    result = await db.execute(select(ApiConfig).filter(ApiConfig.key == "stripe_webhook_secret"))
    webhook_secret_cfg = result.scalars().first()
    webhook_secret = webhook_secret_cfg.value if webhook_secret_cfg else None
    
    try:
        if webhook_secret:
            event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
        else:
            import json
            event = json.loads(payload)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
        
    if event["type"] == "invoice.payment_succeeded":
        customer_id = event["data"]["object"].get("customer")
        res = await db.execute(select(User).filter(User.stripe_customer_id == customer_id))
        user = res.scalars().first()
        if user and user.subscription:
            user.subscription.status = "active"
            user.subscription.next_billing_at = datetime.utcnow() + timedelta(days=30)
            await db.commit()
            
    elif event["type"] == "invoice.payment_failed":
        customer_id = event["data"]["object"].get("customer")
        res = await db.execute(select(User).filter(User.stripe_customer_id == customer_id))
        user = res.scalars().first()
        if user and user.subscription:
            user.subscription.status = "past_due"
            await db.commit()
            
    return {"received": True}
