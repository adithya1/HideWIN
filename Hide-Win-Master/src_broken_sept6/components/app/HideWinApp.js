import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';
import { MainView } from '../views/MainView.js';
import { CustomizeView } from '../views/CustomizeView.js';
import { HelpView } from '../views/HelpView.js';
import { HistoryView } from '../views/HistoryView.js';
import { BrowseView } from '../views/BrowseView.js';
import { AssistantView } from '../views/AssistantView.js';
import { OnboardingView } from '../views/OnboardingView.js';
import { AICustomizeView } from '../views/AICustomizeView.js';
import { FeedbackView } from '../views/FeedbackView.js';
import { NotesView } from '../views/NotesView.js';
import { AuthView } from '../views/AuthView.js';
import { InviteView } from '../views/InviteView.js';
import '../views/ScheduleMeetingView.js';
import '../views/MeetingDashboardView.js';

export class HideWinApp extends LitElement {
    static styles = css`
        * {
            box-sizing: border-box;
            font-family: var(--font);
            margin: 0;
            padding: 0;
            cursor: default;
            user-select: none;
        }

        /* Stealth mode: force arrow cursor on every element inside shadow DOM */
        :host(.stealth-cursor) *,
        :host(.stealth-cursor) *::before,
        :host(.stealth-cursor) *::after {
            cursor: default !important;
        }

        /* Stealth Red Cursor: Allows the user to see their mouse (red arrow) while indicating stealth mode is active */
        :host(.cursor-hidden) * {
            cursor: none !important;
        }
        .fake-cursor {
            display: none;
            position: fixed;
            width: 16px;
            height: 16px;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="red" stroke="white" stroke-width="1" d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.54.35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z"/></svg>');
            background-size: contain;
            background-repeat: no-repeat;
            pointer-events: none;
            z-index: 999999;
            transform: translate(0, 0);
            pointer-events: none;
        }
        :host(.cursor-hidden) .fake-cursor {
            display: block;
        }



        /* Click-through mode: pass 100% of mouse events and cursor shapes to underlying OS windows */
        :host(.click-through-active) .app-shell {
            pointer-events: none;
        }
        :host(.click-through-active) .mouse-toggle-container,
        :host(.click-through-active) .mouse-toggle-container * {
            pointer-events: auto !important;
        }

        @keyframes border-glow {
            0% { box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.15), 0 0 20px rgba(99, 102, 241, 0.05), 0 8px 32px rgba(0, 0, 0, 0.8); }
            50% { box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.35), 0 0 30px rgba(99, 102, 241, 0.15), 0 8px 32px rgba(0, 0, 0, 0.8); }
            100% { box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.15), 0 0 20px rgba(99, 102, 241, 0.05), 0 8px 32px rgba(0, 0, 0, 0.8); }
        }

        :host {
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
        }

        :host(.is-session-window) {
            background: transparent !important;
            border: none;
            border-radius: 0;
            padding: 15px;
            --response-font-size: clamp(12px, calc(10px + 0.8vw), 18px);
        }

        /* Resize handles */
        .resize-handle {
            position: absolute;
            z-index: 99999;
            background: transparent;
            -webkit-app-region: no-drag;
            transition: border-color 0.2s;
        }
        
        :host(.is-session-window) .resize-handle {
            width: 20px;
            height: 20px;
            background: transparent;
            border: none;
            border-radius: 4px;
        }

        .resize-handle.top-left {
            top: 0;
            left: 0;
            width: 8px;
            height: 8px;
            cursor: nw-resize;
        }

        .resize-handle.top-right {
            top: 0;
            right: 0;
            width: 8px;
            height: 8px;
            cursor: ne-resize;
        }

        .resize-handle.bottom-left {
            bottom: 0;
            left: 0;
            width: 8px;
            height: 8px;
            cursor: sw-resize;
        }

        .resize-handle.bottom-right {
            bottom: 0;
            right: 0;
            width: 8px;
            height: 8px;
            cursor: se-resize;
        }

        /* ── Full app shell: top drag bar + horizontal top toolbar + main content ── */

        .app-shell {
            display: flex;
            flex-direction: column;
            height: 100%;
            overflow: hidden;
        }

        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            position: relative;
        }

        .content-inner {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            overflow-x: hidden;
            position: relative;
        }

        :host(.is-session-window) .app-shell {
            background: var(--bg-app);
            border-radius: 12px;
            border: 1px solid transparent;
            animation: border-glow 6s ease-in-out infinite;
        }

        .top-drag-bar {
            position: relative;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 40px;
            background: var(--bg-surface);
            border-bottom: 1px solid var(--border);
            -webkit-app-region: drag;
            backdrop-filter: blur(12px);
            padding: 0 8px;
        }

        .drag-region {
            flex: 1;
            height: 100%;
            -webkit-app-region: drag;
        }

        .drag-region:active {
            cursor: grabbing;
        }

        .top-drag-bar.hidden {
            display: none;
        }

        /* Left: app brand */
        .titlebar-brand {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-right: 16px;
        }
        .brand-logo {
            width: 100px;
            height: 28px;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: left center;
            display: inline-block;
            background-image: url('./assets/images/media_1786601281073.png');
        }
        :host-context(html[data-theme='dark']) .brand-logo,
        html[data-theme='dark'] .brand-logo {
            background-image: url('./assets/images/media_1786601281022.png');
        }

        .titlebar-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3B82F6, #8B5CF6);
            box-shadow: 0 0 6px rgba(59,130,246,0.6);
            flex-shrink: 0;
        }

        .titlebar-name {
            font-size: 12px;
            font-weight: 600;
            color: var(--text-muted);
            letter-spacing: 0.04em;
            text-transform: uppercase;
        }

        /* Right: window controls */
        .titlebar-controls {
            display: flex;
            align-items: center;
            gap: 8px;
            padding-right: 8px;
            -webkit-app-region: no-drag;
        }

        .win-btn {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 1px solid rgba(255, 255, 255, 0.08);
            background: rgba(255, 255, 255, 0.03);
            color: var(--text-secondary);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: default;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            padding: 0;
            backdrop-filter: blur(8px);
        }

        .win-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-primary);
            border-color: rgba(255, 255, 255, 0.2);
            transform: scale(1.05);
        }

        .win-btn.close:hover {
            background: rgba(239, 68, 68, 0.2);
            border-color: rgba(239, 68, 68, 0.5);
            color: #f87171;
        }

        .win-btn svg {
            width: 13px;
            height: 13px;
            pointer-events: none;
        }

        /* Horizontal Top Navigation Bar (Snipping Tool Style) */
        .top-toolbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: var(--bg-surface);
            border-bottom: 1px solid var(--border);
            padding: 6px 12px;
            height: 48px;
            -webkit-app-region: no-drag;
            gap: 8px;
        }

        .top-toolbar.hidden {
            display: none;
        }

        .horizontal-nav {
            display: flex;
            align-items: center;
            gap: 6px;
            overflow-x: auto;
            scrollbar-width: none;
        }

        .horizontal-nav::-webkit-scrollbar {
            width: 0px !important;
            height: 0px !important;
            display: none !important;
        }
        .mouse-toggle-container {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #f1f5f9;
            padding: 4px 8px 4px 12px;
            border-radius: 20px;
            border: 1px solid #e2e8f0;
            pointer-events: auto !important; /* Ensure it stays clickable in click-through mode */
            cursor: pointer;
            transition: all 0.2s ease;
        }
        :host-context(html[data-theme='dark']) .mouse-toggle-container,
        html[data-theme='dark'] .mouse-toggle-container {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.1);
        }
        .mouse-toggle-label {
            font-size: 13px;
            font-weight: 500;
            color: #64748b;
            display: flex;
            align-items: center;
            gap: 6px;
            pointer-events: none;
        }
        :host-context(html[data-theme='dark']) .mouse-toggle-label,
        html[data-theme='dark'] .mouse-toggle-label {
            color: #94a3b8;
        }
        .mouse-toggle-switch {
            position: relative;
            width: 32px;
            height: 18px;
            background: #cbd5e1;
            border-radius: 10px;
            transition: background 0.2s ease;
            pointer-events: none;
        }
        :host-context(html[data-theme='dark']) .mouse-toggle-switch,
        html[data-theme='dark'] .mouse-toggle-switch {
            background: #475569;
        }
        .mouse-toggle-container.undetectable .mouse-toggle-switch {
            background: #3b82f6;
        }
        .mouse-toggle-knob {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 14px;
            height: 14px;
            background: white;
            border-radius: 50%;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .mouse-toggle-container.undetectable .mouse-toggle-knob {
            transform: translateX(14px);
        }

        @keyframes pulse-glow {
            0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.1); border-color: rgba(99, 102, 241, 0.2); }
            100% { box-shadow: 0 0 8px 0 rgba(99, 102, 241, 0.3); border-color: rgba(99, 102, 241, 0.5); }
        }
        .stealth-note {
            font-size: 11px;
            font-weight: 500;
            color: var(--text-secondary);
            background: rgba(99, 102, 241, 0.05);
            border: 1px solid rgba(99, 102, 241, 0.2);
            padding: 4px 10px;
            border-radius: 12px;
            margin-left: 8px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            animation: pulse-glow 3s infinite alternate;
        }
        .stealth-note kbd {
            background: rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 4px;
            padding: 1px 4px;
            font-family: var(--font-mono);
            font-size: 10px;
            color: var(--accent);
        }
    `;

