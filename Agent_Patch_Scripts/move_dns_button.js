const fs = require('fs');
const p = 'C:\\Users\\akula\\Downloads\\Hide-WIN - Copy\\Hide-Win-Web\\src\\pages\\Admin.jsx';
let text = fs.readFileSync(p, 'utf8');

const sidebarBtn = `
                  <button className={\`settings-nav-item \${activeSettingsTab === 'dns' ? 'active' : ''}\`} onClick={() => setActiveSettingsTab('dns')}>
                    <Globe size={18} /> DNS & Network
                  </button>
                </aside>`;

// Remove the misplaced injection
text = text.replace(`
                  <button className={\`settings-nav-item \${activeSettingsTab === 'dns' ? 'active' : ''}\`} onClick={() => setActiveSettingsTab('dns')}>
                    <Globe size={18} /> DNS & Network
                  </button>
                </aside>`, `</aside>`);

// Re-inject it at the CORRECT location (the second <aside>, which has className="settings-sidebar")
text = text.replace(
    `<button className={\`settings-nav-item \${activeSettingsTab === 'architecture' ? 'active' : ''}\`} onClick={() => setActiveSettingsTab('architecture')}>
                  <Network size={18} /> Advanced Architecture
                </button>
              </aside>`,
    `<button className={\`settings-nav-item \${activeSettingsTab === 'architecture' ? 'active' : ''}\`} onClick={() => setActiveSettingsTab('architecture')}>
                  <Network size={18} /> Advanced Architecture
                </button>
                <button className={\`settings-nav-item \${activeSettingsTab === 'dns' ? 'active' : ''}\`} onClick={() => setActiveSettingsTab('dns')}>
                  <Globe size={18} /> DNS & Network
                </button>
              </aside>`
);

fs.writeFileSync(p, text, 'utf8');
console.log("Moved the DNS button to the correct Settings Sidebar!");
