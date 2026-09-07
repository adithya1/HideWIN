import requests

try:
    login = requests.post("http://localhost:8000/api/auth/login", json={"email": "admin@hidewin.com", "password": "adminpassword123"})
    token = login.json()["token"]
    
    # Try creating a meeting
    data = {
        "title": "Test fetch",
        "description": "",
        "start_time": "2026-08-30T10:00:00Z",
        "timezone": "America/New_York",
        "recurrence": "none",
        "participants": [],
        "cc_participants": [],
        "bcc_participants": [],
        "invite_url_base": "http://localhost/invite"
    }
    
    # We use multipart/form-data because the endpoint expects `meeting_data` and `files`
    import json
    files = {
        'meeting_data': (None, json.dumps(data), 'application/json')
    }
    
    res = requests.post("http://localhost:8000/api/meetings/", headers={"Authorization": f"Bearer {token}"}, files=files)
    print(f"Status: {res.status_code}")
    print(res.text)
except Exception as e:
    print("Error:", e)
