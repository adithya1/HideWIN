import smtplib
from email.message import EmailMessage
from sqlalchemy.orm import Session
from sqlalchemy import select
from services.api import db_models as models
import logging

logger = logging.getLogger(__name__)

class EmailService:
    @staticmethod
    async def send_email(db: Session, to_email: str, subject: str, content: str, cc: list = None, bcc: list = None, attachments: list = None):
        keys = ["smtp_host", "smtp_port", "smtp_user", "smtp_pass",
                "smtp_from_name", "smtp_from_email", "smtp_ssl"]
        result = await db.execute(select(models.ApiConfig).filter(models.ApiConfig.key.in_(keys)))
        configs = result.scalars().all()
        data = {c.key: c.value for c in configs}

        host     = data.get("smtp_host")
        port     = int(data.get("smtp_port", 587)) if data.get("smtp_port") else 587
        user     = data.get("smtp_user")
        password = data.get("smtp_pass")

        from_name  = data.get("smtp_from_name", "")
        from_email = data.get("smtp_from_email") or user
        use_ssl    = str(data.get("smtp_ssl", "false")).lower() in ("true", "1", "yes")

        if not all([host, port, user, password]):
            logger.error("SMTP config missing. Please configure email server in Admin.")
            return False

        from_header = f"{from_name} <{from_email}>" if from_name else from_email

        try:
            msg = EmailMessage()
            msg.set_content(content)
            content_html = content.replace('\n', '<br>') if '<' not in content else content
            msg.add_alternative(content_html, subtype='html')
            
            msg["Subject"] = subject
            msg["From"]    = from_header
            msg["To"]      = to_email

            if cc: msg["Cc"] = ", ".join(cc)
            if bcc: msg["Bcc"] = ", ".join(bcc)

            recipients = [to_email]
            if cc: recipients.extend(cc)
            if bcc: recipients.extend(bcc)

            if use_ssl:
                with smtplib.SMTP_SSL(host, port) as server:
                    server.login(user, password)
                    server.send_message(msg, from_addr=from_email, to_addrs=recipients)
            else:
                with smtplib.SMTP(host, port) as server:
                    server.ehlo()
                    server.starttls()
                    server.ehlo()
                    server.login(user, password)
                    server.send_message(msg, from_addr=from_email, to_addrs=recipients)
            return True
        except Exception as e:
            logger.error(f"Failed to send email: {e}")
            return False
