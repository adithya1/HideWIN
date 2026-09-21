import re

file_path = "services/api/api/authentication/service.py"
with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

# Make sure we import EmailNotificationService
if "from services.api.services.email_service import EmailNotificationService" not in text:
    text = text.replace("from services.api.services.email_service import EmailService",
                        "from services.api.services.email_service import EmailService, EmailNotificationService")

# Rewrite send_otp
# Old: await EmailService.send_email(db, email, "Your HideWIN Login Code", body_html)
# New: await EmailNotificationService.dispatch(db, "AUTH_LOGIN_OTP", email, {"firstName": "User", "otpCode": otp, "otpExpiryMinutes": admin_settings.otp_expiry_minutes})

old_try_block = """        body_html = f"Your login code is: {otp}\\n\\nPlease enter this code to sign in."
        print(f"\\n{'='*40}\\n[DEBUG] OTP FOR {email} IS: {otp}\\n{'='*40}\\n")
        try:
            await EmailService.send_email(db, email, "Your HideWIN Login Code", body_html)
        except Exception as e:
            print(f"Failed to send email to {email}: {e}")"""

new_try_block = """        print(f"\\n{'='*40}\\n[DEBUG] OTP FOR {email} IS: {otp}\\n{'='*40}\\n")
        
        # Decide if it's signup or login. We'll use AUTH_LOGIN_OTP as default unless we know it's a signup.
        # But per instructions, AUTH_LOGIN_OTP is fine for now.
        # Could also lookup if user exists.
        
        variables = {
            "firstName": email.split("@")[0], # Fallback name
            "otpCode": otp,
            "otpExpiryMinutes": admin_settings.otp_expiry_minutes
        }
        
        try:
            await EmailNotificationService.dispatch(db, "AUTH_LOGIN_OTP", email, variables)
        except Exception as e:
            print(f"Failed to dispatch AUTH_LOGIN_OTP to {email}: {e}")"""

text = text.replace(old_try_block, new_try_block)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(text)

print("OTP Service updated successfully!")
