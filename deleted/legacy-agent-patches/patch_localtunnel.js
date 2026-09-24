const fs = require('fs');
const path = 'C:\\Users\\akula\\Downloads\\Hide-WIN\\Hide-Win-Master\\src\\components\\views\\InviteView.js';
let content = fs.readFileSync(path, 'utf8');

const regex1 = /const cloudHost = 'hidewin\.com:9000';/;
const replace1 = `const cloudHost = (this.dnsIP && this.dnsIP.includes('.loca.lt')) ? this.dnsIP : 'hidewin.com:9000';`;

const regex2 = /const cloudHost = '127\.0\.0\.1:9000';/;
const replace2 = `const cloudHost = (this.dnsIP && this.dnsIP.includes('.loca.lt')) ? this.dnsIP : '127.0.0.1:9000';`;

content = content.replace(regex1, replace1);
content = content.replace(regex2, replace2);

// Make sure https/wss is used if it's a loca.lt domain
const wsUrlRegex = /\`ws:\/\/\$\{cloudHost\}\/ws\/signaling\/host\/\$\{this\.activeChannelId\}\`/;
const newWsUrl = `cloudHost.includes('loca.lt') ? \`wss://\${cloudHost}/ws/signaling/host/\${this.activeChannelId}\` : \`ws://\${cloudHost}/ws/signaling/host/\${this.activeChannelId}\``;
content = content.replace(wsUrlRegex, newWsUrl);

const inviteUrlRegex = /\`http:\/\/\$\{cloudHost\}\/invite\/index\.html\?channel=\$\{this\.activeChannelId\}&passcode=\$\{this\.channelToken\}\`/;
const newInviteUrl = `cloudHost.includes('loca.lt') ? \`https://\${cloudHost}/invite/index.html?channel=\${this.activeChannelId}&passcode=\${this.channelToken}\` : \`http://\${cloudHost}/invite/index.html?channel=\${this.activeChannelId}&passcode=\${this.channelToken}\``;
content = content.replace(inviteUrlRegex, newInviteUrl);

fs.writeFileSync(path, content);
console.log("Patched InviteView to support localtunnel domains.");
