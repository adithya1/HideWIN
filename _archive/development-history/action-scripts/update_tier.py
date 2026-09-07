from database import SessionLocal
from models import AppSetting

db = SessionLocal()
s = db.query(AppSetting).filter(AppSetting.setting_key == 'fast_tier_model').first()
s.setting_value = 'mixtral-8x7b-32768'
db.commit()
print("Updated DB to use mixtral")
