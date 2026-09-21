import asyncio
from sqlalchemy import select
from services.api.core.database import async_session
from services.api.db_models.email_template import EmailTemplate, EmailBranding

async def seed_templates():
    async with async_session() as db:
        # 1. Seed Global Branding
        res = await db.execute(select(EmailBranding).limit(1))
        existing_branding = res.scalars().first()
        
        if not existing_branding:
            print("Seeding default Email Branding...")
            brand = EmailBranding(
                company_name="HideWin",
                website="https://hidwin.com",
                support_email="support@hidwin.com",
                from_name="HideWin",
                from_email="noreply@hidwin.com",
                primary_color="#0A6FB7",
                background_color="#F9FAFB",
                card_background="#FFFFFF",
                text_color="#1F2937",
                muted_text_color="#6B7280",
                border_color="#E5E7EB",
                button_text="#FFFFFF",
                footer_text="You're receiving this email because you have an account or activity associated with HideWin."
            )
            db.add(brand)
        
        templates_to_seed = [
            {
                "template_key": "AUTH_LOGIN_OTP",
                "name": "Login Verification Code",
                "category": "AUTHENTICATION",
                "subject": "Your HideWin login code is {{otpCode}}",
                "preheader": "Use this code to securely sign in to HideWin.",
                "body_html": """<p>Hi {{firstName}},</p>
<p>You can log in to your HideWin account by entering the verification code below.</p>
<div style="background-color: #F3F4F6; padding: 32px; text-align: center; border-radius: 8px; margin: 24px 0; border: 1px solid #E5E7EB;">
    <span style="font-family: monospace; font-size: 36px; letter-spacing: 12px; font-weight: bold; color: #1F2937;">{{otpCode}}</span>
</div>
<p style="font-size: 14px; color: #6B7280;">This code expires in {{otpExpiryMinutes}} minutes.</p>
<p style="font-size: 14px; color: #6B7280;">If you did not request this code, you can safely ignore this email.</p>"""
            },
            {
                "template_key": "AUTH_WELCOME",
                "name": "Welcome to HideWin",
                "category": "AUTHENTICATION",
                "subject": "Welcome to HideWin",
                "preheader": "Your HideWin account is ready.",
                "body_html": """<p>Hi {{firstName}},</p>
<p>Welcome to HideWin.</p>
<p>Your account is ready, and you can now use HideWin to prepare for, participate in, and get more from your meetings.</p>
<div style="margin: 32px 0;">
    <a href="{{dashboardUrl}}" style="background-color: #0A6FB7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Open HideWin</a>
</div>"""
            },
            {
                "template_key": "MEETING_INVITATION",
                "name": "Meeting Invitation",
                "category": "MEETINGS",
                "subject": "You're invited to {{meetingTitle}}",
                "preheader": "{{organizerName}} invited you to a HideWin meeting.",
                "body_html": """<p>Hi {{firstName}},</p>
<p>{{organizerName}} invited you to a meeting.</p>
<h3 style="margin-top: 24px; margin-bottom: 8px; color: #1F2937;">{{meetingTitle}}</h3>
<p style="margin: 0; color: #374151;"><strong>Date:</strong> {{meetingDate}}</p>
<p style="margin: 0; color: #374151;"><strong>Time:</strong> {{meetingTime}} {{meetingTimezone}}</p>
<p style="margin: 0; color: #374151;"><strong>Organizer:</strong> {{organizerName}}</p>
<div style="background-color: #F9FAFB; padding: 16px; border-radius: 6px; border: 1px solid #E5E7EB; margin: 24px 0;">
    <p style="margin: 0 0 8px 0; color: #374151;"><strong>Meeting ID:</strong> {{meetingId}}</p>
    <p style="margin: 0; color: #374151;"><strong>Passcode:</strong> {{meetingPasscode}}</p>
</div>
<div style="margin: 32px 0;">
    <a href="{{meetingJoinUrl}}" style="background-color: #0A6FB7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Join the meeting</a>
</div>
<p><a href="{{calendarUrl}}" style="color: #0A6FB7; text-decoration: none;">Add to calendar</a></p>
<p style="margin-top: 24px;">We look forward to seeing you there.</p>"""
            },
            {
                "template_key": "MEETING_SUMMARY_READY",
                "name": "Meeting Summary Ready",
                "category": "MEETING_OUTPUT",
                "subject": "Your meeting summary is ready",
                "preheader": "Review the AI-generated summary from {{meetingTitle}}.",
                "body_html": """<p>Hi {{firstName}},</p>
<p>Your HideWin meeting summary is ready.</p>
<h3 style="margin-top: 24px; margin-bottom: 24px; color: #1F2937;">{{meetingTitle}}</h3>
<div style="margin: 32px 0;">
    <a href="{{summaryUrl}}" style="background-color: #0A6FB7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Review summary</a>
</div>
<p style="font-size: 13px; color: #6B7280; margin-top: 32px;"><em>AI-generated content may contain inaccuracies. Please review important information.</em></p>"""
            }
        ]
        
        for tmpl_data in templates_to_seed:
            res = await db.execute(select(EmailTemplate).filter_by(template_key=tmpl_data["template_key"]))
            existing = res.scalars().first()
            if not existing:
                print(f"Seeding template {tmpl_data['template_key']}...")
                tmpl = EmailTemplate(
                    template_key=tmpl_data["template_key"],
                    name=tmpl_data["name"],
                    category=tmpl_data["category"],
                    subject=tmpl_data["subject"],
                    preheader=tmpl_data["preheader"],
                    body_html=tmpl_data["body_html"]
                )
                db.add(tmpl)
            else:
                print(f"Template {tmpl_data['template_key']} already exists.")
                
        await db.commit()
        print("Done seeding.")

if __name__ == "__main__":
    asyncio.run(seed_templates())
