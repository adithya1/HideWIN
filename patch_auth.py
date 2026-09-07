with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\user\auth.py', 'r', encoding='utf-8') as f:
    content = f.read()

new_get_user = """
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    exc = HTTPException(status_code=401, detail="Could not validate credentials", headers={"WWW-Authenticate": "Bearer"})
    
    if token == "dev-bypass-token":
        # Create a dummy user for testing
        user = db.query(models.User).filter(models.User.email == "dev@hidewin.local").first()
        if not user:
            user = models.User(id=1, email="dev@hidewin.local", full_name="Dev User", role="admin")
            db.add(user)
            db.commit()
            db.refresh(user)
        return user

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
"""

import re
content = re.sub(r'def get_current_user\(.*?try:\n        payload = jwt\.decode\(token, SECRET_KEY, algorithms=\[ALGORITHM\]\)', new_get_user, content, flags=re.DOTALL)

with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\user\auth.py', 'w', encoding='utf-8') as f:
    f.write(content)
print("Added dev-bypass-token support")
