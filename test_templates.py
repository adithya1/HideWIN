import requests

try:
    r = requests.get("http://localhost:8000/api/admin/email-templates", headers={"Authorization": "Bearer adminpassword123"})
    print(r.status_code)
    print(r.text)
except Exception as e:
    print("Error:", e)
