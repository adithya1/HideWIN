import re

file_path = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js'
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

# Remove the isMainWindowMinimized block completely
code = re.sub(r'if \(this\.isMainWindowMinimized\) \{.*?return html`.*?</div>\s*</div>\s*`;\s*\}', '', code, flags=re.DOTALL)

# Now find the render block and ensure renderLiveBar is placed absolutely at the top, and no top-drag-bar
replacement = '''        const isLive = this._isLiveMode();

        return html`
            <div style="position: absolute; top: 0; left: 0; width: 100%; display: flex; justify-content: center; z-index: 99999;">
                ${this.renderLiveBar()}
            </div>

            <!-- Resize Handles (Corner Only) -->
            ${!this.isSessionHidden ? html`
                <div class="resize-handle top-left" @mousedown=${e => this._startResize(e, 'top-left')}></div>
                <div class="resize-handle top-right" @mousedown=${e => this._startResize(e, 'top-right')}></div>
                <div class="resize-handle bottom-left" @mousedown=${e => this._startResize(e, 'bottom-left')}></div>
                <div class="resize-handle bottom-right" @mousedown=${e => this._startResize(e, 'bottom-right')}></div>
            ` : ''}
            
            <div class="app-shell" style="${this.isSessionHidden ? 'display: none;' : 'margin-top: 48px; height: calc(100vh - 48px);'}">
                ${this.renderTopToolbar()}
                <div class="content">
                    <div class="content-inner ${isLive ? 'live' : ''}">
                        ${this.renderCurrentView()}
                    </div>
                </div>
            </div>
'''

# We need to replace everything from `const isLive = this._isLiveMode();` up to `${this.showProfileModal ? html`
start_tag = 'const isLive = this._isLiveMode();'
end_tag = '${this.showProfileModal ? html`'
start_idx = code.find(start_tag)
end_idx = code.find(end_tag)

if start_idx != -1 and end_idx != -1:
    code = code[:start_idx] + replacement + '\n            ' + code[end_idx:]
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(code)
    print("SUCCESS")
else:
    print("FAILED TO FIND")
