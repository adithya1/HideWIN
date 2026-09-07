import re, shutil

bkp = r"C:\Users\akula\Downloads\Hide-WIN - Copy\Hide-Win-Master\src\components\app\HideWinApp.js"
live = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"

# Step 1: Read Aug25 backup
with open(bkp, "r", encoding="utf-8") as f:
    text = f.read()

print("Step 1: Loaded Aug25 backup, size:", len(text))

# Step 2: Add MeetingDashboardView and ScheduleMeetingView imports
if "MeetingDashboardView" not in text:
    text = text.replace(
        "import { AuthView }",
        "import { MeetingDashboardView } from '../views/MeetingDashboardView.js';\nimport { ScheduleMeetingView } from '../views/ScheduleMeetingView.js';\nimport { AuthView }"
    )
    print("Step 2: Added imports")
else:
    print("Step 2: Imports already present")

# Step 3: Add invite and schedule_meeting routes if not present
if "case 'invite'" not in text:
    # Find 'case \'help\'' and insert before it
    text = text.replace(
        "case 'help':",
        "case 'invite':\n                return html`<meeting-dashboard-view @new-meeting=${() => { this.currentView = 'schedule_meeting'; this.requestUpdate(); }}></meeting-dashboard-view>`;\n\n            case 'schedule_meeting':\n                return html`<schedule-meeting-view @close-meeting=${() => { this.currentView = 'invite'; this.requestUpdate(); }}></schedule-meeting-view>`;\n\n            case 'help':"
    )
    print("Step 3: Added invite and schedule_meeting routes")
else:
    print("Step 3: Routes already present")

# Step 4: Add fake-cursor CSS BEFORE :host(.cursor-hidden) block if not present
if ".fake-cursor {" not in text:
    fake_css = """        /* Stealth Red Cursor */
        :host(.cursor-hidden) * {
            cursor: none !important;
        }
        .fake-cursor {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 16px;
            height: 16px;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="red" stroke="white" stroke-width="1" d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.54.35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z"/></svg>');
            background-size: contain;
            background-repeat: no-repeat;
            pointer-events: none;
            z-index: 999999;
            transform: translate(0, 0);
        }
        :host(.cursor-hidden) .fake-cursor {
            display: block;
        }
"""
    # insert after static styles = css` opening
    text = re.sub(r'(static\s+styles\s*=\s*css`)', r'\1\n' + fake_css, text, count=1)
    print("Step 4: Added fake-cursor CSS")
else:
    print("Step 4: CSS already present")

# Step 5: Add fake-cursor div inside main app-shell if not present
if '<div class="fake-cursor"></div>' not in text:
    # Insert in the main app-shell (the one with style attribute - the main render shell)
    text = text.replace(
        '<div class="app-shell" style="${this.isSessionHidden',
        '<div class="fake-cursor"></div>\n            <div class="app-shell" style="${this.isSessionHidden'
    )
    print("Step 5: Added fake-cursor div to main shell")
else:
    print("Step 5: fake-cursor div already present")

# Step 6: Add _boundStealthMove logic that draws the red arrow
if "_boundStealthMove" not in text:
    stealthMove = """
            this._boundStealthMove = (_, pos) => {
                const cursor = this.shadowRoot.querySelector('.fake-cursor');
                if (cursor) {
                    cursor.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
                    let el = document.elementFromPoint(pos.x, pos.y);
                    while (el && el.shadowRoot) {
                        let inner = el.shadowRoot.elementFromPoint(pos.x, pos.y);
                        if (!inner || inner === el) break;
                        el = inner;
                    }
                    let cursorType = 'default';
                    if (el) { cursorType = window.getComputedStyle(el).cursor; }
                    if (cursorType === 'pointer') {
                        cursor.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="red" stroke="white" stroke-width="1" d="M19.32,11.59l-2.45-1.52A1.44,1.44,0,0,0,14.65,11v-4A2.65,2.65,0,0,0,12,4.38a2.65,2.65,0,0,0-2.65,2.64v7.71l-2.31-2.32a1.76,1.76,0,0,0-2.49,0,1.76,1.76,0,0,0,0,2.49l4.57,4.57A6,6,0,0,0,13.35,21.2h2a6.41,6.41,0,0,0,6.23-5l.77-4.14A1.45,1.45,0,0,0,19.32,11.59Z"/></svg>')`;
                    } else if (cursorType === 'text') {
                        cursor.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="red" stroke="red" stroke-width="2" d="M11 4h2v16h-2zM7 4h10v2H7zM7 18h10v2H7z"/></svg>')`;
                    } else {
                        cursor.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="red" stroke="white" stroke-width="1" d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.54.35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z"/></svg>')`;
                    }
                }
            };
            ipcRenderer.on('move-stealth-cursor', this._boundStealthMove);
"""
    # Find connectedCallback and inject after ipcRenderer is defined
    text = text.replace(
        "ipcRenderer.on('new-response'",
        stealthMove + "\n            ipcRenderer.on('new-response'"
    )
    print("Step 6: Added _boundStealthMove")
else:
    print("Step 6: _boundStealthMove already present")

# Step 7: Add set-stealth-state handler
if "set-stealth-state" not in text:
    stealthState = """
            ipcRenderer.on('set-stealth-state', (_, isActive) => {
                this.classList.toggle('cursor-hidden', isActive);
                const fakeCursor = this.renderRoot ? this.renderRoot.querySelector('.fake-cursor') : null;
                if (fakeCursor) fakeCursor.style.display = isActive ? 'block' : 'none';
            });
"""
    text = text.replace(
        "ipcRenderer.on('reconnect-failed'",
        stealthState + "\n            ipcRenderer.on('reconnect-failed'"
    )
    print("Step 7: Added set-stealth-state handler")
else:
    print("Step 7: set-stealth-state handler already present")

# Write the final file
with open(live, "w", encoding="utf-8") as f:
    f.write(text)

print("\nDONE! File written, size:", len(text))
