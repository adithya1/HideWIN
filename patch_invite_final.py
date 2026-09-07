import re
with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add handleSignalingData and startScreenShareForPeer
new_methods = """
    async handleSignalingData(guestId, msg) {
        const pc = this.peers.get(guestId);
        if (!pc) return;
        try {
            if (msg.type === 'answer') {
                await pc.setRemoteDescription(new RTCSessionDescription(msg.answer));
            } else if (msg.type === 'candidate') {
                await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
            }
        } catch (e) {
            console.error('Error handling signaling data for', guestId, e);
        }
    }

    async startScreenShareForPeer(guestId) {
        if (!this.localStream) {
            try {
                this.localStream = await navigator.mediaDevices.getDisplayMedia({ video: { cursor: "always" }, audio: true });
                if (this.sharingOptions.mic) {
                    try {
                        const micStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
                        micStream.getAudioTracks().forEach(track => this.localStream.addTrack(track));
                    } catch (e) {
                        console.warn("Host microphone access denied or unavailable.");
                    }
                }
            } catch (e) {
                console.error("Failed to start screen share", e);
                return;
            }
        }

        const configuration = { 'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}] };
        const pc = new RTCPeerConnection(configuration);
        this.peers.set(guestId, pc);

        this.localStream.getTracks().forEach(track => pc.addTrack(track, this.localStream));

        pc.ontrack = (e) => {
            // Receive guest audio
            let audioEl = this.shadowRoot.getElementById('audio-guest-' + guestId);
            if (!audioEl) {
                audioEl = document.createElement('audio');
                audioEl.id = 'audio-guest-' + guestId;
                audioEl.autoplay = true;
                this.shadowRoot.appendChild(audioEl);
            }
            audioEl.srcObject = e.streams[0];
        };

        pc.onicecandidate = (e) => {
            if(e.candidate && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({ type: 'candidate', candidate: e.candidate, target: guestId }));
            }
        };

        const dcs = {};
        dcs.events = pc.createDataChannel("control");
        dcs.events.onmessage = async (event) => {
            try {
                const data = JSON.parse(event.data);
                if (this.activeControllerId !== guestId) return;
                fetch('http://127.0.0.1:8000/api/user/remote-control', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }).catch(()=>{});
            } catch(e) {}
        };
        this.dataChannels.set(guestId, dcs);

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'offer', offer: offer, target: guestId }));
        }
    }
"""

# Insert methods before initSpeechRecognition
content = content.replace("initSpeechRecognition() {", new_methods + "\n    initSpeechRecognition() {")

# Delete the old standalone startScreenShare() method since it was a hardcoded 1:1 version
content = re.sub(r'async startScreenShare\(\) \{.*?(?=stopScreenShare\(\) \{)', '', content, flags=re.DOTALL)

# Add Mute User action to the HTML participant list
# We want to add a mute button near the accept/reject actions for active participants
mute_btn = """
                                        ${p.status === 'active' && p.id !== 'me' ? html`
                                            <button class="action-btn" style="color:var(--danger);" title="Mute Participant" @click=${() => this.ws.send(JSON.stringify({type: 'mute_user', target: p.id}))}>
                                                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                                            </button>
                                        ` : ''}
"""
content = content.replace('</div>\n                                        \n                                        ${p.status === \'waiting\'', mute_btn + '</div>\n                                        \n                                        ${p.status === \'waiting\'')

# Handle participant_talking signaling
talking_logic = """} else if(msg.type === 'participant_talking') {
                        const idx = this.participants.findIndex(p => p.id === msg.guest_id);
                        if (idx > -1) {
                            this.participants[idx].isTalking = msg.isTalking;
                            this.requestUpdate();
                        }
                    } else if(msg.type === 'candidate'"""
content = content.replace("} else if(msg.type === 'candidate'", talking_logic)

# Update UI to glow green when talking
content = content.replace('class="status-dot ${p.status}"', 'class="status-dot ${p.status} ${p.isTalking ? \'talking\' : \'\'}"')
if '.status-dot.talking' not in content:
    content = content.replace('.status-dot.active { background: var(--success); }', '.status-dot.active { background: var(--success); }\n            .status-dot.talking { box-shadow: 0 0 8px 2px #4ade80; background: #22c55e; }')

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated InviteView.js")
