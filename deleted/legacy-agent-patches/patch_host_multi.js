const fs = require('fs');
const path = 'C:\\Users\\akula\\Downloads\\Hide-WIN\\Hide-Win-Master\\src\\components\\views\\InviteView.js';
let content = fs.readFileSync(path, 'utf8');

const regexMap = [
    {
        find: /this\.peerConnection = null;/,
        replace: `this.peers = new Map();\n        this.dataChannels = new Map();`
    },
    {
        find: /if\(msg\.type === 'participant_joined'\) \{[\s\S]*?this\.requestUpdate\(\);\s*\}/,
        replace: `if(msg.type === 'participant_joined') {
                this.participants.push({ id: msg.guest_id, name: msg.name, role: 'Participant', status: 'waiting' });
                new Notification("Meeting Room", { body: msg.name + " is waiting to join. Click Accept in the participant list." });
                this.requestUpdate();
            }`
    },
    {
        find: /if\(msg\.type === 'answer'\) \{[\s\S]*?\}\s*else if\(msg\.type === 'candidate' \|\| msg\.type === 'ice_candidate'\) \{[\s\S]*?\}/,
        replace: `if(msg.type === 'answer') {
                const pc = this.peers.get(msg.source);
                if (pc) pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
            } else if(msg.type === 'candidate' || msg.type === 'ice_candidate') {
                const pc = this.peers.get(msg.source);
                if (pc) pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
            }`
    },
    {
        find: /if\(msg\.type === 'participant_left'\) \{[\s\S]*?this\.requestUpdate\(\);\s*\}/,
        replace: `if(msg.type === 'participant_left') {
                this.participants = this.participants.filter(p => p.id !== msg.guest_id);
                if (this.peers.has(msg.guest_id)) {
                    this.peers.get(msg.guest_id).close();
                    this.peers.delete(msg.guest_id);
                    this.dataChannels.delete(msg.guest_id);
                }
                this.requestUpdate();
            }`
    },
    {
        find: /acceptParticipant\(id\) \{[\s\S]*?\}\s*\}/,
        replace: `acceptParticipant(id) {
        if(id !== 'me') {
            this.participants = this.participants.map(p => p.id === id ? {...p, status: 'active'} : p);
            this.requestUpdate();
            this.startScreenShareForPeer(id);
        }
    }`
    }
];

regexMap.forEach(rule => {
    content = content.replace(rule.find, rule.replace);
});

// Rename and rewrite startScreenShare to startScreenShareForPeer
const startScreenShareRegex = /async startScreenShare\(\) \{[\s\S]*?const offer = await this\.peerConnection\.createOffer\(\);\s*await this\.peerConnection\.setLocalDescription\(offer\);\s*this\.ws\.send\(JSON\.stringify\(\{ type: 'offer', sdp: offer \}\)\);\s*\} catch\(err\) \{[\s\S]*?\}\s*\}/;

const newStartScreenShare = `async startScreenShareForPeer(guestId) {
        try {
            if (!this.localStream) {
                this.localStream = await navigator.mediaDevices.getDisplayMedia({ video: { cursor: "always" }, audio: true });
                if (this.sharingOptions.mic) {
                    try {
                        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                        micStream.getAudioTracks().forEach(track => this.localStream.addTrack(track));
                    } catch (e) {
                        console.warn("Microphone access denied.");
                    }
                }
                this.localStream.getVideoTracks()[0].onended = () => { this.stopSharing(); };
            }
            
            const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
            const pc = new RTCPeerConnection(configuration);
            this.peers.set(guestId, pc);
            
            this.localStream.getTracks().forEach(track => {
                pc.addTrack(track, this.localStream);
            });
            
            pc.onicecandidate = (e) => {
                if(e.candidate) this.ws.send(JSON.stringify({ type: 'candidate', candidate: e.candidate, target: guestId }));
            };
            
            // Phase 1 DataChannels: Split mouse and events
            const dcs = {
                mouse: pc.createDataChannel("mouse-move", { ordered: false, maxRetransmits: 0 }),
                events: pc.createDataChannel("events", { ordered: true })
            };
            this.dataChannels.set(guestId, dcs);
            
            const handleMessage = async (event) => {
                try {
                    const data = JSON.parse(event.data);
                    fetch('http://127.0.0.1:8000/api/user/remote-control', {
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
                    }).catch(e => {});
                } catch(e) {}
            };
            
            dcs.mouse.onmessage = handleMessage;
            dcs.events.onmessage = handleMessage;
            
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            
            this.ws.send(JSON.stringify({ type: 'offer', sdp: offer, target: guestId }));
            
        } catch(err) {
            console.error("Error capturing screen:", err);
            alert("Could not capture screen.");
        }
    }`;

content = content.replace(startScreenShareRegex, newStartScreenShare);
fs.writeFileSync(path, content);
console.log("Patched InviteView.js for Multi-User and Low Latency Channels.");
