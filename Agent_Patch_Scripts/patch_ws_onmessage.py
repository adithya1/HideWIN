import os
p = r"C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

target = """            if(msg.type === 'channel_created') {
                this.hostToken = msg.token;
                this.requestUpdate();
            } else if(msg.type === 'participant_joined') {
                this.participants = [
                    ...this.participants,
                    { id: 'guest-' + Date.now(), name: msg.name || 'Guest', role: 'Waiting for approval', status: 'waiting' }
                ];
                this.requestUpdate();
            }
        };"""

replacement = """            if(msg.type === 'channel_created') {
                this.hostToken = msg.token;
                this.requestUpdate();
            } else if(msg.type === 'participant_joined') {
                this.participants = [
                    ...this.participants,
                    { id: 'guest-' + Date.now(), name: msg.name || 'Guest', role: 'Waiting for approval', status: 'waiting' }
                ];
                this.requestUpdate();
            } else if (msg.type === 'answer' || msg.type === 'candidate' || msg.type === 'ice_candidate') {
                this.handleWebRTCMessage(msg);
            }
        };"""

if "this.handleWebRTCMessage(msg)" not in text:
    text = text.replace(target, replacement)
    text = text.replace(target.replace('\r\n', '\n'), replacement.replace('\r\n', '\n'))
    with open(p, "w", encoding="utf-8") as f:
        f.write(text)
    print("Patched ws.onmessage in InviteView.js!")
else:
    print("Already patched!")
