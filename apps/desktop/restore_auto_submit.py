import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\renderer.js"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Add auto-submit logic based on silence (1500ms)
auto_submit_logic = r"""
    sttAccumulated = (sttAccumulated + ' ' + text).trim();

    // Show accumulated so far
    if (app && typeof app.updateLiveTranscription === 'function') {
        app.updateLiveTranscription(sttAccumulated);
    }

    // Auto-submit after 1.5 seconds of silence (splits blocks automatically)
    if (sttSilenceTimer) clearTimeout(sttSilenceTimer);
    sttSilenceTimer = setTimeout(async () => {
        const question = sttAccumulated.trim();
        if (question.length > 2 && !sttSubmitting) {
            sttSubmitting = true;
            console.log('[STT] Auto-submitting due to silence:', question);
            sttAccumulated = '';
            if (app && typeof app.updateLiveTranscription === 'function') {
                app.updateLiveTranscription('');
            }
            try {
                await window.hideWin.ipcRenderer.invoke('send-text-message', question);
            } catch (err) {
                console.error('[STT] Auto-Submit error:', err);
            } finally {
                sttSubmitting = false;
            }
        }
    }, 1500);
"""

# Replace the block that just accumulates without auto-submitting
target = r"""    sttAccumulated = \(sttAccumulated \+ ' ' \+ text\)\.trim\(\);

    // Show accumulated so far
    if \(app && typeof app\.updateLiveTranscription === 'function'\) \{
        app\.updateLiveTranscription\(sttAccumulated\);
    \}

    // User requested MANUAL trigger via Ctrl\+Enter\. Auto-submit removed\.
    // sttAccumulated just keeps growing as they speak\."""

content = re.sub(target, auto_submit_logic, content)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Auto-submit restored!")
