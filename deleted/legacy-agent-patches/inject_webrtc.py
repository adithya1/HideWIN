import os
import re

p = r"C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# Add a method to start WebRTC
webrtc_code = """
    async startScreenShare() {
        try {
            // Get screen and system audio
            this.localStream = await navigator.mediaDevices.getDisplayMedia({
                video: { cursor: "always" },
                audio: true
            });
            
            // Setup RTCPeerConnection
            const configuration = { 'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}] };
            this.peerConnection = new RTCPeerConnection(configuration);
            
            this.localStream.getTracks().forEach(track => {
                this.peerConnection.addTrack(track, this.localStream);
            });
            
            this.peerConnection.onicecandidate = (e) => {
                if(e.candidate) {
                    this.ws.send(JSON.stringify({ type: 'candidate', candidate: e.candidate }));
                }
            };
            
            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);
            
            this.ws.send(JSON.stringify({ type: 'offer', sdp: offer }));
            
            // If the user manually stops sharing via the browser bar
            this.localStream.getVideoTracks()[0].onended = () => {
                this.stopSharing();
            };
            
        } catch(err) {
            console.error("Error capturing screen:", err);
            alert("Could not capture screen. Did you grant permission?");
        }
    }
    
    handleWebRTCMessage(msg) {
        if (!this.peerConnection) return;
        if (msg.type === 'answer') {
            this.peerConnection.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        } else if (msg.type === 'candidate' || msg.type === 'ice_candidate') {
            this.peerConnection.addIceCandidate(new RTCIceCandidate(msg.candidate));
        }
    }
"""

if "async startScreenShare()" not in text:
    # Insert right before stopSharing()
    text = text.replace("    stopSharing() {", webrtc_code + "\n    stopSharing() {")

# Update acceptParticipant to call it
accept_code = """    acceptParticipant(id) {
        this.participants = this.participants.map(p => 
            p.id === id ? { ...p, role: 'Participant', status: 'active' } : p
        );
        this.startScreenShare();
    }"""
text = re.sub(r'acceptParticipant\(id\) \{[\s\S]*?\}', accept_code, text, count=1)

# Ensure ws.onmessage passes WebRTC messages to handleWebRTCMessage
onmessage_patch = """
            if(msg.type === 'channel_created') {
                this.hostToken = msg.token;
                this.requestUpdate();
            } else if(msg.type === 'participant_joined') {
                this.participants = [
                    ...this.participants,
                    { id: 'guest-' + Date.now(), name: msg.name || 'Guest', role: 'Waiting for approval', status: 'waiting' }
                ];
                this.requestUpdate();
            } else if (['answer', 'candidate', 'ice_candidate'].includes(msg.type)) {
                this.handleWebRTCMessage(msg);
            }
"""
# Wait, I need to do string replacement carefully for ws.onmessage
with open(p, "w", encoding="utf-8") as f:
    f.write(text)
print("Injected Phase 1 WebRTC into InviteView.js!")
