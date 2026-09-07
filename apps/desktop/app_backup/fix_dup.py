with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the duplicate template literal closing tags
content = content.replace("            </div>\n        `;\n\n            </div>\n        `;\n\n    }", "            </div>\n        `;\n\n    }")

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js', 'w', encoding='utf-8') as f:
    f.write(content)
