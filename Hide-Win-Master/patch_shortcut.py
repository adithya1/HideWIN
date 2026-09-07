import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\renderer.js"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

pattern = r"function handleShortcut\(shortcutKey\) \{.*?if \(shortcutKey === 'ctrl\+enter' \|\| shortcutKey === 'cmd\+enter'\) \{.*?if \(currentView === 'main'\) \{.*?hideWin\.element\(\)\.handleStart\(\);.*?\} else \{.*?captureManualScreenshot\(\);.*?\}\s*\}\s*\}"

replacement = """function handleShortcut(shortcutKey) {
    const currentView = hideWin.getCurrentView();

    if (shortcutKey === 'ctrl+enter' || shortcutKey === 'cmd+enter') {
        if (currentView === 'main') {
            hideWin.element().handleStart();
        } else {
            // New Logic: Prefer submitting transcription over taking a screenshot
            const question = (typeof sttAccumulated !== 'undefined') ? sttAccumulated.trim() : '';
            const app = document.querySelector('hide-win-app');
            
            if (question.length > 2 && !sttSubmitting) {
                sttSubmitting = true;
                console.log('[STT] Manually submitting transcription via global shortcut:', question);
                
                // Clear UI immediately for feedback
                if (typeof sttAccumulated !== 'undefined') sttAccumulated = '';
                if (app && typeof app.updateLiveTranscription === 'function') {
                    app.updateLiveTranscription('');
                }
                
                window.hideWin.ipcRenderer.invoke('send-text-message', question)
                    .catch(err => console.error('[STT] Submit error:', err))
                    .finally(() => { sttSubmitting = false; });
            } else {
                console.log('[Shortcut] No transcription text available, falling back to manual screenshot');
                captureManualScreenshot();
            }
        }
    }
}"""

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("handleShortcut in renderer.js patched.")
