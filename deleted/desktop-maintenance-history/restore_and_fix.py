import os
import shutil
import re

backup_dir = r"C:\Users\akula\Downloads\Hide-WIN - Copy\Hide-Win-Master"
active_dir = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master"

# 1. Restore monolithic HideWinApp.js
shutil.copy2(os.path.join(backup_dir, "src", "components", "app", "HideWinApp.js"),
             os.path.join(active_dir, "src", "components", "app", "HideWinApp.js"))

# 2. Delete the split files
split_files = ["HideWinApp.styles.js", "HideWinAppEvents.js", "HideWinAppRenderers.js"]
for sf in split_files:
    sf_path = os.path.join(active_dir, "src", "components", "app", sf)
    if os.path.exists(sf_path):
        os.remove(sf_path)

# 3. Read monolithic HideWinApp.js
app_path = os.path.join(active_dir, "src", "components", "app", "HideWinApp.js")
with open(app_path, 'r', encoding='utf-8') as f:
    code = f.read()

# 4. Modify styles in HideWinApp.js
# Change :host to transparent
host_target = """        :host {
            display: block;
            position: relative;
            width: 100%;
            height: 100vh;
            background: var(--bg-app);
            color: var(--text-primary);
            border: 3px solid var(--border);
            border-radius: 2px;
            overflow: hidden;
            box-sizing: border-box;
        }"""
host_replacement = """        :host {
            display: block;
            position: relative;
            width: 100%;
            height: 100vh;
            background: transparent;
            color: var(--text-primary);
        }"""
code = code.replace(host_target, host_replacement)

# Change .app-shell to have the background and border
app_shell_target = """        .app-shell {
            display: flex;
            flex-direction: column;
            height: 100vh;
            overflow: hidden;
        }"""
app_shell_replacement = """        .app-shell {
            display: flex;
            flex-direction: column;
            height: calc(100vh - 48px);
            margin-top: 48px;
            overflow: hidden;
            background: var(--bg-app);
            border: 3px solid var(--border);
            border-radius: 2px;
            box-sizing: border-box;
        }"""
code = code.replace(app_shell_target, app_shell_replacement)

# Remove click-through block that resets .app-shell background (if any)
click_through_target = """        :host(.click-through-active) .app-shell {
            pointer-events: none;
        
            background: var(--bg-app);
            border: 3px solid var(--border);
            border-radius: 2px;
            overflow: hidden;
            box-sizing: border-box;}"""
click_through_replacement = """        :host(.click-through-active) .app-shell {
            pointer-events: none;
        }"""
code = code.replace(click_through_target, click_through_replacement)

# 5. Fix renderLiveBar (always show, invert logo)
live_bar_target = "if (!this._isLiveMode()) return '';"
code = code.replace(live_bar_target, "")

logo_target = "url('./assets/images/media_1786601281022.png'); background-size: auto 32px; background-position: left center; background-repeat: no-repeat; margin-left: 4px; transform: scale(1.35); transform-origin: left center;"
logo_replacement = logo_target + " filter: brightness(0) invert(1);"
code = code.replace(logo_target, logo_replacement)

logo_target2 = "url('./assets/images/small_icon.png'); background-size: auto 32px; background-position: left center; background-repeat: no-repeat; margin-left: 4px; transform: scale(1.35); transform-origin: left center;"
logo_replacement2 = logo_target2 + " filter: brightness(0) invert(1);"
code = code.replace(logo_target2, logo_replacement2)

# 6. Restructure render() to put live-bar outside app-shell
render_target = """            <div class="app-shell" style="${this.isSessionHidden ? 'display: none;' : (isLive ? 'margin-top: 48px; height: calc(100vh - 78px);' : '')}">
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

render_replacement = """            <div style="position: absolute; top: 0; left: 0; width: 100%; display: flex; justify-content: center; z-index: 99999;">
                ${this.renderLiveBar()}
            </div>
            <div class="app-shell" style="${this.isSessionHidden ? 'display: none;' : ''}">
                ${this.renderTopToolbar()}
                <div class="content">
                    <div class="content-inner ${isLive ? 'live' : ''}">
                        ${this.renderCurrentView()}
                    </div>
                </div>
            </div>"""
code = code.replace(render_target, render_replacement)

# Also remove the separate renderLiveBar() block if it exists
live_bar_block = """            ${isLive ? html`
                <div style="position: absolute; top: 0; left: 0; width: 100%; display: flex; justify-content: center; z-index: 99999;">
                    ${this.renderLiveBar()}
                </div>
            ` : ''}"""
code = code.replace(live_bar_block, "")

# 7. Also remove isMainWindowMinimized block if it exists (from my previous mess, though it shouldn't be in the backup)
min_widget_regex = re.compile(r'// Enforce Minimized Widget First.*?if \(this\.isMainWindowMinimized\) \{.*?return html`.*?</div>\s*</div>\s*`;\s*\}\s*', re.DOTALL)
code = min_widget_regex.sub('', code)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS")
