import re
import os

# 1. Update HideWinApp.styles.js
styles_path = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.styles.js"
with open(styles_path, 'r', encoding='utf-8') as f:
    styles = f.read()

host_regex = re.compile(r'(:host\s*\{[^}]*)background:\s*var\(--bg-app\);\s*(.*?)border:\s*3px solid var\(--border\);\s*border-radius:\s*2px;\s*overflow:\s*hidden;\s*(box-sizing: border-box;)', re.DOTALL)
app_shell_regex = re.compile(r'(\.app-shell\s*\{[^}]*)', re.DOTALL)

if host_regex.search(styles):
    styles = host_regex.sub(r'\1background: transparent;\n            \2\3', styles)
    styles = app_shell_regex.sub(r'\1\n            background: var(--bg-app);\n            border: 3px solid var(--border);\n            border-radius: 2px;\n            overflow: hidden;\n            box-sizing: border-box;', styles, count=1)
    with open(styles_path, 'w', encoding='utf-8') as f:
        f.write(styles)
    print("STYLES_SUCCESS")
else:
    print("STYLES_REGEX_FAILED")

# 2. Update HideWinApp.js
app_path = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(app_path, 'r', encoding='utf-8') as f:
    code = f.read()

# Remove isMainWindowMinimized block
code = re.sub(r'// Enforce Minimized Widget First.*?if \(this\.isMainWindowMinimized\) \{.*?return html`.*?</div>\s*</div>\s*`;\s*\}\s*', '', code, flags=re.DOTALL)

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
    with open(app_path, 'w', encoding='utf-8') as f:
        f.write(code)
    print("APP_SUCCESS")
else:
    print("APP_TARGET_NOT_FOUND")

# 3. Update HideWinAppRenderers.js (Inject white logo filter in renderLiveBar)
renderers_path = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinAppRenderers.js"
with open(renderers_path, 'r', encoding='utf-8') as f:
    renderers = f.read()

# I will replace the logo div to add filter: brightness(0) invert(1)
logo_div = "url('./assets/images/small_icon.png'); background-size: auto 32px; background-position: left center; background-repeat: no-repeat; margin-left: 4px; transform: scale(1.35); transform-origin: left center;"
new_logo_div = logo_div + " filter: brightness(0) invert(1);"
if logo_div in renderers:
    renderers = renderers.replace(logo_div, new_logo_div)
    with open(renderers_path, 'w', encoding='utf-8') as f:
        f.write(renderers)
    print("RENDERERS_SUCCESS")
else:
    # try the other logo image name
    logo_div2 = "url('./assets/images/media_1786601281022.png'); background-size: auto 32px; background-position: left center; background-repeat: no-repeat; margin-left: 4px; transform: scale(1.35); transform-origin: left center;"
    new_logo_div2 = logo_div2 + " filter: brightness(0) invert(1);"
    if logo_div2 in renderers:
        renderers = renderers.replace(logo_div2, new_logo_div2)
        with open(renderers_path, 'w', encoding='utf-8') as f:
            f.write(renderers)
        print("RENDERERS_SUCCESS_2")
    else:
        print("RENDERERS_LOGO_NOT_FOUND")

