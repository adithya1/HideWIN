import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';
import { render } from './InviteViewRenderer.js';
import { inviteStyles } from './InviteView.styles.js';

const configManager = window.require ? window.require('./utils/configManager.js') : require('../../utils/configManager.js');

export class InviteView extends LitElement {
    static properties = {
        prefillChannelId: { type: String },
        prefillPasscode: { type: String },
        channelName: { type: String },
        activeChannelId: { type: String },
        participants: { type: Array },
        sharingOptions: { type: Object },
        dnsDomain: { type: String },
        dnsIP: { type: String },
        dnsPort: { type: String },
        toastMessage: { type: String },
        toastType: { type: String },
        pendingParticipant: { type: Object },
        activeSidebar: { type: String },
        chatMessages: { type: Array },
        chatInput: { type: String },
        meetingSeconds: { type: Number },
        showLeaveModal: { type: Boolean },
        meetingData: { type: Object },
        showExtendModal: { type: Boolean },
        customExtMinutes: { type: Number },
        hostInitials: { type: String },
        showToolsOverlay: { type: Boolean },
        activeToolTab: { type: String }
    };

    static styles = inviteStyles;


    constructor() {
        super();
        this.channelName = '';
        this.activeChannelId = null;
        this.controlRequests = new Set();
        this.activeControllerId = 'host';
        this.dataChannels = new Map();
        this.peers = new Map();

        this.participants = [
            { id: 'me', name: 'You (Host)', role: 'Host', status: 'active' }
        ];
        this.sharingOptions = {
            screen: true,
            audio: true,
            mic: true,
            transcription: true,
            remoteMouse: false,
            remoteKeyboard: false
        };
    }

    
    
    
    async 
    copyInviteLink() {
        if (!this.activeChannelId || !this.channelToken) return;
        
        // Invite link now points securely to the Cloud Relay, hiding your PC's IP address!
        // For local simulation, we use 127.0.0.1:9000 (or localhost:9000). 
        // Note: To test from your mobile phone on the same WiFi, you would change 127.0.0.1 to the IP of the machine running the Cloud Relay, but the link structure itself is decoupled from your API backend!
        const cloudHost = (this.dnsIP && this.dnsIP.includes('.loca.lt')) ? this.dnsIP : '127.0.0.1:8000';
        const inviteLink = cloudHost.includes('loca.lt') ? `https://${cloudHost}/invite/index.html?channel=${this.activeChannelId}&passcode=${this.channelToken}` : `http://${cloudHost}/invite/index.html?channel=${this.activeChannelId}&passcode=${this.channelToken}`;
        
        navigator.clipboard.writeText(inviteLink).then(() => {
            // Notification removed
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    }



    showToast(msg, type = 'success') {
        try {
            const fs = window.require('fs');
            fs.appendFileSync('C:\\Users\\akula\\Downloads\\Hide-WIN\\invite_test.log', new Date().toISOString() + ' - TOAST: ' + msg + '\n');
        } catch(e) {}
        this.toastMessage = msg;

        this.toastType = type;
        this.requestUpdate();
        setTimeout(() => {
            if (this.toastMessage === msg) {
                this.toastMessage = null;
                this.requestUpdate();
            }
        }, 5000);
    }



    async firstUpdated() {
        if (window.require) {
            try {
                let usingApi = false;
                try {
                    const response = await fetch(`${configManager.getApiBaseUrl()}/api/user/public/dns-settings`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.dnsIP && data.dnsIP !== '127.0.0.1') {
                            this.dnsDomain = data.dnsDomain || '';
                            this.dnsIP = data.dnsIP || '127.0.0.1';
                            this.dnsPort = data.dnsPort || '8000';
                            usingApi = true;
                            setTimeout(() => this.showToast(`Fetched IP from API: ${this.dnsIP}:${this.dnsPort}`, 'success'), 1000);
                        }
                    }
                } catch (err) {
                    console.warn("Fetch failed", err);
                }

                if (!usingApi) {
                    const { ipcRenderer } = window.require('electron');
                    const prefsStr = await ipcRenderer.invoke('storage:get-preferences');
                    const prefs = typeof prefsStr === 'string' ? JSON.parse(prefsStr) : prefsStr;
                    this.dnsDomain = (prefs.data && prefs.data.dnsDomain) ? prefs.data.dnsDomain : (prefs.dnsDomain || '');
                    this.dnsIP = (prefs.data && prefs.data.dnsIP) ? prefs.data.dnsIP : (prefs.dnsIP || '127.0.0.1');
                    this.dnsPort = (prefs.data && prefs.data.dnsPort) ? prefs.data.dnsPort : (prefs.dnsPort || '8000');
                }
            } catch (e) {
                this.dnsIP = '127.0.0.1';
                this.dnsPort = '8000';
            }
        } else {
            this.dnsIP = '127.0.0.1';
            this.dnsPort = '8000';
        }
        
                // Fetch host initials
        if (window.hideWin && window.hideWin.storage) {
            
        }
        
        if (this.prefillChannelId) {
            this.createChannel();
        }
    }


        
    disconnectedCallback() {
        if (this.ws) {
            this.ws.close();
        }
        super.disconnectedCallback();
    }
    createChannel() {
        try {
            this.showToast(this.prefillChannelId ? "Connecting to meeting..." : "Starting channel creation...", "success");
        if (this._meetingTimer) clearInterval(this._meetingTimer);
        this.meetingSeconds = 0;
        this.showLeaveModal = false;
        this.showExtendModal = false;
        this.customExtMinutes = 15;
        
        this.showToolsOverlay = false;
        this.activeToolTab = 'notes';
        this._meetingTimer = setInterval(() => { 
            if (this.meetingData && this.meetingData.end_time) {
                const diff = new Date(this.meetingData.end_time).getTime() - Date.now();
                this.meetingSeconds = Math.max(0, Math.floor(diff / 1000));
                
                // If meeting expired and modal not shown yet, show it!
                if (this.meetingSeconds === 0 && !this.showExtendModal && this.meetingData.id) {
                    this.showExtendModal = true;
                    this.dispatchEvent(new CustomEvent('global-toast', { detail: { message: 'Meeting Time Expired! Please extend the session.', type: 'error' }, bubbles: true, composed: true }));
                }
            } else {
                this.meetingSeconds++;
            }
            this.requestUpdate();
        }, 1000);
            if (!this.channelName || !this.channelName.trim()) this.channelName = 'Collaboration Session';
                    // Fetch host initials
        if (window.hideWin && window.hideWin.storage) {
            
        }
        
        if (this.prefillChannelId) {
                this.activeChannelId = this.prefillChannelId;
            } else {
                this.activeChannelId = 'HW-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
            }
            
            const cloudHost = (this.dnsIP && this.dnsIP.includes('.loca.lt')) ? this.dnsIP : '127.0.0.1:8000';
            this.showToast("Host resolved to: " + cloudHost, "success");
            
            const wsUrl = cloudHost.includes('.loca.lt') ? `wss://${cloudHost}/ws/signaling/host/${this.activeChannelId}` : `ws://${cloudHost}/ws/signaling/host/${this.activeChannelId}`;
            this.showToast("Connecting WS to: " + wsUrl, "success");
            
            this.ws = new WebSocket(wsUrl);
            
            this.ws.onerror = (e) => {
                this.showToast(`WS Error: Connection refused to ${wsUrl}. Is the API running on port 8000?`, 'error');
                this.activeChannelId = null;
        this.controlRequests = new Set();
        this.activeControllerId = 'host';
        this.dataChannels = new Map();
        this.peers = new Map();

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
                        this.showToast(this.prefillChannelId ? "Connected to Meeting!" : "Channel Created Successfully!", "success");
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
                    } else if(msg.type === 'participant_talking') {
                        const idx = this.participants.findIndex(p => p.id === msg.guest_id);
                        if (idx > -1) {
                            this.participants[idx].isTalking = msg.isTalking;
                            this.requestUpdate();
                        }
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
    }

    grantRole(guestId, role) {
        const dcs = this.dataChannels.get(guestId);
        if (!dcs || !dcs.events) return;
        
        if (role === 'mouse') {
            if (this.activeControllerId !== 'host' && this.activeControllerId !== guestId) {
                const oldDc = this.dataChannels.get(this.activeControllerId);
                if (oldDc && oldDc.events) oldDc.events.send(JSON.stringify({ type: 'role_revoked', role: 'mouse' }));
            }
            this.activeControllerId = guestId;
            dcs.events.send(JSON.stringify({ type: 'role_granted', role: 'mouse' }));
        }
        else if (role === 'mic') {
            this.activeSpeakers.add(guestId);
            dcs.events.send(JSON.stringify({ type: 'role_granted', role: 'mic' }));
        }
        else if (role === 'host') {
            if (this.currentHostId !== 'local' && this.currentHostId !== guestId) {
                const oldDc = this.dataChannels.get(this.currentHostId);
                if (oldDc && oldDc.events) oldDc.events.send(JSON.stringify({ type: 'role_revoked', role: 'host' }));
            }
            this.currentHostId = guestId;
            dcs.events.send(JSON.stringify({ type: 'role_granted', role: 'host' }));
        }
        
        // Remove from roleRequests
        this.roleRequests = this.roleRequests.filter(req => !(req.guestId === guestId && req.role === role));
        this.requestUpdate();
    }
    
    
    revokeControl(guestId) {
        if (this.activeControllerId === guestId) {
            const dc = this.dataChannels.get(guestId);
            if (dc && dc.events && dc.events.readyState === 'open') {
                dc.events.send(JSON.stringify({ type: 'control_revoked' }));
            }
            this.activeControllerId = 'host';
            this.requestUpdate();
            this.showToast("Control revoked.", "success");
        }
    }

    grantControl(guestId) {
        if (this.activeControllerId !== 'host' && this.activeControllerId !== guestId) {
            const oldDc = this.dataChannels.get(this.activeControllerId);
            if (oldDc && oldDc.events && oldDc.events.readyState === 'open') {
                oldDc.events.send(JSON.stringify({ type: 'control_revoked' }));
            }
        }
        this.activeControllerId = guestId;
        this.controlRequests.delete(guestId);
        
        const newDc = this.dataChannels.get(guestId);
        if (newDc && newDc.events && newDc.events.readyState === 'open') {
            newDc.events.send(JSON.stringify({ type: 'control_granted' }));
        }
        this.requestUpdate();
    }
    
    acceptParticipant(id) {
        if(id !== 'me') {
            this.participants = this.participants.map(p => p.id === id ? {...p, status: 'active'} : p);
            this.requestUpdate();
            this.startScreenShareForPeer(id);
        }
    }

    
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
                fetch(`${configManager.getApiBaseUrl()}/api/user/remote-control`, {
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

    initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = false;
            recognition.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript.trim() !== '') {
                    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                        this.ws.send(JSON.stringify({ type: 'transcript', text: finalTranscript }));
                    }
                }
            };
            recognition.start();
            this.recognition = recognition;
        }
    }

