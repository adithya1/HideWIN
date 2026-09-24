import os

p = r"C:\Users\akula\Downloads\Hide-WIN - Copy\Hide-Win-Web\src\pages\Admin.jsx"

with open(p, "r", encoding="utf-8") as f:
    text = f.read()

target = """              <button className={`settings-nav-item ${activeSettingsTab === 'architecture' ? 'active' : ''}`} onClick={() => setActiveSettingsTab('architecture')}>
                <Network size={18} /> Advanced Architecture
              </button>
            </aside>"""

replacement = """              <button className={`settings-nav-item ${activeSettingsTab === 'architecture' ? 'active' : ''}`} onClick={() => setActiveSettingsTab('architecture')}>
                <Network size={18} /> Advanced Architecture
              </button>
              <button className={`settings-nav-item ${activeSettingsTab === 'dns' ? 'active' : ''}`} onClick={() => setActiveSettingsTab('dns')}>
                <Globe size={18} /> DNS & Network
              </button>
            </aside>"""

# Replace exact string
text = text.replace(target, replacement)
text = text.replace(target.replace('\r\n', '\n'), replacement.replace('\r\n', '\n'))
text = text.replace(target.replace('\n', '\r\n'), replacement.replace('\n', '\r\n'))

with open(p, "w", encoding="utf-8") as f:
    f.write(text)

print("Injected into Settings Sidebar!")
