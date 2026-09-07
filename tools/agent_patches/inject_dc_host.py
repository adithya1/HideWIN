import os
import re

p = r"C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

dc_logic = """
            // Create DataChannel for Remote Control BEFORE creating offer
            this.dataChannel = this.peerConnection.createDataChannel("control");
            this.dataChannel.onmessage = async (event) => {
                try {
                    const data = JSON.parse(event.data);
                    // Forward to Python backend
                    fetch('http://127.0.0.1:8000/api/user/remote-control', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    }).catch(err => console.error("RC Error:", err));
                } catch(e) {}
            };
            
            const offer ="""

if "createDataChannel" not in text:
    text = text.replace("const offer =", dc_logic)
    with open(p, "w", encoding="utf-8") as f:
        f.write(text)
    print("Injected DataChannel into InviteView.js!")
else:
    print("DataChannel already injected!")
