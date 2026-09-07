import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';
import { unifiedPageStyles } from './sharedPageStyles.js';

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

    static styles = [
        unifiedPageStyles,
        css`
            * { box-sizing: border-box; }

            :host {
                display: block;
                height: 100%;
                overflow-y: auto;
            }

            
            .toast-notification {
                position: fixed;
                bottom: 24px;
                right: 24px;
                padding: 12px 24px;
                border-radius: 8px;
                color: white;
                font-weight: 600;
                font-size: 14px;
                z-index: 9999;
                box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .toast-notification.success {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                border: 1px solid #34d399;
            }
            .toast-notification.error {
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                border: 1px solid #f87171;
            }
            @keyframes slideIn {
                from { transform: translateY(100px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .admit-modal {
                position: fixed;
                top: 24px;
                left: 50%;
                transform: translateX(-50%);
                background: #1e293b;
                border: 1px solid #334155;
                padding: 16px 24px;
                border-radius: 12px;
                box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2), 0 10px 10px -5px rgba(0,0,0,0.1);
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 12px;
                animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                min-width: 300px;
            }
            .admit-modal-title { font-weight: 600; color: white; font-size: 15px; }
            .admit-modal-actions { display: flex; gap: 10px; justify-content: flex-end; }
            .admit-btn { background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500; }
            .admit-btn:hover { background: #2563eb; }
            .deny-btn { background: transparent; color: #cbd5e1; border: 1px solid #475569; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500; }
            .deny-btn:hover { background: #334155; }
            @keyframes slideDown { from { transform: translate(-50%, -50px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
            
            .posh-meeting-container {
                display: flex;
                flex-direction: column;
                height: 100vh;
                background: white;
                margin: -24px; /* offset the .invite-container padding */
            }
            .meeting-top-bar {
                height: 60px;
                background: white;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 16px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                z-index: 20;
            }
            .top-bar-left { display: flex; align-items: center; gap: 12px; width: 200px; }
            .top-bar-center { display: flex; align-items: center; gap: 4px; justify-content: center; flex: 1; }
            .top-bar-right { display: flex; align-items: center; gap: 12px; width: 200px; justify-content: flex-end; }

            .meeting-timer {
                font-size: 14px;
                font-weight: 600;
                color: #374151;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .meeting-action-btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: transparent;
                border: none;
                cursor: pointer;
                color: #4b5563;
                min-width: 68px;
                height: 52px;
                border-radius: 8px;
                transition: background 0.15s ease;
            }
            .meeting-action-btn:hover, .meeting-action-btn.active {
                background: #f3f4f6;
                color: #111827;
            }
            .meeting-action-btn svg { width: 20px; height: 20px; margin-bottom: 4px; }
            .meeting-action-btn span { font-size: 11px; font-weight: 500; }

            .leave-btn {
                background: #ef4444;
                color: white;
                border-radius: 6px;
                padding: 6px 16px;
                font-weight: 600;
                font-size: 14px;
                border: none;
                cursor: pointer;
                transition: background 0.15s ease;
            }
            .leave-btn:hover { background: #dc2626; }

            .meeting-main-area {
                display: flex;
                flex: 1;
                background: #f3f2f1;
                position: relative;
                overflow: hidden;
            }

            .meeting-stage {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                position: relative;
            }

            .avatar-circle {
                width: 120px;
                height: 120px;
                border-radius: 50%;
                background: #fce7f3;
                color: #831843;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 40px;
                font-weight: 500;
                margin-bottom: 24px;
            }
            .waiting-text {
                font-size: 18px;
                color: #374151;
                font-weight: 500;
            }

            .meeting-sidebar {
                width: 320px;
                background: white;
                border-left: 1px solid #e5e7eb;
                display: flex;
                flex-direction: column;
                box-shadow: -4px 0 15px rgba(0,0,0,0.03);
                z-index: 10;
            }
            .sidebar-header {
                padding: 16px 20px;
                border-bottom: 1px solid #e5e7eb;
                font-size: 16px;
                font-weight: 600;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .sidebar-close {
                background: none; border: none; cursor: pointer; color: #6b7280; padding: 4px; border-radius: 4px;
                display: flex; align-items: center; justify-content: center;
            }
            .sidebar-close:hover { background: #f3f4f6; color: #111827; }
            .sidebar-content {
                flex: 1;
                overflow-y: auto;
            }

            .invite-container {


                margin: 0;
                padding: 24px;
            }

            .section-card {
                background: var(--bg-card);
                border: 1px solid var(--border);
                border-radius: 12px;
                padding: 24px;
                margin-bottom: 24px;
            }

            .section-title {
                font-size: 14px;
                font-weight: 600;
                color: var(--text-secondary);
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 16px;
            }

            .input-group {
                margin-bottom: 20px;
            }

            .input-label {
                display: block;
                font-size: 13px;
                color: var(--text-primary);
                margin-bottom: 8px;
            }

            .text-input {
                width: 100%;
                max-width: 400px;
                background: var(--bg-input);
                border: 1px solid var(--border);
                color: var(--text-primary);
                padding: 10px 14px;
                border-radius: 8px;
                font-size: 14px;
                transition: border-color 0.2s;
            }

            .text-input:focus {
                outline: none;
                border-color: #3b82f6;
            }

            .primary-btn {
                background: #3b82f6;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: background 0.2s;
            }

            .primary-btn:hover {
                background: #2563eb;
            }

            .secondary-btn {
                background: var(--bg-hover);
                color: var(--text-primary);
                border: 1px solid var(--border);
                padding: 10px 20px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                transition: all 0.2s;
            }

            .secondary-btn:hover {
                background: var(--bg-active);
            }

            .danger-btn {
                background: rgba(239, 68, 68, 0.1);
                color: #ef4444;
                border: 1px solid rgba(239, 68, 68, 0.2);
                padding: 10px 20px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
            }

            .danger-btn:hover {
                background: rgba(239, 68, 68, 0.2);
            }

            .meeting-id {
                font-size: 24px;
                font-weight: 700;
                color: var(--text-primary);
                letter-spacing: 1px;
                margin-bottom: 16px;
                font-family: monospace;
            }

            .participant-list {
                margin-top: 24px;
            }

            .participant-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 16px;
                background: var(--bg-app);
                border: 1px solid var(--border);
                border-radius: 8px;
                margin-bottom: 8px;
            }

            .participant-info {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .status-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
            }
            .status-dot.active { background: #10b981; }
            .status-dot.waiting { background: #f59e0b; }

            .participant-name {
                font-size: 14px;
                font-weight: 500;
                color: var(--text-primary);
            }

            .participant-role {
                font-size: 13px;
                color: var(--text-secondary);
            }

            .actions {
                display: flex;
                gap: 8px;
            }

            .action-btn {
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                border: none;
            }
            .action-btn.accept {
                background: rgba(16, 185, 129, 0.1);
                color: #10b981;
            }
            .action-btn.accept:hover { background: rgba(16, 185, 129, 0.2); }
            
            .action-btn.reject {
                background: rgba(239, 68, 68, 0.1);
                color: #ef4444;
            }
            .action-btn.reject:hover { background: rgba(239, 68, 68, 0.2); }

            .sharing-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 16px;
                margin-bottom: 24px;
            }

            .checkbox-label {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 14px;
                color: var(--text-primary);
                cursor: pointer;
            }

            .checkbox-label input[type="checkbox"] {
                width: 18px;
                height: 18px;
                cursor: pointer;
                accent-color: #3b82f6;
            }
        `
    ];

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
                    const response = await fetch('http://127.0.0.1:8000/api/user/public/dns-settings');
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
        return html`
            <div class="notes-container">
                
            ${this.toastMessage ? html`
                <div class="toast-notification ${this.toastType}">
                    ${this.toastType === 'success' ? html`<svg width='16' height='16' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24' style='vertical-align: text-bottom; margin-right: 6px;'><path d='M20 6L9 17l-5-5'></path></svg>` : html`<svg width='16' height='16' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24' style='vertical-align: text-bottom; margin-right: 6px;'><path d='M18 6L6 18M6 6l12 12'></path></svg>`}${this.toastMessage}
                </div>
            ` : ''}
            <div class="invite-container">

                    ${!this.activeChannelId ? (this.prefillChannelId ? html`
                        <div style="display: flex; height: 100vh; align-items: center; justify-content: center; flex-direction: column; margin-top: -60px;">
                            <div style="width: 40px; height: 40px; border: 4px solid #f3f4f6; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 16px;"></div>
                            <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
                            <div style="font-size: 16px; font-weight: 500; color: #374151;">Connecting to Meeting...</div>
                        </div>
                    ` : html`
                        <div class="section-card">
                            <div class="section-title">Create Collaboration Channel</div>
                            
                            <div class="input-group">
                                <label class="input-label">Channel Name</label>
                                <input type="text" class="text-input" 
                                    placeholder="e.g. Client Presentation" 
                                    .value=${this.channelName} 
                                    @input=${e => this.channelName = e.target.value}
                                    @keyup=${e => e.key === 'Enter' && this.createChannel()}>
                            </div>
                            
                            <button class="primary-btn" @click=${(e) => this.createChannel()}>Create Channel</button>
                        </div>
                    `) : html`
                        <div class="posh-meeting-container">

                                <!-- Glassmorphism Tools Overlay -->
                                ${this.showToolsOverlay ? html`
                                    <div style="position: absolute; top: 70px; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.7); backdrop-filter: blur(20px); z-index: 50; display: flex; flex-direction: column; animation: slideUp 0.3s cubic-bezier(0.16,1,0.3,1);">
                                        <div style="display: flex; background: rgba(255,255,255,0.9); border-bottom: 1px solid rgba(0,0,0,0.1); padding: 0 24px;">
                                            <button style="padding: 16px 24px; border: none; background: transparent; font-weight: 600; font-size: 14px; color: ${this.activeToolTab === 'notes' ? '#3b82f6' : '#6b7280'}; border-bottom: 3px solid ${this.activeToolTab === 'notes' ? '#3b82f6' : 'transparent'}; cursor: pointer;" @click=${() => this.activeToolTab = 'notes'}>AI Notes</button>
                                            <button style="padding: 16px 24px; border: none; background: transparent; font-weight: 600; font-size: 14px; color: ${this.activeToolTab === 'browser' ? '#3b82f6' : '#6b7280'}; border-bottom: 3px solid ${this.activeToolTab === 'browser' ? '#3b82f6' : 'transparent'}; cursor: pointer;" @click=${() => this.activeToolTab = 'browser'}>Browser</button>
                                            <button style="padding: 16px 24px; border: none; background: transparent; font-weight: 600; font-size: 14px; color: ${this.activeToolTab === 'settings' ? '#3b82f6' : '#6b7280'}; border-bottom: 3px solid ${this.activeToolTab === 'settings' ? '#3b82f6' : 'transparent'}; cursor: pointer;" @click=${() => this.activeToolTab = 'settings'}>Settings</button>
                                            <button style="margin-left: auto; background: transparent; border: none; cursor: pointer; color: #4b5563;" @click=${() => this.showToolsOverlay = false}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                            </button>
                                        </div>
                                        <div style="flex: 1; overflow: hidden; position: relative; background: rgba(249,250,251,0.5);">
                                            ${this.activeToolTab === 'notes' ? html`<notes-view></notes-view>` : ''}
                                            ${this.activeToolTab === 'browser' ? html`<browse-view></browse-view>` : ''}
                                            ${this.activeToolTab === 'settings' ? html`<settings-view></settings-view>` : ''}
                                        </div>
                                    </div>
                                ` : ''}

                            <div class="meeting-top-bar">
                                <div class="top-bar-left">
                                    <div class="meeting-timer">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                        ${this.formatMeetingTime()}
                                    </div>
                                </div>
                                
                                <div class="top-bar-center">
                                    <button class="meeting-action-btn ${this.activeSidebar === 'chat' ? 'active' : ''}" @click=${() => this.activeSidebar = this.activeSidebar === 'chat' ? null : 'chat'}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                        <span>Chat</span>
                                    </button>
                                    
                                    <button class="meeting-action-btn ${this.activeSidebar === 'people' ? 'active' : ''}" @click=${() => this.activeSidebar = this.activeSidebar === 'people' ? null : 'people'}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                        <span>People</span>
                                    </button>
                                    
                                    <button class="meeting-action-btn ${this.localStream ? 'active' : ''}" @click=${() => this.localStream ? this.showToast("Screen is already in share mode!", "success") : this.startScreenShare()}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="M8 17l4-4 4 4"></path></svg>
                                        <span>Share</span>
                                    </button>
                                    
                                    <button class="meeting-action-btn ${this.showToolsOverlay ? 'active' : ''}" @click=${() => this.showToolsOverlay = !this.showToolsOverlay}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                                        <span>Tools</span>
                                    </button>
                                    
                                    <button class="meeting-action-btn ${this.activeSidebar === 'settings' ? 'active' : ''}" @click=${() => this.activeSidebar = this.activeSidebar === 'settings' ? null : 'settings'}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                                        <span>More</span>
                                    </button>
                                    
                                    <button class="meeting-action-btn" title="Copy Invite Link" @click=${(e) => this.copyInviteLink()}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                        <span>Link</span>
                                    </button>
                                </div>
                                
                                <div class="top-bar-right" style="display: flex; gap: 12px;">
                                    <button style="background: transparent; border: 1px solid #d1d5db; color: #4b5563; padding: 6px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px;" @click=${() => this.dispatchEvent(new CustomEvent('minimize-meeting', { bubbles: true, composed: true }))}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line></svg>
                                        Minimize
                                    </button>
                                    <button class="leave-btn" @click=${() => this.confirmLeave()}>Leave</button>
                                </div>
                            </div>
                            
                            <div class="meeting-main-area">
                                <div class="meeting-stage">
                                    <div class="avatar-circle">
                                        ${this.hostInitials}
                                    </div>
                                    <div class="waiting-text">
                                        ${this.localStream ? 'You are sharing your screen.' : (this.participants.length > 0 ? 'Meeting is Active.' : 'Waiting for others to join...')}
                                    </div>
                                    <div style="margin-top: 8px; color: #6b7280; font-size: 13px;">Meeting ID: ${this.activeChannelId}</div>
                                </div>
                                
                                ${this.activeSidebar === 'people' ? html`
                                    <div class="meeting-sidebar">
                                        <div class="sidebar-header">
                                            <span>Participants (${this.participants.length})</span>
                                            <button class="sidebar-close" @click=${() => this.activeSidebar = null}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                                        </div>
                                        <div class="sidebar-content participant-list" style="padding: 16px;">
                                            ${this.participants.length === 0 ? html`<div style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 20px;">No participants yet.</div>` : ''}
                                            ${this.participants.map(p => html`
                                                <div class="participant-item" style="display: flex; flex-direction: column; gap: 8px; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 8px;">
                                                    <div style="display: flex; align-items: center; justify-content: space-between;">
                                                        <div style="display: flex; align-items: center; gap: 8px;">
                                                            <div class="status-dot ${p.status} ${p.isTalking ? 'talking' : ''}"></div>
                                                            <span class="participant-name" style="font-weight: 500; font-size: 14px;">${p.name}</span>
                                                        </div>
                                                        <div style="display: flex; gap: 4px;">
                                                            ${this.activeControllerId === p.id ? html`
                                                                <span title="Has Control" style="font-size:11px; background:#e0e7ff; color:#4338ca; padding: 3px 6px; border-radius: 4px; font-weight: 600;">Control</span>
                                                                <button style="background:#fee2e2; color:#ef4444; border:none; cursor:pointer; font-size:11px; padding: 3px 6px; border-radius: 4px; font-weight: 600;" title="Revoke Control" @click=${() => this.revokeControl(p.id)}>Revoke</button>
                                                            ` : ''}
                                                            ${this.controlRequests.has(p.id) && this.activeControllerId !== p.id ? html`
                                                                <button style="background:#e0e7ff; color:#4338ca; border:none; cursor:pointer; font-size:11px; padding: 3px 6px; border-radius: 4px; font-weight: 600;" title="Grant Control" @click=${() => this.grantControl(p.id)}>Grant</button>
                                                            ` : ''}
                                                            ${p.status === 'active' && p.id !== 'me' ? html`
                                                                <button style="background:#fee2e2; border:none; cursor:pointer; color:#ef4444; font-size:11px; padding: 3px 6px; border-radius: 4px; font-weight: 600;" title="Soft Mute Mic" @click=${() => { this.ws.send(JSON.stringify({type: 'soft_mute_mic', target: p.id})); this.showToast("Requested soft mute", "success"); }}>S-Mute</button>
                                                                <button style="background:#7f1d1d; border:none; cursor:pointer; color:white; font-size:11px; padding: 3px 6px; border-radius: 4px; font-weight: 600;" title="Hard Mute Mic" @click=${() => { this.ws.send(JSON.stringify({type: 'hard_mute_mic', target: p.id})); this.showToast("Forced hard mute", "success"); }}>H-Mute</button>
                                                            ` : ''}
                                                        </div>
                                                    </div>
                                                    ${p.status === 'waiting' ? html`
                                                        <div class="actions" style="display: flex; gap: 8px;">
                                                            <button class="action-btn accept" style="flex: 1; background: #10b981; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600;" @click=${() => this.acceptParticipant(p.id)}>Admit</button>
                                                            <button class="action-btn reject" style="flex: 1; background: #ef4444; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600;" @click=${() => this.rejectParticipant(p.id)}>Deny</button>
                                                        </div>
                                                    ` : ''}
                                                </div>
                                            `)}
                                        </div>
                                    </div>
                                ` : ''}
                                

                                ${this.activeSidebar === 'chat' ? html`
                                    <div class="meeting-sidebar">
                                        <div class="sidebar-header">
                                            <span>Meeting Chat</span>
                                            <button class="sidebar-close" @click=${() => this.activeSidebar = null}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                                        </div>
                                        <div class="sidebar-content" style="padding: 16px; display: flex; flex-direction: column; height: 100%;">
                                            <div style="flex: 1; overflow-y: auto; margin-bottom: 12px; display: flex; flex-direction: column; gap: 12px;">
                                                ${this.chatMessages.length === 0 ? html`<div style="color: #6b7280; font-size: 13px; text-align: center; margin-top: 20px;">No messages yet. Start the conversation!</div>` : ''}
                                                ${this.chatMessages.map(m => html`
                                                    <div style="display: flex; flex-direction: column; align-items: ${m.sender === 'You (Host)' ? 'flex-end' : 'flex-start'};">
                                                        <span style="font-size: 11px; color: #6b7280; margin-bottom: 2px;">${m.sender} • ${m.time}</span>
                                                        <div style="background: ${m.sender === 'You (Host)' ? '#dbeafe' : '#f3f4f6'}; color: #1f2937; padding: 8px 12px; border-radius: 8px; font-size: 13px; max-width: 90%; word-break: break-word;">
                                                            ${m.text}
                                                        </div>
                                                    </div>
                                                `)}
                                            </div>
                                            <div style="display: flex; gap: 8px;">
                                                <input type="text" style="flex: 1; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px 12px; font-size: 13px; outline: none;" placeholder="Type a message..." .value=${this.chatInput} @input=${e => this.chatInput = e.target.value} @keyup=${e => { if (e.key === 'Enter') this.sendChat(); }}>
                                                <button style="background: #3b82f6; color: white; border: none; border-radius: 6px; padding: 0 16px; cursor: pointer;" @click=${() => this.sendChat()}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ` : ''}
                                ${this.activeSidebar === 'settings' ? html`
                                    <div class="meeting-sidebar">
                                        <div class="sidebar-header">
                                            <span>Sharing Permissions</span>
                                            <button class="sidebar-close" @click=${() => this.activeSidebar = null}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                                        </div>
                                        <div class="sidebar-content" style="padding: 20px;">
                                            <div class="sharing-grid" style="display: flex; flex-direction: column; gap: 16px;">
                                                <label class="checkbox-label" style="display: flex; align-items: center; gap: 12px; font-size: 14px; color: #374151; cursor: pointer;">
                                                    <input type="checkbox" style="width: 16px; height: 16px;" .checked=${this.sharingOptions.screen} @change=${() => this.toggleSharing('screen')}>
                                                    Screen Sharing
                                                </label>
                                                <label class="checkbox-label" style="display: flex; align-items: center; gap: 12px; font-size: 14px; color: #374151; cursor: pointer;">
                                                    <input type="checkbox" style="width: 16px; height: 16px;" .checked=${this.sharingOptions.audio} @change=${() => this.toggleSharing('audio')}>
                                                    System Audio
                                                </label>
                                                <label class="checkbox-label" style="display: flex; align-items: center; gap: 12px; font-size: 14px; color: #374151; cursor: pointer;">
                                                    <input type="checkbox" style="width: 16px; height: 16px;" .checked=${this.sharingOptions.mic} @change=${() => this.toggleSharing('mic')}>
                                                    Microphone
                                                </label>
                                                <label class="checkbox-label" style="display: flex; align-items: center; gap: 12px; font-size: 14px; color: #374151; cursor: pointer;">
                                                    <input type="checkbox" style="width: 16px; height: 16px;" .checked=${this.sharingOptions.transcription} @change=${() => this.toggleSharing('transcription')}>
                                                    Live Transcription
                                                </label>
                                                <div style="border-top: 1px solid #e5e7eb; margin: 8px 0;"></div>
                                                <label class="checkbox-label" style="display: flex; align-items: center; gap: 12px; font-size: 14px; color: #374151; cursor: pointer;">
                                                    <input type="checkbox" style="width: 16px; height: 16px;" .checked=${this.sharingOptions.remoteMouse} @change=${() => this.toggleSharing('remoteMouse')}>
                                                    Remote Mouse Control
                                                </label>
                                                <label class="checkbox-label" style="display: flex; align-items: center; gap: 12px; font-size: 14px; color: #374151; cursor: pointer;">
                                                    <input type="checkbox" style="width: 16px; height: 16px;" .checked=${this.sharingOptions.remoteKeyboard} @change=${() => this.toggleSharing('remoteKeyboard')}>
                                                    Remote Keyboard Control
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `}
                </div>
            </div>
        `;
    }
}

customElements.define('invite-view', InviteView);








