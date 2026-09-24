import os
import re

p = r"C:\Users\akula\Downloads\Hide-WIN - Copy\hidewin-fastapi\invite_client\index.html"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# 1. Change Token to Passcode
text = text.replace("Token", "Passcode")
text = text.replace("token", "passcode")

# 2. Add auto-fill logic to the script
autofill_script = """
        window.onload = () => {
            const params = new URLSearchParams(window.location.search);
            const channelParam = params.get('channel');
            const passcodeParam = params.get('passcode');
            
            if (channelParam) {
                document.getElementById('channel-id').value = channelParam;
            }
            if (passcodeParam) {
                document.getElementById('passcode').value = passcodeParam;
            }
            
            if (channelParam && passcodeParam) {
                // Focus the name input if the others are auto-filled
                document.getElementById('participant-name').focus();
            }
        };

        document.getElementById('join-btn').onclick = () => {
"""

if "window.onload = () => {" not in text:
    text = text.replace("document.getElementById('join-btn').onclick = () => {", autofill_script)

with open(p, "w", encoding="utf-8") as f:
    f.write(text)
print("Updated Web Client with auto-fill logic and Passcode terminology!")
