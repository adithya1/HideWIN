import sys
sys.path.append('.')
from database import SessionLocal
import models

db = SessionLocal()

# Update the key to the new one
key = db.query(models.AiProviderKey).filter_by(provider="gemini").first()
if key:
    key.api_key_value = "AQ.Ab8RN6KBKJqmt6_YdpAW6FQtUrM5KiKQU6kDw64L_8V-hYv8oA"
    key.is_enabled = True
    db.commit()
    print("[OK] Updated Gemini key in DB")

# Set model to gemini-flash-latest (the one that returns 503=overloaded, meaning key is valid)
# First create app settings if not exist
for key_val, val in [("fast_tier_model", "gemini-flash-latest"), ("high_tier_model", "gemini-flash-latest"), ("fallback_provider", "gemini")]:
    existing = db.query(models.AppSetting).filter_by(setting_key=key_val).first()
    if existing:
        existing.setting_value = val
        print(f"[UPDATED] {key_val} = {val}")
    else:
        db.add(models.AppSetting(setting_key=key_val, setting_value=val))
        print(f"[ADDED] {key_val} = {val}")

db.commit()
db.close()
print("\nDone! Backend configured to use gemini-flash-latest")
