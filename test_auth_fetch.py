import requests

try:
    # First login to get a real token
    login_res = requests.post("http://localhost:8000/api/auth/login", json={"email": "admin@hidewin.com", "password": "adminpassword123"})
    if login_res.status_code == 200:
        token = login_res.json()["token"]
        print("Got token")
        
        res = requests.get("http://localhost:8000/api/admin/email-templates", headers={"Authorization": f"Bearer {token}"})
        print(f"GET templates: {res.status_code}")
        print(res.text)
    else:
        print("Failed to login", login_res.status_code, login_res.text)
except Exception as e:
    print("Error:", e)
