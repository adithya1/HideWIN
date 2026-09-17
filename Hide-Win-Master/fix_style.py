import re

file_path = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

start_idx = code.find('<style>')
end_idx = code.find('</style>') + 8

new_style = """<style>
            /* Make the electron app behave like a native draggable widget */
            .app-header {
                -webkit-app-region: drag;
            }
            body, html, * {
                -webkit-app-region: no-drag;
            }
            
            :root {
                color-scheme: light;
                --bg-app: #ffffff;
                --bg-surface: #f3f4f6;
                --bg-elevated: #ffffff;
                --bg-hover: #e5e7eb;
                --text-primary: #111827;
                --text-secondary: #4b5563;
                --text-muted: #9ca3af;
                --border: #e5e7eb;
                --border-strong: #d1d5db;
                --accent: #2563eb;
                --accent-hover: #1d4ed8;
                --success: #16a34a;
                --warning: #ca8a04;
                --danger: #dc2626;
                --font: 'Segoe UI', Inter, -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
            }
            
            html.is-session, html.session-hidden {
                background-color: transparent !important;
                backdrop-filter: none !important;
            }
            html.is-session body, body.session-hidden {
                overflow-x: hidden;
                background-color: transparent !important;
                backdrop-filter: none !important;
                box-shadow: none !important;
                border: none !important;
            }
            body {
                overflow-x: hidden;
                background-color: var(--bg-app);
                margin: 0;
                overflow: hidden;
            }
            ::-webkit-scrollbar {
                width: 4px;
                height: 4px;
            }
            ::-webkit-scrollbar-track {
                background: transparent;
            }
            ::-webkit-scrollbar-thumb {
                background: rgba(150, 150, 150, 0.3);
                border-radius: 10px;
            }
            ::-webkit-scrollbar-thumb:hover {
                background: rgba(150, 150, 150, 0.6);
            }
            ::-webkit-scrollbar-corner {
                background: transparent;
            }
        </style>"""

code = code[:start_idx] + new_style + code[end_idx:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS")
