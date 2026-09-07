import requests
from langchain.tools import tool
from typing import List, Dict

@tool
def fetch_recent_commits(repo_url: str, access_token: str, hours: int = 24) -> List[Dict]:
    """
    Fetches the commit history of a user from a given Git/Bitbucket repository URL over the last specified hours.
    Returns a list of commit summaries.
    """
    # MOCK IMPLEMENTATION FOR AGILE SIMULATION
    # In production, parses repo_url to determine Github vs Bitbucket API, injects PAT as Bearer token.
    if not access_token:
        return [{"error": "Missing Git Access Token"}]
        
    return [
        {"commit_hash": "a1b2c3d4", "message": "feat(auth): Integrate JWT stateless quotas", "timestamp": "2026-04-03T14:32:00Z"},
        {"commit_hash": "e5f6g7h8", "message": "fix(ui): Resolve WebRTC scaling bugs", "timestamp": "2026-04-03T16:15:00Z"},
        {"commit_hash": "i9j0k1l2", "message": "chore(docs): Update OpenAPI specs", "timestamp": "2026-04-04T09:00:00Z"}
    ]
