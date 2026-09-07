const fs = require('fs');
const path = 'C:\\Users\\akula\\Downloads\\Hide-WIN\\Hide-Win-Master\\src\\components\\views\\InviteView.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Inject state tracking
if (!content.includes('this.activeControllerId =')) {
    content = content.replace('this.participants = [{', "this.activeControllerId = 'host';\n        this.controlRequests = new Set();\n        this.participants = [{");
}

// 2. Add grantControl method
const grantControlCode = `
    grantControl(guestId) {
        if (this.activeControllerId !== 'host' && this.activeControllerId !== guestId) {
            const oldDc = this.dataChannels.get(this.activeControllerId);
            if (oldDc && oldDc.events && oldDc.events.readyState === 'open') {
                oldDc.events.send(JSON.stringify({ type: 'control_revoked' }));
            }
        }
        this.activeControllerId = guestId;
        this.controlRequests.delete(guestId);
        
        const newDc = this.dataChannels.get(guestId);
        if (newDc && newDc.events && newDc.events.readyState === 'open') {
            newDc.events.send(JSON.stringify({ type: 'control_granted' }));
        }
        this.requestUpdate();
    }
    
    acceptParticipant(id) {`;

if (!content.includes('grantControl(guestId)')) {
    content = content.replace('acceptParticipant(id) {', grantControlCode);
}

// 3. Inject Gatekeeper logic in handleMessage
const handleMessageFind = /const handleMessage = async \(event\) => \{[\s\S]*?try \{[\s\S]*?const data = JSON\.parse\(event\.data\);/;
const handleMessageReplace = `const handleMessage = async (event) => {
                try {
                    const data = JSON.parse(event.data);
                    
                    if (data.type === 'request_control') {
                        this.controlRequests.add(guestId);
                        new Notification("Hide-WIN", { body: "?? Request for remote control" });
                        this.requestUpdate();
                        return;
                    }
                    if (data.type === 'release_control') {
                        if (this.activeControllerId === guestId) {
                            this.activeControllerId = 'host';
                            new Notification("Hide-WIN", { body: "?? Remote control released" });
                            this.requestUpdate();
                        }
                        return;
                    }
                    if (['mousemove', 'mousedown', 'mouseup', 'click', 'keydown', 'keyup'].includes(data.type)) {
                        if (this.activeControllerId !== guestId) return; // Mutex Gatekeeper
                    }`;

if (content.includes('const handleMessage = async (event) => {')) {
    content = content.replace(handleMessageFind, handleMessageReplace);
}

// 4. Update the render participant list UI
const renderFind = /<span class="participant-role">.*?<\/span>/;
const renderReplace = `<span class="participant-role"> \${p.role}</span>
                                              \${this.activeControllerId === p.id ? html\`<span title="Has Control">??</span>\` : ''}
                                              \${this.controlRequests.has(p.id) && this.activeControllerId !== p.id ? html\`
                                                  <button style="background:none;border:none;cursor:pointer;font-size:12px;" title="Grant Control" @click=\${() => this.grantControl(p.id)}>??</button>
                                              \` : ''}`;

if (!content.includes('grantControl(p.id)')) {
    content = content.replace(renderFind, renderReplace);
}

fs.writeFileSync(path, content);
console.log("Patched InviteView.js with Mutex Logic.");
