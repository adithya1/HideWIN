const fs = require('fs');
const path = 'C:\\Users\\akula\\Downloads\\Hide-WIN\\Hide-Win-Master\\src\\components\\views\\InviteView.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Add Microphone Capture
const micLogic = `
            this.localStream = await navigator.mediaDevices.getDisplayMedia({
                video: { cursor: "always" },
                audio: true
            });
            
            if (this.sharingOptions.mic) {
                try {
                    const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    micStream.getAudioTracks().forEach(track => this.localStream.addTrack(track));
                } catch (e) {
                    console.warn("Microphone access denied or unavailable.");
                }
            }
`;
content = content.replace(/this\.localStream = await navigator\.mediaDevices\.getDisplayMedia\(\{[\s\S]*?audio: true\s*\}\);/, micLogic.trim());

// 2. Handle AI Response from remote-control fetch
const fetchLogicOld = `
                    fetch('http://127.0.0.1:8000/api/user/remote-control', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    }).catch(err => console.error("RC Error:", err));
`;
const fetchLogicNew = `
                    fetch('http://127.0.0.1:8000/api/user/remote-control', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    })
                    .then(r => r.json())
                    .then(res => {
                        if (res.answer) {
                            this.ws.send(JSON.stringify({ type: 'ai_answer', text: res.answer }));
                        }
                    })
                    .catch(err => console.error("RC Error:", err));
`;
content = content.replace(fetchLogicOld.trim(), fetchLogicNew.trim());

fs.writeFileSync(path, content);
console.log("Patched InviteView.js");
