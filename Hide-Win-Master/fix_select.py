import re

fpath = 'src/components/views/sharedPageStyles.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# Change the white arrow to a gray arrow suitable for light mode
content = re.sub(r"stroke='rgba\(255,255,255,0\.5\)'", "stroke='%2364748b'", content)

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated select dropdown arrow color in sharedPageStyles.js")
