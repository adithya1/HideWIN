import os
import re

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception:
        return

    # Strip out any rogue hidden scrollbar rules
    content = re.sub(r'::-webkit-scrollbar\s*\{\s*display:\s*none[^}]*\}', '', content)
    content = re.sub(r'scrollbar-width:\s*none\s*;?', '', content)
    content = re.sub(r'-ms-overflow-style:\s*none\s*;?', '', content)
    
    # Strip my previous 10px scrollbar attempts so I can inject the new ultra-lean one perfectly
    content = re.sub(r'/\* GLOBAL POSH LEAN SCROLLBAR.*?\*/.*?(?=(?:</style>|`|$))', '', content, flags=re.DOTALL)
    content = re.sub(r'::-webkit-scrollbar\s*\{.*?\}', '', content, flags=re.DOTALL)
    content = re.sub(r'::-webkit-scrollbar-[a-z:-]+\s*\{.*?\}', '', content, flags=re.DOTALL)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.js') or file.endswith('.html') or file.endswith('.css'):
            fix_file(os.path.join(root, file))

print("Scrubbed all hidden scrollbar logic.")
