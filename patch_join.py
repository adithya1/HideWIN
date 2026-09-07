import re
with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\invite_client\join.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Mic and Speaker buttons to controls-bar
new_buttons = """
            <!-- Audio Controls -->
            <button class="control-btn" id="toggle-mic" title="Mute/Unmute Microphone">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
            </button>
            <button class="control-btn" id="toggle-speaker" title="Mute/Unmute Speaker">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
            </button>
"""
content = content.replace('<!-- STT Transcription Toggle -->', new_buttons + '\n            <!-- STT Transcription Toggle -->')

# Add Audio Stream Logic
js_setup_webrtc = """
        let localMicStream = null;
        let isMicMuted = false;
        let isSpeakerMuted = false;
        let audioContext, analyser, microphone, scriptProcessor;

        async function initLocalAudio() {
            try {
                localMicStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
                
                // Audio Volume Meter (Speaking Indicator)
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                microphone = audioContext.createMediaStreamSource(localMicStream);
                scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);
                
                analyser.smoothingTimeConstant = 0.8;
                analyser.fftSize = 1024;
                
                microphone.connect(analyser);
                analyser.connect(scriptProcessor);
                scriptProcessor.connect(audioContext.destination);
                
                let isTalking = false;
                scriptProcessor.onaudioprocess = function() {
                    const array = new Uint8Array(analyser.frequencyBinCount);
                    analyser.getByteFrequencyData(array);
                    let values = 0;
                    for (let i = 0; i < array.length; i++) {
                        values += array[i];
                    }
                    const average = values / array.length;
                    
                    const currentlyTalking = average > 10 && !isMicMuted;
                    if (currentlyTalking !== isTalking) {
                        isTalking = currentlyTalking;
                        if (ws && ws.readyState === WebSocket.OPEN) {
                            ws.send(JSON.stringify({ type: 'participant_talking', isTalking: isTalking }));
                        }
                    }
                };
                
                return localMicStream;
            } catch (e) {
                console.error("Microphone access denied", e);
                return null;
            }
        }

        document.getElementById('toggle-mic').onclick = () => {
            if (!localMicStream) return;
            isMicMuted = !isMicMuted;
            localMicStream.getAudioTracks()[0].enabled = !isMicMuted;
            const btn = document.getElementById('toggle-mic');
            if (isMicMuted) {
                btn.classList.add('danger');
                btn.innerHTML = `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`;
            } else {
                btn.classList.remove('danger');
                btn.innerHTML = `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`;
            }
        };

        document.getElementById('toggle-speaker').onclick = () => {
            isSpeakerMuted = !isSpeakerMuted;
            video.muted = isSpeakerMuted;
            const btn = document.getElementById('toggle-speaker');
            if (isSpeakerMuted) {
                btn.classList.add('danger');
                btn.innerHTML = `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
            } else {
                btn.classList.remove('danger');
                btn.innerHTML = `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
            }
        };

        async function setupWebRTC() {
"""

content = content.replace("function setupWebRTC() {", js_setup_webrtc)

# Inject local stream into peerConnection
content = content.replace(
    "const configuration = { 'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}] };\n            peerConnection = new RTCPeerConnection(configuration);",
    """const configuration = { 'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}] };
            peerConnection = new RTCPeerConnection(configuration);
            const stream = await initLocalAudio();
            if (stream) {
                stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
            }"""
)

# Handle mute_user from Host
content = content.replace(
    "} else if(msg.type === 'role_revoked') {",
    """} else if(msg.type === 'mute_user') {
                    if (localMicStream && !isMicMuted) {
                        document.getElementById('toggle-mic').click(); // trigger soft mute
                    }
                } else if(msg.type === 'role_revoked') {"""
)

with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\invite_client\join.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated join.html")
