import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\AssistantView.js"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Fix the HTML replacement bug
content = content.replace('<div class="live-caption-title">Live Transcript...</div>', '<div class="live-caption-title">🗣️ USER TRANSCRIPT...</div>')

# Also, let's change the rendering of liveTranscription so that if there IS an active question, it renders INSIDE the active card at the bottom.
# This perfectly satisfies "user respond transaction we can see word by word in below the quesion ans: user what he speaken word by word transcption can capture".

# We'll modify the render method where it loops over this.responses
pattern = r"(\<div class=\"history-question\"\>.*?)(?=\</div\>\s*\</div\>)"
# Wait, let's just find the loop logic and inject the live transcription block dynamically if it's the active item and AI has answered.

# Let's replace the whole history-list block with a smarter one.
replacement = r"""
                <div class="history-list">
                    ${hasResponses ? this.responses.map((item, idx) => {
                        const isObj = typeof item === 'object' && item !== null;
                        const rawQuestion = isObj ? (item.question || item.prompt || item.transcription || '') : '';
                        const qText = rawQuestion ? rawQuestion.replace(/^\[(Interviewer|Candidate)\]:\s*/gi, '').trim() : '';
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
                                    <div class="live-caption" style="margin-top: 12px; padding: 8px 12px; border-left: 3px solid #22C55E; background: rgba(34, 197, 94, 0.1);">
                                        <div class="live-caption-title" style="color: #22C55E;">🗣️ USER RESPONSE</div>
                                        <div style="font-size: 13.5px; color: #e8eaed;">${this.liveTranscription}</div>
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }) : ''}
                    
                    ${this.liveTranscription && (!hasResponses || (hasResponses && (!this.responses[this.currentResponseIndex]?.answer || this.responses[this.currentResponseIndex]?.answer?.includes('Generating response')))) ? html`
                        <div class="live-caption">
                            <div class="live-caption-title">🗣️ LISTENING (INTERVIEWER)...</div>
                            ${this.liveTranscription}
                        </div>
                    ` : ''}
                </div>
"""

content = re.sub(r'<div class="history-list">.*?</div>(?=\s*<div class="left-footer">)', replacement, content, flags=re.DOTALL)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("AssistantView history logic updated!")
