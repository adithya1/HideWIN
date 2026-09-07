with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\user\meeting.py', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'participants: List[str] = []\n    invite_url_base: Optional[str] = None',
    'participants: List[str] = []\n    cc_participants: List[str] = []\n    bcc_participants: List[str] = []\n    invite_url_base: Optional[str] = None'
)

with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\user\meeting.py', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched MeetingCreate")
