import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\AssistantView.js"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Extract the block to replace
start_idx = content.find('<div class="history-list">')
end_idx = content.find('<div class="left-footer">')

if start_idx != -1 and end_idx != -1:
    before = content[:start_idx]
    after = content[end_idx:]
    
    replacement = """<div class="history-list">
                    ${hasResponses ? this.responses.map((item, idx) => {
                        const isObj = typeof item === 'object' && item !== null;
                        const rawQuestion = isObj ? (item.question || item.prompt || item.transcription || '') : '';
                        const qText = rawQuestion ? rawQuestion.replace(/^\\[(Interviewer|Candidate)\\]:\\s*/gi, '').trim() : '';
                        const timestamp = isObj && item.timestamp ? item.timestamp : new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
                        
                        if (!qText) return '';
                        
                        const isActive = this.currentResponseIndex === idx;
                        const hasAnswer = isObj && item.answer && !item.answer.includes('Generating response');
                        
                        return html`
                            <div class="history-item ${isActive ? 'active' : ''}" @click=${() => {
                                this.currentResponseIndex = idx;
                                this.requestUpdate();
                            }}>
                                <div class="history-time">${timestamp}</div>
                                <div class="history-question">${qText}</div>
                                ${isActive && hasAnswer && this.liveTranscription ? html`
                                    <div class="live-caption" style="margin-top: 12px; padding: 12px 16px; border-left: 3px solid #22C55E; background: #1c2120; border-radius: 8px;">
                                        <div class="live-caption-title" style="color: #22C55E; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 6px;">🗣️ User Explaining:</div>
                                        <div style="font-size: 14.5px; color: #d1d5db;">${this.liveTranscription}</div>
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }) : ''}
                    
                    ${this.liveTranscription && (!hasResponses || (hasResponses && (!this.responses[this.currentResponseIndex]?.answer || this.responses[this.currentResponseIndex]?.answer?.includes('Generating response')))) ? html`
                        <div class="live-caption" style="margin-top: 16px; padding: 12px 16px; border-left: 3px solid #6366f1; background: #2a2b2f; border-radius: 8px;">
                            <div class="live-caption-title" style="color: #9aa0a6; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 6px;">🎙️ Interviewer Asking:</div>
                            <div style="font-size: 14.5px; color: #d1d5db;">${this.liveTranscription}</div>
                        </div>
                    ` : ''}
                </div>
                """
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(before + replacement + after)
    print("UI logic correctly updated!")
else:
    print("Could not find the target HTML blocks.")
