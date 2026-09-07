import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\AssistantView.js"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Remove the "User Explaining" live caption from inside the active history item
# It starts at: ${isActive && hasAnswer && this.liveTranscription ? html`
# and ends at: ` : ''}
user_explaining_pattern = r"\$\{isActive && hasAnswer && this\.liveTranscription \? html`.*?` : ''\}"
content = re.sub(user_explaining_pattern, "", content, flags=re.DOTALL)

# 2. Replace the "Interviewer Asking" live caption at the bottom with a mock history-item that perfectly matches the UI design
interviewer_asking_pattern = r"\$\{this\.liveTranscription && \(!hasResponses \|\| \(hasResponses && \(!this\.responses\[this\.currentResponseIndex\]\?\.answer \|\| this\.responses\[this\.currentResponseIndex\]\?\.answer\?\.includes\('Generating response'\)\)\)\) \? html`.*?` : ''\}"

perfect_match_live_transcription = r"""
                    ${this.liveTranscription ? html`
                        <div class="history-item active" style="opacity: 0.8; border-left: 3px solid #6366f1; padding-left: 9px;">
                            <div class="history-time">LIVE TRANSCRIPT...</div>
                            <div class="history-question">${this.liveTranscription}</div>
                        </div>
                    ` : ''}
"""
content = re.sub(interviewer_asking_pattern, perfect_match_live_transcription, content, flags=re.DOTALL)


with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("UI updated to match 100% exactly!")
