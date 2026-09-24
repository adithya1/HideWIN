import os
import re

p = r"C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

new_func = """    createChannel() {
        if (!this.channelName.trim()) this.channelName = 'Collaboration Session';
        this.activeChannelId = 'HW-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
        
        // Host always connects via 127.0.0.1 to avoid local Windows Firewall rules blocking the local IP.
        const localHost = `127.0.0.1:${this.dnsPort}`;
        this.ws = new WebSocket(`ws://${localHost}/ws/signaling/host/${this.activeChannelId}`);
        
        this.ws.onerror = (e) => {
            console.error("WebSocket Error:", e);
            this.showToast(`Error connecting to local Signaling Server at ${localHost}. Is Uvicorn running?`, 'error');
            this.activeChannelId = null;
            this.hostToken = null;
            this.requestUpdate();
        };
        
        this.ws.onclose = () => {
            console.warn("WebSocket closed");
        };
        
        this.ws.onmessage = (e) => {
            const msg = JSON.parse(e.data);
            if(msg.type === 'channel_created') {
                this.hostToken = msg.token;
                this.requestUpdate();
            } else if(msg.type === 'participant_joined') {
                const guestId = 'guest-' + Date.now();
                const guestName = msg.name || 'Guest';
                this.participants = [
                    ...this.participants,
                    { id: guestId, name: guestName, role: 'Waiting for approval', status: 'waiting' }
                ];
                this.pendingParticipant = { id: guestId, name: guestName };
                this.requestUpdate();
            } else if(msg.type === 'participant_left') {
                this.participants = this.participants.filter(p => p.id === 'me');
                this.requestUpdate();
                this.showToast('Participant disconnected', 'error');
            } else if(msg.type === 'answer') {
                this.peerConnection.setRemoteDescription(new RTCSessionDescription(msg.sdp));
            } else if(msg.type === 'candidate') {
                this.peerConnection.addIceCandidate(new RTCIceCandidate(msg.candidate));
            }
        };
    }"""

text = re.sub(r'createChannel\(\)\s*\{[\s\S]*?(?=\n\n\s*stopSharing\(\)\s*\{|\n\n\s*copyInviteLink\(\)\s*\{)', new_func, text)

with open(p, "w", encoding="utf-8") as f:
    f.write(text)
print("Rewrote createChannel()!")
