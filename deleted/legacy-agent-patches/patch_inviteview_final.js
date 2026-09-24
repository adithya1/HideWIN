const fs = require('fs');
const path = 'C:\\Users\\akula\\Downloads\\Hide-WIN\\Hide-Win-Master\\src\\components\\views\\InviteView.js';
let content = fs.readFileSync(path, 'utf8');

const target = `fetch('http://127.0.0.1:8000/api/user/remote-control', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    }).catch(err => console.error("RC Error:", err));`;

const replace = `fetch('http://127.0.0.1:8000/api/user/remote-control', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    })
                    .then(r => r.json())
                    .then(res => {
                        if (res.answer) {
                            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                                this.ws.send(JSON.stringify({ type: 'ai_answer', text: res.answer }));
                            }
                            new Notification('Hide-WIN AI Assistant', { body: res.answer });
                        }
                    })
                    .catch(err => console.error("RC Error:", err));`;

if (content.includes(target)) {
    content = content.replace(target, replace);
    fs.writeFileSync(path, content);
    console.log("Patched InviteView.js successfully.");
} else {
    console.log("Target not found. Doing fallback regex.");
    content = content.replace(/fetch\('http:\/\/127\.0\.0\.1:8000\/api\/user\/remote-control'[\s\S]*?catch\(err => console\.error\("RC Error:", err\)\);/, replace);
    fs.writeFileSync(path, content);
    console.log("Patched using Regex.");
}
