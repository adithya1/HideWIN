from langchain.tools import tool
from typing import List, Dict

@tool
def fetch_assigned_tickets(jira_url: str, access_token: str, user_email: str) -> List[Dict]:
    """
    Fetches open/in-progress tickets assigned to the user from Jira to formulate daily task status.
    """
    # MOCK IMPLEMENTATION FOR AGILE SIMULATION
    if not access_token:
        return [{"error": "Missing Jira Access Token"}]
        
    return [
        {"ticket_id": "HW-402", "title": "Migrate SQLite to PostgreSQL", "status": "IN_PROGRESS", "priority": "High"},
        {"ticket_id": "HW-405", "title": "Implement Kafka Audio Streaming", "status": "TODO", "priority": "Critical"}
    ]

@tool
def update_ticket_status(jira_url: str, access_token: str, ticket_id: str, new_status: str) -> str:
    """
    Updates the status of a Jira ticket (e.g. moving from IN_PROGRESS to DONE).
    """
    # MOCK IMPLEMENTATION
    if not access_token:
        return "Failed: Missing token"
    return f"Successfully updated ticket {ticket_id} to status {new_status}."
