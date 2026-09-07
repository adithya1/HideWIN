import sys
sys.path.append('.')
from database import SessionLocal
import models

db = SessionLocal()

# Update key 
key = db.query(models.AiProviderKey).filter_by(provider="gemini").first()
if key:
    key.api_key_value = "AQ.Ab8RN6KBKJqmt6_YdpAW6FQtUrM5KiKQU6kDw64L_8V-hYv8oA"
    key.is_enabled = True
    db.commit()
    print("Key updated:", key.api_key_value[:20], "... enabled:", key.is_enabled)

# verify
all_keys = db.query(models.AiProviderKey).all()
for k in all_keys:
    print(f"  provider={k.provider} | enabled={k.is_enabled} | key={k.api_key_value[:20]}...")
db.close()
