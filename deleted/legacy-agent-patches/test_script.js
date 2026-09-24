
        let ws;
        let peerConnection;
        const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
        
        const joinBtn = document.getElementById('join-btn');
        const nameInput = document.getElementById('participant-name');
        const channelInput = document.getElementById('channel-id');
        const passcodeInput = document.getElementById('passcode');
        const statusText = document.getElementById('call-status');
        
        
        let recognition;
        let isSTTActive = false;
        const captionsContainer = document.getElementById('captions-container');
        const captionsText = document.getElementById('captions-text');
        const toggleSttBtn = document.getElementById('toggle-stt');

        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            
            recognition.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';
                
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                
                captionsText.innerHTML = finalTranscript || interimTranscript;
            };
            
            recognition.onerror = (e) => console.error("STT Error:", e);
            
            // Auto-restart if it stops while active
            recognition.onend = () => {
                if (isSTTActive) recognition.start();
            };
        }

        toggleSttBtn.onclick = () => {
            if (!recognition) return alert("Speech recognition is not supported in this browser.");
            
            isSTTActive = !isSTTActive;
            if (isSTTActive) {
                toggleSttBtn.classList.add('active');
                captionsContainer.style.display = 'block';
                captionsText.innerHTML = "<em>Listening...</em>";
                try { recognition.start(); } catch(e) {}
            } else {
                toggleSttBtn.classList.remove('active');
                captionsContainer.style.display = 'none';
                try { recognition.stop(); } catch(e) {}
            }
        };

        window.onload = () => {
            const params = new URLSearchParams(window.location.search);
            const channelParam = params.get('channel');
            const passcodeParam = params.get('passcode');
            
            if (channelParam && passcodeParam) {
                // Direct Login flow! Hide the ID/Passcode inputs
                channelInput.value = channelParam;
                passcodeInput.value = passcodeParam;
                
                document.getElementById('channel-group').style.display = 'none';
                document.getElementById('passcode-group').style.display = 'none';
                document.getElementById('join-subtitle').innerText = 'You have been invited. Enter your name to join.';
                
                nameInput.focus();
            }
        };
        
        joinBtn.onclick = () => {
            const name = nameInput.value.trim();
            const channel = channelInput.value.trim();
            const passcode = passcodeInput.value.trim();
            
            if(!name || !channel || !passcode) return alert('Please enter all required fields.');
            
            joinBtn.disabled = true;
            joinBtn.innerHTML = 'Connecting...';
            
            ws = new WebSocket(`ws://${location.host}/ws/signaling/join/${channel}/${passcode}/${encodeURIComponent(name)}`);
            
            ws.onopen = () => {
                document.getElementById('join-screen').style.display = 'none';
                document.getElementById('call-screen').style.display = 'flex';
                document.getElementById('meeting-badge').innerText = `HideWIN Session: ${channel}`;
                setupWebRTC();
            };
            
            ws.onmessage = async (e) => {
                const msg = JSON.parse(e.data);
                if(msg.type === 'error') {
                    alert(msg.message);
                    location.reload();
                } else if(msg.type === 'offer') {
                    await peerConnection.setRemoteDescription(new RTCSessionDescription(msg.sdp));
                    const answer = await peerConnection.createAnswer();
                    await peerConnection.setLocalDescription(answer);
                    ws.send(JSON.stringify({ type: 'answer', sdp: answer }));
                } else if(msg.type === 'candidate' || msg.type === 'ice_candidate') {
                    await peerConnection.addIceCandidate(new RTCIceCandidate(msg.candidate));
                }
            };
            
            ws.onclose = () => {
                alert('Disconnected from host');
                location.reload();
            };
        };

        
        let dataChannel;
        let isControlling = false;
        
        // Remote Control Logic
        const requestMouseBtn = document.getElementById('request-mouse');
        const video = document.getElementById('remote-video');
        
        requestMouseBtn.onclick = () => {
            isControlling = !isControlling;
            if (isControlling) {
                requestMouseBtn.classList.add('active');
                video.style.cursor = 'crosshair';
            } else {
                requestMouseBtn.classList.remove('active');
                video.style.cursor = 'default';
            }
        };

        function sendControlEvent(type, e) {
            if (!isControlling || !dataChannel || dataChannel.readyState !== 'open') return;
            
            let payload = { type };
            
            if (e instanceof MouseEvent) {
                // Calculate percentage relative to the actual video stream (accounting for letterboxing/object-fit)
                const rect = video.getBoundingClientRect();
                
                // Get intrinsic video dimensions vs displayed element dimensions
                const videoRatio = video.videoWidth / video.videoHeight;
                const elementRatio = rect.width / rect.height;
                
                let renderWidth = rect.width;
                let renderHeight = rect.height;
                let renderX = 0;
                let renderY = 0;
                
                if (videoRatio > elementRatio) {
                    renderHeight = rect.width / videoRatio;
                    renderY = (rect.height - renderHeight) / 2;
                } else {
                    renderWidth = rect.height * videoRatio;
                    renderX = (rect.width - renderWidth) / 2;
                }
                
                // Mouse position relative to the actual rendered video box
                const x = e.clientX - rect.left - renderX;
                const y = e.clientY - rect.top - renderY;
                
                // Ignore clicks outside the video area (in the black bars)
                if (x < 0 || x > renderWidth || y < 0 || y > renderHeight) return;
                
                payload.x = x / renderWidth;
                payload.y = y / renderHeight;
            } else if (e instanceof KeyboardEvent) {
                payload.key = e.key;
            }
            
            dataChannel.send(JSON.stringify(payload));
        }

        video.addEventListener('mousemove', (e) => sendControlEvent('mousemove', e));
        video.addEventListener('mousedown', (e) => sendControlEvent('mousedown', e));
        video.addEventListener('mouseup', (e) => sendControlEvent('mouseup', e));
        video.addEventListener('click', (e) => sendControlEvent('click', e));
        
        window.addEventListener('keydown', (e) => sendControlEvent('keydown', e));
        window.addEventListener('keyup', (e) => sendControlEvent('keyup', e));

        function setupWebRTC() {
            peerConnection = new RTCPeerConnection(configuration);
            
                        peerConnection.ondatachannel = (e) => {
                dataChannel = e.channel;
            };
            peerConnection.onicecandidate = (e) => {
                if(e.candidate) ws.send(JSON.stringify({ type: 'candidate', candidate: e.candidate }));
            };
            
            peerConnection.ontrack = (e) => {
                const video = document.getElementById('remote-video');
                document.getElementById('empty-state').style.display = 'none';
                video.style.display = 'block';
                video.srcObject = e.streams[0];
                document.getElementById('controls-bar').style.display = 'flex';
            };
            
            document.getElementById('leave-btn').onclick = () => {
                ws.close();
                peerConnection.close();
                location.reload();
            };
        }
    