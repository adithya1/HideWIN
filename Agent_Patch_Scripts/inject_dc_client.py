import os
import re

p = r"C:\Users\akula\Downloads\Hide-WIN - Copy\hidewin-fastapi\invite_client\index.html"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

script_additions = """
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
"""

# Inject before peerConnection = new RTCPeerConnection
if "let dataChannel;" not in text:
    text = text.replace("function setupWebRTC() {", script_additions + "\n        function setupWebRTC() {")
    
    # Inject ondatachannel
    dc_handler = """            peerConnection.ondatachannel = (e) => {
                dataChannel = e.channel;
            };"""
    text = text.replace("peerConnection.onicecandidate =", dc_handler + "\n            peerConnection.onicecandidate =")
    
    with open(p, "w", encoding="utf-8") as f:
        f.write(text)
    print("Injected Remote Control logic into Web Client!")
else:
    print("Already injected!")
