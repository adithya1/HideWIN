import re
path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add :host style to fix layout collapsing
host_css = """
            :host {
                display: block;
                height: 100%;
                width: 100%;
                overflow: hidden;
            }
"""

content = re.sub(r'css`', 'css`\n' + host_css, content, count=1)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
