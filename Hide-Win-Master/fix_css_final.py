import re

with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Remove from the end of the file
regex = r'/\* RESPONSIVE LAYOUT \*/.*?\.mobile-hamburger:hover\s*\{\s*color:\s*#007acc;\s*\}'
match = re.search(regex, text, re.DOTALL)

if match:
    css_content = match.group(0)
    text = text.replace(css_content, '')
    
    # Put it right before `static properties = {` inside the backtick
    insert_str = '    `;\n\n    static properties = {'
    
    new_insert = css_content + '\n' + insert_str
    
    text = text.replace(insert_str, new_insert)
    
    with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Fixed CSS location!")
else:
    print("Could not find CSS!")
