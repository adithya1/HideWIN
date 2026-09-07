import sys

with open("src/utils/renderer.js", "r", encoding="utf-8") as f:
    code = f.read()

ipc_listener = """
window.hideWin.ipcRenderer.on('live-transcription', (text) => {
    const app = document.querySelector('hide-win-app');
    if (app && typeof app.updateLiveTranscription === 'function') {
        app.updateLiveTranscription(text);
    }
});
"""

if "window.hideWin.ipcRenderer.on('live-transcription'" not in code:
    code = code + "\n" + ipc_listener

with open("src/utils/renderer.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Added IPC listener for live-transcription in renderer.js")
