const fs = require('fs');
const path = 'C:\\Users\\akula\\Downloads\\Hide-WIN - Copy\\hidewin-fastapi\\invite_client\\index.html';
let content = fs.readFileSync(path, 'utf8');

// 1. DataChannel onmessage handler to receive control_granted / control_revoked
const dcFind = /peerConnection\.ondatachannel = \(e\) => \{[\s\S]*?if \(e\.channel\.label === "events"\) dataChannels\.events = e\.channel;\s*\};/;
const dcReplace = `            peerConnection.ondatachannel = (e) => {
                if (e.channel.label === "mouse-move") dataChannels.mouse = e.channel;
                if (e.channel.label === "events") {
                    dataChannels.events = e.channel;
                    e.channel.onmessage = (event) => {
                        try {
                            const msg = JSON.parse(event.data);
                            if (msg.type === 'control_granted') {
                                isControlling = true;
                                document.getElementById('request-mouse').classList.add('active');
                            } else if (msg.type === 'control_revoked') {
                                isControlling = false;
                                document.getElementById('request-mouse').classList.remove('active');
                            }
                        } catch(err) {}
                    };
                }
            };`;
content = content.replace(dcFind, dcReplace);

// 2. Hotkeys and Request Logic
const hotkeysFind = /document\.getElementById\('request-mouse'\)\.onclick = function\(\) \{[\s\S]*?\};/;
const hotkeysReplace = `        document.getElementById('request-mouse').onclick = function() {
            if (isControlling) {
                if (dataChannels.events && dataChannels.events.readyState === 'open') {
                    dataChannels.events.send(JSON.stringify({ type: 'release_control' }));
                }
                isControlling = false;
                this.classList.remove('active');
            } else {
                if (dataChannels.events && dataChannels.events.readyState === 'open') {
                    dataChannels.events.send(JSON.stringify({ type: 'request_control' }));
                }
            }
        };

        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'p') {
                e.preventDefault();
                if (dataChannels.events && dataChannels.events.readyState === 'open') {
                    dataChannels.events.send(JSON.stringify({ type: 'request_control' }));
                }
                return;
            }
            if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'r') {
                e.preventDefault();
                if (dataChannels.events && dataChannels.events.readyState === 'open') {
                    dataChannels.events.send(JSON.stringify({ type: 'release_control' }));
                }
                isControlling = false;
                document.getElementById('request-mouse').classList.remove('active');
                return;
            }
            
            // Standard keydown forwarding
            if (isControlling) sendControlEvent('keydown', e);
        });
`;

// Remove the old window.addEventListener('keydown', ...); that was at the bottom
content = content.replace(/window\.addEventListener\('keydown', \(e\) => sendControlEvent\('keydown', e\)\);/, '');

content = content.replace(hotkeysFind, hotkeysReplace);

fs.writeFileSync(path, content);
console.log("Patched web client with Mutex Hotkeys.");
