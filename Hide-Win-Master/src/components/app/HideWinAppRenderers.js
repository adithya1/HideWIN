import { html } from '../../assets/lit-core-2.7.4.min.js';

export function renderTopToolbar() {
        if (this.windowType === 'session') return '';

        const items = [
            { id: 'main', label: 'Home', icon: html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m19 8.71l-5.333-4.148a2.666 2.666 0 0 0-3.274 0L5.059 8.71a2.67 2.67 0 0 0-1.029 2.105v7.2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.2c0-.823-.38-1.6-1.03-2.105"/><path d="M16 15c-2.21 1.333-5.792 1.333-8 0"/></g></svg>` },
            { id: 'ai-customize', label: 'Profile', icon: html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="17" y1="11" x2="23" y2="11"/></svg>` },
            { id: 'notes', label: 'Notes', icon: html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="14 2 14 8 20 8"/><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="16" y1="13" x2="8" y2="13"/><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="16" y1="17" x2="8" y2="17"/><polyline fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="10 9 9 9 8 9"/></svg>` },
            { id: 'history', label: 'History', icon: html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M10 20.777a9 9 0 0 1-2.48-.969M14 3.223a9.003 9.003 0 0 1 0 17.554m-9.421-3.684a9 9 0 0 1-1.227-2.592M3.124 10.5c.16-.95.468-1.85.9-2.675l.169-.305m2.714-2.941A9 9 0 0 1 10 3.223"/><path d="M12 8v4l3 3"/></g></svg>` },
            { id: 'browse', label: 'Browse', icon: html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>` },
            { id: 'invite', label: 'Invite', icon: html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>` },
            { id: 'help', label: 'Help', icon: html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9s-9-1.8-9-9s1.8-9 9-9m0 13v.01"/><path d="M12 13a2 2 0 0 0 .914-3.782a1.98 1.98 0 0 0-2.414.483"/></g></svg>` }
        ];

        return html`
            <div class="top-toolbar ${this._isLiveMode() ? 'hidden' : ''}">
                <nav class="horizontal-nav">
                    ${items.map(item => html`
                          <button
                              class="nav-item ${this.currentView === item.id ? 'active' : ''}"
                              @click=${() => this.navigate(item.id)}
                              title=${item.label}
                          >
                              ${item.icon}
                              <span class="nav-label">${item.label}</span>
                          </button>
                    `)}
                </nav>
                <div class="toolbar-right" style="display: flex; align-items: center; gap: 16px;">

                    
                    <div style="display: flex; align-items: center; gap: 8px; position: relative;">
                        ${this.sessionActive ? html`
                            <button class="pause-btn ${this.isPaused ? 'paused' : 'active'}" @click=${() => this.togglePause()}>
                                ${this.isPaused ? '▶ Resume' : '⏸ Pause'}
                            </button>
                        ` : ''}
                        
                        <!-- Profile Avatar with Dropdown -->
                        <div class="avatar-dropdown-container" style="position: relative;">
                            <div class="stealth-tooltip" data-tooltip="Account Menu" @click=${() => { this.showAvatarMenu = !this.showAvatarMenu; this.requestUpdate(); }} style="width: 26px; height: 26px; border-radius: 50%; background-color: ${this.getUserAvatarColor()}; color: white; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; cursor: pointer; user-select: none; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
                                ${this.getUserAvatarInitials()}
                            </div>
                            
                            ${this.showAvatarMenu ? html`
                                <div class="avatar-dropdown-menu" style="position: absolute; right: 0; top: 120%; min-width: 180px; background: var(--bg-primary); border: 1px solid var(--border); border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; padding: 8px 0; display: flex; flex-direction: column;">
                                    <div style="padding: 8px 16px; border-bottom: 1px solid var(--border); margin-bottom: 4px;">
                                        <div style="font-weight: 600; font-size: 13px; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                            Account
                                        </div>
                                        <div style="font-size: 11px; color: var(--text-secondary); opacity: 0.8; margin-top: 2px;">
                                            ${this.userEmail || ''}
                                        </div>
                                    </div>
                                    
                                    <button @click=${() => { this.navigate('customize'); this.showAvatarMenu = false; }} style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: transparent; border: none; width: 100%; text-align: left; cursor: pointer; color: var(--text-primary); font-size: 13px; transition: background 0.2s;" onmouseover="this.style.background='var(--bg-secondary)'" onmouseout="this.style.background='transparent'">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M19.875 6.27A2.23 2.23 0 0 1 21 8.218v7.284c0 .809-.443 1.555-1.158 1.948l-6.75 4.27a2.27 2.27 0 0 1-2.184 0l-6.75-4.27A2.23 2.23 0 0 1 3 15.502V8.217c0-.809.443-1.554 1.158-1.947l6.75-3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98z"/><path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0"/></g></svg>
                                        Settings
                                    </button>
                                    
                                    <button @click=${() => { this.navigate('feedback'); this.showAvatarMenu = false; }} style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: transparent; border: none; width: 100%; text-align: left; cursor: pointer; color: var(--text-primary); font-size: 13px; transition: background 0.2s;" onmouseover="this.style.background='var(--bg-secondary)'" onmouseout="this.style.background='transparent'">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-5l-5 3v-3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zM9.5 9h.01m4.99 0h.01"/><path d="M9.5 13a3.5 3.5 0 0 0 5 0"/></g></svg>
                                        Feedback
                                    </button>
                                </div>
                            ` : ''}
                        </div>

                        <button class="nav-item stealth-tooltip" data-tooltip="Toggle Theme" @click=${() => window.hideWin.theme.load().then(t => window.hideWin.theme.save(t === 'light' ? 'dark' : 'light'))} style="padding: 4px; border: none; background: transparent; cursor: pointer;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }


export function renderLiveBar() {
        if (!this._isLiveMode()) return '';

        return html`
            <div class="live-bar" style="display: flex; justify-content: center; align-items: flex-start; padding: 0; margin-top: 4px; background: transparent; border-bottom: none; position: relative; z-index: 10; -webkit-app-region: drag;">
                <div style="display: flex; align-items: center; background: rgba(30,32,38,0.95); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.15); border-radius: 28px; padding: 4px 6px; gap: 4px; box-shadow: 0 6px 16px rgba(0,0,0,0.6);">
                    
                    <!-- Drag Handle / Logo Icon -->
                    <div style="width: 32px; height: 32px; border-radius: 50%; background-image: url('./assets/images/media_1786601281022.png'); background-size: auto 32px; background-position: left center; background-repeat: no-repeat; margin-left: 4px; transform: scale(1.35); transform-origin: left center;">
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

            case 'invite':
                return html`
                    <meeting-dashboard-view
                        @new-meeting=${() => { this.navigate('schedule-meeting'); }}
                        @edit-meeting=${(e) => { this._editingMeeting = e.detail; this.navigate('schedule-meeting'); this.requestUpdate(); }}
                        @start-existing-meeting=${(e) => { this._meetingToStart = e.detail; this.navigate('meeting-room'); this.requestUpdate(); }}
                    ></meeting-dashboard-view>
                `;

            case 'schedule-meeting':
                return html`
                    <schedule-meeting-view
                        .editMeeting=${this._editingMeeting || null}
                        @close-meeting=${() => { this._editingMeeting = null; this.navigate('invite'); }}
                    ></schedule-meeting-view>
                `;

            case 'meeting-room':
                return html`
                    <invite-view
                        .prefillChannelId=${this._meetingToStart ? this._meetingToStart.id : ''}
                        .prefillPasscode=${this._meetingToStart ? (this._meetingToStart.passcode || '') : ''}
                        @minimize-meeting=${() => this.navigate('invite')}
                    ></invite-view>
                `;

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
                                <span style="font-size: 12px; font-weight: 600; color: var(--text-primary);">📝 Reference Notes & Diagrams</span>
                                <button
                                    style="padding: 4px 10px; font-size: 11px; font-weight: 600; cursor: default; border-radius: 4px; border: 1px solid var(--accent); background: var(--accent); color: #fff;"
                                    @click=${() => { this.showLiveNotes = false; this.requestUpdate(); }}
                                >
                                    ← Return to AI Live Session
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


