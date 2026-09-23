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
    subscription_number = Column(String, unique=True, index=True, nullable=True)
    country = Column(String, nullable=True)
    currency = Column(String, nullable=True)
    credits = Column(Integer, default=0)
    base_price = Column(Float, default=9.99)
    discount_percentage = Column(Float, default=0.0)
    billing_interval = Column(String, nullable=True)
    price = Column(Float, default=0.0)
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
    order_number = Column(String, unique=True, index=True, nullable=True)
    amount = Column(Float, default=0.0)
    currency = Column(String, nullable=True)
    country = Column(String, nullable=True)
    package_id = Column(Integer, ForeignKey("packages.id"), nullable=True)
    credits = Column(Integer, default=0)
    base_price = Column(Float, default=9.99)
    discount_percentage = Column(Float, default=0.0)
    status = Column(String, default="pending")
    payment_status = Column(String, default="pending")
    payment_method = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    package = relationship("Package")
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



class Package(Base):
    __tablename__ = 'packages'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)  # e.g., '1 Hour', '5 Hours'
    credits = Column(Integer, default=0)
    base_price = Column(Float, default=9.99)
    discount_percentage = Column(Float, default=0.0)
    is_subscription = Column(Boolean, default=False)
    active = Column(Boolean, default=True)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class CountryPricing(Base):
    __tablename__ = 'country_pricing'
    id = Column(Integer, primary_key=True, index=True)
    package_id = Column(Integer, ForeignKey('packages.id'))
    country_code = Column(String, index=True)  # e.g., 'US', 'IN'
    currency = Column(String)  # e.g., 'USD', 'INR'
    price = Column(Float, default=0.0)
    stripe_price_id = Column(String, nullable=True)
    active = Column(Boolean, default=True)
    
    package = relationship('Package')

class Transaction(Base):
    __tablename__ = 'transactions'
    id = Column(String, primary_key=True, index=True)  # e.g. '6aa2d9d6...'
    user_id = Column(Integer, ForeignKey('users.id'), index=True)
    order_id = Column(Integer, ForeignKey('orders.id'), nullable=True, index=True)
    subscription_id = Column(Integer, ForeignKey('subscriptions.id'), nullable=True, index=True)
    type = Column(String, index=True) # 'Credit Purchase', 'Credit Usage', 'Refund', etc.
    credits = Column(Integer, default=0)
    base_price = Column(Float, default=9.99)
    discount_percentage = Column(Float, default=0.0)
    amount = Column(Float, default=0.0)
    currency = Column(String)
    country = Column(String)
    status = Column(String, index=True)
    provider = Column(String) # e.g. Stripe
    provider_transaction_id = Column(String, index=True, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    user = relationship('User', foreign_keys=[user_id])
    order = relationship('Order', foreign_keys=[order_id])
    subscription = relationship('Subscription', foreign_keys=[subscription_id])

class CreditHistory(Base):
    __tablename__ = 'credit_history'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), index=True)
    transaction_id = Column(String, ForeignKey('transactions.id'), nullable=True, index=True)
    credit_change = Column(Integer)
    balance_before = Column(Integer)
    balance_after = Column(Integer)
    source = Column(String) # 'Credit Purchase', 'Meeting Usage', 'Admin Adjustment'
    notes = Column(String, nullable=True)
    admin_id = Column(Integer, ForeignKey('users.id'), nullable=True) # if manually adjusted
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    
    user = relationship('User', foreign_keys=[user_id])
    admin = relationship('User', foreign_keys=[admin_id])
    transaction = relationship('Transaction', foreign_keys=[transaction_id])
class PaymentMethod(Base):
    __tablename__ = 'payment_methods'
    id = Column(Integer, primary_key=True, index=True)
    provider = Column(String, index=True) 
    method_name = Column(String) 
    is_active = Column(Boolean, default=False)
    allowed_countries = Column(String, default='["*"]')
    region = Column(String, default='global')
