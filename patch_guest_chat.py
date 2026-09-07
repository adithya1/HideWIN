import re

with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\invite_client\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Chat Tab Header
old_tabs = """                <button class="tab-btn active" onclick="switchTab('ai')">AI Chat</button>
                <button class="tab-btn" onclick="switchTab('transcript')">Transcript</button>"""
new_tabs = """                <button class="tab-btn active" onclick="switchTab('ai')">AI Chat</button>
                <button class="tab-btn" onclick="switchTab('chat')">Meeting Chat</button>
                <button class="tab-btn" onclick="switchTab('transcript')">Transcript</button>"""
content = content.replace(old_tabs, new_tabs)

# 2. Add Chat Tab Content
old_ai_content = """            <div class="tab-content active" id="tab-ai">
                <div id="ai-chat-log" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">
                    <div class="ai-message">Click AI Cam to analyze the host's screen!</div>
                </div>
                <div class="ai-input-bar">
                    <input type="text" id="ai-prompt" placeholder="Ask AI about the screen...">
                    <button id="send-ai">Send</button>
                </div>
            </div>"""

chat_content = """            <div class="tab-content" id="tab-chat">
                <div id="meeting-chat-log" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">
                </div>
                <div class="ai-input-bar">
                    <input type="text" id="chat-input" placeholder="Type a message to everyone..." onkeyup="if(event.key === 'Enter') sendMeetingChat()">
                    <button onclick="sendMeetingChat()">Send</button>
                </div>
            </div>"""

content = content.replace(old_ai_content, old_ai_content + "\n" + chat_content)

# 3. Add sendMeetingChat() script
send_chat_script = """          function sendMeetingChat() {
              const input = document.getElementById('chat-input');
              const text = input.value.trim();
              if(!text || !ws) return;
              const msg = { type: 'chat_message', sender: guestName || 'Guest', text: text };
              ws.send(JSON.stringify(msg));
              
              const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
              document.getElementById('meeting-chat-log').innerHTML += `<div class="ai-message user"><b>You</b> (${time}):<br>${text}</div>`;
              input.value = '';
          }"""
content = content.replace("function switchTab(tab) {", send_chat_script + "\n\n          function switchTab(tab) {")

# 4. Handle incoming chat_message in WS
old_ws = "} else if (msg.type === 'forwarded_request') {"
new_ws = """} else if (msg.type === 'chat_message') {
                                const log = document.getElementById('meeting-chat-log');
                                const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                                log.innerHTML += `<div class="ai-message"><b>${msg.sender}</b> (${time}):<br>${msg.text}</div>`;
                                log.scrollTop = log.scrollHeight;
                                // If not on chat tab, maybe show alert
                                if (!document.getElementById('tab-chat').classList.contains('active')) {
                                    alert(`New message from ${msg.sender}: ${msg.text}`);
                                }
                            } else if (msg.type === 'forwarded_request') {"""
content = content.replace(old_ws, new_ws)

with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\invite_client\index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched Guest UI for Chat")
