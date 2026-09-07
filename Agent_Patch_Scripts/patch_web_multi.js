const fs = require('fs');
const path = 'C:\\Users\\akula\\Downloads\\Hide-WIN - Copy\\hidewin-fastapi\\invite_client\\index.html';
let content = fs.readFileSync(path, 'utf8');

const regex = /peerConnection\.ondatachannel = \(e\) => \{[\s\S]*?\};/;
const newDc = `
            peerConnection.ondatachannel = (e) => {
                if (e.channel.label === "mouse-move") dataChannels.mouse = e.channel;
                if (e.channel.label === "events") dataChannels.events = e.channel;
            };
`;
content = content.replace(regex, newDc.trim());

// Change `let dataChannel;` to `let dataChannels = { mouse: null, events: null };`
content = content.replace('let dataChannel;', 'let dataChannels = { mouse: null, events: null };');

// Update sendControlEvent and throttling
const sendEventOld = /function sendControlEvent\(type, e, extra = \{\}\) \{[\s\S]*?dataChannel\.send\(JSON\.stringify\(payload\)\);\s*\}/;

const sendEventNew = `
        let lastMouseTime = 0;
        
        function sendControlEvent(type, e, extra = {}) {
            if (!isControlling && type !== 'screenshot_and_analyze') return;
            
            let targetChannel = (type === 'mousemove') ? dataChannels.mouse : dataChannels.events;
            if (!targetChannel || targetChannel.readyState !== 'open') return;
            
            // Throttle mousemove to ~60fps
            if (type === 'mousemove') {
                const now = performance.now();
                if (now - lastMouseTime < 16) return;
                lastMouseTime = now;
            }
            
            let payload = { type, ...extra };
            
            if (e && e.clientX !== undefined) {
                const video = document.getElementById('remote-video');
                const rect = video.getBoundingClientRect();
                const videoRatio = video.videoWidth / video.videoHeight;
                const elementRatio = rect.width / rect.height;
                
                let renderWidth = rect.width;
                let renderHeight = rect.height;
                let renderX = 0;
                let renderY = 0;
                
                if (elementRatio > videoRatio) {
                    renderWidth = rect.height * videoRatio;
                    renderX = (rect.width - renderWidth) / 2;
                } else {
                    renderHeight = rect.width / videoRatio;
                    renderY = (rect.height - renderHeight) / 2;
                }
                
                const clickX = e.clientX - rect.left - renderX;
                const clickY = e.clientY - rect.top - renderY;
                
                if (clickX < 0 || clickX > renderWidth || clickY < 0 || clickY > renderHeight) return;
                
                payload.x = clickX / renderWidth;
                payload.y = clickY / renderHeight;
            } else if (e && e.key) {
                payload.key = e.key;
            }
            
            targetChannel.send(JSON.stringify(payload));
        }
`;

content = content.replace(sendEventOld, sendEventNew.trim());
fs.writeFileSync(path, content);
console.log("Patched web client for multi-channel & throttling.");
