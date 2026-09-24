import os
import re

p = r"C:\Users\akula\Downloads\Hide-WIN - Copy\Hide-Win-Web\src\pages\Admin.jsx"

with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# 1. DESTROY all existing injected buttons
text = re.sub(r'<button[^>]*>\s*<Globe[^>]*>\s*DNS & Network\s*</button>', '', text)

# 2. DESTROY any empty lines left by the destruction
text = re.sub(r'\n\s*\n\s*</aside>', '\n        </aside>', text)

# 3. Carefully inject into the proper settings sidebar
btn = """
                <button className={`settings-nav-item ${activeSettingsTab === 'dns' ? 'active' : ''}`} onClick={() => setActiveSettingsTab('dns')}>
                  <Globe size={18} /> DNS & Network
                </button>"""
text = re.sub(r'(<button[^>]*>\s*<Network[^>]*>\s*Advanced Architecture\s*</button>)', r'\1' + btn, text)

with open(p, "w", encoding="utf-8") as f:
    f.write(text)

print("Brute-force fixed the layout!")
