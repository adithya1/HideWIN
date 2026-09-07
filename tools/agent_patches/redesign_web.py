import os

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HideWIN Meet</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #202124;
            --surface-color: #3c4043;
            --primary: #8ab4f8;
            --primary-hover: #aecbfa;
            --text-main: #e8eaed;
            --text-muted: #9aa0a6;
            --danger: #ea4335;
        }
        * { box-sizing: border-box; font-family: 'Inter', sans-serif; }
        body { background: var(--bg-color); color: var(--text-main); margin: 0; padding: 0; height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        
        /* Pre-Join Screen */
        .join-container { background: #2b2d31; padding: 40px; border-radius: 16px; width: 100%; max-width: 480px; box-shadow: 0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.2); }
        .join-header { text-align: center; margin-bottom: 30px; }
        .join-header h1 { font-size: 24px; font-weight: 400; margin: 0 0 8px 0; }
        .join-header p { color: var(--text-muted); font-size: 14px; margin: 0; }
        
        .input-group { margin-bottom: 20px; }
        .input-group label { display: block; font-size: 13px; color: var(--text-muted); margin-bottom: 8px; font-weight: 500; }
        .input-group input { width: 100%; background: #1e1f22; border: 1px solid #4a4d51; border-radius: 8px; padding: 12px 16px; color: white; font-size: 15px; transition: border 0.2s; }
        .input-group input:focus { outline: none; border-color: var(--primary); }
        
        .btn { width: 100%; padding: 12px; border-radius: 8px; border: none; font-size: 15px; font-weight: 500; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-primary { background: var(--primary); color: #202124; }
        .btn-primary:hover { background: var(--primary-hover); }
        .btn-danger { background: var(--danger); color: white; }
        
        /* Meeting Screen */
        #call-screen { width: 100%; height: 100%; display: none; flex-direction: column; position: relative; }
        .video-container { flex: 1; display: flex; align-items: center; justify-content: center; padding: 20px; position: relative; }
        #remote-video { max-width: 100%; max-height: 100%; border-radius: 8px; object-fit: contain; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        
        .empty-state { position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-muted); }
        .empty-state svg { width: 64px; height: 64px; margin-bottom: 16px; opacity: 0.5; }
        
        /* Floating Controls */
        .controls-bar { position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); background: #3c4043; border-radius: 100px; padding: 12px 24px; display: flex; gap: 16px; align-items: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); }
        .control-btn { width: 44px; height: 44px; border-radius: 50%; background: #3c4043; border: 1px solid #5f6368; display: flex; align-items: center; justify-content: center; cursor: pointer; color: white; transition: all 0.2s; }
        .control-btn:hover { background: #4a4d51; }
        .control-btn.active { background: var(--primary); color: #202124; border-color: var(--primary); }
        .control-btn.danger { background: var(--danger); border-color: var(--danger); }
        
        .meeting-info { position: absolute; bottom: 24px; left: 24px; color: white; font-size: 14px; font-weight: 500; text-shadow: 0 1px 2px rgba(0,0,0,0.5); }
    </style>
</head>
<body>

    <!-- PRE-JOIN SCREEN -->
    <div class="join-container" id="join-screen">
        <div class="join-header">
            <h1>HideWIN Meet</h1>
            <p id="join-subtitle">Enter your details to join the secure collaboration session.</p>
        </div>
        
        <div class="input-group" id="name-group">
            <label>Your Name</label>
            <input type="text" id="participant-name" placeholder="John Doe">
        </div>
        
        <div class="input-group" id="channel-group">
            <label>Channel ID</label>
            <input type="text" id="channel-id" placeholder="HW-XXXX-XXXX">
        </div>
        
        <div class="input-group" id="passcode-group">
            <label>Passcode</label>
            <input type="password" id="passcode" placeholder="Enter session passcode">
        </div>
        
        <button class="btn btn-primary" id="join-btn">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
            Ask to Join
        </button>
    </div>

    <!-- MEETING SCREEN -->
    <div id="call-screen">
        <div class="video-container">
            <div class="empty-state" id="empty-state">
                <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z"></path><rect width="10" height="14" x="3" y="5" rx="2"></rect></svg>
                <div id="call-status">Waiting for host to accept and share screen...</div>
            </div>
            <video id="remote-video" autoplay playsinline></video>
        </div>
        
        <div class="meeting-info" id="meeting-badge">HideWIN Session</div>
        
        <div class="controls-bar" id="controls-bar" style="display: none;">
            <!-- Remote Control Request (Mouse) -->
            <button class="control-btn" id="request-mouse" title="Request Remote Control">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path><path d="M13 13l6 6"></path></svg>
            </button>
            
            <!-- STT Transcription Toggle -->
            <button class="control-btn" id="toggle-stt" title="Manual Transcription">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </button>
            
            <!-- Leave -->
            <button class="control-btn danger" id="leave-btn" title="Leave Session">
                <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10.66 17.66l-5.32-5.32 5.32-5.32"></path><path d="M5.34 12.34H21"></path></svg>
            </button>
        </div>
    </div>

    <script>
        let ws;
        let peerConnection;
        const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
        
        const joinBtn = document.getElementById('join-btn');
        const nameInput = document.getElementById('participant-name');
        const channelInput = document.getElementById('channel-id');
        const passcodeInput = document.getElementById('passcode');
        const statusText = document.getElementById('call-status');
        
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

        function setupWebRTC() {
            peerConnection = new RTCPeerConnection(configuration);
            
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
    </script>
</body>
</html>"""

p = r"C:\Users\akula\Downloads\Hide-WIN - Copy\hidewin-fastapi\invite_client\index.html"
with open(p, "w", encoding="utf-8") as f:
    f.write(html_content)
print("Updated Web Client to Professional Teams/Meet layout with Direct Login flow!")
