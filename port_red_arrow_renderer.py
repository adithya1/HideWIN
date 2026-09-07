import sys
import re

live_js = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
bkp_js = r"C:\Users\akula\Downloads\HW-BKP\Hide-Win-Master - Copy 12 - aug - 2026\src\components\app\HideWinApp.js"

with open(bkp_js, 'r', encoding='utf-8') as f:
    bkp_text = f.read()

with open(live_js, 'r', encoding='utf-8') as f:
    live_text = f.read()

# Replace _boundStealthMove
m_bkp = re.search(r'(this\._boundStealthMove = \(_, pos\) => \{.*?\};\n\s*ipcRenderer\.on\(\'move-stealth-cursor\', this\._boundStealthMove\);)', bkp_text, re.DOTALL)
m_live = re.search(r'(this\._boundStealthMove = \(_, pos\) => \{.*?\};\n\s*ipcRenderer\.on\(\'move-stealth-cursor\', this\._boundStealthMove\);)', live_text, re.DOTALL)

if m_bkp and m_live:
    live_text = live_text.replace(m_live.group(1), m_bkp.group(1))
    print("Replaced _boundStealthMove!")

# Replace toggle-mouse-visibility handler
m_bkp2 = re.search(r'(ipcRenderer\.on\(\'toggle-mouse-visibility\', \(\) => \{.*?\n\s*\}\);)', bkp_text, re.DOTALL)
if m_bkp2 and 'toggle-mouse-visibility' not in live_text:
    # Just inject it after the move-stealth-cursor line
    live_text = live_text.replace("ipcRenderer.on('move-stealth-cursor', this._boundStealthMove);", "ipcRenderer.on('move-stealth-cursor', this._boundStealthMove);\n\n            " + m_bkp2.group(1))
    print("Added toggle-mouse-visibility handler!")

# Ensure <div class="fake-cursor"> is in the HTML
if 'class="fake-cursor"' not in live_text and "class='fake-cursor'" not in live_text:
    # Let's find where it is in the backup
    m_bkp3 = re.search(r'(<div class="fake-cursor".*?</div>)', bkp_text, re.DOTALL)
    if m_bkp3:
        live_text = live_text.replace("</main>", "</main>\n                " + m_bkp3.group(1))
        print("Added fake-cursor HTML!")

with open(live_js, 'w', encoding='utf-8') as f:
    f.write(live_text)

print("Done patching HideWinApp.js")
