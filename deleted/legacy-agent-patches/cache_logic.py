import re

path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. We need to make sure keyupWindow and stealthCursorWindow are cached.
# Actually, stealthCursorWindow needs to be recreated because frozenX/Y changes?
# No, we can just update its position!
# Wait, in the original code, stealthCursorWindow is 100x100 and moves dynamically via IPC.
# `stealthCursorWindow.setBounds({ x: currentX - 50, y: currentY - 50, width: 100, height: 100 });`
# So recreating it is just what the original code did. Does the original code cause the loading cursor?
# "when user press on alt + m , with arrow loading symbol also showing , it's should not be like that"
# This means Alt+M is causing the loading symbol.
# In Alt+M, my patch DID NOT use keyupWindow!
# Look at my patch:
# `if (keybinds.momentaryStealth) { ... creates keyupWindow ... }`
# `if (keybinds.toggleMouseVisibility) { ... just calls startStealthMode() ... }`
# So Alt+M DOES NOT CREATE keyupWindow!
# Therefore, the loading symbol is caused by EITHER `new BrowserWindow` for stealthCursorWindow, OR `spawn(MouseBlocker.exe)`!

# To fix this, let's cache stealthCursorWindow!
