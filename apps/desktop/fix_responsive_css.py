import re

with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Remove it from where it currently is
# Look for /* RESPONSIVE LAYOUT */ up to .mobile-hamburger:hover { color: #007acc; }
regex = r'/\* RESPONSIVE LAYOUT \*/.*?\.mobile-hamburger:hover\s*\{\s*color:\s*#007acc;\s*\}'
match = re.search(regex, text, re.DOTALL)
if match:
    css_content = match.group(0)
    text = text.replace(css_content, '')
    
    # 2. Find the END of the actual static styles block.
    # The static styles block is `css\` ... \``
    # Let's just find the first `];` which ends `static styles = [ ... ];`
    # Or find `color: var(--accent); } ` which was near the end of the styles block.
    # Actually, let's find `static properties = {` and insert it right before the `];` that precedes it.
    
    prop_idx = text.find('static properties = {')
    insert_idx = text.rfind('];', 0, prop_idx)
    
    # We need to insert it inside the css` ` template. The css string ends with `\n    `;\n    ];`
    
    # Let's find the closing backtick before `];`
    backtick_idx = text.rfind('`', 0, insert_idx)
    
    text = text[:backtick_idx] + '\n' + css_content + '\n' + text[backtick_idx:]

with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Moved responsive CSS to the correct static styles block!")
