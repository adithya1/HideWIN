import re
path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

custom_scrollbar = """            /* Custom Scrollbar */
            ::-webkit-scrollbar {
                width: 14px;
                height: 14px;
            }
            ::-webkit-scrollbar-track {
                background: transparent;
                border-left: 1px solid rgba(0,0,0,0.05);
            }
            ::-webkit-scrollbar-thumb {
                background-color: #c1c1c1;
                border-radius: 10px;
                border: 3px solid #ffffff;
            }
            ::-webkit-scrollbar-thumb:hover {
                background-color: #a8a8a8;
            }
            ::-webkit-scrollbar-button:single-button {
                background-color: transparent;
                display: block;
                height: 14px;
                width: 14px;
            }
            ::-webkit-scrollbar-button:single-button:vertical:decrement {
                background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a1a1a1'><path d='M7 14l5-5 5 5z'/></svg>");
                background-size: 12px;
                background-position: center;
                background-repeat: no-repeat;
            }
            ::-webkit-scrollbar-button:single-button:vertical:increment {
                background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a1a1a1'><path d='M7 10l5 5 5-5z'/></svg>");
                background-size: 12px;
                background-position: center;
                background-repeat: no-repeat;
            }
            
"""

# Find `css\`` and insert the scrollbar right after it
content = re.sub(r'css`', 'css`\n' + custom_scrollbar, content, count=1)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
