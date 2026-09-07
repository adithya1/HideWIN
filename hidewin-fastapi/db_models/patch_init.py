import re
path = r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\db_models\__init__.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

import_statement = "from .meeting import Meeting, MeetingParticipant\n\n# System domain"
content = content.replace("# System domain", import_statement)

export_statement = '    "InviteToken", "Notification", "AuditLog",\n    # Meeting\n    "Meeting", "MeetingParticipant",'
content = content.replace('"InviteToken", "Notification", "AuditLog",', export_statement)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
