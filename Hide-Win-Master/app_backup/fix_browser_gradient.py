import re

path = 'src/components/views/StealthBrowserView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    (r'background: linear-gradient\(160deg, #0f0f1e 0%, #1a1a35 50%, #0f0f1e 100%\);', r'background: var(--bg-app);'),
    (r'stroke="rgba\(255,255,255,0\.4\)"', r'stroke="var(--text-secondary)"'),
    (r'rgba\(255,255,255,0\.1\)', r'var(--border)'),
    (r'rgba\(255,255,255,0\.05\)', r'var(--border)'),
    (r'rgba\(255,255,255,0\.2\)', r'var(--border-strong)'),
    (r'rgba\(255,255,255,0\.4\)', r'var(--text-secondary)'),
    (r'rgba\(255,255,255,0\.6\)', r'var(--text-secondary)'),
    (r'rgba\(255,255,255,0\.7\)', r'var(--text-secondary)'),
    (r'rgba\(255, 255, 255, 0\.1\)', r'var(--border)'),
]

for old, new in replacements:
    content = re.sub(old, new, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed more StealthBrowserView.js hardcoded colors")
