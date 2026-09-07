import requests

try:
    login_res = requests.post("http://localhost:8000/api/auth/login", json={"email": "admin@hidewin.com", "password": "adminpassword123"})
    if login_res.status_code == 200:
        token = login_res.json()["token"]
        res = requests.get("http://localhost:8000/api/meetings/upcoming", headers={"Authorization": f"Bearer {token}"})
        print(f"Upcoming: {res.status_code}")
        print(res.text)
except Exception as e:
    print("Error:", e)
