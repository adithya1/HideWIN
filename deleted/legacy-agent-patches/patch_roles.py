import os
path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. State vars
if "this.currentHostId =" not in content:
    content = content.replace("this.activeControllerId = 'host';", "this.activeControllerId = 'host';\n        this.currentHostId = 'local';\n        this.activeSpeakers = new Set();\n        this.roleRequests = [];")

# 2. Grant Role Logic
grant_role_code = """
    grantRole(guestId, role) {
        const dcs = this.dataChannels.get(guestId);
        if (!dcs || !dcs.events) return;
        
        if (role === 'mouse') {
            if (this.activeControllerId !== 'host' && this.activeControllerId !== guestId) {
                const oldDc = this.dataChannels.get(this.activeControllerId);
                if (oldDc && oldDc.events) oldDc.events.send(JSON.stringify({ type: 'role_revoked', role: 'mouse' }));
            }
            this.activeControllerId = guestId;
            dcs.events.send(JSON.stringify({ type: 'role_granted', role: 'mouse' }));
        }
        else if (role === 'mic') {
            this.activeSpeakers.add(guestId);
            dcs.events.send(JSON.stringify({ type: 'role_granted', role: 'mic' }));
        }
        else if (role === 'host') {
            if (this.currentHostId !== 'local' && this.currentHostId !== guestId) {
                const oldDc = this.dataChannels.get(this.currentHostId);
                if (oldDc && oldDc.events) oldDc.events.send(JSON.stringify({ type: 'role_revoked', role: 'host' }));
            }
            this.currentHostId = guestId;
            dcs.events.send(JSON.stringify({ type: 'role_granted', role: 'host' }));
        }
        
        // Remove from roleRequests
        this.roleRequests = this.roleRequests.filter(req => !(req.guestId === guestId && req.role === role));
        this.requestUpdate();
    }
    
    grantControl(guestId) {"""
if "grantRole(guestId, role)" not in content:
    content = content.replace("grantControl(guestId) {", grant_role_code)

# 3. Handle Message Gatekeeper Updates
# We need to replace the old request_control logic with request_role logic
import re
new_handle_msg = """const handleMessage = async (event) => {
                try {
                    const data = JSON.parse(event.data);
                    
                    if (data.type === 'request_role') {
                        if (this.currentHostId === 'local') {
                            this.roleRequests.push({ guestId, role: data.role });
                            new Notification("Hide-WIN", { body: `?? Request for ${data.role} access` });
                            this.requestUpdate();
                        } else {
                            const hostDc = this.dataChannels.get(this.currentHostId);
                            if (hostDc && hostDc.events) {
                                hostDc.events.send(JSON.stringify({ type: 'forwarded_request', guestId, role: data.role }));
                            }
                        }
                        return;
                    }
                    if (data.type === 'approve_role' && guestId === this.currentHostId) {
                        this.grantRole(data.guestId, data.role);
                        return;
                    }
                    if (data.type === 'release_control') {
                        if (this.activeControllerId === guestId) {
                            this.activeControllerId = 'host';
                            this.requestUpdate();
                        }
                        return;
                    }
                    if (data.type === 'transcript') {
                        if (!this.activeSpeakers.has(guestId)) return; // Mute enforcement
                    }
                    if (['mousemove', 'mousedown', 'mouseup', 'click', 'keydown', 'keyup'].includes(data.type)) {
                        if (this.activeControllerId !== guestId) return; // Mutex Gatekeeper
                    }"""
content = re.sub(r'const handleMessage = async \(event\) => \{[\s\S]*?if \(\[\'mousemove\', \'mousedown\', \'mouseup\', \'click\', \'keydown\', \'keyup\'\]\.includes\(data\.type\)\) \{[\s\S]*?\}', new_handle_msg, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("InviteView.js patched!")
