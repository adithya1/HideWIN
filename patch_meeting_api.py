import re
path = r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\user\meeting.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'\s*location:\s*Optional\[str\]\s*=\s*None', '', content)
content = re.sub(r'\s*location:\s*Optional\[str\]', '', content)
content = re.sub(r'\s*location=meeting\.location,', '', content)
content = re.sub(r'\s*if meeting\.location:\s*lines\.append\(f"Location: \{meeting\.location\}"\)', '', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
