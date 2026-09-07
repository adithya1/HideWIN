from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from services.api.core.database import get_db
from services.api.core.security import get_current_user
from services.api.models.user import User
from services.api.db_models.session import Session

router = APIRouter(prefix="/resume", tags=["resume"])

@router.post("/sync-achievements")
async def sync_achievements(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Session).where(Session.user_id == current_user.id, Session.status == "COMPLETED")
    )
    sessions = result.scalars().all()
    
    if not sessions:
        return {
            "success": True,
            "message": "No completed missions found yet. Win more missions to update your profile!",
            "data_points": []
        }

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
    current_user: User = Depends(get_current_user)
):
    return {
        "user": current_user.email,
        "elite_rank": "Senior Stealth Agent" if getattr(current_user, 'is_premium', False) else "Junior Agent",
        "missions_completed": 12, # Mocked
        "top_skills": ["RAG Architecture", "Real-time AI Synergy", "Covert Strategy"]
    }
