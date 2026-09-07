import { html } from '../../../assets/lit-core-2.7.4.min.js';

export function render() {
        return html`
            ${this.isThemeMenuOpen ? html`
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 2000; display: flex; align-items: center; justify-content: center;" @click=${() => { this.isThemeMenuOpen = false; this.requestUpdate(); }}>
                    <div style="background: var(--bg-primary, rgba(30,32,38,0.95)); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; width: 300px; max-width: 90%; box-shadow: 0 12px 32px rgba(0,0,0,0.4);" @click=${e => e.stopPropagation()}>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <h3 style="margin: 0; font-size: 16px; color: var(--text-primary);">Session Theme Settings</h3>
                            <button @click=${() => { this.isThemeMenuOpen = false; this.requestUpdate(); }} style="background: none; border: none; color: var(--text-secondary); cursor: pointer; padding: 4px;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                            </button>
                        </div>
                        
                        <div style="display: flex; flex-direction: column; gap: 16px;">
                            <div>
                                <label style="display: block; margin-bottom: 8px; font-size: 13px; color: var(--text-secondary);">Theme</label>
                                <select style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: var(--text-primary); border-radius: 8px; padding: 8px;" @change=${async (e) => {
                                    this.themeSession = e.target.value;
                                    if (window.hideWin && window.hideWin.storage) await window.hideWin.storage.updatePreference('themeSession', this.themeSession);
                                    if (window.hideWin && window.hideWin.theme) window.hideWin.theme.applySessionTheme(this.themeSession);
                                    this.requestUpdate();
                                }}>
                                    <option value="dark" ?selected=${this.themeSession === 'dark'}>Dark (Default)</option>
                                    <option value="light" ?selected=${this.themeSession === 'light'}>Light</option>
                                    <option value="amoled" ?selected=${this.themeSession === 'amoled'}>AMOLED Black</option>
                                    <option value="matrix" ?selected=${this.themeSession === 'matrix'}>Matrix Hacker</option>
                                    <option value="terminal" ?selected=${this.themeSession === 'terminal'}>Terminal Green</option>
                                    <option value="blue" ?selected=${this.themeSession === 'blue'}>Deep Blue</option>
                                    <option value="discord" ?selected=${this.themeSession === 'discord'}>Discord Dark</option>
                                </select>
                            </div>
                            
                            <div>
                                <label style="display: block; margin-bottom: 8px; font-size: 13px; color: var(--text-secondary);">Background Transparency (${Math.round((this.transparencySession || 0.3) * 100)}%)</label>
                                <input type="range" min="0" max="1" step="0.01" .value=${this.transparencySession !== undefined ? this.transparencySession : 0.3} style="width: 100%;" @input=${async (e) => {
                                    this.transparencySession = parseFloat(e.target.value);
                                    if (window.hideWin && window.hideWin.storage) await window.hideWin.storage.updatePreference('transparencySession', this.transparencySession);
                                    document.documentElement.style.setProperty('--app-bg-transparency', this.transparencySession);
                                    this.requestUpdate();
                                }} />
                            </div>
                            
                            <div>
                                <label style="display: block; margin-bottom: 8px; font-size: 13px; color: var(--text-secondary);">Text Size (${this.fontSizeSession || 15}px)</label>
                                <input type="range" min="12" max="24" step="1" .value=${this.fontSizeSession !== undefined ? this.fontSizeSession : 15} style="width: 100%;" @input=${async (e) => {
                                    this.fontSizeSession = parseInt(e.target.value, 10);
                                    if (window.hideWin && window.hideWin.storage) await window.hideWin.storage.updatePreference('fontSizeSession', this.fontSizeSession);
                                    document.documentElement.style.setProperty('--response-font-size', this.fontSizeSession + 'px');
                                    this.requestUpdate();
                                }} />
                            </div>
                        </div>
                    </div>
                </div>
            ` : ''}

            <div style="position: absolute; top: 8px; right: 12px; z-index: 1000; display: flex; align-items: center; gap: 4px;">
                ${(() => {
                    const isProcessing = this.isAnalyzing || (this.statusText && (this.statusText.toLowerCase().includes('generating') || this.statusText.toLowerCase().includes('analyzing') || this.statusText.toLowerCase().includes('processing')));
                    const color = isProcessing ? '#ef4444' : (this.isPaused ? '#eab308' : '#22c55e');
                    const pulseAnim = !this.isPaused ? 'pulse 2s infinite' : 'none';
                    let text = this.statusText;
                    if (!text) {
                        text = isProcessing ? 'Processing...' : (this.isPaused ? 'Paused' : 'Listening...');
                    }
                    return html`
                        <div style="width: 5px; height: 5px; border-radius: 50%; background-color: ${color}; box-shadow: 0 0 5px ${color}; animation: ${pulseAnim};"></div>
                        <span style="font-size: 9px; text-transform: lowercase; font-variant: small-caps; letter-spacing: 0.3px; color: rgba(255,255,255,0.6); display: inline-block; text-transform: capitalize;">${text.toLowerCase()}</span>
                    `;
                })()}
            </div>

            <div class="response-container" id="responseContainer"></div>

            <div class="input-area-wrapper" style="padding: 0 12px 12px 12px; display: flex; flex-direction: column; gap: 8px;">
                <!-- Suggestions Row -->
                <div class="suggestion-chips-wrapper" style="position: relative; width: 100%; display: flex; align-items: center; margin-bottom: 2px;"
                     @mouseenter=${(e) => {
                         const chips = e.currentTarget.querySelector('.suggestion-chips');
                         const hasScroll = chips.scrollWidth > chips.clientWidth + 2;
                         if (hasScroll) {
                             e.currentTarget.querySelectorAll('.scroll-btn').forEach(b => b.classList.add('visible'));
                         }
                     }}
                     @mouseleave=${(e) => {
                         e.currentTarget.querySelectorAll('.scroll-btn').forEach(b => b.classList.remove('visible'));
                     }}>
                    <button class="scroll-btn left" @click=${(e) => e.currentTarget.parentElement.querySelector('.suggestion-chips').scrollBy({ left: -200, behavior: 'smooth' })}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    
                    <div class="suggestion-chips" style="display: flex; gap: 6px; flex-wrap: nowrap; overflow: visible; scrollbar-width: none; -ms-overflow-style: none; flex: 1; padding-bottom: 2px; scroll-behavior: smooth;">
                    <button class="suggestion-chip ${this.isWhatToSayEnabled ? 'active' : ''}" @click=${this.handleWhatToSay} style="font-size: 13px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8;">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                        </svg>
                        What to say?
                        ${this.isWhatToSayEnabled ? html`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>` : ''}
                    </button>
                    <span class="suggestion-dot" style="color: rgba(255,255,255,0.2); font-size: 16px; align-self: center;">·</span>
                    <!-- Follow-ups Button -->
                    <button class="suggestion-chip ${this.isFollowUpsEnabled ? 'active' : ''}" @click=${this.handleFollowUps} style="font-size: 13px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8;">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                        </svg>
                        Follow-ups
                        ${this.isFollowUpsEnabled ? html`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>` : ''}
                    </button>
                    <span class="suggestion-dot" style="color: rgba(255,255,255,0.2); font-size: 16px; align-self: center;">·</span>
                    
                    <!-- Refresh Button -->
                    <button class="suggestion-chip ${this.isRefreshing ? 'active' : ''}" @click=${this.handleRefreshAction} style="font-size: 13px; transition: all 0.2s ease;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8; ${this.isRefreshing ? 'animation: spin 1s linear infinite;' : ''}">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                            <path d="M3 3v5h5"></path>
                        </svg>
                        ${this.isRefreshing ? 'Refreshing...' : (this.refreshSuccess ? 'Done!' : 'Refresh')}
                    </button>
                    <span class="suggestion-dot" style="color: rgba(255,255,255,0.2); font-size: 16px; align-self: center;">·</span>

                    <!-- Notes Button -->
                    <button class="suggestion-chip ${this.isNotesOpening ? 'active' : ''}" @click=${this.handleNotesAction} style="font-size: 13px; transition: all 0.2s ease;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" style="opacity: 0.8;"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="14 2 14 8 20 8"/><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="16" y1="13" x2="8" y2="13"/><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="16" y1="17" x2="8" y2="17"/><polyline fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="10 9 9 9 8 9"/></svg>
                        Notes
                    </button>
                    <span class="suggestion-dot" style="color: rgba(255,255,255,0.2); font-size: 16px; align-self: center;">·</span>

                    </div>
                    <button class="scroll-btn right" @click=${(e) => e.currentTarget.parentElement.querySelector('.suggestion-chips').scrollBy({ left: 200, behavior: 'smooth' })}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                </div>
                
                <!-- Input Box Row -->
                <div class="input-box-bottom-row" style="display: flex; align-items: center; background: rgba(38, 40, 48, 0.7); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 4px 4px 4px 16px; box-shadow: inset 0 1px 2px rgba(0,0,0,0.2);">
                    <textarea
                        id="textInput"
                        class="premium-input"
                        placeholder="Ask about your screen or conversation, or ^ ↵ for Assist"
                        @keydown=${this.handleTextKeydown}
                        rows="2"
                        style="flex: 1; background: transparent; border: none; color: var(--text-primary); font-size: 13.5px; outline: none; resize: none; line-height: 1.4; padding: 2px 0; font-family: inherit;"
                    ></textarea>
                    
                    <button class="send-btn ${this.isAnalyzing ? 'analyzing' : ''}" @click=${this.handleScreenAnswer} style="background: #185fc4; width: 34px; height: 34px; border-radius: 12px; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; margin-left: 8px;">
                        <canvas class="analyze-canvas"></canvas>
                        <span class="send-btn-content" style="color: white; display: flex; align-items: center; justify-content: center;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                            </svg>
                        </span>
                    </button>
                </div>

                <!-- Bottom Config Row -->
                <div style="display: flex; align-items: center; margin-top: 2px; position: relative; width: 100%; overflow: visible; scrollbar-width: none; -ms-overflow-style: none;">
                    <style>
                        .input-area-wrapper > div:last-child::-webkit-scrollbar { display: none; }
                    </style>

                    <!-- Left Items Group -->
                    <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">


                    <!-- Theme Button -->
                    <button @click=${() => { this.isThemeMenuOpen = true; this.requestUpdate(); }} style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.05); color: var(--text-primary); width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;" title="Toggle Session Theme Settings">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="5"></circle>
                            <line x1="12" y1="1" x2="12" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="23"></line>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                            <line x1="1" y1="12" x2="3" y2="12"></line>
                            <line x1="21" y1="12" x2="23" y2="12"></line>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                        </svg>
                    </button>


                    <!-- Mode/Profile Dropdown -->
                    <div class="suggestion-chip mode-selector" style="position:relative; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 4px 12px; font-size: 12px; display: flex; align-items: center; gap: 6px; cursor: pointer;" @click=${(e) => { e.stopPropagation(); this.isModeMenuOpen = !this.isModeMenuOpen; this.isProfileMenuOpen = false; }}>
                        <span style="font-weight: 400; display: flex; align-items: center;">
                            ${this.selectedModeCategory ? (
                                this.selectedModeCategory === 'Custom' || !['Job Interview', 'Business Meeting', 'Sales Call', 'Presentation', 'Negotiation', 'Exam Assistant'].includes(this.selectedModeCategory) 
                                ? html`<input type="text" 
                                    style="background: transparent; border: none; color: var(--text-primary); font-size: 12px; outline: none; width: 80px; border-bottom: 1px solid rgba(255,255,255,0.2);" 
                                    placeholder="Enter mode..."
                                    .value=${this.selectedModeCategory === 'Custom' ? '' : this.selectedModeCategory}
                                    @click=${e => e.stopPropagation()}
                                    @keyup=${e => {
                                        if(e.key === 'Enter' && e.target.value.trim()) {
                                            this.onModeCategoryChange && this.onModeCategoryChange(e.target.value.trim());
                                        }
                                    }}
                                    @blur=${e => {
                                        if (e.target.value.trim()) {
                                            this.onModeCategoryChange && this.onModeCategoryChange(e.target.value.trim());
                                        }
                                    }}
                                    autofocus
                                />`
                                : (this.selectedModeCategory === 'Job Interview' ? 'Interview' : this.selectedModeCategory === 'Business Meeting' ? 'Business' : this.selectedModeCategory)
                            ) : 'Select Mode'}
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.6;">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                        
                        ${this.isModeMenuOpen ? html`
                            <div class="custom-dropdown-menu" style="bottom: 100%; top: auto; margin-bottom: 8px;">
                                ${['Job Interview', 'Business Meeting', 'Sales Call', 'Presentation', 'Negotiation', 'Exam Assistant', 'Custom'].map(mode => html`
                                    <div class="custom-dropdown-item ${this.selectedModeCategory === mode ? 'active' : ''}" @click=${(e) => { e.stopPropagation(); this.isModeMenuOpen = false; this.onModeCategoryChange && this.onModeCategoryChange(mode); }}>
                                        ${mode === 'Job Interview' ? 'Interview' : mode === 'Business Meeting' ? 'Business' : mode}
                                    </div>
                                `)}
                            </div>
                        ` : ''}
                    </div>

                    <!-- Profile Selector Button -->
                    <div style="position:relative; margin-left: 4px;">
                        <div class="suggestion-chip profile-selector stealth-tooltip" 
                            data-tooltip="Select AI Profile"
                            @click=${(e) => { e.stopPropagation(); this.isProfileMenuOpen = !this.isProfileMenuOpen; this.isModeMenuOpen = false; }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            ${this.profileNotification ? html`<span style="color: #10b981; font-weight: 500;">${this.profileNotification} ✔</span>` : ''}
                        </div>
                        
                        ${this.isProfileMenuOpen ? html`
                            <div class="custom-dropdown-menu" style="bottom: 100%; right: 0; top: auto; margin-bottom: 8px; min-width: 180px;">
                                ${!this.selectedModeCategory ? html`
                                    <div style="padding: 8px 12px; font-size: 11px; color: var(--text-muted); text-align: center;">
                                        Select a Mode first
                                    </div>
                                ` : this.profiles.filter(p => p.type === this.selectedModeCategory).length > 0 
                                    ? this.profiles.filter(p => p.type === this.selectedModeCategory).map(p => html`
                                        <div class="custom-dropdown-item ${this.selectedProfile === p.id ? 'active' : ''}" 
                                             @click=${(e) => { 
                                                 e.stopPropagation(); 
                                                 this.isProfileMenuOpen = false; 
                                                 this.onProfileChange && this.onProfileChange(p.id); 
                                                 this.profileNotification = p.name.split(' ')[0] || 'AI';
                                                 setTimeout(() => { this.profileNotification = null; this.requestUpdate(); }, 2000);
                                             }}>
                                            ${p.name?.split(' ')[0]}
                                        </div>
                                    `)
                                    : html`
                                        <div style="padding: 8px 12px; font-size: 11px; color: var(--text-muted); text-align: center;">
                                            No profiles for ${this.selectedModeCategory === 'Job Interview' ? 'Interview' : this.selectedModeCategory === 'Business Meeting' ? 'Business' : this.selectedModeCategory}
                                        </div>
                                    `
                                }
                                <div style="height: 1px; background: rgba(255,255,255,0.1); margin: 4px 0;"></div>
                                <div class="custom-dropdown-item" style="color: var(--accent);" @click=${(e) => { e.stopPropagation(); this.isProfileMenuOpen = false; this.onAddProfileClick && this.onAddProfileClick(); }}>
                                    + Add Profile
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    <!-- Centered Play/Pause Button -->
                    <div style="margin: 0 auto; display: flex; padding: 0 8px; flex-shrink: 0;">
                        <button @click=${() => this.dispatchEvent(new CustomEvent('toggle-pause', { bubbles: true, composed: true }))} class="stealth-tooltip" data-tooltip=${this.isPaused ? 'Resume Session' : 'Pause Session'} style="-webkit-app-region: no-drag; background: ${this.isPaused ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)'}; border: 1px solid ${this.isPaused ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}; color: ${this.isPaused ? '#ef4444' : '#10b981'}; width: 48px; height: 32px; border-radius: 20px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 12px ${this.isPaused ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'};" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                            ${this.isPaused ? html`
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                            ` : html`
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                            `}
                        </button>
                    </div>

                    <!-- Mouse Toggle (from Main Window) -->
                    <div class="mouse-toggle-container stealth-tooltip" data-tooltip="Stealth Mode" style="pointer-events: auto; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; padding: 0 4px; margin-left: 4px; width: 42px; max-width: 42px; flex-shrink: 0;" @click=${() => this.dispatchEvent(new CustomEvent('toggle-click-through', { bubbles: true, composed: true }))}>
                        <div style="width: 42px; height: 22px; border-radius: 6px; background: ${this.isClickThrough ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.08)'}; border: 1px solid rgba(255,255,255,0.05); position: relative; transition: all 0.3s ease; box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);">
                            <div style="width: 18px; height: 18px; border-radius: 4px; background: #ffffff; position: absolute; top: 1px; left: ${this.isClickThrough ? '21px' : '1px'}; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.15);">
                                <div style="width: 10px; height: 10px; border-radius: 2px; background: ${this.isClickThrough ? '#ef4444' : 'rgba(0,0,0,0.3)'}; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">
                                    <div style="width: 5px; height: 1.5px; background: #ffffff; border-radius: 1px; transform: rotate(-45deg);"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- End Session Button -->
                    <button @click=${() => window.require && window.require('electron').ipcRenderer.invoke('end-session-completely')} class="stealth-tooltip" data-tooltip="End Session Completely" style="-webkit-app-region: no-drag; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.05); color: var(--text-primary); width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; margin-left: 8px;" onmouseover="this.style.background='rgba(239, 68, 68, 0.2)'; this.style.color='#ef4444'; this.style.borderColor='rgba(239, 68, 68, 0.4)';" onmouseout="this.style.background='rgba(255,255,255,0.08)'; this.style.color='var(--text-primary)'; this.style.borderColor='rgba(255,255,255,0.05)';">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                        </svg>
                    </button>



                </div>
            </div>
        `;
    }
}

customElements.define('assistant-view', AssistantView);


export function _startWaveformAnimation() {
        const canvas = this.shadowRoot.querySelector('.analyze-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const dangerColor = getComputedStyle(this).getPropertyValue('--danger').trim() || '#EF4444';
        const startTime = performance.now();
        const FADE_IN = 0.5; // seconds
        const PARTICLE_SPREAD = 4; // px inward from border
        const PARTICLE_COUNT = 250;

        // Pill perimeter helpers
        const w = rect.width;
        const h = rect.height;
        const r = h / 2; // pill radius = half height
        const straightLen = w - 2 * r;
        const arcLen = Math.PI * r;
        const perimeter = 2 * straightLen + 2 * arcLen;

        // Given a distance along the perimeter, return {x, y, nx, ny} (position + inward normal)
        const pointOnPerimeter = (d) => {
            d = ((d % perimeter) + perimeter) % perimeter;
            // Top straight: left to right
            if (d < straightLen) {
                return { x: r + d, y: 0, nx: 0, ny: 1 };
            }
            d -= straightLen;
            // Right arc
            if (d < arcLen) {
                const angle = -Math.PI / 2 + (d / arcLen) * Math.PI;
                return {
                    x: w - r + Math.cos(angle) * r,
                    y: r + Math.sin(angle) * r,
                    nx: -Math.cos(angle),
                    ny: -Math.sin(angle),
                };
            }
            d -= arcLen;
            // Bottom straight: right to left
            if (d < straightLen) {
                return { x: w - r - d, y: h, nx: 0, ny: -1 };
            }
            d -= straightLen;
            // Left arc
            const angle = Math.PI / 2 + (d / arcLen) * Math.PI;
            return {
                x: r + Math.cos(angle) * r,
                y: r + Math.sin(angle) * r,
                nx: -Math.cos(angle),
                ny: -Math.sin(angle),
            };
        };

        // Pre-seed random offsets for stable particles
        const seeds = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            seeds.push({ pos: Math.random(), drift: Math.random(), depthSeed: Math.random() });
        }

        const draw = (now) => {
            const elapsed = (now - startTime) / 1000;
            const fade = Math.min(1, elapsed / FADE_IN);

            ctx.clearRect(0, 0, w, h);

            // ── Particle border ──
            ctx.fillStyle = dangerColor;
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const s = seeds[i];
                const along = (s.pos + s.drift * elapsed * 0.03) * perimeter;
                const depth = s.depthSeed * PARTICLE_SPREAD;
                const density = 1 - depth / PARTICLE_SPREAD;

                if (Math.random() > density) continue;

                const p = pointOnPerimeter(along);
                const px = p.x + p.nx * depth;
                const py = p.y + p.ny * depth;
                const size = 0.8 + density * 0.6;

                ctx.globalAlpha = fade * density * 0.85;
                ctx.beginPath();
                ctx.arc(px, py, size, 0, Math.PI * 2);
                ctx.fill();
            }

            // ── Waveform ──
            const midY = h / 2;
            const waves = [
                { freq: 3, amp: 0.35, speed: 2.5, opacity: 0.9, width: 1.8 },
                { freq: 5, amp: 0.2, speed: 3.5, opacity: 0.5, width: 1.2 },
                { freq: 7, amp: 0.12, speed: 5, opacity: 0.3, width: 0.8 },
            ];

            for (const wave of waves) {
                ctx.beginPath();
                ctx.strokeStyle = dangerColor;
                ctx.globalAlpha = wave.opacity * fade;
                ctx.lineWidth = wave.width;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                for (let x = 0; x <= w; x++) {
                    const norm = x / w;
                    const envelope = Math.sin(norm * Math.PI);
                    const y = midY + Math.sin(norm * Math.PI * 2 * wave.freq + elapsed * wave.speed) * (midY * wave.amp) * envelope;
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            ctx.globalAlpha = 1;
            this._animFrame = requestAnimationFrame(draw);
        };

        this._animFrame = requestAnimationFrame(draw);
    }


