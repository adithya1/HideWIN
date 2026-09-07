import os

p = r"C:\Users\akula\Downloads\Hide-WIN - Copy\hidewin-fastapi\routers\user.py"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# Fix the AppSettings import error
text = text.replace("from db_models import AppSettings", "from db_models import AppSetting")
text = text.replace("settings = db.query(AppSettings).first()", "settings = db.query(AppSetting).first()")

with open(p, "w", encoding="utf-8") as f:
    f.write(text)
print("Fixed AppSetting import error in user.py!")
