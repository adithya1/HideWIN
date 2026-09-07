import re
with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Hide sidebar during active meeting
old_sidebar = """<div class="sidebar ${isLive ? 'hidden' : ''}">"""
new_sidebar = """<div class="sidebar ${isLive || this.currentView === 'active-meeting' ? 'hidden' : ''}" style="${this.currentView === 'active-meeting' ? 'display: none !important;' : ''}">"""
content = content.replace(old_sidebar, new_sidebar)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Made meeting room truly fullscreen by hiding sidebar")
