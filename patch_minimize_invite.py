with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'r', encoding='utf-8') as f:
    content = f.read()

old_btns = """<div class="top-bar-right">
                                    <button class="leave-btn" @click=${() => this.confirmLeave()}>Leave</button>
                                </div>"""

new_btns = """<div class="top-bar-right" style="display: flex; gap: 12px;">
                                    <button style="background: transparent; border: 1px solid #d1d5db; color: #4b5563; padding: 6px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px;" @click=${() => this.dispatchEvent(new CustomEvent('minimize-meeting', { bubbles: true, composed: true }))}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line></svg>
                                        Minimize
                                    </button>
                                    <button class="leave-btn" @click=${() => this.confirmLeave()}>Leave</button>
                                </div>"""

content = content.replace(old_btns, new_btns)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Added minimize button to InviteView")
