import re
path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add styles for .content and .content-inner right after .app-shell
new_css = """
        .app-shell {
            display: flex;
            flex-direction: column;
            height: 100%;
            overflow: hidden;
        }

        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            position: relative;
        }

        .content-inner {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            position: relative;
        }
"""

content = re.sub(r'\.app-shell\s*\{\s*display:\s*flex;\s*flex-direction:\s*column;\s*height:\s*100%;\s*overflow:\s*hidden;\s*\}', new_css.strip(), content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
