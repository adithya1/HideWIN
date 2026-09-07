import re
import glob

files = glob.glob('src/components/views/*.js')
files.append('src/components/app/HideWinApp.js')

hex_colors = set()
for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    matches = re.findall(r'#[0-9a-fA-F]{3,6}(?![a-zA-Z0-9_-])', content)
    for m in matches:
        hex_colors.add((filepath, m.lower()))

for filepath, hexcode in sorted(hex_colors):
    print(f"{filepath}: {hexcode}")