    rejectParticipant(id) {
        this.participants = this.participants.filter(p => p.id !== id);
    }


    async startScreenShare() {
        try {
            // Get screen and system audio
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
            
            
            // Create DataChannel for Remote Control BEFORE creating offer
            this.dataChannel = this.peerConnection.createDataChannel("control");
            this.dataChannel.onmessage = async (event) => {
                try {
                    const data = JSON.parse(event.data);
                    // Forward to Python backend
                    fetch(`${configManager.getApiBaseUrl()}/api/user/remote-control`, {
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
                            // Notification removed
                        }
                    })
                    .catch(err => console.error("RC Error:", err));
                } catch(e) {}
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

    stopSharing() {
        this.activeChannelId = null;
        this.controlRequests = new Set();
        this.activeControllerId = 'host';
        this.dataChannels = new Map();
        this.peers = new Map();

        this.channelName = '';
        this.activeControllerId = 'host';
        this.currentHostId = 'local';
        this.activeSpeakers = new Set();
        this.roleRequests = [];
        this.controlRequests = new Set();
        this.participants = [{ id: 'me', name: 'You (Host)', role: 'Host', status: 'active' }];
    }

    toggleSharing(option) {
        this.sharingOptions = { ...this.sharingOptions, [option]: !this.sharingOptions[option] };
    }

        formatMeetingTime() {
        const h = Math.floor(this.meetingSeconds / 3600);
        const m = Math.floor((this.meetingSeconds % 3600) / 60);
        const s = this.meetingSeconds % 60;
        if (h > 0) return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }

        confirmLeave() {
        if (this.participants.length > 1) {
            this.showLeaveModal = true;
        } else {
            this.executeLeave();
        }
    }
    
    executeLeave() {
        this.showLeaveModal = false;
        this.showExtendModal = false;
        this.customExtMinutes = 15;
        
        this.showToolsOverlay = false;
        this.activeToolTab = 'notes';
        if(this.ws) this.ws.close(); 
        this.dispatchEvent(new CustomEvent('close-meeting', { bubbles: true, composed: true }));
    }

        async extendMeeting(mins) {
        if (!this.meetingData || !this.meetingData.id) return;
        const currentEnd = new Date(this.meetingData.end_time).getTime();
        const newEnd = new Date(Math.max(currentEnd, Date.now()) + mins * 60000);
        
        try {
            let token = '';
            if (window.hideWin && window.hideWin.storage) {
                const creds = await window.hideWin.storage.getCredentials();
                if (creds) token = creds.jwtToken;
            }
            if (token) {
                const updatedMeeting = { ...this.meetingData, end_time: newEnd.toISOString() };
                const res = await fetch(`${this.invite_url_base.split('/invite')[0]}/api/meetings/${this.meetingData.id}`, {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedMeeting)
                });
                if (res.ok) {
                    this.meetingData.end_time = newEnd.toISOString();
                    this.showExtendModal = false;
                    this.showToast(`Meeting extended by ${mins} minutes!`, "success");
                    
                    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                        this.ws.send(JSON.stringify({ type: 'time_extended', end_time: this.meetingData.end_time }));
                    }
                    this.requestUpdate();
                } else {
                    this.showToast("Failed to extend meeting", "error");
                }
            }
        } catch (e) {
            console.error(e);
            this.showToast("Error extending meeting", "error");
        }
    }

    render() {
        return render.call(this);
    }

}
customElements.define('invite-view', InviteView);

