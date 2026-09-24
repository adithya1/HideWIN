import re

fpath = 'src/components/views/MainView.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'style="border-radius: 8px; padding: 14px 40px; [^"]+"', '', content)
content = re.sub(r'style="border-radius: 8px; padding: 0 24px; [^"]+"', '', content)

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed inline button styles.")
