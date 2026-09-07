"""
HideWIN Elite — Billing Router
Handles subscription plans, package purchases, and Stripe configuration.
Admin configures Stripe keys via /api/admin/keys. Users subscribe via this router.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
import db_models as models
import src.schemas.schemas as schemas
from src.lib.database import get_db
from src.api.user.auth import get_current_user

router = APIRouter(prefix="/api/billing", tags=["billing"])

# ───────────────────────────────────────────────────
# Helper: get Stripe secret from admin config
# ───────────────────────────────────────────────────
def _get_stripe_secret(db: Session) -> Optional[str]:
    cfg = db.query(models.ApiConfig).filter(models.ApiConfig.key == "stripe_secret_key").first()
    return cfg.value if cfg else None

def _get_stripe():
    """Try to import stripe. Returns None if not configured."""
    try:
        import stripe
        return stripe
    except ImportError:
        return None

# ─────────────────────────────────────────────────────────────
# PUBLIC PLAN LISTING — no auth required
# ─────────────────────────────────────────────────────────────
@router.get("/plans")
def list_plans(db: Session = Depends(get_db)):
    """Return all active billing plans."""
    plans = db.query(models.Plan).filter(models.Plan.is_active == True).all()
    return {
        "success": True,
        "plans": [
            {
                "id": p.id,
                "name": p.name,
                "slug": p.slug,
                "price_monthly": p.price_monthly,
                "features": p.features or [],
                "seat_limit": p.seat_limit,
            }
            for p in plans
        ],
    }

# ─────────────────────────────────────────────────────────────
# CURRENT USER'S SUBSCRIPTION
# ─────────────────────────────────────────────────────────────
@router.get("/my-plan")
def get_my_plan(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Return the current authenticated user's active subscription."""
    sub = current_user.subscription
    if not sub:
        # Return the free plan info
        free = db.query(models.Plan).filter(models.Plan.slug == "free").first()
        return {
            "success": True,
            "plan": free.name if free else "Free",
            "price_monthly": 0,
            "status": "free",
            "started_at": None,
            "next_billing_at": None,
        }
    return {
        "success": True,
        "plan": sub.plan.name,
        "slug": sub.plan.slug,
        "price_monthly": sub.plan.price_monthly,
        "status": sub.status,
        "started_at": str(sub.started_at),
        "next_billing_at": str(sub.next_billing_at) if sub.next_billing_at else None,
        "stripe_subscription_id": sub.stripe_subscription_id,
    }


@router.get("/history")
def billing_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Return billing history for the current user (Stripe webhook events, simplified)."""
    sub = current_user.subscription
    if not sub:
        return {"success": True, "history": []}
    # In a full production setup, billing events come from Stripe webhooks.
    # For now, return the subscription start as a single invoice record.
    return {
        "success": True,
        "history": [
            {
                "date": str(sub.started_at),
                "plan": sub.plan.name,
                "amount": sub.plan.price_monthly,
                "status": "paid",
            }
        ] if sub else [],
    }


# ─────────────────────────────────────────────────────────────
# SUBSCRIBE TO A PLAN
# ─────────────────────────────────────────────────────────────
class SubscribeRequest(BaseModel):
    plan_slug: str
    stripe_payment_method_id: Optional[str] = None


@router.post("/subscribe")
def subscribe(
    body: SubscribeRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Subscribe the current user to a plan. If Stripe is configured, charges the card."""
    plan = db.query(models.Plan).filter(models.Plan.slug == body.plan_slug).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    if not plan.is_active:
        raise HTTPException(status_code=400, detail="This plan is no longer available")

    stripe_sub_id = None
    stripe_cust_id = current_user.stripe_customer_id

    # ── Stripe integration (only if configured) ──
    stripe_secret = _get_stripe_secret(db)
    stripe = _get_stripe()
    if stripe and stripe_secret and plan.price_monthly > 0 and body.stripe_payment_method_id:
        stripe.api_key = stripe_secret
        try:
            # Create or reuse Stripe customer
            if not stripe_cust_id:
                customer = stripe.Customer.create(
                    email=current_user.email,
                    payment_method=body.stripe_payment_method_id,
                    invoice_settings={"default_payment_method": body.stripe_payment_method_id},
                )
                stripe_cust_id = customer.id
                current_user.stripe_customer_id = stripe_cust_id
                db.commit()

            if plan.stripe_price_id:
                stripe_subscription = stripe.Subscription.create(
                    customer=stripe_cust_id,
                    items=[{"price": plan.stripe_price_id}],
                    expand=["latest_invoice.payment_intent"],
                )
                stripe_sub_id = stripe_subscription.id
        except Exception as e:
            raise HTTPException(status_code=402, detail=f"Payment failed: {str(e)}")

    # ── Create or update subscription record ──
    existing_sub = current_user.subscription
    next_billing = datetime.utcnow() + timedelta(days=30)
    if existing_sub:
        existing_sub.plan_id = plan.id
        existing_sub.status = "active"
        existing_sub.next_billing_at = next_billing
        if stripe_sub_id:
            existing_sub.stripe_subscription_id = stripe_sub_id
        if stripe_cust_id:
            existing_sub.stripe_customer_id = stripe_cust_id
    else:
        new_sub = models.Subscription(
            user_id=current_user.id,
            plan_id=plan.id,
            stripe_subscription_id=stripe_sub_id,
            stripe_customer_id=stripe_cust_id,
            status="active",
            next_billing_at=next_billing,
        )
        db.add(new_sub)

    current_user.is_premium = plan.price_monthly > 0
    db.commit()

    return {"success": True, "message": f"Successfully subscribed to {plan.name}", "plan": plan.name}


