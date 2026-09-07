import re

path = 'src/admin.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

bad = """        :root[data-theme="light"], @media (prefers-color-scheme: light) {
            :root:not([data-theme="dark"]) {
                --bg: #F9FAFB;
                --surface: #FFFFFF;
                --elevated: #F3F4F6;
                --hover: #E5E7EB;
                --text: #111827;
                --muted: #6B7280;
                --dim: #9CA3AF;
                --border: #E5E7EB;
                --border-s: #D1D5DB;
            }
        }"""

good = """        :root[data-theme="light"] {
            --bg: #F9FAFB;
            --surface: #FFFFFF;
            --elevated: #F3F4F6;
            --hover: #E5E7EB;
            --text: #111827;
            --muted: #6B7280;
            --dim: #9CA3AF;
            --border: #E5E7EB;
            --border-s: #D1D5DB;
        }
        
        @media (prefers-color-scheme: light) {
            :root:not([data-theme="dark"]) {
                --bg: #F9FAFB;
                --surface: #FFFFFF;
                --elevated: #F3F4F6;
                --hover: #E5E7EB;
                --text: #111827;
                --muted: #6B7280;
                --dim: #9CA3AF;
                --border: #E5E7EB;
                --border-s: #D1D5DB;
            }
        }"""

content = content.replace(bad, good)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed CSS syntax")
