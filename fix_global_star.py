import re
path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\sharedPageStyles.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the harmful global * rule
content = re.sub(r'\s*\*\s*\{[^}]*pointer-events:\s*auto\s*!important;[^}]*\}', '', content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
