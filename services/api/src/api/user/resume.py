from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
import db_models as models
from src.lib.database import get_db
from src.api.user.auth import get_current_user

router = APIRouter(prefix="/api/resume", tags=["resume-updater"])

@router.post("/sync-achievements")
async def sync_achievements(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Performance-Driven Resume Updater (Roadmap 3.2).
    Analyzes historical 'Wins' from completed missions and generates data points for LinkedIn/Resume.
    """
    # 1. Fetch completed sessions for this user
    sessions = db.query(models.Session).filter(
        models.Session.user_id == current_user.id,
        models.Session.status == "COMPLETED"
    ).all()
    
    if not sessions:
        return {
            "success": True,
            "message": "No completed missions found yet. Win more missions to update your profile!",
            "data_points": []
        }

    # 2. Simulate AI summarization of mission 'Wins'
    # In production, this would look at Participant records and AI Transcripts.
    data_points = []
    for s in sessions:
        data_points.append({
            "session_id": s.id,
            "achievement": f"Successfully navigated high-stakes interview: {s.title}",
            "proven_skill": "Advanced AI Collaboration & Real-time Problem Solving",
            "impact": "100% technical competency score via Autonomous Code-Pilot assistance."
        })

    return {
        "success": True,
        "achievements_found": len(data_points),
        "suggested_bullet_points": data_points,
        "instructions": "Click 'Sync to LinkedIn' to automatically update your professional profile with these mission-proven data points."
    }

@router.get("/profile")
async def get_resume_profile(
    current_user: models.User = Depends(get_current_user)
):
    return {
        "user": current_user.email,
        "elite_rank": "Senior Stealth Agent" if current_user.is_premium else "Junior Agent",
        "missions_completed": 12, # Mocked
        "top_skills": ["RAG Architecture", "Real-time AI Synergy", "Covert Strategy"]
    }
