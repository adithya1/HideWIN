import smtplib
import json
import logging
import asyncio
from datetime import datetime, timezone
from email.message import EmailMessage
from sqlalchemy.orm import Session
from sqlalchemy import select, insert, update
from services.api import db_models as models
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

def replace_variables(template_string: str, variables: Dict[str, Any]) -> str:
    """Safely replace {{variable}} in the template string."""
    if not template_string: return ""
    result = template_string
    for key, value in variables.items():
        placeholder = f"{{{{{key}}}}}"
        result = result.replace(placeholder, str(value) if value is not None else "")
    return result

class EmailNotificationService:
    @staticmethod
    async def get_branding(db: Session):
        branding = await db.execute(select(models.EmailBranding).order_by(models.EmailBranding.id.desc()).limit(1))
        branding_record = branding.scalars().first()
        if not branding_record:
            # Return defaults
            return {
                "company_name": "HideWin",
                "primary_color": "#0A6FB7",
                "background_color": "#F9FAFB",
                "card_background": "#FFFFFF",
                "text_color": "#1F2937",
                "muted_text_color": "#6B7280",
                "border_color": "#E5E7EB",
                "button_text": "#FFFFFF",
                "footer_text": "You're receiving this email because you have an account or activity associated with HideWin.",
                "support_email": "support@hidwin.com",
                "logo_light": "",
                "logo_dark": ""
            }
        return {
            "company_name": branding_record.company_name,
            "primary_color": branding_record.primary_color,
            "background_color": branding_record.background_color,
            "card_background": branding_record.card_background,
            "text_color": branding_record.text_color,
            "muted_text_color": branding_record.muted_text_color,
            "border_color": branding_record.border_color,
            "button_text": branding_record.button_text,
            "footer_text": branding_record.footer_text,
            "support_email": branding_record.support_email,
            "logo_light": branding_record.logo_light,
            "logo_dark": branding_record.logo_dark
        }

    @staticmethod
    def render_layout(body_html: str, branding: dict) -> str:
        """Wraps the email body in the global HTML envelope."""
        year = datetime.now().year
        logo_html = f'<img src="{branding["logo_light"]}" alt="{branding["company_name"]}" style="max-height:36px; margin-bottom: 24px;" />' if branding.get("logo_light") else f'<h2 style="margin: 0 0 24px 0; color: {branding["text_color"]};">{branding["company_name"]}</h2>'
        
        layout = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body {{ font-family: Arial, Helvetica, sans-serif; background-color: {branding['background_color']}; margin: 0; padding: 0; }}
  .email-wrapper {{ width: 100%; background-color: {branding['background_color']}; padding: 40px 20px; }}
  .email-container {{ max-width: 600px; margin: 0 auto; background-color: {branding['card_background']}; border: 1px solid {branding['border_color']}; border-radius: 8px; padding: 32px; overflow: hidden; }}
  .email-content {{ color: {branding['text_color']}; font-size: 15px; line-height: 1.6; }}
  .email-footer {{ max-width: 600px; margin: 24px auto 0; text-align: center; color: {branding['muted_text_color']}; font-size: 13px; }}
  hr {{ border: none; border-top: 1px solid {branding['border_color']}; margin: 24px 0; }}
</style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      {logo_html}
      <div class="email-content">
        {body_html}
      </div>
    </div>
    <div class="email-footer">
      <p>{branding['footer_text']}</p>
      <p>&copy; {year} {branding['company_name']}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>"""
        return layout

    @staticmethod
    async def dispatch(db: Session, template_key: str, recipient: str, variables: Dict[str, Any]):
        """Main entry point to resolve template, apply variables, and send/queue."""
        # Log attempt
        log = models.EmailLog(
            template_key=template_key,
            recipient=recipient,
            status="QUEUED"
        )
        db.add(log)
        await db.flush()

        template_query = await db.execute(select(models.EmailTemplate).filter_by(template_key=template_key, enabled=True))
        template = template_query.scalars().first()

        if not template:
            log.status = "FAILED"
            log.failure_reason = "Template not found or disabled"
            await db.commit()
            return False

        branding = await EmailNotificationService.get_branding(db)

        # Merge standard variables
        merged_vars = {**variables, "companyName": branding["company_name"], "supportEmail": branding["support_email"]}
        
        subject = replace_variables(template.subject, merged_vars)
        body_inner_html = replace_variables(template.body_html, merged_vars)
        final_html = EmailNotificationService.render_layout(body_inner_html, branding)

        log.subject = subject

        # Actually send (synchronous for now, typically push to Celery/Queue)
        success = await EmailService.send_email(db, recipient, subject, final_html)
        
        if success:
            log.status = "DELIVERED"
            log.delivered_at = datetime.now(timezone.utc)
        else:
            log.status = "FAILED"
            log.failure_reason = "SMTP Dispatch Failed"
            log.attempt_count += 1
            
        await db.commit()
        return success

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

        from_name  = data.get("smtp_from_name", "HideWin")
        from_email = data.get("smtp_from_email") or user
        use_ssl    = str(data.get("smtp_ssl", "false")).lower() in ("true", "1", "yes")

        if not all([host, port, user, password]):
            logger.error("SMTP config missing. Please configure email server in Admin.")
            return False

        from_header = f"{from_name} <{from_email}>" if from_name else from_email

        try:
            msg = EmailMessage()
            msg.set_content(content)
            # Content is already an HTML layout from render_layout
            msg.add_alternative(content, subtype='html')
            
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
