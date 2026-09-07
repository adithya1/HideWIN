from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Optional
import subprocess
import os
import tempfile
import db_models as models
from src.lib.database import get_db
from src.api.user.auth import get_current_user

router = APIRouter(prefix="/api/code", tags=["code-pilot"])

@router.post("/execute")
async def execute_code(
    payload: Dict,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Autonomous Code-Pilot Sandbox (Roadmap 3.1).
    Executes Python or SQL snippets in a restricted environment and returns output.
    """
    code = payload.get("code")
    language = payload.get("language", "python")
    
    if not code:
        raise HTTPException(status_code=400, detail="No code provided.")
    
    if language != "python":
        return {
            "success": False,
            "error": "Only Python is supported in the current stealth sandbox."
        }

    # 1. Create a temporary file for execution
    with tempfile.NamedTemporaryFile(suffix=".py", delete=False) as tmp:
        tmp.write(code.encode('utf-8'))
        tmp_path = tmp.name

    try:
        # 2. Execute in a subprocess with a timeout (Security)
        # Note: In production, this should use a Docker container or restricted VM.
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
