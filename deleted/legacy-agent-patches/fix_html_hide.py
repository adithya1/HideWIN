import os
import re

p = r"C:\Users\akula\Downloads\Hide-WIN - Copy\hidewin-fastapi\invite_client\index.html"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# Replace the window.onload logic with inline synchronous logic
new_logic = """
        // Parse URL params immediately
        const params = new URLSearchParams(window.location.search);
        const channelParam = params.get('channel');
        const passcodeParam = params.get('passcode');
        
        if (channelParam && passcodeParam) {
            // Direct Login flow! Hide the ID/Passcode inputs immediately
            document.getElementById('channel-id').value = channelParam;
            document.getElementById('passcode').value = passcodeParam;
            
            document.getElementById('channel-group').style.display = 'none';
            document.getElementById('passcode-group').style.display = 'none';
            document.getElementById('join-subtitle').innerText = 'You have been invited. Enter your name to join.';
            
            // Focus name input after a tiny delay to ensure render
            setTimeout(() => document.getElementById('participant-name').focus(), 50);
        }
        
        window.onload = () => {
"""

text = re.sub(r'window\.onload = \(\) => \{\s*const params = new URLSearchParams\(window\.location\.search\);\s*const channelParam = params\.get\(\'channel\'\);\s*const passcodeParam = params\.get\(\'passcode\'\);\s*if \(channelParam && passcodeParam\) \{\s*// Direct Login flow! Hide the ID/Passcode inputs\s*channelInput\.value = channelParam;\s*passcodeInput\.value = passcodeParam;\s*document\.getElementById\(\'channel-group\'\)\.style\.display = \'none\';\s*document\.getElementById\(\'passcode-group\'\)\.style\.display = \'none\';\s*document\.getElementById\(\'join-subtitle\'\)\.innerText = \'You have been invited\. Enter your name to join\.\';\s*nameInput\.focus\(\);\s*\}\s*', new_logic, text)

with open(p, "w", encoding="utf-8") as f:
    f.write(text)
print("Updated index.html to hide fields synchronously!")
