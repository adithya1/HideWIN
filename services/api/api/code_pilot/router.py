from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict
import subprocess
import os
import tempfile
from services.api.core.database import get_db
from services.api.core.security import get_current_user
from services.api.models.user import User

router = APIRouter(prefix="/code", tags=["code-pilot"])

@router.post("/execute")
async def execute_code(
    payload: Dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    code = payload.get("code")
    language = payload.get("language", "python")
    
    if not code:
        raise HTTPException(status_code=400, detail="No code provided.")
    
    if language != "python":
        return {
            "success": False,
            "error": "Only Python is supported in the current stealth sandbox."
        }

    with tempfile.NamedTemporaryFile(suffix=".py", delete=False) as tmp:
        tmp.write(code.encode('utf-8'))
        tmp_path = tmp.name

    try:
        result = subprocess.run(
            ["python", tmp_path],
            capture_output=True,
            text=True,
            timeout=5
        )
        
        return {
            "success": True,
            "stdout": result.stdout,
            "stderr": result.stderr,
            "exit_code": result.returncode
        }
    except subprocess.TimeoutExpired:
        return {
            "success": False,
            "error": "Execution timed out (5s limit). Potential infinite loop detected."
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Sandbox Exception: {str(e)}"
        }
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

@router.get("/status")
async def get_sandbox_status():
    return {
        "status": "READY",
        "engine": "Python 3.10+",
        "safety": "Subprocess 5s Timeout"
    }
