import sys
import os
sys.path.append(r"C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi")

from src.lib.database import SessionLocal
from db_models import EmailTemplate

db = SessionLocal()

defaults = [
    {
        "action_trigger": "login",
        "title": "New Login Alert",
        "subject": "New login to your Hide-WIN account",
        "body_html": "<p>Hi {{user_name}},</p><p>We noticed a new login to your account from {{ip_address}}.</p>"
    },
    {
        "action_trigger": "register",
        "title": "Welcome Email",
        "subject": "Welcome to Hide-WIN!",
        "body_html": "<p>Welcome {{user_name}}!</p><p>Thanks for registering.</p>"
    },
    {
        "action_trigger": "user_otp",
        "title": "OTP Verification",
        "subject": "Your Hide-WIN Verification Code",
        "body_html": "<div style='text-align: center;'><p>Hi {{user_name}},</p><p>You can log into your account by entering the following code.</p><h2>Login code</h2><div style='background: #f1f5f9; padding: 16px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 4px;'>{{otp_code}}</div></div>"
    },
    {
        "action_trigger": "user_reset_password",
        "title": "Reset Password",
        "subject": "Reset your Hide-WIN password",
        "body_html": "<p>Click the link below to reset your password.</p>"
    },
    {
        "action_trigger": "subscription_reminder",
        "title": "Subscription Reminder",
        "subject": "Your subscription is renewing soon",
        "body_html": "<p>Your subscription renews on {{date}}.</p>"
    },
    {
        "action_trigger": "subscription_success",
        "title": "Subscription Success",
        "subject": "Payment Successful",
        "body_html": "<p>Thank you for your payment!</p>"
    },
    {
        "action_trigger": "subscription_expired",
        "title": "Subscription Expired",
        "subject": "Action Required: Subscription Expired",
        "body_html": "<p>Your subscription has expired. Please renew.</p>"
    }
]

for d in defaults:
    existing = db.query(EmailTemplate).filter(EmailTemplate.action_trigger == d["action_trigger"]).first()
    if not existing:
        t = EmailTemplate(**d)
        db.add(t)

db.commit()
print("Default email templates seeded!")
