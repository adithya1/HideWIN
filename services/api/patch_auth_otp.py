with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\user\auth.py', 'r', encoding='utf-8') as f:
    content = f.read()

import_statement = "from db_models import EmailTemplate\n"
if "EmailTemplate" not in content:
    content = content.replace("from db_models.base import Base", "from db_models.base import Base\n" + import_statement)
    content = content.replace("from src.lib.database import get_db\nimport db_models as models", "from src.lib.database import get_db\nimport db_models as models\nfrom db_models import EmailTemplate")

old_otp_logic = """    success = send_email(db, body.email, "Your HideWIN Login Code", f"Your login code is: {otp}\\n\\nPlease enter this code to sign in.")"""

new_otp_logic = """    template = db.query(EmailTemplate).filter(EmailTemplate.action_trigger == "user_otp").first()
    subject = template.subject if template else "Your HideWIN Login Code"
    
    if template:
        body_html = template.body_html.replace("{{otp_code}}", otp).replace("{{user_name}}", body.email.split("@")[0])
    else:
        body_html = f"Your login code is: {otp}\\n\\nPlease enter this code to sign in."
        
    success = send_email(db, body.email, subject, body_html)"""

content = content.replace(old_otp_logic, new_otp_logic)

with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\user\auth.py', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched auth.py OTP logic")
