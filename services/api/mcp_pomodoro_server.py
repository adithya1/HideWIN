import asyncio
from sqlalchemy.orm import Session
from mcp.server.fastmcp import FastMCP
from pydantic import BaseModel

import database
import models

# Initialize Database Engine
engine = database.engine

# Create the MCP Server
mcp = FastMCP("HideWIN Agile Pomodoro Server")

@mcp.tool()
def get_active_tasks(user_id: int) -> list[dict]:
    """Retrieves all active Agile/JIRA tasks for the user from the HideWIN environment."""
    with Session(engine) as db:
        tasks = db.query(models.Task).filter(
            models.Task.user_id == user_id, 
            models.Task.status != "DONE"
        ).all()
        return [{"id": t.id, "title": t.title, "jira_ref": t.jira_ticket_ref, "pomodoros": t.pomodoro_sessions, "status": t.status} for t in tasks]

@mcp.tool()
def start_pomodoro(task_id: int) -> str:
    """Marks a task as active/doing, initiating a Pomodoro focus cycle."""
    with Session(engine) as db:
        task = db.query(models.Task).filter(models.Task.id == task_id).first()
        if not task:
            return "Task not found."
        
        task.status = "DOING"
        db.commit()
        return f"Pomodoro cycle started for task [{task.jira_ticket_ref}] '{task.title}'."

@mcp.tool()
def complete_pomodoro(task_id: int) -> str:
    """Completes a 25-minute Pomodoro cycle, adding it to the ticket's history."""
    with Session(engine) as db:
        task = db.query(models.Task).filter(models.Task.id == task_id).first()
        if not task:
            return "Task not found."
        
        task.pomodoro_sessions += 1
        db.commit()
        return f"Pomodoro session recorded! Total sessions for [{task.jira_ticket_ref}]: {task.pomodoro_sessions}"

@mcp.tool()
def mark_task_done(task_id: int) -> str:
    """Marks the agile task / JIRA ticket as fully DONE."""
    with Session(engine) as db:
        task = db.query(models.Task).filter(models.Task.id == task_id).first()
        if not task:
            return "Task not found."
        
        task.status = "DONE"
        db.commit()
        return f"Task [{task.jira_ticket_ref}] successfully closed."

if __name__ == "__main__":
    # In production, run via MCP stdio pipeline: mcp run mcp_pomodoro_server.py
    mcp.run()
