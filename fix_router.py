import re

file_path = "services/api/api/authentication/router.py"
with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace("result = await OTPService.send_otp(body.email, db)", "result = await OTPService.send_otp(body.email, db, user)")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Router updated!")
