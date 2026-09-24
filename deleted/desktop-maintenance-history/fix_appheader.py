import sys, re

file_path = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\AppHeader.js'
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

# Make the header very thin
code = code.replace("var(--header-padding)", "4px 8px")

# Add Hide everywhere, not just in assistant view. Let's just rewrite the render function header actions block.
# Actually, the user wants: 2% icons. So instead of a text "Hide", it should be an icon.
hide_btn_regex = r"<button @click=\$\{this\.onHideToggleClick\} class=\"button\">\s*Hide&nbsp;&nbsp;.*?&bsol;</span>\s*</button>"
hide_btn_replacement = r'''<button @click= class="icon-button" title="Hide">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                              </button>'''
code = re.sub(hide_btn_regex, hide_btn_replacement, code, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)
