import re

filepath = r"Hide-Win-Master\src\index.html"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<script src="utils/renderer.js"></script>',
    '<script src="assets/ort.min.js"></script>\n        <script src="assets/vad-bundle.js"></script>\n        <script src="utils/renderer.js"></script>'
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
