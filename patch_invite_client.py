import os
run_api = r"C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\run_api.py"
with open(run_api, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('directory="invite_client"', 'directory=r"../Hide-Win-Web/Guest"')

with open(run_api, "w", encoding="utf-8") as f:
    f.write(content)
print("Patched invite_client path in run_api.py")
