import re

file_path = "services/api/api/authentication/service.py"
with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

# Replace send_otp signature and logic to support template switching

old_sig = "async def send_otp(email: str, db) -> dict:"
new_sig = "async def send_otp(email: str, db, user=None) -> dict:"

text = text.replace(old_sig, new_sig)

old_logic = """        variables = {
            "firstName": email.split("@")[0], # Fallback name
            "otpCode": otp,
            "otpExpiryMinutes": admin_settings.otp_expiry_minutes
        }
        
        try:
            await EmailNotificationService.dispatch(db, "AUTH_LOGIN_OTP", email, variables)
        except Exception as e:
            print(f"Failed to dispatch AUTH_LOGIN_OTP to {email}: {e}")"""

new_logic = """        template_key = "AUTH_LOGIN_OTP" if user else "AUTH_SIGNUP_OTP"
        first_name = user.first_name if user and getattr(user, 'first_name', None) else email.split("@")[0]

        variables = {
            "firstName": first_name,
            "otpCode": otp,
            "otpExpiryMinutes": admin_settings.otp_expiry_minutes
        }
        
        try:
            await EmailNotificationService.dispatch(db, template_key, email, variables)
        except Exception as e:
            print(f"Failed to dispatch {template_key} to {email}: {e}")"""

text = text.replace(old_logic, new_logic)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(text)

print("OTP Service updated with signup vs login switching!")
