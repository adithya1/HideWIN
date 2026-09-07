import requests

url = "http://127.0.0.1:8000/api/meetings/"
# We need auth, but we can just see if it's running and what error we get.
try:
    r = requests.post(url, data={})
    print(r.status_code)
    print(r.text)
except Exception as e:
    print("Error:", e)
