import re

with open('src/components/app/HideWinApp.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Make sure app-shell-main doesn't overflow
old_css = """        @media (max-width: 768px) {
            .app-shell-main {
                display: flex !important;
                flex-direction: column !important;
            }"""
            
new_css = """        @media (max-width: 768px) {
            .app-shell-main {
                display: flex !important;
                flex-direction: column !important;
                width: 100vw !important;
                overflow-x: hidden !important;
            }"""
code = code.replace(old_css, new_css)

with open('src/components/app/HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(code)

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    code2 = f.read()

old_css2 = """        @media (max-width: 768px) {
            .home-container {
                padding: 0 !important;
                background: var(--bg-app) !important;
            }"""

new_css2 = """        @media (max-width: 768px) {
            .home-container {
                padding: 0 !important;
                background: var(--bg-app) !important;
                width: 100vw !important;
                overflow-x: hidden !important;
            }"""
code2 = code2.replace(old_css2, new_css2)

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(code2)

print("Fixed horizontal scroll.")
