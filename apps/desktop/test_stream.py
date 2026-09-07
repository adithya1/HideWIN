import hmac
import hashlib
import urllib.request
import json

secret = b'hw_desktop_secret_998877'
body = b'{"contents":[{"role":"user","parts":[{"text":"hello"}]}]}'
sig = hmac.new(secret, body, hashlib.sha256).hexdigest()

req = urllib.request.Request('http://localhost:8000/api/ai-proxy/stream', data=body, headers={'Content-Type': 'application/json', 'X-HideWin-Signature': sig})
try:
    resp = urllib.request.urlopen(req)
    print("STATUS:", resp.status)
    for line in resp:
        print(line.decode('utf-8'), end='')
except urllib.error.HTTPError as e:
    print("HTTP ERROR:", e.code)
    print(e.read().decode('utf-8'))
