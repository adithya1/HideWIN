import re
with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\user\meeting.py', 'r', encoding='utf-8') as f:
    text = f.read()

text = re.sub(r'content = ".*?"\.join\(lines\)', 'content = chr(10).join(lines)', text, flags=re.DOTALL)

with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\user\meeting.py', 'w', encoding='utf-8') as f:
    f.write(text)
