const fs = require('fs');
const p = 'C:\\Users\\akula\\Downloads\\Hide-WIN\\Hide-Win-Master\\src\\admin.html';
let text = fs.readFileSync(p, 'utf8');

const dnsCard = `
                <div class="card" id="dns-config-card" style="margin-top: 20px;">
                    <div class="card-title">?? DNS & Network Configuration</div>
                    <div style="font-size:12px;color:var(--muted);margin-bottom:12px;">Configure local or remote server settings for WebRTC signaling and collaboration.</div>
                    
                    <div style="margin-bottom: 12px;">
                        <div class="card-title" style="font-size:12px;">Server IP Address</div>
                        <div class="input-group">
                            <input type="text" id="dns-ip2" placeholder="127.0.0.1">
                            <button class="btn btn-primary" onclick="saveDnsPref2('dnsIP')">Save</button>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 12px;">
                        <div class="card-title" style="font-size:12px;">Server Port</div>
                        <div class="input-group">
                            <input type="text" id="dns-port2" placeholder="8001">
                            <button class="btn btn-primary" onclick="saveDnsPref2('dnsPort')">Save</button>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 12px;">
                        <div class="card-title" style="font-size:12px;">Custom Domain (Future VPC/AWS)</div>
                        <div class="input-group">
                            <input type="text" id="dns-domain2" placeholder="hidewin.com">
                            <button class="btn btn-primary" onclick="saveDnsPref2('dnsDomain')">Save</button>
                        </div>
                    </div>
                </div>
`;

if (!text.includes('id="dns-config-card"')) {
    text = text.replace('<!-- Preferences -->\n            <div class="panel" id="panel-preferences">', '<!-- Preferences -->\n            <div class="panel" id="panel-preferences">\n' + dnsCard);
    
    // Add logic for these new inputs
    const logic = `
        async function saveDnsPref2(key) {
            let val;
            if (key === 'dnsIP') val = document.getElementById('dns-ip2').value.trim();
            if (key === 'dnsPort') val = document.getElementById('dns-port2').value.trim();
            if (key === 'dnsDomain') val = document.getElementById('dns-domain2').value.trim();
            await ipcRenderer.invoke('storage:update-preference', key, val);
            toast(key + ' saved successfully');
            loadDnsConfig(); // sync the other inputs
        }
`;
    text = text.replace('async function loadDnsConfig() {', logic + '\n        async function loadDnsConfig() {');
    
    // Sync the load
    const syncLoad = `
                const ipEl2 = document.getElementById('dns-ip2');
                if(ipEl2) ipEl2.value = prefsReq.data.dnsIP || '127.0.0.1';
                const portEl2 = document.getElementById('dns-port2');
                if(portEl2) portEl2.value = prefsReq.data.dnsPort || '8001';
                const domEl2 = document.getElementById('dns-domain2');
                if(domEl2) domEl2.value = prefsReq.data.dnsDomain || '';
    `;
    text = text.replace("document.getElementById('dns-domain').value = prefsReq.data.dnsDomain || '';", "document.getElementById('dns-domain').value = prefsReq.data.dnsDomain || '';\n" + syncLoad);
    
    fs.writeFileSync(p, text, 'utf8');
    console.log("Injected DNS directly into Preferences tab");
} else {
    console.log("Already there");
}