    static properties = {
        isAuthenticated: { type: Boolean },
        currentView: { type: String },
        statusText: { type: String },
        startTime: { type: Number },
        isRecording: { type: Boolean },
        sessionActive: { type: Boolean },
        isPaused: { type: Boolean },
        isMainWindowMinimized: { type: Boolean },
        selectedProfile: { type: String },
        selectedModeCategory: { type: String },
        transcriptionLanguage: { type: String },
        outputLanguage: { type: String },
        responses: { type: Array },
        currentResponseIndex: { type: Number },
        selectedScreenshotInterval: { type: String },
        selectedImageQuality: { type: String },
        layoutMode: { type: String },
        _viewInstances: { type: Object, state: true },
        _isClickThrough: { state: true },
        _awaitingNewResponse: { state: true },
        shouldAnimateResponse: { type: Boolean },
        autoScroll: { type: Boolean },
        _storageLoaded: { state: true },
        _updateAvailable: { state: true },
        _whisperDownloading: { state: true },
        showLiveNotes: { type: Boolean },
        showProfileModal: { type: Boolean, state: true },
        showOverlayProfileModal: { type: Boolean, state: true },
        isSessionHidden: { type: Boolean },
        userFullName: { type: String },
        userEmail: { type: String },
        showAvatarMenu: { state: true }
    };

