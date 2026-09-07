import os

p = r"C:\Users\akula\Downloads\Hide-WIN - Copy\Hide-Win-Web\src\pages\Admin.jsx"

with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# Just find the exact bad string and rip it out
bad_str = """
                  <button className={`settings-nav-item ${activeSettingsTab === 'dns' ? 'active' : ''}`} onClick={() => setActiveSettingsTab('dns')}>
                    <Globe size={18} /> DNS & Network
                  </button>
                </aside>
        
        <main className="main-content" style={{ overflowY: 'auto' }}>"""

good_str = """
                </aside>
        
        <main className="main-content" style={{ overflowY: 'auto' }}>"""

text = text.replace(bad_str, good_str)
text = text.replace(bad_str.replace('\r\n', '\n'), good_str.replace('\r\n', '\n'))
text = text.replace(bad_str.replace('\n', '\r\n'), good_str.replace('\n', '\r\n'))

good_injection = """
                <button className={`settings-nav-item ${activeSettingsTab === 'architecture' ? 'active' : ''}`} onClick={() => setActiveSettingsTab('architecture')}>
                  <Network size={18} /> Advanced Architecture
                </button>
                <button className={`settings-nav-item ${activeSettingsTab === 'dns' ? 'active' : ''}`} onClick={() => setActiveSettingsTab('dns')}>
                  <Globe size={18} /> DNS & Network
                </button>
              </aside>
"""

target = """
                <button className={`settings-nav-item ${activeSettingsTab === 'architecture' ? 'active' : ''}`} onClick={() => setActiveSettingsTab('architecture')}>
                  <Network size={18} /> Advanced Architecture
                </button>
              </aside>
"""

text = text.replace(target, good_injection)
text = text.replace(target.replace('\r\n', '\n'), good_injection.replace('\r\n', '\n'))

with open(p, "w", encoding="utf-8") as f:
    f.write(text)

print("Replaced string exactly!")
