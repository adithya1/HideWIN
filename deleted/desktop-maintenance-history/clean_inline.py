import re

def clean_inline_styles(content):
    # Fix border radius 40px -> 8px
    content = re.sub(r'border-radius:\s*40px;?', 'border-radius: 8px;', content)
    
    # Fix excessive drop shadows in inline styles
    content = re.sub(r'box-shadow:\s*0\s+4px\s+14px\s+rgba\(59,\s*130,\s*246,\s*0\.[45]\);?', 'box-shadow: 0 1px 3px rgba(0,0,0,0.1);', content)
    
    # Also fix any other stray border-radius inline (like 50px or 100px)
    content = re.sub(r'border-radius:\s*50px;?', 'border-radius: 8px;', content)
    content = re.sub(r'border-radius:\s*100px;?', 'border-radius: 8px;', content)
    
    return content

fpath = 'src/components/views/MainView.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

new_content = clean_inline_styles(content)

if new_content != content:
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Cleaned inline styles in MainView.js")

