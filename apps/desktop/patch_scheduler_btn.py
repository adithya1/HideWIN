import re
path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace button colors with the exact same blue as Notes/History
content = re.sub(r'\.btn-primary \{(.*?)\}', r'.btn-primary {\n                background: #185fc4;\n                color: white;\n                border: none;\n                box-shadow: 0 4px 14px rgba(24, 95, 196, 0.4);\n            }', content, flags=re.DOTALL)
content = re.sub(r'\.btn-primary:hover \{(.*?)\}', r'.btn-primary:hover {\n                background: #1550a6;\n                transform: translateY(-2px);\n                box-shadow: 0 6px 20px rgba(24, 95, 196, 0.6) !important;\n            }', content, flags=re.DOTALL)

# Also fix the header icon color
content = content.replace('background: var(--accent);', 'background: #185fc4;')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
