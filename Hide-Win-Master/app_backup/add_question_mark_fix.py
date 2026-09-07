import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\renderer.js"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Add a function to safely ensure a question mark
ensure_question_mark_func = r"""
function ensureQuestionMark(text) {
    if (!text) return text;
    const trimmed = text.trim();
    if (trimmed.length === 0) return trimmed;
    const lastChar = trimmed[trimmed.length - 1];
    if (['?', '.', '!'].includes(lastChar)) {
        if (lastChar === '?') return trimmed;
        return trimmed.slice(0, -1) + '?'; // Replace . or ! with ?
    }
    return trimmed + '?';
}
"""
if "ensureQuestionMark" not in content:
    content = ensure_question_mark_func + content

# Update the auto-submit block
auto_submit_target = r"""            console.log\('\[STT\] Auto-submitting due to silence:', question\);
            sttAccumulated = '';
            if \(app && typeof app\.updateLiveTranscription === 'function'\) \{
                app\.updateLiveTranscription\(''\);
            \}
            try \{
                await window\.hideWin\.ipcRenderer\.invoke\('send-text-message', question\);"""

auto_submit_replacement = r"""            console.log('[STT] Auto-submitting due to silence:', question);
            sttAccumulated = '';
            
            const questionWithPunctuation = ensureQuestionMark(question);
            
            if (app) {
                if (typeof app.updateLiveTranscription === 'function') {
                    app.updateLiveTranscription('');
                }
                if (typeof app.addNewResponse === 'function') {
                    app.addNewResponse({
                        question: questionWithPunctuation,
                        answer: '⏳ *Generating response...*'
                    });
                }
            }
            
            try {
                await window.hideWin.ipcRenderer.invoke('send-text-message', questionWithPunctuation);"""

content = re.sub(auto_submit_target, auto_submit_replacement, content)

# Update the manual Ctrl+Enter block
manual_submit_target = r"""            console.log\('\[STT\] Manually submitting question:', question\);
            
            // Clear UI immediately for feedback
            sttAccumulated = '';
            if \(app && typeof app\.updateLiveTranscription === 'function'\) \{
                app\.updateLiveTranscription\(''\);
            \}
            
            try \{
                await window\.hideWin\.ipcRenderer\.invoke\('send-text-message', question\);"""

manual_submit_replacement = r"""            console.log('[STT] Manually submitting question:', question);
            
            // Clear UI immediately for feedback
            sttAccumulated = '';
            
            const questionWithPunctuation = ensureQuestionMark(question);
            
            if (app) {
                if (typeof app.updateLiveTranscription === 'function') {
                    app.updateLiveTranscription('');
                }
                if (typeof app.addNewResponse === 'function') {
                    app.addNewResponse({
                        question: questionWithPunctuation,
                        answer: '⏳ *Generating response...*'
                    });
                }
            }
            
            try {
                await window.hideWin.ipcRenderer.invoke('send-text-message', questionWithPunctuation);"""

content = re.sub(manual_submit_target, manual_submit_replacement, content)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("renderer.js updated to immediately save questions with a '?' appended!")
