import re

file_path = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js'
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

# Replace the specific block safely
target = """        const isLive = this._isLiveMode();

        return html`
            ${isLive ? html`
                <div style="position: absolute; top: 0; left: 0; width: 100%; display: flex; justify-content: center; z-index: 99999;">
                    ${this.renderLiveBar()}
                </div>
            ` : ''}

                        <!-- Resize Handles (Corner Only) -->
            ${!this.isSessionHidden ? html`
                <div class="resize-handle top-left" @mousedown=${e => this._startResize(e, 'top-left')}></div>
                <div class="resize-handle top-right" @mousedown=${e => this._startResize(e, 'top-right')}></div>
                <div class="resize-handle bottom-left" @mousedown=${e => this._startResize(e, 'bottom-left')}></div>
                <div class="resize-handle bottom-right" @mousedown=${e => this._startResize(e, 'bottom-right')}></div>
            ` : ''}
            <div class="app-shell" style="${this.isSessionHidden ? 'display: none;' : (isLive ? 'margin-top: 48px; height: calc(100vh - 78px);' : '')}">
                <div class="top-drag-bar ${isLive ? 'hidden' : ''}" @mousedown=${e => this._startMove(e)}>
                    <!-- Left: Brand -->
                    <div class="titlebar-brand">
                        <div class="brand-logo"></div>
                    </div>

                    <!-- Center: Drag region -->
                    <div class="drag-region"></div>

                    <!-- Center: Window Controls -->
                    <div class="titlebar-controls">
                        <button class="win-btn minimize" @click=${() => this._handleMinimize()}>
                            <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="1" y="5.5" width="10" height="1.5" rx="0.75" fill="currentColor"/>
                            </svg>
                        </button>
                        <button class="win-btn maximize" @click=${() => this._handleMaximize()}>
                            <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="1.5" y="1.5" width="9" height="9" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>
                            </svg>
                        </button>
                        <button class="win-btn close" @click=${() => this.handleClose()}>
                            <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
                ${this.renderTopToolbar()}
                <div class="content">
                    <div class="content-inner ${isLive ? 'live' : ''}">
                        ${this.renderCurrentView()}
                    </div>
                </div>
            </div>"""

replacement = """        const isLive = this._isLiveMode();

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
            </div>"""

if target in code:
    code = code.replace(target, replacement)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(code)
    print("SUCCESS")
else:
    print("TARGET NOT FOUND. FALLBACK REGEX.")
    code = re.sub(r'\$\{isLive \? html`.*?</div>\n\s*` : \'\'\}', r'<div style="position: absolute; top: 0; left: 0; width: 100%; display: flex; justify-content: center; z-index: 99999;">\n                ${this.renderLiveBar()}\n            </div>', code, flags=re.DOTALL)
    
    code = re.sub(r'<div class="app-shell".*?<div class="top-drag-bar.*?</div>\s*</div>', r'<div class="app-shell" style="${this.isSessionHidden ? \'display: none;\' : \'margin-top: 48px; height: calc(100vh - 48px);\'}">', code, flags=re.DOTALL)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(code)
    print("SUCCESS_REGEX")
