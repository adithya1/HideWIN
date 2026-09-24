import re

fpath = 'src/components/views/MainView.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the duplicate NEW HOME LAYOUT block to avoid CSS conflict
content = re.sub(r'/\*\s*AAA,A\?A\?sAAAA,A\?A\?sA NEW HOME LAYOUT AAA,A\?A\?sAAAA,A\?A\?sA\s*\*/[\s\S]*?\.home-header\s*\{', '.home-header {', content)

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Cleaned up CSS.")