    constructor() {
        super();
        this.isAuthenticated = false;
        this.currentView = 'main';
        this.statusText = '';
        this.startTime = null;
        this.isRecording = false;
        this.sessionActive = false;
        this.isPaused = false;
        this.isMainWindowMinimized = false;
        this.selectedProfile = '';
        this.selectedModeCategory = 'all';
        this.transcriptionLanguage = 'en-US';
        this.outputLanguage = 'en-US';
        this.selectedScreenshotInterval = '5';
        this.selectedImageQuality = 'medium';
        this.layoutMode = 'normal';
        this.showLiveNotes = false;
        this.showProfileModal = false;
        this.isSessionHidden = false;
        this.userFullName = 'User';
        this.userEmail = 'user@example.com';
        this.showAvatarMenu = false;
        this.responses = [];
        this.currentResponseIndex = -1;
        this._viewInstances = new Map();
        this._isClickThrough = false;
        this._awaitingNewResponse = false;
        this._currentResponseIsComplete = true;
        this.shouldAnimateResponse = false;
        this.autoScroll = true;
        this._storageLoaded = false;
        this._timerInterval = null;
        this._updateAvailable = false;
        this._whisperDownloading = false;
        this._localVersion = '';

        // Read URL params for multi-window support
        const urlParams = new URLSearchParams(window.location.search);
        this.windowType = urlParams.get('windowType') || 'main';
        if (this.windowType === 'session') {
            this.currentView = 'assistant';
            this.selectedModeCategory = urlParams.get('modeCategory') || '';
            this.selectedProfile = urlParams.get('profileId') || '';
            
            // Listen for dynamic updates to mode/profile (when main window calls start-session on an existing window)
            if (window.require) {
                const { ipcRenderer } = window.require('electron');
                ipcRenderer.on('update-session-state', (e, options) => {
                    if (options.modeCategory !== undefined) this.selectedModeCategory = options.modeCategory;
                    if (options.profileId !== undefined) this.selectedProfile = options.profileId;
                    this.requestUpdate();
                });
            }

            // Auto-start session after short delay to allow UI to render
            setTimeout(() => {
                this._handleStartSessionBackend();
            }, 100);
        }

        this._boundResizingKeydown = this._handleResizingKeydown.bind(this);

        this._loadFromStorage();
        this._checkForUpdates();
    }

    async _checkForUpdates() {
        try {
            this._localVersion = await hideWin.getVersion();
            this.requestUpdate();

            const res = await fetch('https://raw.githubusercontent.com/sohzm/hide-win/refs/heads/master/package.json');
            if (!res.ok) return;
            const remote = await res.json();
            const remoteVersion = remote.version;

            const toNum = v => v.split('.').map(Number);
            const [rMaj, rMin, rPatch] = toNum(remoteVersion);
            const [lMaj, lMin, lPatch] = toNum(this._localVersion);

            if (rMaj > lMaj || (rMaj === lMaj && rMin > lMin) || (rMaj === lMaj && rMin === lMin && rPatch > lPatch)) {
                this._updateAvailable = true;
                this.requestUpdate();
            }
        } catch (e) {
            // silently ignore
        }
    }

    async _loadFromStorage() {
        try {
            const [config, prefs, profiles] = await Promise.all([
                hideWin.storage.getConfig(),
                hideWin.storage.getPreferences(),
                hideWin.storage.getProfiles()
            ]);

            if (this.windowType === 'session') {
                this.currentView = 'assistant';
            } else {
                this.currentView = config.onboarded ? 'main' : 'onboarding';
            }
            if (this.windowType !== 'session') {
                this.selectedProfile = prefs.selectedProfile || '';
                this.selectedModeCategory = prefs.selectedModeCategory || '';
            } else {
                this.selectedProfile = this.selectedProfile || '';
                this.selectedModeCategory = this.selectedModeCategory || '';
            }
            this.transcriptionLanguage = prefs.transcriptionLanguage || prefs.selectedLanguage || 'en-US';
            this.outputLanguage = prefs.outputLanguage || prefs.selectedLanguage || 'en-US';
            this.selectedScreenshotInterval = prefs.selectedScreenshotInterval || '5';
            this.selectedImageQuality = prefs.selectedImageQuality || 'high';
            this.layoutMode = config.layout || 'horizontal';
            this.autoScroll = prefs.autoScroll !== undefined ? prefs.autoScroll : true;
            this.userFullName = prefs.userFullName || 'User';
            this.userEmail = prefs.userEmail || 'user@example.com';
            this.profiles = profiles || [];

            this._storageLoaded = true;
            this.requestUpdate();
        } catch (error) {
            console.error('Error loading from storage:', error);
            this._storageLoaded = true;
            this.requestUpdate();
        }
    }

