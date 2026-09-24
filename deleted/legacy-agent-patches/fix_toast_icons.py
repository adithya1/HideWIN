import os
p = r"C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# Replace the garbled emojis with nice inline SVGs
good_icons = "${this.toastType === 'success' ? html`<svg width='16' height='16' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24' style='vertical-align: text-bottom; margin-right: 6px;'><path d='M20 6L9 17l-5-5'></path></svg>` : html`<svg width='16' height='16' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24' style='vertical-align: text-bottom; margin-right: 6px;'><path d='M18 6L6 18M6 6l12 12'></path></svg>`}"

text = text.replace("${this.toastType === 'success' ? '?' : '?'} ", good_icons)

with open(p, "w", encoding="utf-8") as f:
    f.write(text)
print("Fixed garbled emojis with beautiful SVGs!")
