import re
path = r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\db_models\meeting.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'\s*location\s*=\s*Column\(String,\s*nullable=True\)', '', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
