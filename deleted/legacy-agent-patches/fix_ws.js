const fs = require('fs');
const path = 'C:\\Users\\akula\\Downloads\\Hide-WIN - Copy\\hidewin-fastapi\\invite_client\\index.html';
let content = fs.readFileSync(path, 'utf8');

content = content.replace("ws = new WebSocket(ws:///ws/signaling/join///);", "ws = new WebSocket(`ws://${location.host}/ws/signaling/join/${channel}/${passcode}/${encodeURIComponent(name)}`);");

fs.writeFileSync(path, content);
console.log("Fixed websocket interpolation bug in index.html");
