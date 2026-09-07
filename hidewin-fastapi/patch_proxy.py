import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\routers\ai_proxy.py"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

target = r"res = await client\.post\(url, headers=headers, json=payload, timeout=60\.0\)\n\s+res\.raise_for_status\(\)"
replacement = r"""res = await client.post(url, headers=headers, json=payload, timeout=60.0)
                if res.status_code != 200:
                    print("GROQ ERROR:", res.text)
                res.raise_for_status()"""

content = re.sub(target, replacement, content)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Patched ai_proxy.py")