@router.post("/cancel")
def cancel_subscription(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Cancel the current user's subscription."""
    sub = current_user.subscription
    if not sub or sub.status != "active":
        raise HTTPException(status_code=400, detail="No active subscription to cancel")

    stripe_secret = _get_stripe_secret(db)
    stripe = _get_stripe()
    if stripe and stripe_secret and sub.stripe_subscription_id:
        stripe.api_key = stripe_secret
        try:
            stripe.Subscription.delete(sub.stripe_subscription_id)
        except Exception:
            pass  # Still mark as cancelled locally

    sub.status = "cancelled"
    sub.cancelled_at = datetime.utcnow()
    current_user.is_premium = False
    db.commit()

    return {"success": True, "message": "Subscription cancelled successfully"}


# ─────────────────────────────────────────────────────────────
# VENDOR SEAT PACKAGES
# ─────────────────────────────────────────────────────────────
SEAT_PACKAGES = [
    {"seats": 5,   "price_usd": 25,  "label": "Starter Pack — 5 seats"},
    {"seats": 10,  "price_usd": 45,  "label": "Team Pack — 10 seats"},
    {"seats": 25,  "price_usd": 100, "label": "Business Pack — 25 seats"},
    {"seats": 50,  "price_usd": 180, "label": "Enterprise Pack — 50 seats"},
    {"seats": 100, "price_usd": 300, "label": "Unlimited Pack — 100 seats"},
]

@router.get("/seat-packages")
def get_seat_packages():
    """Returns available vendor seat packages."""
    return {"success": True, "packages": SEAT_PACKAGES}


class BuySeatRequest(BaseModel):
    seats: int
    stripe_payment_method_id: Optional[str] = None

@router.post("/vendor/checkout")
def vendor_create_checkout(
    body: BuySeatRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Generates a Stripe Checkout URL for purchasing seat packs."""
    if current_user.role != "VENDOR":
        raise HTTPException(status_code=403, detail="Only vendors can use this")

    package = next((p for p in SEAT_PACKAGES if p["seats"] == body.seats), None)
    if not package:
        raise HTTPException(status_code=400, detail="Invalid package")

    stripe_secret = _get_stripe_secret(db)
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
            success_url="http://localhost:3000/vendor/billing?success=true",
            cancel_url="http://localhost:3000/vendor/billing?canceled=true",
            customer_email=current_user.email,
            metadata={"vendor_id": current_user.id, "seats": body.seats}
        )
        return {"success": True, "url": session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/vendor/portal")
def vendor_create_portal(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Generates a Stripe Customer Portal URL for seat management."""
    if current_user.role != "VENDOR":
        raise HTTPException(status_code=403, detail="Only vendors can use this")

    if not current_user.stripe_customer_id:
        raise HTTPException(status_code=400, detail="No Stripe customer found for this vendor")

    stripe_secret = _get_stripe_secret(db)
    stripe = _get_stripe()
    if not stripe or not stripe_secret:
        raise HTTPException(status_code=503, detail="Stripe not configured")

    stripe.api_key = stripe_secret
    try:
        session = stripe.billing_portal.Session.create(
            customer=current_user.stripe_customer_id,
            return_url="http://localhost:3000/vendor/billing",
        )
        return {"success": True, "url": session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─────────────────────────────────────────────────────────────
# STRIPE WEBHOOK (for real payment events)
# ─────────────────────────────────────────────────────────────
from fastapi import Request

@router.post("/webhook/stripe")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """Receives Stripe webhook events (payment_intent.succeeded, etc.)."""
    stripe_secret = _get_stripe_secret(db)
    stripe = _get_stripe()
    if not stripe or not stripe_secret:
        raise HTTPException(status_code=503, detail="Stripe not configured")

    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    webhook_secret_cfg = db.query(models.ApiConfig).filter(models.ApiConfig.key == "stripe_webhook_secret").first()
    webhook_secret = webhook_secret_cfg.value if webhook_secret_cfg else None

    try:
        if webhook_secret:
            event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
        else:
            import json
            event = json.loads(payload)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Handle events
    if event["type"] == "invoice.payment_succeeded":
        customer_id = event["data"]["object"].get("customer")
        user = db.query(models.User).filter(models.User.stripe_customer_id == customer_id).first()
        if user and user.subscription:
            user.subscription.status = "active"
            user.subscription.next_billing_at = datetime.utcnow() + timedelta(days=30)
            db.commit()

    elif event["type"] == "invoice.payment_failed":
        customer_id = event["data"]["object"].get("customer")
        user = db.query(models.User).filter(models.User.stripe_customer_id == customer_id).first()
        if user and user.subscription:
            user.subscription.status = "past_due"
            db.commit()

    return {"received": True}
