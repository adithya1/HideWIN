import re

path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Inject a simulated stealth start after 5 seconds for testing
test_inject = """
    setTimeout(() => {
        console.log('SIMULATING ALT+A PRESS...');
        if (!stealthActive) {
            stealthActive = true;
            broadcastStealthState(true);
            startStealthMode(true);
        }
    }, 5000);
"""

if 'SIMULATING ALT+A' not in content:
    content = content.replace("    if (keybinds.momentaryStealth) {", test_inject + "    if (keybinds.momentaryStealth) {")
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Injected simulation timeout!")
else:
    print("Already injected.")
