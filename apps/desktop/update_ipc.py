import sys

with open("src/utils/renderer.js", "r", encoding="utf-8") as f:
    code = f.read()

ipc_listener_fixed = """
let voskSilenceTimer = null;
let currentVoskUtterance = '';

window.hideWin.ipcRenderer.on('live-transcription', (text) => {
    const app = document.querySelector('hide-win-app');
    if (app && typeof app.updateLiveTranscription === 'function') {
        app.updateLiveTranscription(text);
    }
    
    currentVoskUtterance = text;
    
    if (voskSilenceTimer) clearTimeout(voskSilenceTimer);
    voskSilenceTimer = setTimeout(async () => {
        if (currentVoskUtterance && currentVoskUtterance.trim().length > 0) {
            const questionText = currentVoskUtterance.trim();
            currentVoskUtterance = '';
            
            if (app && typeof app.updateLiveTranscription === 'function') {
                app.updateLiveTranscription('');
            }
            
            try {
                await window.hideWin.ipcRenderer.invoke('send-text-message', questionText);
            } catch(e) {
                console.error("Error submitting vosk transcription", e);
            }
        }
    }, 1500); // 1.5 second silence timeout for Vosk
});
"""

# Replace the old one with the fixed one
code = code.replace("""window.hideWin.ipcRenderer.on('live-transcription', (text) => {
    const app = document.querySelector('hide-win-app');
    if (app && typeof app.updateLiveTranscription === 'function') {
        app.updateLiveTranscription(text);
    }
});""", ipc_listener_fixed)

with open("src/utils/renderer.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Updated IPC listener with debouncer")
