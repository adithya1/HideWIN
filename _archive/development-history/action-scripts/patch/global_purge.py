import re
import glob

# Mapping of hardcoded light theme hex colors to CSS variables
color_map = [
    (r'#ffffff|#fff(?![\da-fA-F])', r'var(--bg-elevated)'),
    (r'#f8fafc|#f8f9fa|#f0f0f0|#f9fafb|#ede9fe', r'var(--bg-app)'),
    (r'#0f172a|#111827|#374151|#475569|#4b5563|#000000|#000(?![\da-fA-F])', r'var(--text-primary)'),
    (r'#64748b|#94a3b8|#6b7280', r'var(--text-secondary)'),
    (r'#e5e7eb|#e2e8f0|#cbd5e1|#d4d4d4|#d1d5db|#ccc(?![\da-fA-F])', r'var(--border)'),
    (r'#3b82f6|#6366f1|#185fc4|#1550a6|#2b91af|#b5d5ff', r'var(--accent)'),
    (r'#ef4444|#f87171', r'var(--danger)'),
    (r'#10b981|#34d399', r'var(--success)'),
    (r'#f59e0b', r'var(--warning)'),
    
    # Specific rgba overrides for borders/backgrounds
    (r'rgba\(239,\s*68,\s*68,\s*0\.\d+\)', r'transparent'),
    (r'rgba\(16,\s*185,\s*129,\s*0\.\d+\)', r'transparent'),
    (r'rgba\(245,\s*158,\s*11,\s*0\.\d+\)', r'transparent'),
    (r'rgba\(99,\s*102,\s*241,\s*0\.\d+\)', r'transparent'),
]

files = glob.glob('src/components/views/*.js')
files.append('src/components/app/HideWinApp.js') # also do the main app container just in case!

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We should NOT replace literal '#ffffff' if it's inside a string that isn't CSS?
    # No, it's fine, we want to replace all colors.
    new_content = content
    for old, new in color_map:
        new_content = re.sub(old, new, new_content, flags=re.IGNORECASE)
        
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

print("Global purge of hardcoded light theme colors completed!")
