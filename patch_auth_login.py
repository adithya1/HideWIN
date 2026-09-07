with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\user\auth.py', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('not db_user.password', 'not db_user.hashed_password')
content = content.replace('db_user.password)', 'db_user.hashed_password)')

# also fix the user creation for OTP where it passes `password=""` instead of `hashed_password=""`
content = content.replace('password="", # No password, they use OTP', 'hashed_password="", # No password, they use OTP')

with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\user\auth.py', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched auth login logic")
