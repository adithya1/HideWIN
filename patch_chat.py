with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Properties
if "chatMessages: { type: Array }" not in content:
    content = content.replace("activeSidebar: { type: String },", "activeSidebar: { type: String },\n        chatMessages: { type: Array },\n        chatInput: { type: String },")

# 2. Defaults
if "this.chatMessages = [];" not in content:
    content = content.replace("this.activeSidebar = null;", "this.activeSidebar = null;\n        this.chatMessages = [];\n        this.chatInput = '';")

# 3. WS Handler
ws_handler = """                      } else if(msg.type === 'candidate' || msg.type === 'answer') {
                          this.handleSignalingData(msg.guest_id, msg);
                      } else if(msg.type === 'chat_message') {
                          this.chatMessages = [...this.chatMessages, { sender: msg.sender, text: msg.text, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }];
                          if (this.activeSidebar !== 'chat') this.showToast(`New message from ${msg.sender}`, "success");
                          this.requestUpdate();
                      }"""
content = content.replace("""                      } else if(msg.type === 'candidate' || msg.type === 'answer') {
                          this.handleSignalingData(msg.guest_id, msg);
                      }""", ws_handler)

# 4. Chat Button in Top Bar
chat_btn = """                                    <button class="meeting-action-btn ${this.activeSidebar === 'chat' ? 'active' : ''}" @click=${() => this.activeSidebar = this.activeSidebar === 'chat' ? null : 'chat'}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                        <span>Chat</span>
                                    </button>
                                    
                                    <button class="meeting-action-btn ${this.activeSidebar === 'people' ? 'active' : ''}" @click=${() => this.activeSidebar = this.activeSidebar === 'people' ? null : 'people'}>"""
content = content.replace("""                                    <button class="meeting-action-btn ${this.activeSidebar === 'people' ? 'active' : ''}" @click=${() => this.activeSidebar = this.activeSidebar === 'people' ? null : 'people'}>""", chat_btn)

# 5. Chat Sidebar HTML
chat_sidebar = """
                                ${this.activeSidebar === 'chat' ? html`
                                    <div class="meeting-sidebar">
                                        <div class="sidebar-header">
                                            <span>Meeting Chat</span>
                                            <button class="sidebar-close" @click=${() => this.activeSidebar = null}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                                        </div>
                                        <div class="sidebar-content" style="padding: 16px; display: flex; flex-direction: column; height: 100%;">
                                            <div style="flex: 1; overflow-y: auto; margin-bottom: 12px; display: flex; flex-direction: column; gap: 12px;">
                                                ${this.chatMessages.length === 0 ? html`<div style="color: #6b7280; font-size: 13px; text-align: center; margin-top: 20px;">No messages yet. Start the conversation!</div>` : ''}
                                                ${this.chatMessages.map(m => html`
                                                    <div style="display: flex; flex-direction: column; align-items: ${m.sender === 'You' ? 'flex-end' : 'flex-start'};">
                                                        <span style="font-size: 11px; color: #6b7280; margin-bottom: 2px;">${m.sender} • ${m.time}</span>
                                                        <div style="background: ${m.sender === 'You' ? '#dbeafe' : '#f3f4f6'}; color: #1f2937; padding: 8px 12px; border-radius: 8px; font-size: 13px; max-width: 90%; word-break: break-word;">
                                                            ${m.text}
                                                        </div>
                                                    </div>
                                                `)}
                                            </div>
                                            <div style="display: flex; gap: 8px;">
                                                <input type="text" style="flex: 1; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px 12px; font-size: 13px; outline: none;" placeholder="Type a message..." .value=${this.chatInput} @input=${e => this.chatInput = e.target.value} @keyup=${e => { if (e.key === 'Enter') this.sendChat(); }}>
                                                <button style="background: #3b82f6; color: white; border: none; border-radius: 6px; padding: 0 16px; cursor: pointer;" @click=${() => this.sendChat()}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ` : ''}"""

content = content.replace("""                                ${this.activeSidebar === 'settings' ? html`""", chat_sidebar + """\n                                ${this.activeSidebar === 'settings' ? html`""")

# 6. sendChat function
send_chat_fn = """    sendChat() {
        if (!this.chatInput || !this.chatInput.trim()) return;
        const msg = { type: 'chat_message', sender: 'You', text: this.chatInput };
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(msg));
        }
        this.chatMessages = [...this.chatMessages, { ...msg, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }];
        this.chatInput = '';
        this.requestUpdate();
    }
"""
if "sendChat()" not in content:
    content = content.replace("render() {", send_chat_fn + "\n    render() {")

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Injected Chat feature into InviteView")
