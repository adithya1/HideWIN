from services.api.core.admin_config import get_admin_settings
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
        """Wraps the email body in the global HTML envelope (Meta/Ultra-Clean Minimalist Style)."""
        from datetime import datetime
        year = datetime.now().year
        
        theme = branding.get("theme", "light")
        bg_color = "#ffffff" if theme != "dark" else "#000000"
        text_color = "#1c1e21" if theme != "dark" else "#e4e6eb"
        muted_text = "#8a8d91" if theme != "dark" else "#b0b3b8"
        
        # Force CID logo attachment
        logo_html = f'<img src="cid:logo_img" alt="{branding.get("company_name", "HideWin")}" style="height: 32px; display: block;" />'
            
        layout = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body, table, td, a {{ -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }}
  table, td {{ mso-table-lspace: 0pt; mso-table-rspace: 0pt; }}
  img {{ -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }}
  body {{ height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }}
</style>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: {bg_color}; margin: 0; padding: 0;">
  
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: {bg_color};">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="left" style="padding-bottom: 24px; border-bottom: 1px solid #e5e7eb;">
              {logo_html}
            </td>
          </tr>
          <tr>
            <td align="left" style="padding: 32px 0; color: {text_color}; font-size: 15px; line-height: 1.6;">
              {body_html}
            </td>
          </tr>
          <tr>
            <td align="left" style="padding-top: 24px; border-top: 1px solid #e5e7eb; color: {muted_text}; font-size: 12px; line-height: 1.5;">
              <p style="margin: 0 0 8px 0;">This message was sent to you by {branding.get('company_name', 'HideWin')}.</p>
              <p style="margin: 0;">&copy; {year} {branding.get('company_name', 'HideWin')} Inc. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
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
        settings = get_admin_settings()
        data = {
            "smtp_host": settings.smtp_host,
            "smtp_port": settings.smtp_port,
            "smtp_user": settings.smtp_user,
            "smtp_pass": settings.smtp_pass,
            "smtp_from_name": getattr(settings, "smtp_from_name", "HideWin"),
            "smtp_from_email": getattr(settings, "smtp_from_email", settings.smtp_user),
            "smtp_ssl": getattr(settings, "smtp_ssl", "false")
        }

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
            import os
            from email.message import EmailMessage
            from email.utils import make_msgid
            
            msg = EmailMessage()
            msg["Subject"] = subject
            msg["From"]    = from_header
            msg["To"]      = to_email
            
            msg.set_content("Please enable HTML to view this email.")
            msg.add_alternative(content, subtype='html')
            
            # Attach local logo as CID
            logo_path = os.path.join("services", "web", "public", "logo.png")
            if os.path.exists(logo_path):
                with open(logo_path, 'rb') as f:
                    img_data = f.read()
                msg.get_payload()[1].add_related(img_data, maintype='image', subtype='png', cid='<logo_img>')


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
