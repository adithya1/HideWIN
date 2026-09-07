import sys
sys.path.append('.')
from routers.auth import create_access_token
import requests

token = create_access_token(data={"sub": "admin@hidewin.com", "role": "ADMIN"})
res = requests.get('http://localhost:8000/api/admin/users', headers={'Authorization': f'Bearer {token}'})
print(res.status_code)
print(res.text)
