import os

p = r"C:\Users\akula\Downloads\Hide-WIN - Copy\Hide-Win-Web\src\pages\Admin.jsx"

with open(p, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    # Skip lines 546-548 (which are indexes 545, 546, 547 in 0-indexed if we trust the exact line numbers)
    # Better to just use content matching
    if "activeSettingsTab === 'dns'" in line and "settings-nav-item" in line and i < 600:
        continue
    if "Globe size={18}" in line and i < 600:
        continue
    if "</button>" in line and i < 600 and "activeSettingsTab === 'dns'" in lines[i-2]:
        continue
    new_lines.append(line)

# Now inject right after Advanced Architecture
final_lines = []
for line in new_lines:
    final_lines.append(line)
    if "Advanced Architecture" in line and "Network size={18}" in line:
        # We found the button! 
        # Wait, the button ends on the NEXT line (`</button>`)
        pass
    if "</button>" in line and "Advanced Architecture" in new_lines[new_lines.index(line)-1]:
        # Inject here!
        final_lines.append("                <button className={`settings-nav-item ${activeSettingsTab === 'dns' ? 'active' : ''}`} onClick={() => setActiveSettingsTab('dns')}>\n")
        final_lines.append("                  <Globe size={18} /> DNS & Network\n")
        final_lines.append("                </button>\n")

with open(p, "w", encoding="utf-8") as f:
    f.writelines(final_lines)

print("Perfectly fixed!")
