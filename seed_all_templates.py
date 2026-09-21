# -*- coding: utf-8 -*-
import asyncio
from sqlalchemy import select
from services.api.core.database import async_session
from services.api.db_models.email_template import EmailTemplate

templates_to_seed = [
    # --- CATEGORY 1 -- AUTHENTICATION ---
    {
        "template_key": "AUTH_SIGNUP_OTP",
        "name": "Verify your HideWin account",
        "category": "AUTHENTICATION",
        "subject": "Verify your HideWin account",
        "preheader": "Use this code to complete your HideWin registration.",
        "body_html": """<p>Hi {{firstName}},</p>
<p>Use the verification code below to create and verify your HideWin account.</p>
<div style="background-color: #F3F4F6; padding: 32px; text-align: center; border-radius: 8px; margin: 24px 0; border: 1px solid #E5E7EB;">
    <span style="font-family: monospace; font-size: 36px; letter-spacing: 12px; font-weight: bold; color: #1F2937;">{{otpCode}}</span>
</div>
<p style="font-size: 14px; color: #6B7280;">This code expires in {{otpExpiryMinutes}} minutes.</p>
<p style="font-size: 14px; color: #6B7280;">If you did not request this code, you can safely ignore this email.</p>"""
    },
    {
        "template_key": "AUTH_CHANGE_EMAIL_OTP",
        "name": "Confirm your new HideWin email address",
        "category": "AUTHENTICATION",
        "subject": "Confirm your new HideWin email address",
        "preheader": "Verification code to confirm your email change.",
        "body_html": """<p>Hi {{firstName}},</p>
<p>We received a request to change the email address associated with your HideWin account.</p>
<p>Use the verification code below to confirm this change.</p>
<div style="background-color: #F3F4F6; padding: 32px; text-align: center; border-radius: 8px; margin: 24px 0; border: 1px solid #E5E7EB;">
    <span style="font-family: monospace; font-size: 36px; letter-spacing: 12px; font-weight: bold; color: #1F2937;">{{otpCode}}</span>
</div>
<p style="font-size: 14px; color: #6B7280;">This code expires in {{otpExpiryMinutes}} minutes.</p>
<p style="font-size: 14px; color: #6B7280;">If you did not request this change, please secure your account or contact {{supportEmail}}.</p>"""
    },

    # --- CATEGORY 2 -- MEETINGS ---
    {
        "template_key": "MEETING_UPDATED",
        "name": "Meeting Updated",
        "category": "MEETINGS",
        "subject": "Meeting updated: {{meetingTitle}}",
        "preheader": "The details for your HideWin meeting have changed.",
        "body_html": """<p>Hi {{firstName}},</p>
<p>The details for the following meeting have been updated.</p>
<h3 style="margin-top: 24px; margin-bottom: 8px; color: #1F2937;">{{meetingTitle}}</h3>
<p style="margin: 0; color: #374151;"><strong>Date:</strong> {{meetingDate}}</p>
<p style="margin: 0; color: #374151;"><strong>Time:</strong> {{meetingTime}} {{meetingTimezone}}</p>
<div style="background-color: #F9FAFB; padding: 16px; border-radius: 6px; border: 1px solid #E5E7EB; margin: 24px 0;">
    <p style="margin: 0 0 8px 0; color: #374151;"><strong>Meeting ID:</strong> {{meetingId}}</p>
    <p style="margin: 0; color: #374151;"><strong>Passcode:</strong> {{meetingPasscode}}</p>
</div>
<div style="margin: 32px 0;">
    <a href="{{meetingJoinUrl}}" style="background-color: #0A6FB7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View meeting</a>
</div>"""
    },
    {
        "template_key": "MEETING_CANCELLED",
        "name": "Meeting Cancelled",
        "category": "MEETINGS",
        "subject": "Meeting cancelled: {{meetingTitle}}",
        "preheader": "A meeting you were invited to has been cancelled.",
        "body_html": """<p>Hi {{firstName}},</p>
<p>The following meeting has been cancelled.</p>
<h3 style="margin-top: 24px; margin-bottom: 8px; color: #1F2937;">{{meetingTitle}}</h3>
<p style="margin: 0; color: #374151;"><strong>Original date:</strong> {{meetingDate}}</p>
<p style="margin: 0; color: #374151;"><strong>Original time:</strong> {{meetingTime}} {{meetingTimezone}}</p>
<p style="margin-top: 24px;">No action is required.</p>
<p>If you believe this was unexpected, contact the meeting organizer.</p>"""
    },
    {
        "template_key": "MEETING_RESCHEDULED",
        "name": "Meeting Rescheduled",
        "category": "MEETINGS",
        "subject": "Meeting rescheduled: {{meetingTitle}}",
        "preheader": "Your meeting has been moved to a new time.",
        "body_html": """<p>Hi {{firstName}},</p>
<p>The following meeting has been rescheduled.</p>
<h3 style="margin-top: 24px; margin-bottom: 8px; color: #1F2937;">{{meetingTitle}}</h3>
<p style="margin: 0; color: #374151;"><strong>New date:</strong> {{meetingDate}}</p>
<p style="margin: 0; color: #374151;"><strong>New time:</strong> {{meetingTime}} {{meetingTimezone}}</p>
<p style="margin: 16px 0 0 0; color: #374151;"><strong>Meeting ID:</strong> {{meetingId}}</p>
<div style="margin: 32px 0;">
    <a href="{{meetingJoinUrl}}" style="background-color: #0A6FB7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Join meeting</a>
</div>"""
    },
    {
        "template_key": "MEETING_REMINDER",
        "name": "Meeting Reminder",
        "category": "MEETINGS",
        "subject": "Reminder: {{meetingTitle}} is coming up",
        "preheader": "Your HideWin meeting starts {{meetingRelativeTime}}.",
        "body_html": """<p>Hi {{firstName}},</p>
<p>This is a reminder that your meeting is coming up.</p>
<h3 style="margin-top: 24px; margin-bottom: 8px; color: #1F2937;">{{meetingTitle}}</h3>
<p style="margin: 0; color: #374151;"><strong>Date:</strong> {{meetingDate}}</p>
<p style="margin: 0; color: #374151;"><strong>Time:</strong> {{meetingTime}} {{meetingTimezone}}</p>
<p style="margin: 16px 0 0 0; color: #374151;"><strong>Meeting ID:</strong> {{meetingId}}</p>
<div style="margin: 32px 0;">
    <a href="{{meetingJoinUrl}}" style="background-color: #0A6FB7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Join meeting</a>
</div>"""
    },
    {
        "template_key": "MEETING_STARTING_SOON",
        "name": "Meeting Starting Soon",
        "category": "MEETINGS",
        "subject": "Your meeting starts in {{meetingMinutesUntilStart}} minutes",
        "preheader": "Join your HideWin meeting now.",
        "body_html": """<p>Hi {{firstName}},</p>
<p>Your meeting is starting soon.</p>
<h3 style="margin-top: 24px; margin-bottom: 8px; color: #1F2937;">{{meetingTitle}}</h3>
<p style="margin: 0; color: #374151;"><strong>Starting:</strong> {{meetingTime}} {{meetingTimezone}}</p>
<div style="margin: 32px 0;">
    <a href="{{meetingJoinUrl}}" style="background-color: #0A6FB7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Join meeting</a>
</div>"""
    },

    # --- CATEGORY 3 -- MEETING OUTPUT ---
    {
        "template_key": "MEETING_RECORDING_READY",
        "name": "Meeting Recording Ready",
        "category": "MEETING_OUTPUT",
        "subject": "Your recording is ready: {{meetingTitle}}",
        "preheader": "The video recording from your meeting is available.",
        "body_html": """<p>Hi {{firstName}},</p>
<p>The recording from your meeting is ready.</p>
<h3 style="margin-top: 24px; margin-bottom: 24px; color: #1F2937;">{{meetingTitle}}</h3>
<div style="margin: 32px 0;">
    <a href="{{recordingUrl}}" style="background-color: #0A6FB7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View recording</a>
</div>"""
    },
    {
        "template_key": "MEETING_TRANSCRIPT_READY",
        "name": "Meeting Transcript Ready",
        "category": "MEETING_OUTPUT",
        "subject": "Your transcript is ready: {{meetingTitle}}",
        "preheader": "The full text transcript from your meeting is available.",
        "body_html": """<p>Hi {{firstName}},</p>
<p>The transcript from your meeting is ready to review.</p>
<h3 style="margin-top: 24px; margin-bottom: 24px; color: #1F2937;">{{meetingTitle}}</h3>
<div style="margin: 32px 0;">
    <a href="{{transcriptUrl}}" style="background-color: #0A6FB7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View transcript</a>
</div>"""
    },

    # --- CATEGORY 4 -- WORKSPACE / TEAM ---
    {
        "template_key": "WORKSPACE_INVITATION",
        "name": "Workspace Invitation",
        "category": "WORKSPACE",
        "subject": "{{inviterName}} invited you to {{workspaceName}}",
        "preheader": "You have been invited to collaborate on HideWin.",
        "body_html": """<p>Hi {{firstName}},</p>
<p>{{inviterName}} invited you to join the <strong>{{workspaceName}}</strong> workspace on HideWin.</p>
<div style="margin: 32px 0;">
    <a href="{{workspaceInviteUrl}}" style="background-color: #0A6FB7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Join workspace</a>
</div>
<p style="font-size: 13px; color: #6B7280;">Invitation expires: {{inviteExpiryDate}}</p>"""
    },
    {
        "template_key": "TEAM_MEMBER_ADDED",
        "name": "Added to Workspace",
        "category": "WORKSPACE",
        "subject": "You've been added to {{workspaceName}}",
        "preheader": "You are now a member of a new workspace.",
        "body_html": """<p>Hi {{firstName}},</p>
<p>You've been added to the <strong>{{workspaceName}}</strong> workspace on HideWin.</p>
<div style="margin: 32px 0;">
    <a href="{{workspaceUrl}}" style="background-color: #0A6FB7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Open workspace</a>
</div>"""
    },
    {
        "template_key": "ROLE_CHANGED",
        "name": "Role Changed",
        "category": "WORKSPACE",
        "subject": "Your HideWin workspace role has changed",
        "preheader": "Your access level has been updated.",
        "body_html": """<p>Hi {{firstName}},</p>
<p>Your role in <strong>{{workspaceName}}</strong> has been updated.</p>
<p style="margin: 16px 0; color: #374151;"><strong>New role:</strong> {{newRole}}</p>
<div style="margin: 32px 0;">
    <a href="{{workspaceUrl}}" style="background-color: #0A6FB7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Open workspace</a>
</div>"""
    },

    # --- CATEGORY 5 -- SUBSCRIPTION / BILLING ---
    {
        "template_key": "TRIAL_STARTED",
        "name": "Trial Started",
        "category": "SUBSCRIPTION",
        "subject": "Your HideWin trial has started",
        "preheader": "Enjoy your free access to HideWin.",
        "body_html": """<p>Hi {{firstName}},</p>
<p>Your {{planName}} trial is now active.</p>
<p style="margin: 16px 0; color: #374151;"><strong>Trial ends:</strong> {{trialEndDate}}</p>
<div style="margin: 32px 0;">
    <a href="{{dashboardUrl}}" style="background-color: #0A6FB7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Explore HideWin</a>
</div>"""
    },
    {
        "template_key": "TRIAL_ENDING",
        "name": "Trial Ending Soon",
        "category": "SUBSCRIPTION",
        "subject": "Your HideWin trial ends soon",
        "preheader": "Your trial ends on {{trialEndDate}}.",
        "body_html": """<p>Hi {{firstName}},</p>
<p>Your HideWin trial is ending soon.</p>
<p style="margin: 16px 0; color: #374151;"><strong>Trial ends:</strong> {{trialEndDate}}</p>
<p>If you want to continue using your plan, review your subscription before the trial ends.</p>
<div style="margin: 32px 0;">
    <a href="{{subscriptionUrl}}" style="background-color: #0A6FB7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Manage subscription</a>
</div>"""
    },
    {
        "template_key": "SUBSCRIPTION_STARTED",
        "name": "Subscription Active",
        "category": "SUBSCRIPTION",
        "subject": "Your HideWin subscription is active",
        "preheader": "Thank you for subscribing to HideWin.",
        "body_html": """<p>Hi {{firstName}},</p>
<p>Your {{planName}} subscription is now active.</p>
<div style="background-color: #F9FAFB; padding: 16px; border-radius: 6px; border: 1px solid #E5E7EB; margin: 24px 0;">
    <p style="margin: 0 0 8px 0; color: #374151;"><strong>Plan:</strong> {{planName}}</p>
    <p style="margin: 0 0 8px 0; color: #374151;"><strong>Price:</strong> {{planPrice}}</p>
    <p style="margin: 0 0 8px 0; color: #374151;"><strong>Billing:</strong> {{billingInterval}}</p>
    <p style="margin: 0; color: #374151;"><strong>Next billing date:</strong> {{nextBillingDate}}</p>
</div>
<div style="margin: 32px 0;">
    <a href="{{subscriptionUrl}}" style="background-color: #0A6FB7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Manage subscription</a>
</div>"""
    },
    {
        "template_key": "PAYMENT_SUCCESS",
        "name": "Payment Successful",
        "category": "SUBSCRIPTION",
        "subject": "Payment received for your HideWin subscription",
        "preheader": "Your recent payment was successful.",
        "body_html": """<p>Hi {{firstName}},</p>
<p>We've received your payment.</p>
<div style="background-color: #F9FAFB; padding: 16px; border-radius: 6px; border: 1px solid #E5E7EB; margin: 24px 0;">
    <p style="margin: 0 0 8px 0; color: #374151;"><strong>Plan:</strong> {{planName}}</p>
    <p style="margin: 0 0 8px 0; color: #374151;"><strong>Amount:</strong> {{paymentAmount}}</p>
    <p style="margin: 0 0 8px 0; color: #374151;"><strong>Date:</strong> {{paymentDate}}</p>
    <p style="margin: 0; color: #374151;"><strong>Invoice:</strong> {{invoiceNumber}}</p>
</div>
<div style="margin: 32px 0;">
    <a href="{{invoiceUrl}}" style="background-color: #0A6FB7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View invoice</a>
</div>"""
    },
    {
        "template_key": "PAYMENT_FAILED",
        "name": "Payment Failed",
        "category": "SUBSCRIPTION",
        "subject": "Action required: HideWin payment failed",
        "preheader": "Update your payment method to avoid interruption.",
        "body_html": """<p>Hi {{firstName}},</p>
<p>We were unable to process your latest payment for HideWin.</p>
<div style="background-color: #F9FAFB; padding: 16px; border-radius: 6px; border: 1px solid #E5E7EB; margin: 24px 0;">
    <p style="margin: 0 0 8px 0; color: #374151;"><strong>Plan:</strong> {{planName}}</p>
    <p style="margin: 0; color: #374151;"><strong>Amount:</strong> {{paymentAmount}}</p>
</div>
<p>Please update your payment method to avoid interruption.</p>
<div style="margin: 32px 0;">
    <a href="{{billingPortalUrl}}" style="background-color: #0A6FB7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Update payment method</a>
</div>"""
    },
    {
        "template_key": "SUBSCRIPTION_CANCELLED",
        "name": "Subscription Cancelled",
        "category": "SUBSCRIPTION",
        "subject": "Your HideWin subscription has been cancelled",
        "preheader": "Your subscription has ended.",
        "body_html": """<p>Hi {{firstName}},</p>
<p>Your HideWin subscription has been cancelled.</p>
<p>Your access will remain available until:</p>
<p style="margin: 16px 0; font-weight: bold; color: #1F2937;">{{subscriptionEndDate}}</p>
<p>If you change your mind, you can reactivate your subscription.</p>
<div style="margin: 32px 0;">
    <a href="{{subscriptionUrl}}" style="background-color: #0A6FB7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Manage subscription</a>
</div>"""
    },
    {
        "template_key": "INVOICE_AVAILABLE",
        "name": "Invoice Available",
        "category": "SUBSCRIPTION",
        "subject": "Your HideWin invoice {{invoiceNumber}}",
        "preheader": "A new invoice is ready to view.",
        "body_html": """<p>Hi {{firstName}},</p>
<p>Your latest HideWin invoice is available.</p>
<div style="background-color: #F9FAFB; padding: 16px; border-radius: 6px; border: 1px solid #E5E7EB; margin: 24px 0;">
    <p style="margin: 0 0 8px 0; color: #374151;"><strong>Invoice:</strong> {{invoiceNumber}}</p>
    <p style="margin: 0 0 8px 0; color: #374151;"><strong>Amount:</strong> {{paymentAmount}}</p>
    <p style="margin: 0; color: #374151;"><strong>Date:</strong> {{paymentDate}}</p>
</div>
<div style="margin: 32px 0;">
    <a href="{{invoiceUrl}}" style="background-color: #0A6FB7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View invoice</a>
</div>"""
    },

    # --- CATEGORY 6 -- SECURITY ---
    {
        "template_key": "SECURITY_NEW_LOGIN",
        "name": "New Login Alert",
        "category": "SECURITY",
        "subject": "New sign-in to your HideWin account",
        "preheader": "We noticed a new login to your account.",
        "body_html": """<p>Hi {{firstName}},</p>
<p>Your HideWin account was recently accessed.</p>
<div style="background-color: #F9FAFB; padding: 16px; border-radius: 6px; border: 1px solid #E5E7EB; margin: 24px 0;">
    <p style="margin: 0 0 8px 0; color: #374151;"><strong>Date:</strong> {{loginDate}}</p>
    <p style="margin: 0 0 8px 0; color: #374151;"><strong>Location:</strong> {{loginLocation}}</p>
    <p style="margin: 0; color: #374151;"><strong>Device:</strong> {{loginDevice}}</p>
</div>
<p style="font-size: 14px; color: #6B7280;">If this was not you, secure your account immediately.</p>"""
    },
    {
        "template_key": "SECURITY_EMAIL_CHANGED",
        "name": "Email Changed Alert",
        "category": "SECURITY",
        "subject": "Your HideWin email address was changed",
        "preheader": "Your account email has been updated.",
        "body_html": """<p>Hi {{firstName}},</p>
<p>The email address associated with your HideWin account was changed.</p>
<p style="margin-top: 24px;">If you made this change, no action is required.</p>
<p style="font-weight: bold; color: #c5221f;">If you did not make this change, contact {{supportEmail}} immediately.</p>"""
    },

    # --- CATEGORY 7 -- MARKETING / OFFERS ---
    {
        "template_key": "OFFER_PROMOTIONAL",
        "name": "Promotional Offer",
        "category": "MARKETING",
        "subject": "{{offerSubject}}",
        "preheader": "{{offerPreheader}}",
        "body_html": """<p>Hi {{firstName}},</p>
<h3 style="margin-top: 24px; margin-bottom: 16px; color: #1F2937;">{{offerTitle}}</h3>
<p>{{offerDescription}}</p>
<div style="background-color: #F9FAFB; padding: 24px; text-align: center; border-radius: 6px; border: 1px dashed #E5E7EB; margin: 32px 0;">
    <p style="margin: 0 0 16px 0; color: #374151;">Use promo code:</p>
    <span style="font-family: monospace; font-size: 24px; letter-spacing: 4px; font-weight: bold; color: #0A6FB7;">{{offerCode}}</span>
    <p style="margin: 16px 0 0 0; color: #6B7280; font-size: 13px;">Expires: {{offerExpiryDate}}</p>
</div>
<div style="margin: 32px 0; text-align: center;">
    <a href="{{offerUrl}}" style="background-color: #0A6FB7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Claim Offer</a>
</div>
<p style="font-size: 12px; color: #9CA3AF; text-align: center;">{{offerTerms}}</p>
<div style="margin-top: 40px; text-align: center;">
    <a href="{{unsubscribeUrl}}" style="font-size: 12px; color: #6B7280;">Unsubscribe from offers</a>
</div>"""
    },
    {
        "template_key": "PRODUCT_ANNOUNCEMENT",
        "name": "Product Announcement",
        "category": "MARKETING",
        "subject": "Introducing {{announcementTitle}}",
        "preheader": "Exciting new updates from HideWin.",
        "body_html": """<p>Hi {{firstName}},</p>
<h3 style="margin-top: 24px; margin-bottom: 16px; color: #1F2937;">{{announcementTitle}}</h3>
<p>{{announcementDescription}}</p>
<div style="margin: 32px 0; text-align: center;">
    <a href="{{announcementUrl}}" style="background-color: #0A6FB7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">{{announcementCta}}</a>
</div>
<div style="margin-top: 40px; text-align: center;">
    <a href="{{unsubscribeUrl}}" style="font-size: 12px; color: #6B7280;">Unsubscribe from updates</a>
</div>"""
    },

    # --- CATEGORY 8 -- CUSTOM ---
    {
        "template_key": "CUSTOM_EMAIL",
        "name": "Custom Email Template",
        "category": "CUSTOM",
        "subject": "{{customSubject}}",
        "preheader": "{{customPreheader}}",
        "body_html": """<p>Hi {{firstName}},</p>
<div style="margin-top: 24px; margin-bottom: 24px;">
    {{customBodyContent}}
</div>
<div style="margin: 32px 0;">
    <a href="{{customCtaUrl}}" style="background-color: #0A6FB7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">{{customCtaText}}</a>
</div>"""
    }
]

async def seed_remaining():
    async with async_session() as db:
        for tmpl_data in templates_to_seed:
            res = await db.execute(select(EmailTemplate).filter_by(template_key=tmpl_data["template_key"]))
            existing = res.scalars().first()
            
            if not existing:
                print(f"Adding {tmpl_data['template_key']}...")
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
                existing.name = tmpl_data["name"]
                existing.category = tmpl_data["category"]
                existing.subject = tmpl_data["subject"]
                existing.preheader = tmpl_data["preheader"]
                existing.body_html = tmpl_data["body_html"]
                print(f"Updated {tmpl_data['template_key']}")
                
        await db.commit()
        print("Done seeding all remaining templates.")

if __name__ == "__main__":
    asyncio.run(seed_remaining())
