const fs = require('fs');
const path = require('path');
const p = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'components', 'views', 'InviteView.js');
let text = fs.readFileSync(p, 'utf8');

const regex = /createChannel\(\) \{.*?setTimeout\(\(\) => \{.*?\}\, 3000\);\s*\}/s;

const newLogic = `
    createChannel() {
        if (!this.channelName.trim()) this.channelName = 'Collaboration Session';
        this.activeChannelId = 'HW-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
        
        // Connect to local backend for testing
        this.ws = new WebSocket(\`ws://127.0.0.1:8001/ws/signaling/host/\${this.activeChannelId}\`);
        
        this.ws.onmessage = (e) => {
            const msg = JSON.parse(e.data);
            if(msg.type === 'channel_created') {
                this.hostToken = msg.token;
                this.requestUpdate();
            } else if(msg.type === 'participant_joined') {
                this.participants = [
                    ...this.participants,
                    { id: 'guest-' + Date.now(), name: msg.name || 'Guest', role: 'Waiting for approval', status: 'waiting' }
                ];
            } else if(msg.type === 'participant_left') {
                this.participants = this.participants.filter(p => p.id === 'me');
            } else if(msg.type === 'answer') {
                console.log('Received WebRTC answer');
            }
        };
    }

    copyInviteLink() {
        const link = \`http://127.0.0.1:8001/invite/index.html\`;
        const creds = \`Channel ID: \${this.activeChannelId}\\nToken: \${this.hostToken}\`;
        const text = \`Join my session:\\n\${link}\\n\\n\${creds}\`;
        
        if (window.require) {
            const { clipboard } = window.require('electron');
            clipboard.writeText(text);
        } else {
            navigator.clipboard.writeText(text);
        }
        alert('Invite link and credentials copied to clipboard!');
    }
`;

text = text.replace(regex, newLogic);
fs.writeFileSync(p, text, 'utf8');
console.log("Updated InviteView.js with WebSockets!");
