import sys
sys.path.append('.')
from database import SessionLocal
import models

db = SessionLocal()

# Set both tiers to use gemini-flash-latest, as this is the only model supported by the AQ. key
for key_val in ["fast_tier_model", "high_tier_model"]:
    setting = db.query(models.AppSetting).filter_by(setting_key=key_val).first()
    if setting:
        setting.setting_value = "gemini-flash-latest"
    else:
        db.add(models.AppSetting(setting_key=key_val, setting_value="gemini-flash-latest"))

db.commit()
print("Updated model settings to gemini-flash-latest (the only supported model for this key)")
db.close()
