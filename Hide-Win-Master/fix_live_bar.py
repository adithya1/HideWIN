import re

file_path = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinAppRenderers.js'
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

new_live_bar = '''export function renderLiveBar() {
        return html`
            <div class="live-bar" style="display: flex; justify-content: center; align-items: flex-start; padding: 0; margin-top: 4px; background: transparent; border-bottom: none; position: relative; z-index: 10; -webkit-app-region: drag;">
                <div style="display: flex; align-items: center; background: var(--bg-surface); border: 1px solid var(--border); border-radius: 8px; padding: 4px 6px; gap: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                    
                    <!-- Drag Handle / Logo Icon -->
                    <div style="width: 24px; height: 24px; background-image: url('./assets/images/small_icon.png'); background-size: contain; background-position: center; background-repeat: no-repeat; margin-left: 2px;"></div>
                    
                    ${this._isLiveMode() ? html`
                        ${this.renderStatusDot()}
                        <div style="color: var(--text-primary); font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums; margin-right: 4px;">
                            ${this.getElapsedTime()}
                        </div>
                    ` : ''}

                    <!-- Hide/Ask Toggle (ALWAYS VISIBLE) -->
                    <button class="stealth-tooltip" data-tooltip=${this.isSessionHidden ? 'Show Window' : 'Hide Window'} @click=${() => this.toggleSessionHide()} style="background: transparent; border: none; color: var(--text-primary); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; font-size: 12px; font-weight: 700; padding: 4px 8px; border-radius: 6px; transition: background 0.2s; -webkit-app-region: no-drag;" onmouseover="this.style.background='rgba(128,128,128,0.2)'" onmouseout="this.style.background='transparent'">
                        ${this.isSessionHidden ? html`
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            Ask
                        ` : html`
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                            Hide
                        `}
                    </button>

                    <!-- End Session / Close App -->
                    <button class="stealth-tooltip" data-tooltip=${this._isLiveMode() ? "End Session" : "Close App"} @click=${() => this.handleClose()} style="background: transparent; border: 1px solid transparent; color: #ef4444; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 6px; transition: all 0.2s; -webkit-app-region: no-drag;" onmouseover="this.style.background='rgba(239, 68, 68, 0.15)'; this.style.borderColor='rgba(239, 68, 68, 0.3)';" onmouseout="this.style.background='transparent'; this.style.borderColor='transparent';">
                        ${this._isLiveMode() ? html`
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="3" ry="3"></rect></svg>
                        ` : html`
                            <svg viewBox="0 0 12 12" width="12" height="12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        `}
                    </button>

                </div>
            </div>
        `;
}'''

start_idx = code.find('export function renderLiveBar() {')
end_idx = code.find('export function renderCurrentView() {')

if start_idx != -1 and end_idx != -1:
    code = code[:start_idx] + new_live_bar + '\n\n' + code[end_idx:]
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(code)
    print("SUCCESS")
else:
    print("FAILED TO FIND INDICES")
