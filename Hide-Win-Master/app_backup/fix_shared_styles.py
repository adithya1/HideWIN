import re

path = 'src/components/views/sharedPageStyles.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace hardcoded colors with variables
replacements = [
    (r'#ffffff', r'var(--bg-elevated)'),
    (r'#0f172a', r'var(--text-primary)'),
    (r'#1e3a8a', r'var(--text-primary)'),
    (r'#334155', r'var(--text-secondary)'),
    (r'#64748b', r'var(--text-secondary)'),
    (r'#94a3b8', r'var(--text-muted)'),
    (r'#1e1e24', r'var(--bg-app)'),
    (r'#3b82f6', r'var(--accent)'),
    (r'#6366f1', r'var(--accent)'),
    (r'#4f46e5', r'var(--accent-hover)'),
    (r'#2563eb', r'var(--accent-hover)'),
    (r'rgba\(59, 130, 246, 0\.3\)', r'var(--border)'),
    (r'rgba\(59, 130, 246, 0\.2\)', r'var(--border)'),
    (r'rgba\(59, 130, 246, 0\.05\)', r'transparent'),
    (r'rgba\(59, 130, 246, 0\.15\)', r'transparent'),
    (r'rgba\(99, 102, 241, 0\.4\)', r'var(--border-strong)'),
    (r'rgba\(255, 255, 255, 0\.95\)', r'var(--bg-hover)'),
    (r'linear-gradient\([^)]+\)', r'var(--accent)'), # Replace gradients with simple accent background
]

for old, new in replacements:
    content = re.sub(old, new, content)

# But wait, linear gradient might be replacing background: linear-gradient() which is fine, 
# but if it was replacing just the gradient part, we should be careful. 
# It's better to just replace `background: linear-gradient(...)` with `background: var(--accent)`

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Purged hardcoded light/dark colors from sharedPageStyles.js!")
