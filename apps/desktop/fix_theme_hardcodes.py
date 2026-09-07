import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace hardcoded light/dark values for inputs
old_input_css = """        input, select, textarea {
            background: rgba(255, 255, 255, 0.04);
            color: var(--text-primary);
            border: 1px solid rgba(255, 255, 255, 0.08);"""
new_input_css = """        input, select, textarea {
            background: var(--bg-surface, rgba(0, 0, 0, 0.04));
            color: var(--text-primary);
            border: 1px solid var(--border);"""
code = code.replace(old_input_css, new_input_css)

old_input_hover = """        input:hover:not(:focus), select:hover:not(:focus), textarea:hover:not(:focus) {
            border-color: rgba(255, 255, 255, 0.15);
            background: rgba(255, 255, 255, 0.06);
        }"""
new_input_hover = """        input:hover:not(:focus), select:hover:not(:focus), textarea:hover:not(:focus) {
            border-color: var(--accent);
            background: var(--bg-surface, rgba(0, 0, 0, 0.06));
        }"""
code = code.replace(old_input_hover, new_input_hover)

old_input_focus = """            border-color: rgba(99, 102, 241, 0.5);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15), inset 0 1px 2px rgba(0, 0, 0, 0.2);
            background: rgba(255, 255, 255, 0.08);"""
new_input_focus = """            border-color: var(--accent, rgba(99, 102, 241, 0.5));
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15), inset 0 1px 2px rgba(0, 0, 0, 0.2);
            background: var(--bg-surface, rgba(0, 0, 0, 0.08));"""
code = code.replace(old_input_focus, new_input_focus)

old_input_placeholder = """        input::placeholder, textarea::placeholder {
            color: rgba(255, 255, 255, 0.3);
        }"""
new_input_placeholder = """        input::placeholder, textarea::placeholder {
            color: var(--text-muted);
        }"""
code = code.replace(old_input_placeholder, new_input_placeholder)

old_mode_pill_hover = """            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.05);"""
new_mode_pill_hover = """            background: var(--bg-surface, rgba(0,0,0,0.05));
            border: 1px solid var(--border);"""
code = code.replace(old_mode_pill_hover, new_mode_pill_hover)

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Fixed theme hardcodes in MainView.js")
