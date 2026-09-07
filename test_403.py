import requests
import json

r = requests.post("http://127.0.0.1:8000/api/meetings/", headers={"Authorization": "Bearer invalid"})
print(r.status_code)
print(r.text)
