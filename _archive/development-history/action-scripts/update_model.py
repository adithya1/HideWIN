import sys
sys.path.append('.')
from database import SessionLocal
import models

db = SessionLocal()

# Update settings to use the older but more stable gemini-1.5-flash model
for key_val in ["fast_tier_model", "high_tier_model"]:
    setting = db.query(models.AppSetting).filter_by(setting_key=key_val).first()
    if setting:
        setting.setting_value = "gemini-1.5-flash"
    else:
        db.add(models.AppSetting(setting_key=key_val, setting_value="gemini-1.5-flash"))

db.commit()
print("Updated model settings to gemini-1.5-flash")
db.close()
