import re

path = 'src/components/views/StealthBrowserView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    (r'background: #1a1a2e;', r'background: var(--bg-app);'),
    (r'color: #fff;', r'color: var(--text-primary);'),
    (r'background: #0f0f1a;', r'background: var(--bg-surface);'),
    (r'border-bottom: 1px solid rgba\(255,255,255,0\.06\);', r'border-bottom: 1px solid var(--border);'),
    (r'color: rgba\(255,255,255,0\.4\);', r'color: var(--text-secondary);'),
    (r'background: rgba\(255,60,60,0\.25\); color: #ff6b6b;', r'background: rgba(239, 68, 68, 0.15); color: #ef4444;'),
    (r'background: #252540;', r'background: var(--bg-elevated);'),
    (r'color: rgba\(255,255,255,0\.6\);', r'color: var(--text-secondary);'),
    (r'background: rgba\(255,255,255,0\.05\);', r'background: var(--bg-hover);'),
    (r'border-right: 1px solid rgba\(255,255,255,0\.05\);', r'border-right: 1px solid var(--border);'),
    (r'background: rgba\(255,255,255,0\.1\); color: #fff;', r'background: var(--bg-hover); color: var(--text-primary);'),
    (r'background: #1e1e36;', r'background: var(--bg-elevated);'),
    (r'border-bottom: 1px solid rgba\(255,255,255,0\.1\);', r'border-bottom: 1px solid var(--border);'),
    (r'color: rgba\(255,255,255,0\.7\);', r'color: var(--text-secondary);'),
    (r'background: rgba\(255,255,255,0\.08\);', r'background: var(--bg-hover);'),
    (r'color: #fff;', r'color: var(--text-primary);'),
    (r'color: rgba\(255,255,255,0\.2\);', r'color: var(--text-muted);'),
    (r'background: #141424;', r'background: var(--bg-app);'),
    (r'border: 1px solid rgba\(255,255,255,0\.1\);', r'border: 1px solid var(--border);'),
    (r'border-color: #3b82f6;', r'border-color: var(--accent);'),
    (r'box-shadow: 0 0 0 2px rgba\(59, 130, 246, 0\.2\);', r'box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);'),
    (r'background: transparent;', r'background: transparent;'),
    (r'color: #0f0f1a;', r'color: var(--bg-surface);'),
    (r'background: #fff;', r'background: var(--text-primary);'),
    (r'color: #3b82f6;', r'color: var(--accent);'),
]

for old, new in replacements:
    content = re.sub(old, new, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated StealthBrowserView.js colors")
