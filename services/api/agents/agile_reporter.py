import asyncio
import time
from sqlalchemy.orm import Session
from datetime import datetime
from database import engine, SessionLocal
import models

# In a real environment, you'd import requests to hit JIRA/Git directly here
# import requests
# from langchain_openai import ChatOpenAI

def pull_external_data(integration: models.Integration):
    """
    Mocks fetching data from the external integration (JIRA/Git)
    using the provided API URL and Access Token.
    """
    print(f"[{datetime.now()}] Pulling from {integration.platform} at {integration.api_url}...")
    # Simulate network latency
    time.sleep(1)
    
    if integration.platform == "JIRA":
        return "Commits/Comments: Marked STARK-402 as DONE. Deployed arc reactor logic."
    elif integration.platform == "GitHub" or integration.platform == "Bitbucket":
        return "Commits: feat - implemented LangGraph routing algorithm in third_eye_graph.py"
    return "No activity."

def generate_ai_summary(raw_data: str) -> str:
    """
    Routinely passes the raw commit/ticket comment string into the LLM
    to condense it into a clean B2B standup bullet point.
    """
    # llm = ChatOpenAI(model="gpt-4")
    # return llm.invoke(f"Summarize this for a standup: {raw_data}").content
    return f"AI Summary: {raw_data}" # Mocked for execution without key

def run_hourly_standup_agent():
    print("Starting Agile Reporter Background Agent...")
    db = SessionLocal()

    # 1. Fetch all active integrations
    integrations = db.query(models.Integration).all()
    
    for inter in integrations:
        # 2. Pull Data
        raw_dump = pull_external_data(inter)
        
        # 3. Ask AI to summarize the last hour
        summary = generate_ai_summary(raw_dump)
        
        user = db.query(models.User).filter(models.User.id == inter.user_id).first()
        
        # 4. Save to WorkReport
        new_report = models.WorkReport(
            user_id=user.id,
            vendor_id=user.vendor_id,
            report_type="HOURLY",
            summary_data={"text": summary, "platform": inter.platform}
        )
        db.add(new_report)
        
        # 5. Push non-intrusive Notification to Vendor instead of Email
        if user.vendor_id:
            notif = models.Notification(
                user_id=user.vendor_id, 
                title="Hourly Standup Generated", 
                message=f"Standup logged for {user.email}: {summary}"
            )
            db.add(notif)
            
            # Optional Email trigger
            vendor = db.query(models.User).filter(models.User.id == user.vendor_id).first()
            if vendor and vendor.email_notifications:
                print(f"--> [EMAIL DISPATCHED] To {vendor.email}: New standup from {user.email}")

    db.commit()
    db.close()
    print("Agile Reporter Cycle Complete.")

if __name__ == "__main__":
    # Usually you'd wrap this in an APScheduler or celery task to run every hour
    run_hourly_standup_agent()
