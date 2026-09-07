import re
path = r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\user\meeting.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the broken string block
broken = """content = f"Hello,

You have been invited to a meeting scheduled by {current_user.email}.

\"""
fixed = '            content = f"Hello,\\n\\nYou have been invited to a meeting scheduled by {current_user.email}.\\n\\n"\n'

content = content.replace(broken, fixed)
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
