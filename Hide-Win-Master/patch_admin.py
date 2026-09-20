import re

with open('src/admin.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add the Network settings card
network_card = """
                <div class="card">
                    <div class="card-title">Network & Deployment Settings</div>
                    <div class="input-group">
                        <label>Web App Domain (e.g., localhost:5173 or hidewin.com)</label>
                        <input type="text" id="pref-webdomain" placeholder="localhost:5173" />
                    </div>
                    <div class="input-group">
                        <label>Backend API Domain (e.g., localhost:8000 or api.hidewin.com)</label>
                        <input type="text" id="pref-apidomain" placeholder="localhost:8000" />
                    </div>
                    <div class="input-group">
                        <label>Deployment Strategy (Optional metadata)</label>
                        <select id="pref-deployment">
                            <option value="localhost">Localhost</option>
                            <option value="aws">AWS VPC</option>
                            <option value="digitalocean">DigitalOcean</option>
                            <option value="godaddy">GoDaddy VPS</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>Server IP Address</label>
                        <input type="text" id="pref-serverip" placeholder="192.168.1.x" />
                    </div>
                    <div class="input-group">
                        <label>Server Username</label>
                        <input type="text" id="pref-serveruser" placeholder="root" />
                    </div>
                    <div class="toggle-row" style="margin-top: 15px;">
                        <div>
                            <div class="toggle-label">Network Mode</div>
                            <div class="toggle-desc">Switch between Cloud (Domain) and Localhost</div>
                        </div>
                        <div class="toggle" id="pref-networkmode" onclick="toggleNetworkMode(this)">
                            <div class="knob"></div>
                        </div>
                    </div>
                    <button class="btn btn-primary" onclick="saveNetworkSettings()" style="margin-top: 10px;">Activate Domain</button>
                </div>
"""

content = content.replace('<div class="card">\n                    <div class="card-title">Danger Zone</div>', network_card + '\n                <div class="card">\n                    <div class="card-title">Danger Zone</div>')

# Add JS functions to handle loading and saving Network Settings
js_additions = """
        // Network Settings Handlers
        function toggleNetworkMode(el) {
            el.classList.toggle('on');
            saveNetworkSettings();
        }

        async function saveNetworkSettings() {
            const isCloud = document.getElementById('pref-networkmode').classList.contains('on');
            const webDomain = document.getElementById('pref-webdomain').value.trim() || 'localhost:5173';
            const apiDomain = document.getElementById('pref-apidomain').value.trim() || 'localhost:8000';
            const deployment = document.getElementById('pref-deployment').value;
            const ip = document.getElementById('pref-serverip').value;
            const username = document.getElementById('pref-serveruser').value;
            
            await window.electronAPI.setConfig({
                networkMode: isCloud ? 'cloud' : 'localhost',
                webDomain,
                apiDomain,
                deploymentStrategy: deployment,
                serverIp: ip,
                serverUser: username
            });
            showToast('Network configuration activated and saved!');
            
            // Trigger app reload or IPC broadcast if necessary
            // For now, the app components read directly from ConfigManager on next action.
        }

        async function loadNetworkSettings() {
            const configRes = await window.electronAPI.getConfig();
            const config = configRes.success ? configRes.data : {};
            
            if (config.networkMode === 'cloud') document.getElementById('pref-networkmode').classList.add('on');
            else document.getElementById('pref-networkmode').classList.remove('on');
            
            document.getElementById('pref-webdomain').value = config.webDomain || 'localhost:5173';
            document.getElementById('pref-apidomain').value = config.apiDomain || 'localhost:8000';
            document.getElementById('pref-deployment').value = config.deploymentStrategy || 'localhost';
            document.getElementById('pref-serverip').value = config.serverIp || '';
            document.getElementById('pref-serveruser').value = config.serverUser || '';
        }
"""

content = content.replace('async function loadPrefs() {', js_additions + '\n        async function loadPrefs() {')
content = content.replace('await loadPrefs();', 'await loadPrefs();\n            await loadNetworkSettings();')

with open('src/admin.html', 'w', encoding='utf-8') as f:
    f.write(content)
