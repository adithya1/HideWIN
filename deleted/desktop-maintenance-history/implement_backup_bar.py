import re

file_path = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinAppRenderers.js'
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

new_bar = '''export function renderLiveBar() {
        return html`
            <div class="live-bar" style="display: flex; justify-content: center; align-items: flex-start; padding: 0; margin-top: 4px; background: transparent; border-bottom: none; position: relative; z-index: 10; -webkit-app-region: drag;">
                <div style="display: flex; align-items: center; background: rgba(30,32,38,0.95); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.15); border-radius: 28px; padding: 4px 6px; gap: 4px; box-shadow: 0 6px 16px rgba(0,0,0,0.6);">
                    
                    <!-- Drag Handle / Logo Icon -->
                    <div style="width: 32px; height: 32px; border-radius: 50%; background-image: url('./assets/images/small_icon.png'); background-size: auto 32px; background-position: left center; background-repeat: no-repeat; margin-left: 4px; transform: scale(1.35); transform-origin: left center;">
                    </div>

                    ${this._isLiveMode() ? html`
                        ${this.renderStatusDot()}
                        
                        <div style="color: rgba(255,255,255,0.8); font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums; margin: 0 4px;">
                            ${this.getElapsedTime()}
                        </div>
                    ` : ''}

                    <!-- Hide/Ask Toggle -->
                    <button class="stealth-tooltip" data-tooltip=${this.isSessionHidden ? 'Show Session' : 'Hide Session'} @click=${() => this.toggleSessionHide()} style="background: transparent; border: none; color: #ffffff; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; font-size: 15px; font-weight: 700; padding: 6px 10px; border-radius: 20px; transition: all 0.2s; -webkit-app-region: no-drag;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">
                        ${this.isSessionHidden ? html`
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            Ask
                        ` : html`
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                            Hide
                        `}
                    </button>

                    <!-- End Session (Square Stop Icon) -->
                    <button class="stealth-tooltip" data-tooltip="End Session" @click=${() => this.handleClose()} style="background: transparent; border: 1px solid transparent; color: #ef4444; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%; transition: all 0.2s; margin-left: 2px; -webkit-app-region: no-drag;" onmouseover="this.style.background='rgba(239, 68, 68, 0.25)'; this.style.boxShadow='0 0 8px rgba(239, 68, 68, 0.5)'; this.style.borderColor='rgba(239, 68, 68, 0.5)';" onmouseout="this.style.background='transparent'; this.style.boxShadow='none'; this.style.borderColor='transparent';">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="4" ry="4"></rect></svg>
                    </button>
                    
                </div>
            </div>
        `;
}'''

start_idx = code.find('export function renderLiveBar() {')
end_idx = code.find('export function renderCurrentView() {')

if start_idx != -1 and end_idx != -1:
    code = code[:start_idx] + new_bar + '\n\n' + code[end_idx:]
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(code)
    print("SUCCESS")
else:
    print("FAILED")