    connectedCallback() {
        super.connectedCallback();
        

        
        // Load Authentication State
        if (window.hideWin && window.hideWin.storage) {
            window.hideWin.storage.getCredentials().then(creds => {
                if (creds && creds.jwtToken) {
                    this.isAuthenticated = true;
                    try {
                        const payload = JSON.parse(atob(creds.jwtToken.split('.')[1]));
                        if (payload && payload.sub) {
                            this.userEmail = payload.sub;
                        }
                    } catch(e) { }
                    this.requestUpdate();
                }
            }).catch(e => console.error("Error loading auth:", e));
        }

        // Listen for Deep Link Authentication
        if (window.hideWin && window.hideWin.ipcRenderer) {
                        window.hideWin.ipcRenderer.on('deep-link-auth-success', async (event, data) => {
                try {
                    if (data && data.token && data.hash) {
                        if (window.hideWin && window.hideWin.storage) {
                            let creds = {};
                            try { creds = await window.hideWin.storage.getCredentials() || {}; } catch(e) {}
                            await window.hideWin.storage.setCredentials({
                                ...creds,
                                jwtToken: data.token,
                                hashkey: data.hash,
                                user: data.user || creds.user
                            });
                        }
                    }
                } catch(e) { } finally {
                    this.isAuthenticated = true;
                    this.requestUpdate();
                    if (this.isMainWindowMinimized) {
                        this._handleMaximize();
                    }
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
                    ...Array.from(this.shadowRoot.querySelectorAll('.mouse-toggle-container')),
                    ...(mainView && mainView.shadowRoot ? Array.from(mainView.shadowRoot.querySelectorAll('.mouse-toggle-container')) : []),
                    ...(assistantView && assistantView.shadowRoot ? Array.from(assistantView.shadowRoot.querySelectorAll('.mouse-toggle-container')) : [])
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

    disconnectedCallback() {
        super.disconnectedCallback();
        
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

    async _handleResizingKeydown(e) {
        if (e.shiftKey) {
            let isArrow = false;
            let deltaW = 0;
            let deltaH = 0;
            if (e.key === 'ArrowUp') {
                isArrow = true;
                deltaH = 30;
            } else if (e.key === 'ArrowDown') {
                isArrow = true;
                deltaH = -30;
            } else if (e.key === 'ArrowRight') {
                isArrow = true;
                deltaW = 30;
            } else if (e.key === 'ArrowLeft') {
                isArrow = true;
                deltaW = -30;
            }

            if (isArrow) {
                e.preventDefault();
                e.stopPropagation();
                if (window.require) {
                    const { ipcRenderer } = window.require('electron');
                    try {
                        const bounds = await ipcRenderer.invoke('get-window-bounds');
                        if (bounds) {
                            const minW = 400;
                            const minH = 300;
                            const newWidth = Math.max(minW, bounds.width + deltaW);
                            const newHeight = Math.max(minH, bounds.height + deltaH);
                            await ipcRenderer.invoke('window-resize', {
                                width: newWidth,
                                height: newHeight
                            });
                            const widthKey = this.windowType === 'session' ? 'sessionWindowWidth' : 'mainWindowWidth';
                            const heightKey = this.windowType === 'session' ? 'sessionWindowHeight' : 'mainWindowHeight';
                            hideWin.storage.updateConfig(widthKey, newWidth);
                            hideWin.storage.updateConfig(heightKey, newHeight);
                        }
                    } catch (err) {
                        console.error('Failed to resize window via keys:', err);
                    }
                }
            }
        }
    }

    // ── Timer ──

    _startTimer() {
        this._stopTimer();
        if (this.startTime) {
            this._timerInterval = setInterval(() => this.requestUpdate(), 1000);
        }
    }

    _stopTimer() {
        if (this._timerInterval) {
            clearInterval(this._timerInterval);
            this._timerInterval = null;
        }
    }

    getElapsedTime() {
        if (!this.startTime) return '00:00';
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const h = Math.floor(elapsed / 3600);
        const m = Math.floor((elapsed % 3600) / 60);
        const s = elapsed % 60;
        const pad = n => String(n).padStart(2, '0');
        if (h > 0) return `${h}:${pad(m)}:${pad(s)}`;
        return `${pad(m)}:${pad(s)}`;
    }

    // ── Status & Responses ──

    setStatus(text) {
        this.statusText = text;
        if (text.includes('Ready') || text.includes('Listening') || text.includes('Error')) {
            this._currentResponseIsComplete = true;
        }
    }

    addNewResponse(response) {
        const wasOnLatest = this.currentResponseIndex === this.responses.length - 1;
        
        // If the last card is an in-flight placeholder for this question, update it
        if (
            this.responses.length > 0 &&
            typeof response === 'object' &&
            response !== null &&
            (this._awaitingNewResponse || String(this.responses[this.responses.length - 1]?.answer || '').includes('Generating response'))
        ) {
            this.responses = [...this.responses.slice(0, -1), response];
        } else {
            this.responses = [...this.responses, response];
        }

        if (wasOnLatest || this.currentResponseIndex === -1) {
            this.currentResponseIndex = this.responses.length - 1;
        }
        this._awaitingNewResponse = false;
        this.requestUpdate();
    }

    updateCurrentResponse(response) {
        if (this.responses.length > 0) {
            this.responses = [...this.responses.slice(0, -1), response];
        } else {
            this.addNewResponse(response);
        }
        this.requestUpdate();
    }

    // ── Navigation ──

    async navigate(view, params = null) {
        if (this.currentView === 'assistant' && view === 'ai-customize') {
            this.showProfileModal = true;
            this.requestUpdate();
            return;
        }
        if (this.showProfileModal && view === 'main') {
            this.showProfileModal = false;
            this.requestUpdate();
            return;
        }

        this.currentView = view;
        this.currentViewParams = params;
        this.profiles = await hideWin.storage.getProfiles() || [];
        if (view === 'main') {
            setTimeout(() => {
                const mainView = this.shadowRoot.querySelector('main-view');
                if (mainView && mainView._loadFromStorage) {
                    mainView._loadFromStorage();
                }
            }, 50);
        }
        this.requestUpdate();
    }

    async handleClose() {
        if (this.windowType === 'session') {
            if (window.require) {
                const { ipcRenderer } = window.require('electron');
                await ipcRenderer.invoke('pause-session-window');
            }
        } else {
            if (window.require) {
                const { ipcRenderer } = window.require('electron');
                const sessionStatus = await ipcRenderer.invoke('check-session-status');
                if (sessionStatus && sessionStatus.active) {
                    const confirmed = await ipcRenderer.invoke('show-confirm-dialog', 'A HideWin session is currently running. Are you sure you want to exit and stop all processes?');
                    if (!confirmed) {
                        return;
                    }
                }
                await ipcRenderer.invoke('quit-application');
            }
        }
    }

    async _handleMinimize() {
        this.isMainWindowMinimized = true;
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            const bounds = await ipcRenderer.invoke('get-window-bounds');
            this._previousMainWindowBounds = bounds;
            await ipcRenderer.invoke('minimize-to-bottom-left', { width: 280, height: 60 });
            // Force dark theme for the minimized panel (stealth mode)
            document.documentElement.setAttribute('data-theme', 'dark');
            // Enable stealth mode (click-through)
            await ipcRenderer.invoke('set-ignore-mouse-events', true, { forward: true });
        }
    }

    async _handleMaximize() {
        if ((this.windowType === 'main' || this.windowType === 'session') && this.isMainWindowMinimized) {
            this.isMainWindowMinimized = false;
            if (window.require && this._previousMainWindowBounds) {
                const { ipcRenderer } = window.require('electron');
                await ipcRenderer.invoke('set-window-bounds', { 
                    x: this._previousMainWindowBounds.x,
                    y: this._previousMainWindowBounds.y,
                    width: this._previousMainWindowBounds.width, 
                    height: this._previousMainWindowBounds.height,
                    minWidth: 400, // Restore MIN_WINDOW_SIZE
                    minHeight: 300
                });
                // Restore theme for main window
                window.hideWin.theme.load();
                // Disable stealth mode
                await ipcRenderer.invoke('set-ignore-mouse-events', false);
            }
        } else {
            if (window.require) {
                const { ipcRenderer } = window.require('electron');
                await ipcRenderer.invoke('window-maximize');
            }
        }
    }

    async toggleSessionHide() {
        this.isSessionHidden = !this.isSessionHidden;
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            if (this.isSessionHidden) {
                document.body.classList.add('session-hidden');
                this._previousSessionBounds = await ipcRenderer.invoke('get-window-bounds');
                await ipcRenderer.invoke('set-window-size', { width: 250, height: 50 });
            } else {
                document.body.classList.remove('session-hidden');
                if (this._previousSessionBounds) {
                    await ipcRenderer.invoke('set-window-bounds', {
                        x: this._previousSessionBounds.x,
                        y: this._previousSessionBounds.y,
                        width: this._previousSessionBounds.width,
                        height: this._previousSessionBounds.height,
                        minWidth: 400,
                        minHeight: 300
                    });
                } else {
                    await ipcRenderer.invoke('set-window-size', { width: 550, height: 500 });
                }
            }
        }
        this.requestUpdate();
    }

    // ── Session start ──

    async handleStart(modeCategory, profileId = '') {
        if (!modeCategory || modeCategory === 'undefined' || modeCategory === 'null') {
            this.selectedModeCategory = '';
        } else {
            this.selectedModeCategory = modeCategory;
        }
        this.selectedProfile = profileId;

        if (this.windowType === 'main') {
            if (window.require) {
                const { ipcRenderer } = window.require('electron');
                await ipcRenderer.invoke('start-session', { modeCategory: this.selectedModeCategory, profileId: this.selectedProfile });
            }
            return;
        }

        await this._handleStartSessionBackend();
    }

    async _handleStartSessionBackend() {
        if (!this.selectedModeCategory) {
            this.waitingForMode = true;
            this.isPaused = true;
            this.responses = [];
            this.currentResponseIndex = -1;
            this.sessionActive = true;
            this.currentView = 'assistant';
            this.setStatus('Waiting for Mode selection...');
            
            if (window.require) {
                const { ipcRenderer } = window.require('electron');
                ipcRenderer.invoke('set-stealth-mode', true);
            }
            return;
        }
        await this.startActualSession();
    }

    async startActualSession() {
        this.waitingForMode = false;
        const providerMode = await hideWin.storage.getPreferences().then(p => p.aiProvider || 'gemini').catch(() => 'gemini');

        if (providerMode === 'cloud') {
            const hasCloudToken = await hideWin.storage.getCloudToken().catch(() => null);
            if (!hasCloudToken) {
                const mainView = this.shadowRoot.querySelector('main-view');
                if (mainView && mainView.triggerApiKeyError) {
                    mainView.triggerApiKeyError();
                }
                return;
            }

            const success = await hideWin.initializeCloud(this.selectedProfile);
            if (!success) {
                const mainView = this.shadowRoot.querySelector('main-view');
                if (mainView && mainView.triggerApiKeyError) {
                    mainView.triggerApiKeyError();
                }
                return;
            }
        } else if (providerMode === 'local') {
            const success = await hideWin.initializeLocal(this.selectedProfile);
            if (!success) {
                const mainView = this.shadowRoot.querySelector('main-view');
                if (mainView && mainView.triggerApiKeyError) {
                    mainView.triggerApiKeyError();
                }
                return;
            }
        } else {
            const creds = await hideWin.storage.getCredentials().catch(() => ({}));
            const hasGemini = !!(creds.apiKey || '');
            const hasGroq = !!(creds.groqApiKey || '');
            const hasOpenAI = !!(creds.openaiKey || '');

            if (!hasGemini && !hasGroq && !hasOpenAI) {
                const mainView = this.shadowRoot.querySelector('main-view');
                if (mainView && mainView.triggerApiKeyError) {
                    mainView.triggerApiKeyError();
                }
                return;
            }

            await hideWin.initializeGemini(this.selectedProfile, this.outputLanguage);
            hideWin.setTranscriptionLanguage(this.transcriptionLanguage);
        }

        hideWin.startCapture(this.selectedScreenshotInterval, this.selectedImageQuality);
        if (this.responses.length === 0) {
            this.responses = [];
            this.currentResponseIndex = -1;
        }
        this.startTime = Date.now();
        this.sessionActive = true;
        this.currentView = 'assistant';
        this._startTimer();

        this.isPaused = false;
        this._resetIdleTimer();

        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.invoke('set-stealth-mode', true);
        }
        
        // Show started alert in the session window
        this.responses = [{
            type: 'alert',
            content: `Session started in ${this.selectedModeCategory} mode.`,
            id: 'alert-' + Date.now()
        }, ...this.responses];
        this.currentResponseIndex = 0;
        this.requestUpdate();
    }

    togglePause() {
        if (this.waitingForMode) {
            this.setStatus('Please select a Mode to start.');
            // Shake the mode selector or something? Just return for now.
            return;
        }
        
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            hideWin.stopCapture();
            this.setStatus('Paused (Token saver active)');
        } else {
            hideWin.startCapture(this.selectedScreenshotInterval, this.selectedImageQuality);
            this.setStatus('Listening...');
            this._resetIdleTimer();
        }
        this.requestUpdate();
    }

    async toggleClickThrough() {
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            this._isClickThrough = await ipcRenderer.invoke('toggle-click-through');
            this.requestUpdate();
        }
    }

    _resetIdleTimer() {
        if (this._idleTimer) clearTimeout(this._idleTimer);
    }

    async handleAPIKeyHelp() {
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('open-external', 'https://hidewin.com/help/api-key');
        }
    }

