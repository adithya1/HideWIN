p = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# When stealth (cursor-hidden) is active AND click-through is active,
# we need pointer-events to work so synthetic clicks are processed.
# Replace the blanket pointer-events:none rule with a conditional one.
old_css = """        :host(.click-through-active) .app-shell {
            pointer-events: none;
        }"""

new_css = """        /* In click-through mode, disable pointer-events UNLESS stealth (red arrow) is active.
           When stealth is active, synthetic clicks from MouseBlocker.exe must reach the DOM. */
        :host(.click-through-active:not(.cursor-hidden)) .app-shell {
            pointer-events: none;
        }"""

if old_css in text:
    text = text.replace(old_css, new_css)
    print("SUCCESS: Fixed click-through CSS to allow stealth clicks!")
else:
    print("ERROR: Could not find click-through CSS block")

with open(p, "w", encoding="utf-8") as f:
    f.write(text)
