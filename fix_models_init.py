with open("services/api/db_models/__init__.py", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace("from .email_template import EmailTemplate", "from .email_template import EmailTemplate, EmailBranding, EmailLog")
text = text.replace('"EmailTemplate",', '"EmailTemplate", "EmailBranding", "EmailLog",')

with open("services/api/db_models/__init__.py", "w", encoding="utf-8") as f:
    f.write(text)
