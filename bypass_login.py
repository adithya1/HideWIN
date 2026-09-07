p = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

old_auth = "this.isAuthenticated = false;"
new_auth = "this.isAuthenticated = true; // BYPASSED FOR TESTING"

if old_auth in text:
    text = text.replace(old_auth, new_auth, 1)
    print("SUCCESS: Bypassed login!")
else:
    print("ERROR: Could not find this.isAuthenticated = false;")

with open(p, "w", encoding="utf-8") as f:
    f.write(text)
