import re

# Update configManager.js
with open('src/utils/configManager.js', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("return config.appProtocol || 'huddlemate';", "return config.appProtocol || 'hidewin';")
with open('src/utils/configManager.js', 'w', encoding='utf-8') as f:
    f.write(content)

# Update admin.html to include App Protocol
with open('src/admin.html', 'r', encoding='utf-8') as f:
    content = f.read()

protocol_field = """
                    <div class="input-group">
                        <label>App Custom Protocol (e.g., hidewin)</label>
                        <input type="text" id="pref-protocol" placeholder="hidewin" />
                    </div>
"""
content = content.replace('<div class="input-group">\n                        <label>Deployment Strategy', protocol_field + '<div class="input-group">\n                        <label>Deployment Strategy')

# Update saveNetworkSettings
save_js = """
            const protocol = document.getElementById('pref-protocol').value.trim() || 'hidewin';
            
            await ipcRenderer.invoke('storage:set-config', {
                networkMode: isCloud ? 'cloud' : 'localhost',
                webDomain,
                apiDomain,
                appProtocol: protocol,
"""
content = re.sub(r'await ipcRenderer\.invoke\(\'storage:set-config\', \{[\s\n]*networkMode: isCloud \? \'cloud\' : \'localhost\',[\s\n]*webDomain,[\s\n]*apiDomain,', save_js, content)

# Update loadNetworkSettings
load_js = """
            document.getElementById('pref-webdomain').value = config.webDomain || 'localhost:5173';
            document.getElementById('pref-apidomain').value = config.apiDomain || 'localhost:8000';
            document.getElementById('pref-protocol').value = config.appProtocol || 'hidewin';
"""
content = re.sub(r"document\.getElementById\('pref-webdomain'\)\.value = config\.webDomain \|\| 'localhost:5173';[\s\n]*document\.getElementById\('pref-apidomain'\)\.value = config\.apiDomain \|\| 'localhost:8000';", load_js, content)

with open('src/admin.html', 'w', encoding='utf-8') as f:
    f.write(content)
