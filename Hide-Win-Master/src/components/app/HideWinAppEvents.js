export function bindAppEvents() {
        

        
        // Load Authentication State
        if (window.hideWin && window.hideWin.storage) {
            window.hideWin.storage.getCredentials().then(creds => {
                if (creds && creds.jwtToken) {
                    this.isAuthenticated = true;
                    this.isMainWindowMinimized = false;
                    this._signInExpanded = false;
                    try {
                        const payload = JSON.parse(atob(creds.jwtToken.split('.')[1]));
                        if (payload && payload.sub) {
                            this.userEmail = payload.sub;
                        }
                    } catch(e) { }
                    this.requestUpdate();
                }
            }).catch(e => {
                console.error("Error loading auth:", e);
            });
        }

        // Listen for Deep Link Authentication
        if (window.hideWin && window.hideWin.ipcRenderer) {
                        window.hideWin.ipcRenderer.on('deep-link-auth-success', async (event, data) => {
                let authenticated = false;
                try {
                    if (!data || typeof data.token !== 'string' || typeof data.hash !== 'string') return;
                    const apiBase = window.configManager && window.configManager.getApiBaseUrl();
                    if (!apiBase || !window.hideWin.storage) return;
                    const validation = await fetch(`${apiBase}/auth/validate-hash`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${data.token}`,
                            'X-Session-Hashkey': data.hash
                        }
                    });
                    if (!validation.ok) return;

                    let creds = {};
                    try { creds = await window.hideWin.storage.getCredentials() || {}; } catch(e) {}
                    await window.hideWin.storage.setCredentials({
                        ...creds,
                        jwtToken: data.token,
                        hashkey: data.hash,
                        user: data.user || creds.user
                    });
                    this.isAuthenticated = true;
                    this._signInExpanded = false;
                    if (this.windowType === 'main') {
                        this.notifyPanelAuth(true);
                        // Auto-open main window after login success
                        if (window.hideWin && window.hideWin.ipcRenderer) {
                            window.hideWin.ipcRenderer.invoke('panel-open-main');
                        }
                    }
                    this.requestUpdate();
                    authenticated = true;
                } catch(e) {
                    console.error('Desktop sign-in validation failed');
                } finally {
                    if (authenticated && this.isMainWindowMinimized) this._handleMaximize();
                }
            });
        }

        if (this.windowType === 'session') {
            this.classList.add('is-session-window');
        }

        this._punchOverlays = [];
        
        // Ensure punch overlay stays aligned with the toggle buttons
        this._punchOverlayInterval = setInterval(() => {
            if (this._isClickThrough) {
                const mainView = this.shadowRoot.querySelector('main-view');
                const assistantView = this.shadowRoot.querySelector('assistant-view');
                
                const toggles = [
                    ...Array.from(this.shadowRoot.querySelectorAll('.mouse-toggle-container, .mouse-toggle-wrapper')),
                    ...(mainView && mainView.shadowRoot ? Array.from(mainView.shadowRoot.querySelectorAll('.mouse-toggle-container, .mouse-toggle-wrapper')) : []),
                    ...(assistantView && assistantView.shadowRoot ? Array.from(assistantView.shadowRoot.querySelectorAll('.mouse-toggle-container, .mouse-toggle-wrapper')) : [])
                ];
                
                // Find all visible toggles
                const visibleToggles = [];
                for (const t of toggles) {
                    const rect = t.getBoundingClientRect();
                    if (rect.width > 0 && rect.height > 0) {
                        visibleToggles.push({ element: t, rect: rect });
                    }
                }
                               
                // Create new overlays if needed
                while (this._punchOverlays.length < visibleToggles.length) {
                    const overlay = document.createElement('div');
                    overlay.style.cssText = 'position: fixed; z-index: 999999; pointer-events: auto; cursor: pointer; background: rgba(0, 0, 0, 0.01); -webkit-app-region: no-drag;';
                    overlay.addEventListener('click', () => {
                        this.toggleClickThrough();
                    });
                    overlay.addEventListener('mouseenter', () => {
                        if (this._isClickThrough && window.require) {
                            window.require('electron').ipcRenderer.invoke('set-ignore-mouse-events', false);
                        }
                    });
                    overlay.addEventListener('mouseleave', () => {
                        if (this._isClickThrough && window.require) {
                            window.require('electron').ipcRenderer.invoke('set-ignore-mouse-events', true, { forward: true });
                        }
                    });
                    document.body.appendChild(overlay);
                    this._punchOverlays.push(overlay);
                }

                // Position and show overlays for each visible toggle
                visibleToggles.forEach((t, i) => {
                    const overlay = this._punchOverlays[i];
                    overlay.style.top = t.rect.top + 'px';
                    overlay.style.left = t.rect.left + 'px';
                    overlay.style.width = t.rect.width + 'px';
                    overlay.style.height = t.rect.height + 'px';
                    overlay.style.display = 'block';
                });

                // Hide any extra overlays
                for (let i = visibleToggles.length; i < this._punchOverlays.length; i++) {
                    this._punchOverlays[i].style.display = 'none';
                }
            } else {
                // If not stealth, hide all overlays and let natural buttons take clicks
                this._punchOverlays.forEach(overlay => {
                    overlay.style.display = 'none';
                });
            }
        }, 300);

        window.addEventListener('keydown', this._boundResizingKeydown);

        // The stealth cursor is now updated via IPC to ensure it tracks globally

        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.on('new-response', (_, response) => this.addNewResponse(response));
            ipcRenderer.on('update-response', (_, response) => this.updateCurrentResponse(response));
            ipcRenderer.on('update-status', (_, status) => this.setStatus(status));
            ipcRenderer.on('session-status-changed', (_, status) => {
                this.startTime = status.startTime;
                if (status.startTime && !this.isPaused) {
                    this._startTimer();
                } else {
                    this._stopTimer();
                }
                this.requestUpdate();
            });
            
            // Check initial status to sync clock immediately
            ipcRenderer.invoke('get-session-status').then(status => {
                if (status && status.startTime) {
                    this.startTime = status.startTime;
                    this.isPaused = status.state === 'paused';
                    this._startTimer();
                    this.requestUpdate();
                }
            }).catch(() => {});
            ipcRenderer.on('refresh-session', () => {
                const currentMode = this.isPaused;
                window.hideWin.stopCapture();
                setTimeout(() => { if (!currentMode) window.hideWin.startCapture(this.selectedScreenshotInterval, this.selectedImageQuality); this.requestUpdate(); }, 200);
            });
            ipcRenderer.on('force-restore-main-window', () => {
                if (this.isMainWindowMinimized) {
                    this._handleMaximize();
                }
            });
            
            this._boundStealthMove = (_, pos) => {
                let el = document.elementFromPoint(pos.x, pos.y);
                while (el && el.shadowRoot) {
                    let inner = el.shadowRoot.elementFromPoint(pos.x, pos.y);
                    if (!inner || inner === el) break;
                    el = inner;
                }
                
                let cursorType = 'default';
                if (el) {
                    cursorType = window.getComputedStyle(el).cursor;
                }
                
                ipcRenderer.send('update-stealth-cursor-style', cursorType);
            };
            ipcRenderer.on('move-stealth-cursor', this._boundStealthMove);

            // Stealth click: bypass OS focus by dispatching DOM events directly
            ipcRenderer.on('stealth-click-at', (_, pos) => {
                // Walk into shadow DOM to find the real target element
                let el = document.elementFromPoint(pos.x, pos.y);
                while (el && el.shadowRoot) {
                    let inner = el.shadowRoot.elementFromPoint(pos.x, pos.y);
                    if (!inner || inner === el) break;
                    el = inner;
                }
                if (el) {
                    const opts = { bubbles: true, cancelable: true, composed: true, clientX: pos.x, clientY: pos.y };
                    el.dispatchEvent(new MouseEvent('mousedown', opts));
                    el.dispatchEvent(new MouseEvent('mouseup', opts));
                    el.dispatchEvent(new MouseEvent('click', opts));
                }
            });

            // Bug #2 fix: Listen for stealth ON/OFF to toggle fake-cursor visibility
            ipcRenderer.on('set-stealth-state', (_, isActive) => {
                this.classList.toggle('cursor-hidden', isActive);
                const fakeCursor = this.renderRoot ? this.renderRoot.querySelector('.fake-cursor') : null;
                if (fakeCursor) fakeCursor.style.display = isActive ? 'block' : 'none';
            });

            ipcRenderer.on('click-through-toggled', (_, isEnabled) => {
                this._isClickThrough = isEnabled;
                this.classList.toggle('click-through-active', isEnabled);
                document.documentElement.classList.toggle('click-through-active', isEnabled);
                document.body.classList.toggle('click-through-active', isEnabled);
            });

            ipcRenderer.on('reconnect-failed', (_, data) => this.addNewResponse(data.message));
            ipcRenderer.on('whisper-downloading', (_, downloading) => { this._whisperDownloading = downloading; });
        }
}

export function unbindAppEvents() {
        
        if (this._punchOverlays) {
            this._punchOverlays.forEach(overlay => {
                if (overlay && overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            });
            this._punchOverlays = [];
        }
        
        this._stopTimer();
        window.removeEventListener('keydown', this._boundResizingKeydown);
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.removeAllListeners('new-response');
            ipcRenderer.removeAllListeners('update-response');
            ipcRenderer.removeAllListeners('update-status');
            ipcRenderer.removeAllListeners('refresh-session');
            ipcRenderer.removeAllListeners('click-through-toggled');
            ipcRenderer.removeAllListeners('reconnect-failed');
            ipcRenderer.removeAllListeners('whisper-downloading');
            ipcRenderer.removeAllListeners('move-stealth-cursor');
            ipcRenderer.removeAllListeners('stealth-click-at');  // Bug #3 fix
            ipcRenderer.removeAllListeners('set-stealth-state'); // Bug #2 cleanup
        }
}
