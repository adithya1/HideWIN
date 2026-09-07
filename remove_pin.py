with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """<button class="win-btn pin" title="Always on Top" @click=${() => this._toggleAlwaysOnTop()} style="color: ${this.isAlwaysOnTop ? '#3b82f6' : 'currentColor'}">
                            <svg viewBox="0 0 24 24" fill="${this.isAlwaysOnTop ? '#3b82f6' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                        </button>\n                        """
content = content.replace(target, "")

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed Always on top pin from HideWinApp")
