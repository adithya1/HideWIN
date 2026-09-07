import re
path = r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\user\meeting.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add Form, File, UploadFile to imports
if "UploadFile" not in content:
    content = re.sub(r'from fastapi import APIRouter, Depends, HTTPException', 'from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form', content)

# Change MeetingCreate schema
new_schema = """
class MeetingCreate(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    timezone: str = "UTC"
    recurrence: str = "none"
    participants: List[str] = []
    cc_participants: List[str] = []
    bcc_participants: List[str] = []
    invite_url_base: Optional[str] = None
"""
content = re.sub(r'class MeetingCreate\(BaseModel\):.*?invite_url_base: Optional\[str\] = None', new_schema.strip(), content, flags=re.DOTALL)

# Modify create_meeting signature and logic
new_signature = """
def create_meeting(
    meeting_data: str = Form(...),
    files: List[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    import json
    meeting = MeetingCreate(**json.loads(meeting_data))
"""
content = re.sub(r'def create_meeting\(\s*meeting: MeetingCreate,\s*db: Session = Depends\(get_db\),\s*current_user: models\.User = Depends\(get_current_user\)\s*\):', new_signature.strip(), content)
content = re.sub(r'import db_models as models', 'import db_models as models\nimport os', content)
