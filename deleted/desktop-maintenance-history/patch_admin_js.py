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
            
            await ipcRenderer.invoke('storage:set-config', {
                networkMode: isCloud ? 'cloud' : 'localhost',
                webDomain,
                apiDomain,
                deploymentStrategy: deployment,
                serverIp: ip,
                serverUser: username
            });
            toast('Network configuration activated and saved!');
        }

        async function loadNetworkSettings() {
            const configRes = await ipcRenderer.invoke('storage:get-config');
            const config = configRes.success ? configRes.data : {};
            
            if (config.networkMode === 'cloud') document.getElementById('pref-networkmode').classList.add('on');
            else document.getElementById('pref-networkmode').classList.remove('on');
            
            document.getElementById('pref-webdomain').value = config.webDomain || 'localhost:5173';
            document.getElementById('pref-apidomain').value = config.apiDomain || 'localhost:8000';
            document.getElementById('pref-deployment').value = config.deploymentStrategy || 'localhost';
            document.getElementById('pref-serverip').value = config.serverIp || '';
            document.getElementById('pref-serveruser').value = config.serverUser || '';
        }
        
        loadNetworkSettings();
"""

with open('src/admin.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('checkStatus();\n        setInterval(checkStatus, 30000);', js_additions + '\n        checkStatus();\n        setInterval(checkStatus, 30000);')

with open('src/admin.html', 'w', encoding='utf-8') as f:
    f.write(content)
