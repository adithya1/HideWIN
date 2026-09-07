import sys
import re

live_js = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js"
bkp_js = r"C:\Users\akula\Downloads\HW-BKP\Hide-Win-Master - Copy 12 - aug - 2026\src\utils\window.js"

with open(bkp_js, 'r', encoding='utf-8') as f:
    bkp_text = f.read()

with open(live_js, 'r', encoding='utf-8') as f:
    live_text = f.read()

# 1. Replace Alt+M with Ctrl+Alt+M
live_text = live_text.replace("toggleMouseVisibility: isMac ? 'Cmd+Alt+M' : 'Alt+M',", "toggleMouseVisibility: isMac ? 'Cmd+Alt+M' : 'Ctrl+Alt+M',")
print("Replaced shortcut")

# 2. Extract startStealthMode and stopStealthMode from bkp_text
m_bkp = re.search(r'(const startStealthMode = \(\) => \{.*?const stopStealthMode = \(\) => \{.*?console\.log\([^)]+\);\n\s*\};)', bkp_text, re.DOTALL)
if not m_bkp:
    print("Failed to find start/stop stealth in bkp")
    sys.exit(1)
bkp_stealth = m_bkp.group(1)

# 3. Extract startStealthMode and stopStealthMode from live_text
m_live = re.search(r'(const startStealthMode = \(\) => \{.*?const stopStealthMode = \(\) => \{.*?console\.log\([^)]+\);\n\s*\};)', live_text, re.DOTALL)
if not m_live:
    print("Failed to find start/stop stealth in live")
    sys.exit(1)
live_stealth = m_live.group(1)

# 4. Replace
live_text = live_text.replace(live_stealth, bkp_stealth)

# 5. Extract toggleMouseVisibility registration from bkp
m_bkp_reg = re.search(r'(if \(keybinds\.toggleMouseVisibility\) \{.*?console\.log\(`Stealth mode: \$\{stealthActive \? \'ON\' : \'OFF\'\}`\);\n\s*\}\);\n.*?\}\n\s*\})', bkp_text, re.DOTALL)
if not m_bkp_reg:
    print("Failed to find toggleMouseVisibility registration in bkp")
    sys.exit(1)
bkp_reg = m_bkp_reg.group(1)

# 6. Extract toggleMouseVisibility registration from live
# In live, it's longer
m_live_reg = re.search(r'(if \(keybinds\.toggleMouseVisibility\) \{.*?console\.error\(`Failed to register toggleMouseVisibility.*?\n\s*\})', live_text, re.DOTALL)
if not m_live_reg:
    print("Failed to find toggleMouseVisibility registration in live")
    sys.exit(1)
live_reg = m_live_reg.group(1)

# 7. Replace
live_text = live_text.replace(live_reg, bkp_reg)

with open(live_js, 'w', encoding='utf-8') as f:
    f.write(live_text)

print("Successfully replaced red arrow functionality with Aug 12 backup!")
