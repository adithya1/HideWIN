const fs = require('fs');
const path = require('path');
const p = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'admin.html');
let text = fs.readFileSync(p, 'utf8');

// 1. Add Nav Item
const navInjection = `<div class="nav-item" onclick="showPanel('dns', this)">?? DNS Settings</div>`;
if (!text.includes("showPanel('dns'")) {
    text = text.replace(`<div class="nav-section">Configuration</div>`, `<div class="nav-section">Configuration</div>\n            ${navInjection}`);
}

// 2. Add Panel Content
const panelInjection = `
            <!-- DNS Settings -->
            <div class="panel" id="panel-dns">
                <h2>?? DNS & Network Configuration</h2>
                <div class="subtitle">Configure local or remote server settings for WebRTC signaling and collaboration.</div>
                
                <div class="card">
                    <div class="card-title">Server IP Address</div>
                    <div style="font-size:12px;color:var(--muted);margin-bottom:12px;">The local network or public IP of your signaling server.</div>
                    <div class="input-group">
                        <input type="text" id="dns-ip" placeholder="127.0.0.1">
                        <button class="btn btn-primary" onclick="saveDnsPref('dnsIP')">Save</button>
                    </div>
                </div>

                <div class="card">
                    <div class="card-title">Server Port</div>
                    <div style="font-size:12px;color:var(--muted);margin-bottom:12px;">The port your signaling server runs on.</div>
                    <div class="input-group">
                        <input type="text" id="dns-port" placeholder="8001">
                        <button class="btn btn-primary" onclick="saveDnsPref('dnsPort')">Save</button>
                    </div>
                </div>

                <div class="card">
                    <div class="card-title">Custom Domain (Future VPC/AWS)</div>
                    <div style="font-size:12px;color:var(--muted);margin-bottom:12px;">Optional. If provided, the app will use this domain instead of the IP address (e.g. hidewin.com).</div>
                    <div class="input-group">
                        <input type="text" id="dns-domain" placeholder="hidewin.com">
                        <button class="btn btn-primary" onclick="saveDnsPref('dnsDomain')">Save</button>
                    </div>
                </div>
            </div>
`;

if (!text.includes('id="panel-dns"')) {
    text = text.replace(`<!-- Transcription -->`, `${panelInjection}\n            <!-- Transcription -->`);
}

// 3. Add load/save logic
const scriptInjection = `
        async function loadDnsConfig() {
            const prefsReq = await ipcRenderer.invoke('storage:get-preferences');
            if (prefsReq.success && prefsReq.data) {
                document.getElementById('dns-ip').value = prefsReq.data.dnsIP || '127.0.0.1';
                document.getElementById('dns-port').value = prefsReq.data.dnsPort || '8001';
                document.getElementById('dns-domain').value = prefsReq.data.dnsDomain || '';
            }
        }

        async function saveDnsPref(key) {
            let val;
            if (key === 'dnsIP') val = document.getElementById('dns-ip').value.trim();
            if (key === 'dnsPort') val = document.getElementById('dns-port').value.trim();
            if (key === 'dnsDomain') val = document.getElementById('dns-domain').value.trim();
            
            await ipcRenderer.invoke('storage:update-preference', key, val);
            toast(key + ' saved successfully');
        }
`;

if (!text.includes('function loadDnsConfig')) {
    text = text.replace(`async function loadSttConfig() {`, `${scriptInjection}\n        async function loadSttConfig() {`);
    text = text.replace(`loadSttConfig();`, `loadSttConfig();\n        loadDnsConfig();`);
}

fs.writeFileSync(p, text, 'utf8');
console.log("Updated admin.html with DNS settings");
