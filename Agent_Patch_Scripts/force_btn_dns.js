const fs = require('fs');
const p = 'C:\\Users\\akula\\Downloads\\Hide-WIN - Copy\\Hide-Win-Web\\src\\pages\\Admin.jsx';
let text = fs.readFileSync(p, 'utf8');

// Strip all misinjections of the button
text = text.replace(/<button[^>]*>\s*<Globe[^>]*>\s*DNS & Network\s*<\/button>/g, "");

// Re-inject the button perfectly after the Advanced Architecture button
const btnToInject = `
                <button className={\`settings-nav-item \${activeSettingsTab === 'dns' ? 'active' : ''}\`} onClick={() => setActiveSettingsTab('dns')}>
                  <Globe size={18} /> DNS & Network
                </button>`;

text = text.replace(/(<button[^>]*>\s*<Network[^>]*>\s*Advanced Architecture\s*<\/button>)/, "$1" + btnToInject);

fs.writeFileSync(p, text, 'utf8');
console.log("Successfully injected DNS button using regex capturing groups!");
