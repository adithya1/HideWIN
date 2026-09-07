import re

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the entire div block that contains the duplicate toggles in the grid-viewport
pattern = r'<div style="display:\s*flex;\s*justify-content:\s*flex-end;\s*margin-bottom:\s*16px;\s*gap:\s*8px;">.*?</div>\s*</div>\s*</div>'
# Wait, let's just strip everything from <div style="display: flex; justify-content: flex-end; margin-bottom: 16px; gap: 8px;"> up to the matching closing </div>
# The block has 3 divs total (1 wrapper, 2 buttons with SVGs inside but buttons close on the same line). Wait, buttons have <svg> inside.
# Better way: replace the exact text using flexible whitespace.
pattern2 = r'<div style="display:\s*flex;\s*justify-content:\s*flex-end;\s*margin-bottom:\s*16px;\s*gap:\s*8px;">.*?</button>\s*</div>'
content = re.sub(pattern2, '', content, flags=re.DOTALL)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed redundant toggle block")
