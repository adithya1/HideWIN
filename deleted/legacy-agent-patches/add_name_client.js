const fs = require('fs');
const p = 'C:\\Users\\akula\\Downloads\\Hide-WIN - Copy\\whisper-server\\client\\index.html';
let text = fs.readFileSync(p, 'utf8');

if (!text.includes('id="participant-name"')) {
    text = text.replace(
        `<input type="text" id="channel-id"`, 
        `<input type="text" id="participant-name" placeholder="Your Name">\n        <input type="text" id="channel-id"`
    );
    
    text = text.replace(
        `const channelInput = document.getElementById('channel-id');`,
        `const nameInput = document.getElementById('participant-name');\n        const channelInput = document.getElementById('channel-id');`
    );
    
    text = text.replace(
        `const channel = channelInput.value.trim();\n            const token = tokenInput.value.trim();\n            if(!channel || !token) return alert('Enter channel and token');`,
        `const name = nameInput.value.trim();\n            const channel = channelInput.value.trim();\n            const token = tokenInput.value.trim();\n            if(!name || !channel || !token) return alert('Enter your name, channel ID, and token');`
    );
    
    text = text.replace(
        `ws = new WebSocket(\`ws://\${location.host}/ws/signaling/join/\${channel}/\${token}\`);`,
        `ws = new WebSocket(\`ws://\${location.host}/ws/signaling/join/\${channel}/\${token}/\${encodeURIComponent(name)}\`);`
    );
    
    fs.writeFileSync(p, text, 'utf8');
    console.log("Updated client index.html to require Name");
}
