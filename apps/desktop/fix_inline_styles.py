import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    code = f.read()

old_inline = """<div class="pinned-shortcuts-container" style="width: 100%; max-width: 100%; max-height: 270px; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, 100px); gap: 16px; margin-top: 8px; padding: 24px; border: 1px solid var(--border); border-radius: 16px; background: var(--bg-surface); box-shadow: 0 4px 20px rgba(0,0,0,0.05);">"""
new_inline = """<div class="pinned-shortcuts-container" style="width: 100%; max-width: 100%; display: grid; grid-template-columns: repeat(auto-fill, 100px); gap: 16px; margin-top: 8px; padding: 24px; border: 1px solid var(--border); border-radius: 16px; background: var(--bg-surface); box-shadow: 0 4px 20px rgba(0,0,0,0.05);">"""

if old_inline in code:
    code = code.replace(old_inline, new_inline)
    print("Replaced inline styles to remove internal scroll.")
else:
    print("Could not find inline style to replace.")

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(code)
