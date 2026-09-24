import re

# Fix HideWinAppRenderers.js
path_renderers = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinAppRenderers.js'
with open(path_renderers, 'r', encoding='utf-8') as f:
    code = f.read()

# Remove the isLiveMode check in renderLiveBar
code = code.replace('if (!this._isLiveMode()) return \'\';', '')
with open(path_renderers, 'w', encoding='utf-8') as f:
    f.write(code)

# Fix HideWinApp.js
path_app = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js'
with open(path_app, 'r', encoding='utf-8') as f:
    code = f.read()

# Replace the render() function to remove top-drag-bar and unconditionally show live bar at the top
render_start = code.find('return html')
# The top-drag-bar block is quite long. Let's find it.
top_drag_bar_start = code.find('<div class="top-drag-bar')
top_drag_bar_end = code.find('<!-- Center: Window Controls -->')
top_drag_bar_end = code.find('</div>', code.find('</button>', top_drag_bar_end)) + 6
# Actually wait, there are nested divs. 
# It's much safer to replace it via regex or just exact string match if possible.
