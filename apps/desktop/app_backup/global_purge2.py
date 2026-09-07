import re
import glob

# Mapping of hardcoded light theme hex colors to CSS variables
color_map = [
    (r':\s*white(?!-)', r': var(--bg-elevated)'),
    (r':\s*black(?!-)', r': var(--text-primary)'),
]

files = glob.glob('src/components/views/*.js')
files.append('src/components/app/HideWinApp.js') # also do the main app container just in case!

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for old, new in color_map:
        new_content = re.sub(old, new, new_content, flags=re.IGNORECASE)
        
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated keywords in {filepath}")

print("Global purge of literal white/black colors completed!")