    async handleGroqAPIKeyHelp() {
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('open-external', 'https://console.groq.com/keys');
        }
    }

    // ── Settings handlers ──

    async handleProfileChange(profile) {
        this.selectedProfile = profile;
        await hideWin.storage.updatePreference('selectedProfile', profile);
        const pObj = this.profiles.find(p => p.id === profile);
        this.setStatus(`Profile selected: ${pObj ? pObj.name.split(' ')[0] : 'AI'} ✔`);
    }

    async handleTranscriptionLanguageChange(language) {
        this.transcriptionLanguage = language;
        await hideWin.storage.updatePreference('transcriptionLanguage', language);
        hideWin.setTranscriptionLanguage(language);
        this.requestUpdate();
    }

    async handleOutputLanguageChange(language) {
        this.outputLanguage = language;
        await hideWin.storage.updatePreference('outputLanguage', language);
        this.requestUpdate();
    }

    async handleScreenshotIntervalChange(interval) {
        this.selectedScreenshotInterval = interval;
        await hideWin.storage.updatePreference('selectedScreenshotInterval', interval);
    }

    async handleImageQualityChange(quality) {
        this.selectedImageQuality = quality;
        await hideWin.storage.updatePreference('selectedImageQuality', quality);
    }

    async handleLayoutModeChange(layoutMode) {
        this.layoutMode = layoutMode;
        await hideWin.storage.updateConfig('layout', layoutMode);
        this.requestUpdate();
    }

    async handleExternalLinkClick(url) {
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('open-external', url);
        }
    }

    async handleSendText(message) {
        if (!message || !message.trim()) return;
        this._resetIdleTimer();
        
        // Instantly display question card on screen
        this.addNewResponse({
            question: message,
            answer: '⏳ *Generating response...*'
        });

        const result = await window.hideWin.sendTextMessage(message);
        if (!result.success) {
            this.setStatus('Error sending message: ' + (result.error || 'Unknown error'));
            this.updateCurrentResponse({
                question: message,
                answer: `⚠️ **Unable to generate response**: ${result.error || 'Please ensure your Google Gemini API key is entered in Settings.'}`
            });
        } else {
            this.setStatus('Generating response...');
        }
    }

    handleResponseIndexChanged(e) {
        this.currentResponseIndex = e.detail.index;
        this.shouldAnimateResponse = false;
        this.requestUpdate();
    }

    handleOnboardingComplete() {
        this.currentView = 'main';
    }

    updated(changedProperties) {
        super.updated(changedProperties);
        
        if (changedProperties.has('currentView') && window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.send('view-changed', this.currentView);
        }

        // Toggle stealth cursor: in live mode, force arrow cursor everywhere
        // so hovering over the stealth window doesn't reveal interactive elements.
        if (changedProperties.has('currentView')) {
            const isLive = this._isLiveMode();
            if (isLive) {
                document.body.classList.add('stealth-cursor');
                this.classList.add('stealth-cursor');
            } else {
                document.body.classList.remove('stealth-cursor');
                this.classList.remove('stealth-cursor');
            }
        }
    }

    // ── Helpers ──

    _isLiveMode() {
        return this.currentView === 'assistant';
    }

    handleAutoScrollChanged(e) {
        this.autoScroll = e.detail.autoScroll;
        hideWin.storage.updatePreference('autoScroll', this.autoScroll);
    }

    async _startResize(e, handleType) {
        e.preventDefault();
        e.stopPropagation();

        if (!window.require) return;
        const { ipcRenderer } = window.require('electron');

        const startBounds = await ipcRenderer.invoke('get-window-bounds');
        if (!startBounds) return;

        const startX = e.screenX;
        const startY = e.screenY;

        const minW = 400;
        const minH = 300;

        let finalWidth = startBounds.width;
        let finalHeight = startBounds.height;

        const handleMouseMove = (event) => {
            const deltaX = event.screenX - startX;
            const deltaY = event.screenY - startY;

            let newWidth = startBounds.width;
            let newHeight = startBounds.height;
            let newX = startBounds.x;
            let newY = startBounds.y;

            // Horizontal resizing
            if (handleType.includes('right')) {
                newWidth = Math.max(minW, startBounds.width + deltaX);
            } else if (handleType.includes('left')) {
                newWidth = Math.max(minW, startBounds.width - deltaX);
                newX = startBounds.x + (startBounds.width - newWidth);
            }

            // Vertical resizing
            if (handleType.includes('bottom')) {
                newHeight = Math.max(minH, startBounds.height + deltaY);
            } else if (handleType.includes('top')) {
                newHeight = Math.max(minH, startBounds.height - deltaY);
                newY = startBounds.y + (startBounds.height - newHeight);
            }

            ipcRenderer.invoke('resize-window-corner', { x: newX, y: newY, width: newWidth, height: newHeight });
            finalWidth = newWidth;
            finalHeight = newHeight;
        };

        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);

            const widthKey = this.windowType === 'session' ? 'sessionWindowWidth' : 'mainWindowWidth';
            const heightKey = this.windowType === 'session' ? 'sessionWindowHeight' : 'mainWindowHeight';
            hideWin.storage.updateConfig(widthKey, finalWidth);
            hideWin.storage.updateConfig(heightKey, finalHeight);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }

    async _startMove(e) {
        // Only respond to primary button; skip if the click target is interactive
        if (e.button !== 0) return;
        const tag = e.target.tagName;
        if (tag === 'BUTTON' || tag === 'A' || tag === 'INPUT' || tag === 'SELECT') return;
        e.preventDefault();

        const { ipcRenderer } = window.require('electron');
        const startBounds = await ipcRenderer.invoke('get-window-bounds');
        if (!startBounds) return;

        const startScreenX = e.screenX;
        const startScreenY = e.screenY;

        const handleMouseMove = (event) => {
            const newX = startBounds.x + (event.screenX - startScreenX);
            const newY = startBounds.y + (event.screenY - startScreenY);
            ipcRenderer.invoke('move-window', { x: newX, y: newY });
        };

        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }

    // ── Render ──

    renderCurrentView() {
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

    getUserAvatarInitials() {
        const email = (this.userEmail || 'user@hidewin.ai').trim();
        const namePart = email.split('@')[0];
        
        if (namePart.includes('.')) {
            const parts = namePart.split('.');
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        
        return namePart.substring(0, 2).toUpperCase();
    }

    getUserAvatarColor() {
        const name = (this.userEmail || 'user@hidewin.ai').trim();
        if (!name) return '#3b82f6';
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = Math.abs(hash) % 360;
        return `hsl(${hue}, 65%, 45%)`;
    }

    renderTopToolbar() {
        if (this.windowType === 'session') return '';

        const items = [
            { id: 'main', label: 'Home', icon: html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m19 8.71l-5.333-4.148a2.666 2.666 0 0 0-3.274 0L5.059 8.71a2.67 2.67 0 0 0-1.029 2.105v7.2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.2c0-.823-.38-1.6-1.03-2.105"/><path d="M16 15c-2.21 1.333-5.792 1.333-8 0"/></g></svg>` },
            { id: 'ai-customize', label: 'Profile', icon: html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="17" y1="11" x2="23" y2="11"/></svg>` },
            { id: 'notes', label: 'Notes', icon: html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="14 2 14 8 20 8"/><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="16" y1="13" x2="8" y2="13"/><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="16" y1="17" x2="8" y2="17"/><polyline fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="10 9 9 9 8 9"/></svg>` },
            { id: 'history', label: 'History', icon: html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M10 20.777a9 9 0 0 1-2.48-.969M14 3.223a9.003 9.003 0 0 1 0 17.554m-9.421-3.684a9 9 0 0 1-1.227-2.592M3.124 10.5c.16-.95.468-1.85.9-2.675l.169-.305m2.714-2.941A9 9 0 0 1 10 3.223"/><path d="M12 8v4l3 3"/></g></svg>` },
            { id: 'browse', label: 'Browse', icon: html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>` },
            
            { id: 'help', label: 'Help', icon: html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9s-9-1.8-9-9s1.8-9 9-9m0 13v.01"/><path d="M12 13a2 2 0 0 0 .914-3.782a1.98 1.98 0 0 0-2.414.483"/></g></svg>` },
            { id: 'invite', label: 'Invite', icon: html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>` }
        ];

        return html`
            <div class="top-toolbar ${this._isLiveMode() ? 'hidden' : ''}">
                <nav class="horizontal-nav">
                    ${items.map(item => html`
                        <button
                            class="nav-item ${this.currentView === item.id ? 'active' : ''}"
                            @click=${() => this.navigate(item.id)}
                           
                        >
                            ${item.icon}
                            ${item.label}
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

    getAppStatus() {
        if (this.isPaused) return 'paused';
        const txt = (this.statusText || '').toLowerCase();
        if (txt.includes('generating') || txt.includes('analyzing') || txt.includes('processing')) {
            return 'processing';
        }
        return 'listening';
    }

    renderStatusDot() {
        const status = this.getAppStatus();
        const color = status === 'processing' ? '#ef4444' : (status === 'paused' ? '#eab308' : '#22c55e');
        const pulseAnim = status !== 'paused' ? 'pulse 2s infinite' : 'none';
        
        return html`
            <div style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; margin-left: 2px;">
                <div style="width: 8px; height: 8px; border-radius: 50%; background-color: ${color}; box-shadow: 0 0 8px ${color}; animation: ${pulseAnim};"></div>
            </div>
            <style>
                @keyframes pulse {
                    0% { transform: scale(0.95); opacity: 0.8; }
                    50% { transform: scale(1.15); opacity: 1; }
                    100% { transform: scale(0.95); opacity: 0.8; }
                }
            
        /* GLOBAL POSH LEAN SCROLLBAR */
        ::-webkit-scrollbar { width: 6px !important; height: 6px !important; background-color: transparent !important; }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background-color: #c1c1c1;
            border-radius: 10px;
            border: 3px solid transparent;
            background-clip: padding-box;
        }
        ::-webkit-scrollbar-thumb:hover {
            background-color: #a8a8a8;
        }
        ::-webkit-scrollbar-button:single-button {
            background-color: transparent;
            display: block;
            height: 12px;
            width: 10px;
        }
        ::-webkit-scrollbar-button:single-button:vertical:decrement {
            background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23c1c1c1'><path d='M7 14l5-5 5 5z'/></svg>");
            background-size: 8px;
            background-position: center;
            background-repeat: no-repeat;
        }
        ::-webkit-scrollbar-button:single-button:vertical:increment {
            background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23c1c1c1'><path d='M7 10l5 5 5-5z'/></svg>");
            background-size: 8px;
            background-position: center;
            background-repeat: no-repeat;
        }
    </style>

        `;
    }

    renderLiveBar() {
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

    render() {
        try {
        // Enforce Minimized Widget First (so it works even if not authenticated)
        if (this.isMainWindowMinimized) {
            return html`
                <div class="live-bar" style="display: flex; justify-content: center; align-items: flex-start; padding: 0; background: transparent; position: relative; width: 100%; height: 100%; -webkit-app-region: drag;">
                    <div style="display: flex; align-items: center; background: rgba(30,32,38,0.95); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.15); border-radius: 28px; padding: 4px 6px; gap: 4px; box-shadow: 0 6px 16px rgba(0,0,0,0.6); margin-top: 4px;">
                        
                        <!-- Logo Icon -->
                        <div style="width: 32px; height: 32px; border-radius: 50%; background-image: url('./assets/images/small_icon.png'); background-size: auto 32px; background-position: center; background-repeat: no-repeat; margin-left: 4px;">
                        </div>
                        
                        ${this.startTime != null ? html`
                            ${this.renderStatusDot()}
                            <div style="color: rgba(255,255,255,0.8); font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums; margin: 0 4px;">
                                ${this.getElapsedTime()}
                            </div>
                        ` : ''}

                        <!-- Maximize Button -->
                        <button class="stealth-tooltip" data-tooltip="Restore HideWin" @click=${() => this._handleMaximize()} style="background: transparent; border: none; color: #ffffff; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; font-size: 15px; font-weight: 700; padding: 6px 10px; border-radius: 20px; transition: all 0.2s; -webkit-app-region: no-drag;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"></path><path d="M9 21H3v-6"></path><path d="M21 3l-7 7"></path><path d="M3 21l7-7"></path></svg>
                            Restore
                        </button>
                    </div>
                </div>
            `;
        }

        // Enforce Authentication Next (skip for session windows to prevent AuthView flashing)
        if (!this.isAuthenticated && this.windowType !== 'session') {
            return html`
                            <!-- Resize Handles (Corner Only) -->
            ${!this.isSessionHidden ? html`
                <div class="resize-handle top-left" @mousedown=${e => this._startResize(e, 'top-left')}></div>
                <div class="resize-handle top-right" @mousedown=${e => this._startResize(e, 'top-right')}></div>
                <div class="resize-handle bottom-left" @mousedown=${e => this._startResize(e, 'bottom-left')}></div>
                <div class="resize-handle bottom-right" @mousedown=${e => this._startResize(e, 'bottom-right')}></div>
            ` : ''}
            <div class="app-shell">
                                        <auth-view @auth-success=${async (e) => {
                        try {
                            if (window.hideWin && window.hideWin.storage) {
                                let creds = {};
                                try {
                                    creds = await window.hideWin.storage.getCredentials() || {};
                                } catch(e) { console.warn("Failed to get credentials, creating new"); }
                                
                                await window.hideWin.storage.setCredentials({
                                    ...creds,
                                    jwtToken: e.detail.token,
                                    hashkey: e.detail.hash || creds.hashkey,
                                    user: e.detail.user || creds.user
                                });
                                
                                try {
                                    const payload = JSON.parse(atob(e.detail.token.split('.')[1]));
                                    if (payload && payload.sub) {
                                        this.userEmail = payload.sub;
                                        window.hideWin.storage.updatePreference('userEmail', payload.sub);
                                    }
                                } catch(err) { }
                            }
                        } catch(fatalErr) {
                            console.error("Non-fatal storage error during login:", fatalErr);
                        } finally {
                            this.isAuthenticated = true;
                            this.requestUpdate();
                            if (this.isMainWindowMinimized) {
                                this._handleMaximize();
                            }
                        }
                    }}
                      @minimize=${() => this._handleMinimize()}
                    ></auth-view>
                </div>
            `;
        }

        // Onboarding is fullscreen, no toolbar
        if (this.currentView === 'onboarding') {
            return html`
                            <!-- Resize Handles (Corner Only) -->
            ${!this.isSessionHidden ? html`
                <div class="resize-handle top-left" @mousedown=${e => this._startResize(e, 'top-left')}></div>
                <div class="resize-handle top-right" @mousedown=${e => this._startResize(e, 'top-right')}></div>
                <div class="resize-handle bottom-left" @mousedown=${e => this._startResize(e, 'bottom-left')}></div>
                <div class="resize-handle bottom-right" @mousedown=${e => this._startResize(e, 'bottom-right')}></div>
            ` : ''}
            <div class="app-shell">
                    <onboarding-view
                        .theme=${this.themeMain}
                        @onboarding-complete=${() => {
                            this.currentView = 'main';
                            this.requestUpdate();
                        }}
                    ></onboarding-view>
                </div>
            `;
        }


        const isLive = this._isLiveMode();

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
            </div>


            
            ${this.showProfileModal ? html`
                <div class="modal-overlay" style="position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:99999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(5px);">
                    <div class="modal-content" style="position:relative; width:90%; max-width:900px; height:90%; background:var(--bg-app); border-radius:12px; border:1px solid var(--border); overflow:hidden; display:flex; flex-direction:column; box-shadow:0 10px 40px rgba(0,0,0,0.6);">
                        <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; border-bottom:1px solid var(--border); background:var(--bg-surface);">
                            <h3 style="margin:0; font-size:15px; font-weight:600; color:var(--text-primary);">Create / Edit Profile</h3>
                            <button @click=${() => this.showProfileModal = false} style="background:transparent; border:none; color:var(--text-primary); cursor:pointer; padding:4px; display:flex; align-items:center; justify-content:center; border-radius:4px;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        <div style="flex:1; overflow:hidden; position:relative;">
                            <ai-customize-view
                                .selectedProfile=${this.selectedProfile}
                                .onProfileChange=${p => { this.handleProfileChange(p); this.showProfileModal = false; }}
                            ></ai-customize-view>
                        </div>
                    </div>
                </div>
            ` : ''}
        `;
        } catch(e) { console.error("RENDER_ERROR:", e); return html`<div style="color:red; background:white; padding:20px; z-index:999999; position:absolute;"><h1>Render Error</h1><pre>${e.stack}</pre></div>`; }
    }
}

customElements.define('hide-win-app', HideWinApp);
