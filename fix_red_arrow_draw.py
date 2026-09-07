p = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

old_move = """            this._boundStealthMove = (_, pos) => {
                let el = document.elementFromPoint(pos.x, pos.y);
                while (el && el.shadowRoot) {
                    let inner = el.shadowRoot.elementFromPoint(pos.x, pos.y);
                    if (!inner || inner === el) break;
                    el = inner;
                }

                let cursorType = 'default';
                if (el) {
                    cursorType = window.getComputedStyle(el).cursor;
                }

                ipcRenderer.send('update-stealth-cursor-style', cursorType);
            };"""

new_move = """            this._boundStealthMove = (_, pos) => {
                const cursor = this.shadowRoot ? this.shadowRoot.querySelector('.fake-cursor') : null;
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
                        cursor.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\"><path fill=\\"red\\" stroke=\\"white\\" stroke-width=\\"1\\" d=\\"M19.32,11.59l-2.45-1.52A1.44,1.44,0,0,0,14.65,11v-4A2.65,2.65,0,0,0,12,4.38a2.65,2.65,0,0,0-2.65,2.64v7.71l-2.31-2.32a1.76,1.76,0,0,0-2.49,0,1.76,1.76,0,0,0,0,2.49l4.57,4.57A6,6,0,0,0,13.35,21.2h2a6.41,6.41,0,0,0,6.23-5l.77-4.14A1.45,1.45,0,0,0,19.32,11.59Z\\"/></svg>')";
                    } else if (cursorType === 'text') {
                        cursor.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\"><path fill=\\"red\\" stroke=\\"red\\" stroke-width=\\"2\\" d=\\"M11 4h2v16h-2zM7 4h10v2H7zM7 18h10v2H7z\\"/></svg>')";
                    } else {
                        cursor.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\"><path fill=\\"red\\" stroke=\\"white\\" stroke-width=\\"1\\" d=\\"M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.54.35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z\\"/></svg>')";
                    }

                    ipcRenderer.send('update-stealth-cursor-style', cursorType);
                }
            };"""

if old_move in text:
    text = text.replace(old_move, new_move)
    print("SUCCESS: Replaced _boundStealthMove with red arrow drawing code!")
else:
    print("ERROR: Could not find the exact _boundStealthMove block!")
    # Print context to debug
    idx = text.find("this._boundStealthMove")
    if idx >= 0:
        print("Found at:", idx)
        print(text[idx:idx+400])

with open(p, "w", encoding="utf-8") as f:
    f.write(text)
