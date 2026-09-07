import requests

login_res = requests.post('http://localhost:8000/api/auth/login', json={'email': 'admin@hidewin.com', 'password': 'admin'})
if login_res.status_code == 200:
    token = login_res.json().get('token')
    res = requests.get('http://localhost:8000/api/admin/users', headers={'Authorization': f'Bearer {token}'})
    print(res.status_code)
    print(res.text)
else:
    print("Login failed:", login_res.status_code, login_res.text)
