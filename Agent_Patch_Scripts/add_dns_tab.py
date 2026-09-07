import os
import re

p = r"C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\CustomizeView.js"

with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# 1. Add static properties
if "dnsDomain: { type: String }" not in text:
    text = text.replace("static properties = {", "static properties = {\n        dnsDomain: { type: String },\n        dnsIP: { type: String },\n        dnsPort: { type: String },")

# 2. Add to loadPreferences
if "this.dnsDomain = prefs.dnsDomain" not in text:
    text = text.replace("this.googleSearchEnabled = prefs.googleSearchEnabled ?? true;", "this.googleSearchEnabled = prefs.googleSearchEnabled ?? true;\n            this.dnsDomain = prefs.dnsDomain || '';\n            this.dnsIP = prefs.dnsIP || '127.0.0.1';\n            this.dnsPort = prefs.dnsPort || '8001';")

# 3. Add handleDNSUpdate method
if "handleDNSUpdate" not in text:
    handleDNSUpdate_code = """
    async handleDNSUpdate(field, value) {
        this[field] = value;
        try {
            await hideWin.storage.updatePreferences({
                dnsDomain: this.dnsDomain,
                dnsIP: this.dnsIP,
                dnsPort: this.dnsPort
            });
        } catch(e) {}
    }
    """
    text = text.replace("render() {", handleDNSUpdate_code + "\n    render() {")

# 4. Add Sidebar Tab
if "this.activeTab === 'dns'" not in text:
    tab_code = """
                        <div class="sidebar-item ${this.activeTab === 'dns' ? 'active' : ''}" @click=${() => this.activeTab = 'dns'}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
                            DNS & Network
                        </div>
"""
    text = text.replace("<div class=\"sidebar-item ${this.activeTab === 'billing' ? 'active' : ''}\" @click=${() => this.activeTab = 'billing'}>", tab_code + "\n                        <div class=\"sidebar-item ${this.activeTab === 'billing' ? 'active' : ''}\" @click=${() => this.activeTab = 'billing'}>")

# 5. Add renderDnsTab
if "renderDnsTab" not in text:
    renderDnsTab_code = """
    renderDnsTab() {
        from '../../assets/lit-core-2.7.4.min.js' import html; // dummy for syntax highlighting
        return this.html`
            <div class="settings-section fade-in">
                <div class="section-title">DNS & Network Configuration</div>
                <div class="section-desc">Configure local or remote server settings for WebRTC signaling and collaboration.</div>
                
                <div class="setting-row">
                    <div class="setting-info">
                        <div class="setting-name">Server IP Address</div>
                        <div class="setting-desc">The local network or public IP of your signaling server.</div>
                    </div>
                    <div class="setting-control">
                        <input type="text" class="text-input" style="width: 200px" 
                            .value=${this.dnsIP || '127.0.0.1'} 
                            @input=${e => this.handleDNSUpdate('dnsIP', e.target.value)} 
                            placeholder="e.g. 192.168.1.25">
                    </div>
                </div>

                <div class="setting-row">
                    <div class="setting-info">
                        <div class="setting-name">Server Port</div>
                        <div class="setting-desc">The port your signaling server runs on.</div>
                    </div>
                    <div class="setting-control">
                        <input type="text" class="text-input" style="width: 200px" 
                            .value=${this.dnsPort || '8001'} 
                            @input=${e => this.handleDNSUpdate('dnsPort', e.target.value)} 
                            placeholder="e.g. 8001">
                    </div>
                </div>

                <div class="setting-row">
                    <div class="setting-info">
                        <div class="setting-name">Custom Domain (Future VPC/AWS)</div>
                        <div class="setting-desc">Optional. If provided, the app will use this domain instead of the IP address (e.g. hidewin.com).</div>
                    </div>
                    <div class="setting-control">
                        <input type="text" class="text-input" style="width: 200px" 
                            .value=${this.dnsDomain || ''} 
                            @input=${e => this.handleDNSUpdate('dnsDomain', e.target.value)} 
                            placeholder="e.g. hidewin.com">
                    </div>
                </div>
            </div>
        `.replace("this.html", "html");
    }
"""
    # Replace dummy literal construction using a simpler trick to avoid powershell interpolation issues
    renderDnsTab_code = renderDnsTab_code.replace("this.html", "html").replace("from '../../assets/lit-core-2.7.4.min.js' import html; // dummy for syntax highlighting", "")
    text = text.replace("    render() {", renderDnsTab_code + "\n    render() {")

# 6. Call renderDnsTab in render() switch
if "${this.activeTab === 'dns'" not in text:
    text = text.replace("${this.activeTab === 'billing' ? this.renderBillingTab() : ''}", "${this.activeTab === 'dns' ? this.renderDnsTab() : ''}\n                    ${this.activeTab === 'billing' ? this.renderBillingTab() : ''}")

with open(p, "w", encoding="utf-8") as f:
    f.write(text)
print("Updated CustomizeView.js with DNS tab")
