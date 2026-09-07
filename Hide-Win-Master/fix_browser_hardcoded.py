import re

path = 'src/components/views/StealthBrowserView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace hardcoded dark colors and white opacities with variables
replacements = [
    (r'#151525', r'var(--bg-elevated)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.04\)', r'var(--bg-hover)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.07\)', r'var(--border)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.15\)', r'var(--border-strong)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.2\)', r'var(--border-strong)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.3\)', r'var(--text-muted)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.35\)', r'var(--text-muted)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.4\)', r'var(--text-muted)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.5\)', r'var(--text-secondary)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.75\)', r'var(--text-primary)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.8\)', r'var(--text-primary)'),
    (r'rgba\(255,\s*255,\s*255,\s*0\.9\)', r'var(--text-primary)'),
    (r'color: #ffffff', r'color: var(--text-primary)'),
    (r'color:\s*white', r'color: var(--text-primary)'),
]

for old, new in replacements:
    content = re.sub(old, new, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Purged remaining hardcoded dark themes from StealthBrowserView!")
