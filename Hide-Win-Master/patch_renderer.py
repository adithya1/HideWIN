import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\renderer.js"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Replace variables
content = content.replace("voskSilenceTimer", "sttSilenceTimer")
content = content.replace("voskAccumulated", "sttAccumulated")
content = content.replace("voskSubmitting", "sttSubmitting")
content = content.replace("[Vosk]", "[STT]")

# Remove the setTimeout auto-submit block and add the Ctrl+Enter listener
pattern = r"// Reset silence timer.*?if \(sttSilenceTimer\) clearTimeout\(sttSilenceTimer\);\s*sttSilenceTimer = setTimeout\(async \(\) => \{.*?\}, 1200\);\s*\}\);"

replacement = """// User requested MANUAL trigger via Ctrl+Enter. Auto-submit removed.
    // sttAccumulated just keeps growing as they speak.
});

// --- Ctrl + Enter Manual Submission Logic ---
window.addEventListener('keydown', async (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        const app = document.querySelector('hide-win-app');
        const question = sttAccumulated.trim();
        
        if (question.length > 2 && !sttSubmitting) {
            sttSubmitting = true;
            console.log('[STT] Manually submitting question:', question);
            
            // Clear UI immediately for feedback
            sttAccumulated = '';
            if (app && typeof app.updateLiveTranscription === 'function') {
                app.updateLiveTranscription('');
            }
            
            try {
                await window.hideWin.ipcRenderer.invoke('send-text-message', question);
            } catch (err) {
                console.error('[STT] Submit error:', err);
            } finally {
                sttSubmitting = false;
            }
        }
    }
});"""

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("renderer.js patched for Ctrl+Enter.")
