import re

path = r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\invite_client\index.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace hardcoded ws:// with dynamic protocol
replacement = r"""
            const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
            ws = new WebSocket(`${protocol}//${location.host}/ws/signaling/join/${channel}/${passcode}/${encodeURIComponent(name)}`);
"""
content = re.sub(r"ws = new WebSocket\(`ws://\$\{location\.host\}[^`]+`\);", replacement.strip(), content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
