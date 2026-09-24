import { html } from '../../assets/lit-core-2.7.4.min.js';

export function renderTopToolbar() {
        if (this.windowType === 'session') return '';
        if (!this.isAuthenticated) return '';

        const w = this._windowWidth || window.innerWidth || 1050;
        const isMobile = w <= 650;
        const iconOnly = w <= 500;
        const ultraCompact = w <= 400;

        // Determine nav item class based on width
        const navClass = (id) => {
            let cls = `nav-item ${this.currentView === id ? 'active' : ''}`;
            if (ultraCompact) cls += ' icon-only ultra-compact';
            else if (iconOnly) cls += ' icon-only';
            return cls;
        };

        const items = [
            { id: 'main',         label: 'Home',    icon: html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 8.71l-5.333-4.148a2.666 2.666 0 0 0-3.274 0L5.059 8.71a2.67 2.67 0 0 0-1.029 2.105v7.2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.2c0-.823-.38-1.6-1.03-2.105"/><path d="M16 15c-2.21 1.333-5.792 1.333-8 0"/></svg>` },
            { id: 'ai-customize', label: 'Profile', icon: html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="17" y1="11" x2="23" y2="11"/></svg>` },
            { id: 'notes',        label: 'Notes',   icon: html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>` },
            { id: 'browse',       label: 'Browse',  icon: html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>` },
        ];

        const menuBtnStyle = `display:flex;align-items:center;gap:8px;padding:6px 14px;background:transparent;border:none;width:100%;text-align:left;cursor:pointer;color:var(--text-primary);font-size:12px;transition:background 0.15s;`;

        // Mobile Top Toolbar (Hamburger + Brand + Right Actions)
        if (isMobile) {
            return html`
                <div class="top-toolbar mobile-toolbar ${this._isLiveMode() ? 'hidden' : ''}" style="justify-content: space-between; padding: 0 12px; height: 44px; display: flex; align-items: center; border-bottom: 1px solid var(--border);">
                    <button @click=${() => { this.isMobileDrawerOpen = true; this.requestUpdate(); }} style="background: transparent; border: none; color: var(--text-primary); padding: 8px; cursor: pointer;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
                    </button>
                    
                    <div style="font-weight: 700; font-size: 15px; color: var(--text-primary); letter-spacing: -0.5px; display: flex; align-items: center; gap: 6px;">
                        ${this._getBrandLogoUrl() ? html`<img src=${this._getBrandLogoUrl()} style="height: 18px; max-width: 28px; object-fit: contain;" alt=""/>` : ''}
                        HideWin
                    </div>

                    <div class="toolbar-right" style="display:flex;align-items:center;gap:12px;flex-shrink:0;">
                        <div class="stealth-tooltip" @click=${(e) => { e.stopPropagation(); this.showAvatarMenu = !this.showAvatarMenu; this.requestUpdate(); }} style="width:26px;height:26px;border-radius:50%;background-color:${this.getUserAvatarColor()};color:white;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,0.2);">
                            ${this.getUserAvatarInitials()}
                        </div>
                    </div>

                </div>

                <!-- Mobile Slide-out Drawer -->
                ${this.isMobileDrawerOpen ? html`
                    <div class="mobile-drawer-overlay" @click=${() => { this.isMobileDrawerOpen = false; this.requestUpdate(); }} style="position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 99999; backdrop-filter: blur(2px);">
                        <div class="mobile-drawer-content" @click=${(e) => e.stopPropagation()} style="position: absolute; top: 0; left: 0; bottom: 0; width: 260px; background: var(--bg-surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; padding: 20px 0; box-shadow: 2px 0 24px rgba(0,0,0,0.15);">
                            
                            <div style="padding: 0 20px 20px 20px; border-bottom: 1px solid var(--border); margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <div style="width:32px;height:32px;border-radius:50%;background-color:${this.getUserAvatarColor()};color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;">
                                        ${this.getUserAvatarInitials()}
                                    </div>
                                    <div style="font-weight:600;font-size:13px;color:var(--text-primary);max-width:140px;overflow:hidden;text-overflow:ellipsis;">
                                        ${this.userEmail || 'Account'}
                                    </div>
                                </div>
                                <button @click=${() => { window.hideWin.theme.load().then(t => window.hideWin.theme.save(t === 'light' ? 'dark' : 'light')) }} style="background:transparent;border:none;color:var(--text-secondary);cursor:pointer;padding:4px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                                </button>
                            </div>

                            <nav style="display: flex; flex-direction: column; gap: 4px; padding: 0 12px;">
                                ${items.map(item => html`
                                    <button @click=${() => { this.navigate(item.id); this.isMobileDrawerOpen = false; this.requestUpdate(); }} style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:${this.currentView === item.id ? 'var(--bg-hover)' : 'transparent'};border:none;border-radius:8px;width:100%;text-align:left;cursor:pointer;color:${this.currentView === item.id ? 'var(--accent)' : 'var(--text-primary)'};font-size:14px;font-weight:500;">
                                        <div style="width:18px;height:18px;display:flex;align-items:center;justify-content:center;opacity:${this.currentView === item.id ? '1' : '0.7'};">
                                            ${item.icon}
                                        </div>
                                        ${item.label}
                                    </button>
                                `)}
                            </nav>

                            <div style="margin-top: auto; border-top: 1px solid var(--border); padding-top: 12px; margin-inline: 12px;">
                                <button @click=${() => { this.navigate('customize'); this.isMobileDrawerOpen = false; this.requestUpdate(); }} style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:transparent;border:none;border-radius:8px;width:100%;text-align:left;cursor:pointer;color:var(--text-primary);font-size:14px;font-weight:500;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" opacity="0.7"><path d="M19.875 6.27A2.23 2.23 0 0 1 21 8.218v7.284c0 .809-.443 1.555-1.158 1.948l-6.75 4.27a2.27 2.27 0 0 1-2.184 0l-6.75-4.27A2.23 2.23 0 0 1 3 15.502V8.217c0-.809.443-1.554 1.158-1.947l6.75-3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98z"/><path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0"/></svg>
                                    Settings
                                </button>
                                <button @click=${() => { window.hideWin && window.hideWin.logout && window.hideWin.logout(); this.isMobileDrawerOpen = false; this.requestUpdate(); }} style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:transparent;border:none;border-radius:8px;width:100%;text-align:left;cursor:pointer;color:var(--danger);font-size:14px;font-weight:500;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" opacity="0.7"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                ` : ''}
            `;
        }

        // Standard Desktop/Tablet Top Toolbar
        return html`
            <div class="top-toolbar ${this._isLiveMode() ? 'hidden' : ''}" @mousedown=${e => this._startMove(e)}>
                <div class="titlebar-brand" style="-webkit-app-region: drag; margin-right: 8px;">
                    ${this._getBrandLogoUrl() ? html`<img src=${this._getBrandLogoUrl()} alt="HideWin" style="width:24px;height:24px;object-fit:contain;" />` : ''}
                </div>
                <nav class="horizontal-nav" style="-webkit-app-region: no-drag; flex: 1;">
                    ${items.map(item => html`
                        <button
                            class="${navClass(item.id)}"
                            @click=${() => this.navigate(item.id)}
                            title=${item.label}
                        >
                            ${item.icon}
                            <span class="nav-label">${item.label}</span>
                        </button>
                    `)}
                </nav>
                <div class="toolbar-right" style="display:flex;align-items:center;gap:6px;flex-shrink:0;-webkit-app-region: no-drag;">

                    <!-- Profile Avatar with Dropdown -->
                    <div class="avatar-dropdown-container" style="position:relative;">
                        <div
                            class="stealth-tooltip"
                            data-tooltip="Account"
                            @click=${(e) => { e.stopPropagation(); this.showAvatarMenu = !this.showAvatarMenu; this.requestUpdate(); }}
                            style="width:22px;height:22px;border-radius:50%;background-color:${this.getUserAvatarColor()};color:white;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;cursor:pointer;user-select:none;box-shadow:0 1px 3px rgba(0,0,0,0.2);"
                        >
                            ${this.getUserAvatarInitials()}
                        </div>

                        ${this.showAvatarMenu ? html`
                            <div class="avatar-dropdown-menu" style="position:absolute;right:0;top:calc(100% + 6px);min-width:170px;background:var(--bg-elevated);border:1px solid var(--border);border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,0.18);z-index:9999;padding:6px 0;display:flex;flex-direction:column;">
                                <div style="padding:6px 14px;border-bottom:1px solid var(--border);margin-bottom:2px;">
                                    <div style="font-weight:600;font-size:12px;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${this.userEmail || 'Account'}</div>
                                </div>

                                <button @click=${() => { this.navigate('customize'); this.showAvatarMenu = false; }} style="${menuBtnStyle}" onmouseover="this.style.background='var(--bg-hover)'" onmouseout="this.style.background='transparent'">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19.875 6.27A2.23 2.23 0 0 1 21 8.218v7.284c0 .809-.443 1.555-1.158 1.948l-6.75 4.27a2.27 2.27 0 0 1-2.184 0l-6.75-4.27A2.23 2.23 0 0 1 3 15.502V8.217c0-.809.443-1.554 1.158-1.947l6.75-3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98z"/><path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0"/></svg>
                                    Settings
                                </button>

                                <button @click=${() => { this.openUserHistory(); this.showAvatarMenu = false; }} style="${menuBtnStyle}" onmouseover="this.style.background='var(--bg-hover)'" onmouseout="this.style.background='transparent'">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 2.64-6.36L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/></svg>
                                    History
                                </button>

                                <button @click=${() => { this.navigate('help'); this.showAvatarMenu = false; }} style="${menuBtnStyle}" onmouseover="this.style.background='var(--bg-hover)'" onmouseout="this.style.background='transparent'">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9s-9-1.8-9-9s1.8-9 9-9m0 13v.01"/><path d="M12 13a2 2 0 0 0 .914-3.782a1.98 1.98 0 0 0-2.414.483"/></svg>
                                    Help & Support
                                </button>

                                <button @click=${() => { this.navigate('feedback'); this.showAvatarMenu = false; }} style="${menuBtnStyle}" onmouseover="this.style.background='var(--bg-hover)'" onmouseout="this.style.background='transparent'">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-5l-5 3v-3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zM9.5 9h.01m4.99 0h.01"/><path d="M9.5 13a3.5 3.5 0 0 0 5 0"/></svg>
                                    Feedback
                                </button>

                                <div style="border-top:1px solid var(--border);margin-top:2px;padding-top:2px;">
                                    <button @click=${() => { window.hideWin && window.hideWin.logout && window.hideWin.logout(); this.showAvatarMenu = false; }} style="${menuBtnStyle}color:var(--danger);" onmouseover="this.style.background='rgba(239,68,68,0.08)'" onmouseout="this.style.background='transparent'">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    <!-- Quick Settings -->
                    <div style="position: relative;">
                        <button class="stealth-tooltip" data-tooltip="Quick Settings" @click=${(e) => { e.stopPropagation(); this.isQuickSettingsOpen = !this.isQuickSettingsOpen; }} style="padding:3px;border:none;background:transparent;cursor:pointer;color:var(--text-secondary);display:flex;align-items:center;transition:color 0.2s;" onmouseover="this.style.color='var(--text-primary)'" onmouseout="this.style.color='var(--text-secondary)'">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                        </button>
                        ${this.isQuickSettingsOpen ? html`
                            <div @click=${e => e.stopPropagation()} style="position: absolute; top: calc(100% + 12px); right: 0; width: 280px; background: var(--bg-surface); border: 1px solid var(--border); border-radius: 12px; box-shadow: 0 16px 40px rgba(0,0,0,0.2); padding: 20px; z-index: 9999; animation: slideDownFade 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; display: flex; flex-direction: column; gap: 24px;">
                                <div style="display: flex; align-items: center; justify-content: space-between;">
                                    <span style="font-size: 13px; font-weight: 600; color: var(--text-primary);">Dark Mode</span>
                                    <div @click=${async () => {
                                        const newTheme = this.quickTheme === 'light' ? 'dark' : 'light';
                                        this.quickTheme = newTheme;
                                        await window.hideWin.theme.save(newTheme);
                                    }} style="width: 40px; height: 22px; border-radius: 11px; background: ${this.quickTheme === 'dark' ? 'var(--accent)' : 'var(--border)'}; position: relative; cursor: pointer; transition: background 0.3s ease;">
                                        <div style="width: 18px; height: 18px; border-radius: 50%; background: #fff; position: absolute; top: 2px; left: ${this.quickTheme === 'dark' ? '20px' : '2px'}; transition: left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></div>
                                    </div>
                                </div>
                                <div>
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                        <span style="font-size: 13px; font-weight: 600; color: var(--text-primary);">Transparency</span>
                                        <span style="font-size: 12px; font-weight: 600; color: var(--accent);">${Math.round((1 - this.quickTransparency) * 100)}%</span>
                                    </div>
                                    <input type="range" min="0.1" max="1.0" step="0.05" .value=${this.quickTransparency} @input=${async (e) => {
                                        this.quickTransparency = parseFloat(e.target.value);
                                        if (window.hideWin && window.hideWin.storage) {
                                            await window.hideWin.storage.updatePreference('transparencySession', this.quickTransparency);
                                            if (window.hideWin.theme) await window.hideWin.theme.load();
                                            window.dispatchEvent(new CustomEvent('preferences-updated'));
                                        }
                                    }} style="width: 100%; height: 4px; border-radius: 2px; -webkit-appearance: none; background: var(--border); accent-color: var(--accent); outline: none; cursor: pointer;">
                                </div>
                                <div>
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                        <span style="font-size: 13px; font-weight: 600; color: var(--text-primary);">Text Size</span>
                                        <span style="font-size: 12px; font-weight: 600; color: var(--accent);">${this.quickFontSize}px</span>
                                    </div>
                                    <input type="range" min="10" max="24" step="1" .value=${this.quickFontSize} @input=${async (e) => {
                                        this.quickFontSize = parseInt(e.target.value, 10);
                                        if (window.hideWin && window.hideWin.storage) {
                                            await window.hideWin.storage.updatePreference('fontSizeSession', this.quickFontSize);
                                            if (window.hideWin.theme) await window.hideWin.theme.load();
                                            window.dispatchEvent(new CustomEvent('preferences-updated'));
                                        }
                                    }} style="width: 100%; height: 4px; border-radius: 2px; -webkit-appearance: none; background: var(--border); accent-color: var(--accent); outline: none; cursor: pointer;">
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    </div>
                </div>
            `;
    }


export function renderLiveBar() {
        if (!this._isLiveMode()) return '';

        return html`
            <div class="live-bar" style="display: flex; justify-content: center; align-items: flex-start; padding: 0; margin-top: 4px; background: transparent; border-bottom: none; position: relative; z-index: 10; -webkit-app-region: drag;">
                <div style="display: flex; align-items: center; background: rgba(30,32,38,0.95); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 4px 6px; gap: 4px; box-shadow: 0 6px 16px rgba(0,0,0,0.6);">
                    
                    <!-- Drag Handle / Logo Icon -->
                    <div style="width: 32px; height: 32px; border-radius: 50%; background-image: url('./assets/images/media_1786601281022.png'); background-size: auto 32px; background-position: left center; background-repeat: no-repeat; margin-left: 4px; transform: scale(1.35); transform-origin: left center; filter: brightness(0) invert(1);">
                    </div>

                    ${this.renderStatusDot()}
                    
                    <div style="color: rgba(255,255,255,0.8); font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums; margin: 0 4px;">
                        ${this.getElapsedTime()}
                    </div>

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
    }


export function renderCurrentView() {
        if (!this.isAuthenticated) {
            return html`<auth-view ?embedded=${this.windowType === 'main'} .brandingLogo=${this._getBrandLogoUrl()} @auth-success=${async (e) => {
                try {
                    if (window.hideWin && window.hideWin.storage) {
                        let creds = {};
                        try { creds = await window.hideWin.storage.getCredentials() || {}; } catch(e) {}
                        await window.hideWin.storage.setCredentials({
                            ...creds,
                            jwtToken: e.detail.token,
                            hashkey: e.detail.hash || creds.hashkey,
                            user: e.detail.user || creds.user
                        });
                    }
                } catch(fatalErr) {} finally {
                    this.isAuthenticated = true;
                    this.notifyPanelAuth(true);
                    this._signInExpanded = false;
                    this.requestUpdate();
                }
            }}></auth-view>`;
        }
        switch (this.currentView) {
            case 'onboarding':
                return html`
                    <onboarding-view
                        .onComplete=${() => this.handleOnboardingComplete()}
                        .onClose=${() => this.handleClose()}
                    ></onboarding-view>
                `;

            case 'main':
                return html`
                    <main-view
                        @auth-success=${async (e) => {
                            try {
                                if (window.hideWin && window.hideWin.storage) {
                                    let creds = {};
                                    try { creds = await window.hideWin.storage.getCredentials() || {}; } catch(e) {}
                                    
                                    await window.hideWin.storage.setCredentials({
                                        ...creds,
                                        jwtToken: e.detail.token,
                                        hashkey: e.detail.hash || creds.hashkey,
                                        user: e.detail.user || creds.user
                                    });
                                }
                            } catch(fatalErr) {
                                console.error("Non-fatal storage error during login:", fatalErr);
                            } finally {
                                this.isAuthenticated = true;
                                this.notifyPanelAuth(true);
                                this._signInExpanded = false;
                                this.requestUpdate();
                                if (this.isMainWindowMinimized) {
                                    this._handleMaximize();
                                }
                            }
                        }}
                        .isAuthenticated=${this.isAuthenticated}
                        .selectedProfile=${this.selectedProfile}
                        .isClickThrough=${this._isClickThrough}
                        .onToggleClickThrough=${() => this.toggleClickThrough()}
                        .onProfileChange=${p => this.handleProfileChange(p)}
                        .onNavigate=${v => this.navigate(v)}
                        .onStart=${(modeCategory, profileId) => this.handleStart(modeCategory, profileId)}
                        .onExternalLink=${url => this.handleExternalLinkClick(url)}
                        .whisperDownloading=${this._whisperDownloading}
                        .statusText=${this.statusText}
                        .isPaused=${this.isPaused}
                    ></main-view>
                `;

            case 'ai-customize':
                return html`
                    <ai-customize-view
                        .selectedProfile=${this.selectedProfile}
                        .onProfileChange=${p => this.handleProfileChange(p)}
                    ></ai-customize-view>
                `;

            case 'customize':
                return html`
                    <customize-view
                        .selectedProfile=${this.selectedProfile}
                        .transcriptionLanguage=${this.transcriptionLanguage}
                        .outputLanguage=${this.outputLanguage}
                        .selectedScreenshotInterval=${this.selectedScreenshotInterval}
                        .selectedImageQuality=${this.selectedImageQuality}
                        .layoutMode=${this.layoutMode}
                        .autoScroll=${this.autoScroll}
                        @auto-scroll-changed=${this.handleAutoScrollChanged}
                        .showGeminiKey=${this.showGeminiKey}
                        .showGroqKey=${this.showGroqKey}
                        .onProfileChange=${p => this.handleProfileChange(p)}
                        .onTranscriptionLanguageChange=${l => this.handleTranscriptionLanguageChange(l)}
                        .onOutputLanguageChange=${l => this.handleOutputLanguageChange(l)}
                        .onScreenshotIntervalChange=${i => this.handleScreenshotIntervalChange(i)}
                        .onImageQualityChange=${q => this.handleImageQualityChange(q)}
                        .onLayoutModeChange=${lm => this.handleLayoutModeChange(lm)}
                        .userEmail=${this.userEmail}
                        @sign-out=${async () => {
                            if (window.hideWin && window.hideWin.storage) {
                                const creds = await window.hideWin.storage.getCredentials();
                                await window.hideWin.storage.setCredentials({ ...creds, jwtToken: '', hashkey: '', user: null });
                            }
                            this.isAuthenticated = false;
                            this.currentView = 'main';
                            this.requestUpdate();
                        }}
                    ></customize-view>
                `;

            case 'feedback':
                return html`<feedback-view></feedback-view>`;

            case 'help':
                return html`<help-view .onExternalLinkClick=${url => this.handleExternalLinkClick(url)}></help-view>`;

            case 'history':
                return html`<history-view></history-view>`;

            case 'browse':
                return html`<browse-view></browse-view>`;

            case 'notes':
                return html`<notes-view .isSessionMode=${this.windowType === 'session'} .targetNoteId=${this.currentViewParams?.id} @close-notes=${() => { this.currentView = 'assistant'; this.requestUpdate(); }}></notes-view>`;

            case 'assistant':
                if (this.showLiveNotes) {
                    return html`
                        <div style="display: flex; flex-direction: column; height: 100%;">
                            <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-surface); padding: 6px 12px; border-bottom: 1px solid var(--border);">
                                <span style="font-size: 12px; font-weight: 600; color: var(--text-primary);">ðŸ“ Reference Notes & Diagrams</span>
                                <button
                                    style="padding: 4px 10px; font-size: 11px; font-weight: 600; cursor: default; border-radius: 4px; border: 1px solid var(--accent); background: var(--accent); color: #fff;"
                                    @click=${() => { this.showLiveNotes = false; this.requestUpdate(); }}
                                >
                                    â† Return to AI Live Session
                                </button>
                            </div>
                            <div style="flex: 1; overflow: hidden;">
                                <notes-view .isSessionMode=${this.windowType === 'session'} @close-notes=${() => { this.showLiveNotes = false; this.requestUpdate(); }}></notes-view>
                            </div>
                        </div>
                    `;
                }
                return html`
                    <assistant-view
                        .responses=${this.responses}
                        .currentResponseIndex=${this.currentResponseIndex}
                        .selectedProfile=${this.selectedProfile}
                        .selectedModeCategory=${this.selectedModeCategory}
                        .profiles=${this.profiles}
                        .isPaused=${this.isPaused}
                        .isClickThrough=${this._isClickThrough}
                        .formattedDuration=${this.getElapsedTime()}
                        .statusText=${this.statusText}
                        @toggle-pause=${() => this.togglePause()}
                        @toggle-click-through=${() => this.toggleClickThrough()}
                        @refresh-app=${() => {
                            this.statusText = '';
                            if (window.hideWin && typeof window.hideWin.stopCapture === 'function') {
                                window.hideWin.stopCapture();
                                setTimeout(() => {
                                    if (!this.isPaused) window.hideWin.startCapture(this.selectedScreenshotInterval || 3000, this.selectedImageQuality || 80);
                                    this.requestUpdate();
                                }, 200);
                            }
                        }}
                        .onProfileChange=${p => this.handleProfileChange(p)}
                        .onModeCategoryChange=${m => { 
                            this.selectedModeCategory = m; 
                            this.selectedProfile = ''; 
                            if (this.waitingForMode) {
                                this.startActualSession();
                            }
                            this.requestUpdate(); 
                        }}
                        .onAddProfileClick=${() => {
                            this.showOverlayProfileModal = true;
                            this.requestUpdate();
                            setTimeout(() => {
                                const overlayViews = this.shadowRoot.querySelectorAll('ai-customize-view');
                                const overlayView = overlayViews[overlayViews.length - 1]; // get the overlay one
                                if (overlayView && overlayView.openCreateModal) {
                                    overlayView.openCreateModal();
                                }
                            }, 50);
                        }}
                        @open-notes=${() => {
                            this.currentView = 'notes';
                            this.requestUpdate();
                        }}
                        .onSendText=${msg => this.handleSendText(msg)}
                        .shouldAnimateResponse=${this.shouldAnimateResponse}
                        .autoScroll=${this.autoScroll}
                        @auto-scroll-changed=${this.handleAutoScrollChanged}
                        @response-index-changed=${this.handleResponseIndexChanged}
                        @response-animation-complete=${() => {
                            this.shouldAnimateResponse = false;
                            this._currentResponseIsComplete = true;
                            this.requestUpdate();
                        }}
                    ></assistant-view>
                    
                    ${this.showOverlayProfileModal ? html`
                        <ai-customize-view
                            .isOverlayMode=${true}
                            .isModalOpen=${true}
                            .selectedProfile=${this.selectedProfile}
                            .onProfileChange=${(p) => {
                                this.showOverlayProfileModal = false;
                                this.handleProfileChange(p);
                            }}
                            @modal-closed=${() => {
                                this.showOverlayProfileModal = false;
                                this.requestUpdate();
                            }}
                            @click=${(e) => {
                                if (e.target.tagName.toLowerCase() === 'ai-customize-view' || e.target.classList.contains('modal-backdrop')) {
                                    this.showOverlayProfileModal = false;
                                    this.requestUpdate();
                                }
                            }}
                        ></ai-customize-view>
                    ` : ''}
                `;

            default:
                return html`<div>Unknown view: ${this.currentView}</div>`;
        }
    }
