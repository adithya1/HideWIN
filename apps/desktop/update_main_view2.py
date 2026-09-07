import re
with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MainView.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the Mouse Toggle container's inline style
old_mouse = r'<div class="mouse-toggle-container stealth-tooltip" data-tooltip="Stealth Mode" style="pointer-events: auto; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; padding: 0 8px; margin-right: 8px; width: 130px; max-width: 130px; flex-shrink: 0;" @click=\$\{\(\) => this\.onToggleClickThrough && this\.onToggleClickThrough\(\)\}>'
new_mouse = r'<div class="mouse-toggle-container stealth-tooltip action-mouse-toggle" data-tooltip="Stealth Mode" @click=${() => this.onToggleClickThrough && this.onToggleClickThrough()}>'
text = re.sub(old_mouse, new_mouse, text)

# Replace the Start Button container's inline style
old_start = r'<!-- Start/Active Buttons -->\s*<div style="display: flex; gap: 12px; margin-left: 12px;">'
new_start = r'<!-- Start/Active Buttons -->\n                    <div class="start-btn-container">'
text = re.sub(old_start, new_start, text)

# Update CSS for .action-mouse-toggle and .start-btn-container
css_inject = r"""
        .action-mouse-toggle {
            pointer-events: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            padding: 0 8px;
            margin-right: 8px;
            width: 130px;
            max-width: 130px;
            flex-shrink: 0;
        }
        .start-btn-container {
            display: flex;
            gap: 12px;
            margin-left: 12px;
            flex-shrink: 0;
        }

        @media (max-width: 768px) {
            .action-mouse-toggle {
                width: 100%;
                max-width: 100%;
                margin-right: 0;
                margin-top: 8px;
                margin-bottom: 8px;
            }
            .start-btn-container {
                margin-left: 0;
            }
        }
"""
text = text.replace('/* MainView Responsive Action Bar */', '/* MainView Responsive Action Bar */\n' + css_inject)

with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MainView.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed layout for MainView controls!")
