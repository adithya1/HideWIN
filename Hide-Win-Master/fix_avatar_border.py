import re

with open('src/components/app/HideWinApp.js', 'r', encoding='utf-8') as f:
    code = f.read()

old_html = """<div class="mobile-header-btn avatar-btn" style="border: 2px solid rgba(255,255,255,0.4); font-size: 12px; font-weight: bold;" @click=${() => this.navigate('ai-customize')}>"""
new_html = """<div class="mobile-header-btn avatar-btn" style="border: 1px solid var(--border); font-size: 12px; font-weight: 600; background: var(--bg-surface); color: var(--text-primary);" @click=${() => this.navigate('ai-customize')}>"""

if old_html in code:
    code = code.replace(old_html, new_html)
    print("Replaced HTML.")
else:
    print("Could not find old HTML.")

with open('src/components/app/HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(code)
