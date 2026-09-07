import re

path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

new_func = r'''    createChannel() {
        try {
            this.showToast("Starting channel creation...", "success");
            if (!this.channelName || !this.channelName.trim()) this.channelName = 'Collaboration Session';
            this.activeChannelId = 'HW-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
            
            const cloudHost = (this.dnsIP && this.dnsIP.includes('.loca.lt')) ? this.dnsIP : '127.0.0.1:9000';
            this.showToast("Host resolved to: " + cloudHost, "success");
            
            const wsUrl = cloudHost.includes('.loca.lt') ? `wss://${cloudHost}/ws/signaling/host/${this.activeChannelId}` : `ws://${cloudHost}/ws/signaling/host/${this.activeChannelId}`;
            this.showToast("Connecting WS to: " + wsUrl, "success");
            
            this.ws = new WebSocket(wsUrl);
            
            this.ws.onerror = (e) => {
                this.showToast(`WS Error: Connection refused to ${wsUrl}. Is the Relay running on port 9000?`, 'error');
                this.activeChannelId = null;
                this.hostToken = null;
                this.requestUpdate();
            };
            
            this.ws.onclose = () => {
                this.showToast("WS Closed unexpectedly.", "error");
            };
            
            this.ws.onmessage = (e) => {
                try {
                    const msg = JSON.parse(e.data);
                    if(msg.type === 'channel_created') {
                        this.channelToken = msg.token;
                        this.showToast("Channel Created Successfully!", "success");
                        this.requestUpdate();
                    } else if(msg.type === 'participant_joined') {
                        this.participants.push({ id: msg.guest_id, name: msg.name, role: 'Participant', status: 'waiting' });
                        this.requestUpdate();
                    } else if(msg.type === 'participant_left') {
                        this.participants = this.participants.filter(p => p.id !== msg.guest_id);
                        if (this.peers && this.peers.has(msg.guest_id)) {
                            this.peers.get(msg.guest_id).close();
                            this.peers.delete(msg.guest_id);
                        }
                        this.requestUpdate();
                    } else if(msg.type === 'candidate' || msg.type === 'answer') {
                        this.handleSignalingData(msg.guest_id, msg);
                    }
                } catch(err) {
                    this.showToast("Message parsing error: " + err.message, "error");
                }
            };
        } catch (err) {
            this.showToast("CRITICAL CRASH: " + err.message, "error");
        }
    }'''

content = re.sub(r'    createChannel\(\) \{.*?(?=    grantRole)', new_func + '\n\n', content, flags=re.DOTALL)
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
