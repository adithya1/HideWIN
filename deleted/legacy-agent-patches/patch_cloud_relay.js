const fs = require('fs');
const path = 'C:\\Users\\akula\\Downloads\\Hide-WIN\\Hide-Win-Master\\src\\components\\views\\InviteView.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Change the websocket connection logic to point to the Cloud Relay
const oldWsConnect = /const localHost = `127\.0\.0\.1:\$\{this\.dnsPort\}`;[\s\S]*?this\.ws = new WebSocket\(`ws:\/\/\$\{localHost\}\/ws\/signaling\/host\/\$\{this\.activeChannelId\}`\);/;

const newWsConnect = `// Cloud Relay Outbound Tunnel (Zero Port Forwarding)
          // In production, this would be your VPC domain like 'hidewin.com'
          const cloudHost = '127.0.0.1:9000'; 
          
          this.ws = new WebSocket(\`ws://\${cloudHost}/ws/signaling/host/\${this.activeChannelId}\`);`;

if (content.match(oldWsConnect)) {
    content = content.replace(oldWsConnect, newWsConnect);
}

// 2. Add copyInviteLink method
const copyMethod = `
    copyInviteLink() {
        if (!this.activeChannelId || !this.channelToken) return;
        
        // Invite link now points securely to the Cloud Relay, hiding your PC's IP address!
        // For local simulation, we use 127.0.0.1:9000 (or localhost:9000). 
        // Note: To test from your mobile phone on the same WiFi, you would change 127.0.0.1 to the IP of the machine running the Cloud Relay, but the link structure itself is decoupled from your API backend!
        const cloudHost = '127.0.0.1:9000';
        const inviteLink = \`http://\${cloudHost}/invite/index.html?channel=\${this.activeChannelId}&passcode=\${this.channelToken}\`;
        
        navigator.clipboard.writeText(inviteLink).then(() => {
            new Notification('Hide-WIN', { body: 'Secure Cloud Invite Link copied to clipboard!' });
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    }

    firstUpdated() {`;

if (!content.includes('copyInviteLink() {')) {
    content = content.replace('firstUpdated() {', copyMethod);
}

// Wait, we need to capture `this.channelToken` when the channel is created!
const tokenFind = /if\(msg\.type === 'channel_created'\) \{[\s\S]*?this\.requestUpdate\(\);\s*\}/;
const tokenReplace = `if(msg.type === 'channel_created') {
                this.channelToken = msg.token;
                new Notification("Meeting Room", { body: "Channel activated securely via Cloud Relay" });
                this.requestUpdate();
            }`;

if (content.match(tokenFind) && !content.includes('this.channelToken = msg.token')) {
    content = content.replace(tokenFind, tokenReplace);
}

fs.writeFileSync(path, content);
console.log("Patched InviteView.js for Cloud Relay!");
