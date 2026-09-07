import re
path = r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\user\meeting.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# I will just use regex to replace everything from `content = f"Hello,` up to the next `content +=`
content = re.sub(r'content = f"Hello,[\s\S]*?Title: \{meeting\.title\}\\n"', r'content = f"Hello,\\n\\nYou have been invited to a meeting scheduled by {current_user.email}.\\n\\nTitle: {meeting.title}\\n"', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
