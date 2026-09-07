from database import SessionLocal
from models import AiProviderKey

db = SessionLocal()
key = db.query(AiProviderKey).filter(AiProviderKey.provider == 'groq').first()
if key:
    key.api_key_value = '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'
    key.is_enabled = True
else:
    key = AiProviderKey(
        provider='groq',
        api_key_value='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',
        is_enabled=True,
        tier='fast'
    )
    db.add(key)

db.commit()
print("Added Groq key to backend DB")
