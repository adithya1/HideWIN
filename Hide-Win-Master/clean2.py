import re

fpath = 'src/components/views/MainView.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'/\*.*NEW HOME LAYOUT.*\*/[\s\S]*?\.home-header\s*\{', '.home-header {', content)

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Cleaned up CSS again.")
