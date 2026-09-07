import re
path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

nav_item_css = """
        .nav-item {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            font-size: 13px;
            font-weight: 500;
            color: var(--text-primary);
            background: transparent;
            border: 1px solid transparent;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.15s ease-in-out;
            outline: none;
        }

        .nav-item:hover {
            background: rgba(0, 0, 0, 0.05);
            border-color: var(--border);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .nav-item.active {
            background: rgba(0, 0, 0, 0.08);
            font-weight: 600;
        }

        :host-context(html[data-theme='dark']) .nav-item:hover,
        html[data-theme='dark'] .nav-item:hover {
            background: rgba(255, 255, 255, 0.1);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        
        :host-context(html[data-theme='dark']) .nav-item.active,
        html[data-theme='dark'] .nav-item.active {
            background: rgba(255, 255, 255, 0.15);
        }
"""

# Insert the css immediately after .horizontal-nav::-webkit-scrollbar { ... }
# Or just before the end of the css literal.
# Let's search for .horizontal-nav {
m = re.search(r'\.horizontal-nav\s*\{[^}]*\}', content)
if m:
    content = content[:m.end()] + "\n" + nav_item_css + content[m.end():]
else:
    # fallback, inject before `\n    static properties` or `render()`
    content = content.replace("    render() {", nav_item_css + "\n    render() {")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
