import os
import re

p = r"C:\Users\akula\Downloads\Hide-WIN - Copy\hidewin-fastapi\invite_client\index.html"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

stt_ui = """
        <div class="meeting-info" id="meeting-badge">HideWIN Session</div>
        
        <!-- Live STT Captions Overlay -->
        <div id="captions-container" style="display: none; position: absolute; bottom: 100px; left: 50%; transform: translateX(-50%); width: 80%; text-align: center; pointer-events: none;">
            <span id="captions-text" style="background: rgba(0,0,0,0.7); color: white; padding: 10px 20px; border-radius: 8px; font-size: 18px; font-weight: 500; display: inline-block; text-shadow: 0 1px 2px black;"></span>
        </div>
"""

stt_script = """
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
"""

if "captions-container" not in text:
    text = text.replace('<div class="meeting-info"', stt_ui.strip())
    text = text.replace("window.onload = () => {", stt_script + "\n        window.onload = () => {")
    with open(p, "w", encoding="utf-8") as f:
        f.write(text)
    print("Injected Live STT Subtitles into Web Client!")
else:
    print("STT already injected!")
