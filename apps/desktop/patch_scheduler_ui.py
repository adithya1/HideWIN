import re
path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all occurrences of #5b5fc7 with var(--accent)
content = content.replace('#5b5fc7', 'var(--accent)')
content = content.replace('background: #eef;', 'background: rgba(37, 99, 235, 0.1);')

# Inject custom scrollbar CSS inside the static styles block
custom_scrollbar = """
            /* Custom Scrollbar from User Request */
            ::-webkit-scrollbar {
                width: 14px;
                height: 14px;
            }
            ::-webkit-scrollbar-track {
                background: #f3f3f3;
                border-left: 1px solid #e5e5e5;
            }
            ::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 10px;
                border: 3px solid #f3f3f3; /* Creates padding around the thumb */
            }
            ::-webkit-scrollbar-thumb:hover {
                background: #a8a8a8;
            }
            ::-webkit-scrollbar-button:single-button {
                background-color: #f3f3f3;
                display: block;
                height: 14px;
                width: 14px;
                border-left: 1px solid #e5e5e5;
            }
            ::-webkit-scrollbar-button:single-button:vertical:decrement {
                /* Up arrow */
                background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a1a1a1'><path d='M7 14l5-5 5 5z'/></svg>");
                background-size: 12px;
                background-position: center;
                background-repeat: no-repeat;
            }
            ::-webkit-scrollbar-button:single-button:vertical:increment {
                /* Down arrow */
                background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a1a1a1'><path d='M7 10l5 5 5-5z'/></svg>");
                background-size: 12px;
                background-position: center;
                background-repeat: no-repeat;
            }
"""

content = content.replace('css`\n            .scheduler-container {', 'css`\n' + custom_scrollbar + '\n            .scheduler-container {')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
