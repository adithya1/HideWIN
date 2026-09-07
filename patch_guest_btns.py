with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\invite_client\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_btns = """                <button class="control-btn" id="btn-mic" onclick="toggleRole('mic')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                    <span>Req Mic</span>
                </button>
                <button class="control-btn" id="btn-mouse" onclick="toggleRole('mouse')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="7" ry="7"></rect><line x1="12" y1="6" x2="12" y2="10"></line></svg>
                    <span>Req Mouse</span>
                </button>"""

new_btns = """                <button class="control-btn" id="btn-mic" onclick="toggleRole('mic')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                    <span>Req Mic</span>
                </button>
                <button class="control-btn" id="btn-speaker" onclick="toggleRole('speaker')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                    <span>Req Audio</span>
                </button>
                <button class="control-btn" id="btn-mouse" onclick="toggleRole('mouse')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="7" ry="7"></rect><line x1="12" y1="6" x2="12" y2="10"></line></svg>
                    <span>Req Mouse</span>
                </button>
                <button class="control-btn" id="btn-keyboard" onclick="toggleRole('keyboard')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="6" y1="8" x2="6.01" y2="8"></line><line x1="10" y1="8" x2="10.01" y2="8"></line><line x1="14" y1="8" x2="14.01" y2="8"></line><line x1="18" y1="8" x2="18.01" y2="8"></line><line x1="8" y1="12" x2="8.01" y2="12"></line><line x1="12" y1="12" x2="12.01" y2="12"></line><line x1="16" y1="12" x2="16.01" y2="12"></line><line x1="7" y1="16" x2="17" y2="16"></line></svg>
                    <span>Req Keybd</span>
                </button>"""

content = content.replace(old_btns, new_btns)

with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\invite_client\index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Added Keyboard and Speaker buttons")
