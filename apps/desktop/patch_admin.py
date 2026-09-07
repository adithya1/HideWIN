import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\admin.html"
with open(filepath, "r", encoding="utf-8") as f:
    html = f.read()

# Add nav item
nav_item_target = r'<div class="nav-item" onclick="showPanel\(\'api-keys\', this\)">🔑 API Keys</div>'
nav_item_replacement = r"""<div class="nav-item" onclick="showPanel('transcription', this)">🎙️ Live Transcription API</div>
            <div class="nav-item" onclick="showPanel('api-keys', this)">🔑 API Keys</div>"""

html = re.sub(nav_item_target, nav_item_replacement, html)

# Add panel
panel_target = r'<!-- API Keys -->'
panel_replacement = r"""<!-- Transcription -->
            <div class="panel" id="panel-transcription">
                <h2>🎙️ Live Transcription API</h2>
                <div class="subtitle">Secure Backend Configuration for Audio Routing</div>
                <div class="card">
                    <div class="card-title">Transcription Providers</div>
                    
                    <div class="form-group">
                        <label>Groq / Local Whisper Hybrid Mode</label>
                        <div class="key-row" style="margin-bottom:8px">
                            <input type="password" id="stt-groq-key" placeholder="Enter Groq Key..." />
                            <div class="toggle" id="stt-groq-toggle" onclick="this.classList.toggle('on');saveSttConfig('groq')"><div class="knob"></div></div>
                        </div>
                        <button class="btn btn-sm btn-primary" onclick="saveSttConfig('groq', true)">Set as Active Engine</button>
                    </div>
                    
                    <hr style="border:0; border-bottom:1px solid var(--border); margin:16px 0;">

                    <div class="form-group">
                        <label>Deepgram WebSocket API</label>
                        <div class="key-row" style="margin-bottom:8px">
                            <input type="password" id="stt-deepgram-key" placeholder="Enter Deepgram Key..." />
                            <div class="toggle" id="stt-deepgram-toggle" onclick="this.classList.toggle('on');saveSttConfig('deepgram')"><div class="knob"></div></div>
                        </div>
                        <button class="btn btn-sm btn-primary" onclick="saveSttConfig('deepgram', true)">Set as Active Engine</button>
                    </div>

                    <hr style="border:0; border-bottom:1px solid var(--border); margin:16px 0;">

                    <div class="form-group">
                        <label>Custom STT Endpoint (Hybrid / Advanced)</label>
                        <input type="text" id="stt-custom-url" placeholder="wss://your-custom-stt-endpoint..." style="margin-bottom:8px" />
                        <div class="key-row" style="margin-bottom:8px">
                            <input type="password" id="stt-custom-key" placeholder="Custom API Key (Optional)..." />
                            <div class="toggle" id="stt-custom-toggle" onclick="this.classList.toggle('on');saveSttConfig('custom')"><div class="knob"></div></div>
                        </div>
                        <button class="btn btn-sm btn-primary" onclick="saveSttConfig('custom', true)">Set as Active Engine</button>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-title">Security Status</div>
                    <p style="font-size:12px; color:var(--muted)">Keys are encrypted in the FastAPI SQLite DB and do not exist on the client machine. Audio is transmitted via Base64 JSON over WebSockets.</p>
                </div>
            </div>

            <!-- API Keys -->"""

html = re.sub(panel_target, panel_replacement, html)

# Add loadSttConfig script
script_target = r'loadKeys\(\);'
script_replacement = r"""loadKeys();
        loadSttConfig();
        
        async function loadSttConfig() {
            try {
                const res = await fetch('http://localhost:8000/api/stt/config');
                const data = await res.json();
                
                data.configs.forEach(c => {
                    const prefix = 'stt-' + c.provider_name + '-';
                    const keyEl = document.getElementById(prefix + 'key');
                    const toggleEl = document.getElementById(prefix + 'toggle');
                    
                    if (keyEl && c.api_key_masked) keyEl.value = c.api_key_masked;
                    if (toggleEl && c.is_enabled) toggleEl.classList.add('on');
                    
                    if (c.provider_name === 'custom' && c.custom_url) {
                        document.getElementById('stt-custom-url').value = c.custom_url;
                    }
                    
                    if (c.is_active) {
                        // Highlight active engine
                        keyEl.parentElement.parentElement.style.borderLeft = '3px solid var(--success)';
                        keyEl.parentElement.parentElement.style.paddingLeft = '10px';
                    }
                });
            } catch(e) { console.error('Failed to load STT configs', e); }
        }

        async function saveSttConfig(providerName, makeActive=false) {
            try {
                const prefix = 'stt-' + providerName + '-';
                const keyVal = document.getElementById(prefix + 'key').value;
                const isEnabled = document.getElementById(prefix + 'toggle').classList.contains('on');
                
                const payload = {
                    provider_name: providerName,
                    api_key_value: keyVal,
                    is_enabled: isEnabled,
                    is_active: makeActive
                };
                
                if (providerName === 'custom') {
                    payload.custom_url = document.getElementById('stt-custom-url').value;
                }
                
                await fetch('http://localhost:8000/api/stt/config', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(payload)
                });
                
                toast(providerName + ' STT config saved!');
                setTimeout(loadSttConfig, 500);
            } catch(e) {
                toast('Failed to save STT: ' + e.message, 'error');
            }
        }"""

html = re.sub(script_target, script_replacement, html)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(html)
print("Updated admin.html")
