p = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# OLD startStealthMode opening
old_start = """    const startStealthMode = () => {
        if (blockerProcess) return;

        // Capture frozen position
        const curPos = screen.getCursorScreenPoint();
        frozenScreenX = curPos.x;
        frozenScreenY = curPos.y;
        redDotDX = 0;
        redDotDY = 0;

        try {"""

# NEW startStealthMode opening — saves mouseEventsIgnored state and temporarily enables events
new_start = """    const startStealthMode = () => {
        if (blockerProcess) return;

        // Capture frozen position
        const curPos = screen.getCursorScreenPoint();
        frozenScreenX = curPos.x;
        frozenScreenY = curPos.y;
        redDotDX = 0;
        redDotDY = 0;

        // ── KEY FIX: When in undetectable (click-through) mode, we must temporarily
        // allow mouse events so sendInputEvent from MouseBlocker.exe is processed.
        // Save the current state and restore it when stealth stops.
        preStealthMouseEventsIgnored = mouseEventsIgnored;
        if (mouseEventsIgnored) {
            mouseEventsIgnored = false;
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.setIgnoreMouseEvents(false);
                console.log('Stealth: temporarily re-enabled mouse events for click injection');
            }
        }

        try {"""

if old_start in text:
    text = text.replace(old_start, new_start)
    print("SUCCESS: Patched startStealthMode")
else:
    print("ERROR: Could not find startStealthMode opening block")

# OLD stopStealthMode
old_stop = """    const stopStealthMode = () => {
        if (!blockerProcess) return;
        blockerProcess.stdin.end();
        blockerProcess = null;
        stealthActive = false;"""

# NEW stopStealthMode — restores mouseEventsIgnored state
new_stop = """    const stopStealthMode = () => {
        if (!blockerProcess) return;
        blockerProcess.stdin.end();
        blockerProcess = null;
        stealthActive = false;

        // ── KEY FIX: Restore undetectable mode if it was active before stealth started
        if (preStealthMouseEventsIgnored && !mouseEventsIgnored) {
            mouseEventsIgnored = true;
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.setIgnoreMouseEvents(true, { forward: true });
                console.log('Stealth: restored undetectable mode (ignore mouse events)');
            }
        }"""

if old_stop in text:
    text = text.replace(old_stop, new_stop)
    print("SUCCESS: Patched stopStealthMode")
else:
    print("ERROR: Could not find stopStealthMode block")

with open(p, "w", encoding="utf-8") as f:
    f.write(text)

print("Done writing window.js")
