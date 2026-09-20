from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Boolean, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .base import Base


class Plan(Base):
    """Billing plans / pricing tiers."""
    __tablename__ = "plans"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    slug = Column(String, unique=True, index=True)
    price_monthly = Column(Float, default=0.0)
    stripe_price_id = Column(String, nullable=True)
    features = Column(JSON, default=list)
    seat_limit = Column(Integer, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    subscriptions = relationship("Subscription", back_populates="plan")


class Subscription(Base):
    """User or Vendor subscriptions to a billing plan."""
    __tablename__ = "subscriptions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    plan_id = Column(Integer, ForeignKey("plans.id"))
    stripe_subscription_id = Column(String, nullable=True)
    stripe_customer_id = Column(String, nullable=True)
    status = Column(String, default="active")
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    next_billing_at = Column(DateTime(timezone=True), nullable=True)
    cancelled_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="subscription")
    plan = relationship("Plan", back_populates="subscriptions")


class TokenBilling(Base):
    __tablename__ = "token_billing"
    id = Column(Integer, primary_key=True, index=True)
    vendor_id = Column(Integer, ForeignKey("users.id"))
    total_tokens = Column(Integer, default=0)
    estimated_cost_usd = Column(Integer, default=0)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class Order(Base):
    """Orders for individual services (different from subscriptions)."""
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float, default=0.0)
    status = Column(String, default="pending")
    payment_method = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User")

class Payment(Base):
    """Payments tracking for orders."""
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    stripe_charge_id = Column(String, nullable=True)
    amount = Column(Float, default=0.0)
    status = Column(String, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    order = relationship("Order")

