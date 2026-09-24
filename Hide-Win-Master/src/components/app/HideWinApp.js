window.addEventListener('unhandledrejection', function(event) {
    if (window.require) {
        const fs = window.require('fs');
        fs.appendFileSync('renderer_error_log.txt', 'Unhandled Promise Rejection: ' + event.reason + '\n\n');
    }
});
window.addEventListener('error', function(event) {
    if (window.require) {
        const fs = window.require('fs');
        fs.appendFileSync('renderer_error_log.txt', event.message + '\n' + event.error.stack + '\n\n');
    }
});
import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';
import { renderTopToolbar, renderLiveBar, renderCurrentView } from './HideWinAppRenderers.js';
import { bindAppEvents, unbindAppEvents } from './HideWinAppEvents.js';
import { appStyles } from './HideWinApp.styles.js';
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

export class HideWinApp extends LitElement {
    static styles = appStyles;


    static properties = {
        showAvatarMenu: { type: Boolean },
        isMobileDrawerOpen: { type: Boolean },
        _windowWidth: { state: true },
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
        isQuickSettingsOpen: { state: true },
        quickTheme: { state: true },
        quickTransparency: { state: true },
        quickFontSize: { state: true },
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
        showAvatarMenu: { state: true },
        _signInExpanded: { state: true },
        _branding: { state: true }
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
        this._signInExpanded = false;
        this._branding = null;
        this.selectedProfile = '';
        this.selectedModeCategory = 'all';
        this.transcriptionLanguage = 'en-US';
        this.outputLanguage = 'en-US';
        this.selectedScreenshotInterval = '5';
        this.selectedImageQuality = 'medium';
        this.layoutMode = 'normal';
        this.isQuickSettingsOpen = false;
        this.quickTheme = 'dark';
        this.quickTransparency = 0.3;
        this.quickFontSize = 14;
        this.showLiveNotes = false;
        this.showProfileModal = false;
        this.isSessionHidden = false;
        this.userFullName = 'User';
        this.userEmail = 'user@example.com';
        this._windowWidth = window.innerWidth || 1050;
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
        this.isMainWindowMinimized = false;
        this._panelMainOpen = false;
        this._panelNavigateListener = null;
        
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

        if (this.windowType !== 'panel') {
            this._loadFromStorage();
            this._checkForUpdates();
        }
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
        if (this.windowType === 'panel') {
            this.classList.add('panel-window');
            this._loadBranding();
            if (!window.require) return;
            const { ipcRenderer } = window.require('electron');
            this._panelAuthListener = (_event, authenticated) => {
                this.isAuthenticated = Boolean(authenticated);
                this.requestUpdate();
            };
            this._panelVisibilityListener = (_event, visible) => {
                this._panelMainOpen = Boolean(visible);
                this.requestUpdate();
            };
            ipcRenderer.on('panel-auth-state', this._panelAuthListener);
            ipcRenderer.on('panel-main-visibility', this._panelVisibilityListener);
            window.hideWin?.storage?.getCredentials?.().then(creds => {
                this.isAuthenticated = Boolean(creds?.jwtToken);
                this.requestUpdate();
            }).catch(() => {});
            return;
        }
        bindAppEvents.call(this);
        this._loadBranding();
        if (this.windowType === 'main' && window.require) {
            const { ipcRenderer } = window.require('electron');
            this._panelNavigateListener = () => this.navigate('customize');
            ipcRenderer.on('panel-navigate-settings', this._panelNavigateListener);
        }
        if (this.currentView === 'main' && this.isAuthenticated) {
            // Pill mode disabled
        }

        this._documentClickHandler = () => {
            if (this.isQuickSettingsOpen || this.showAvatarMenu) {
                this.isQuickSettingsOpen = false;
                this.showAvatarMenu = false;
            }
        };
        document.addEventListener('click', this._documentClickHandler);

        if (window.hideWin && window.hideWin.storage) {
            window.hideWin.storage.getPreferences().then(prefs => {
                this.quickTheme = prefs.themeSession || 'dark';
                this.quickTransparency = prefs.transparencySession !== undefined ? prefs.transparencySession : 0.3;
                this.quickFontSize = prefs.fontSizeSession || 14;
            });
        }

        // Track window width for responsive toolbar (CSS media queries don't fire in Electron shadow DOM)
        this._resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                const w = entry.contentRect.width;
                if (w !== this._windowWidth) {
                    this._windowWidth = w;
                }
            }
        });
        this._resizeObserver.observe(this);

        // Handle session start routed from main window (single-window merge)
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.on('update-session-state', (e, options) => {
                if (options && options.modeCategory !== undefined) this.selectedModeCategory = options.modeCategory;
                if (options && options.profileId !== undefined) this.selectedProfile = options.profileId;
                if (!this.sessionActive) {
                    // Transition to session view within main window
                    this.currentView = 'assistant';
                    this.sessionActive = true;
                    this.isPaused = false;
                    this.startTime = Date.now();
                    this._startTimer();
                }
                this.requestUpdate();
            });
        }
    }

        disconnectedCallback() {
        super.disconnectedCallback();
        if (this.windowType !== 'panel') unbindAppEvents.call(this);
        if (window.require && this._panelAuthListener) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.removeListener('panel-auth-state', this._panelAuthListener);
            ipcRenderer.removeListener('panel-main-visibility', this._panelVisibilityListener);
            ipcRenderer.removeListener('panel-navigate-settings', this._panelNavigateListener);
        }
        if (window.require && this.windowType === 'main' && this._panelNavigateListener) {
            window.require('electron').ipcRenderer.removeListener('panel-navigate-settings', this._panelNavigateListener);
        }
        if (this.currentView === 'main' && this.isAuthenticated) {
            // Pill mode disabled
        }
        document.removeEventListener('click', this._documentClickHandler);

        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
            this._resizeObserver = null;
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

    // â”€â”€ Timer â”€â”€

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

    // â”€â”€ Status & Responses â”€â”€

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

    // â”€â”€ Navigation â”€â”€

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
        if (this.windowType !== 'main') return;
        this.isMainWindowMinimized = true;
        this._signInExpanded = false;
        this.classList.add('pill-mode');
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            const bounds = await ipcRenderer.invoke('get-window-bounds');
            this._previousMainWindowBounds = bounds;
            await ipcRenderer.invoke('minimize-to-center', { width: 250, height: 48 });
            if (this.isAuthenticated) {
                // Keep the authenticated stealth panel dark while preserving the pre-login theme.
                document.documentElement.setAttribute('data-theme', 'dark');
            }
            // Enable stealth mode (click-through)
            await ipcRenderer.invoke('set-ignore-mouse-events', false);
        }
        this.requestUpdate();
    }

    async _handleMaximize() {
        if ((this.windowType === 'main' || this.windowType === 'session') && this.isMainWindowMinimized) {
            this.isMainWindowMinimized = false;
            if (this.windowType === 'main') this.classList.remove('pill-mode');
            if (window.require && this._previousMainWindowBounds) {
                const { ipcRenderer } = window.require('electron');
                const restoreBounds = {
                    x: this._previousMainWindowBounds.x,
                    y: this._previousMainWindowBounds.y,
                    width: this._previousMainWindowBounds.width,
                    height: this._previousMainWindowBounds.height,
                    minWidth: 400,
                    minHeight: 300
                };
                if (this.windowType === 'main') {
                    await ipcRenderer.invoke('restore-window-from-panel', restoreBounds);
                } else {
                    await ipcRenderer.invoke('set-window-bounds', restoreBounds);
                }
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

    // â”€â”€ Session start â”€â”€

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

    // â”€â”€ Settings handlers â”€â”€

    async handleProfileChange(profile) {
        this.selectedProfile = profile;
        await hideWin.storage.updatePreference('selectedProfile', profile);
        const pObj = this.profiles.find(p => p.id === profile);
        this.setStatus(`Profile selected: ${pObj ? pObj.name.split(' ')[0] : 'AI'} âœ”`);
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

    async _openSignIn() {
        if (this.windowType === 'panel' && window.require) {
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('panel-open-main');
            this._panelMainOpen = true;
            this.requestUpdate();
        }
    }

    async _handlePanelClick() {
        if (this._panelDragging || this.windowType !== 'panel' || !window.require) return;
        const { ipcRenderer } = window.require('electron');
        const result = await ipcRenderer.invoke('panel-toggle-main');
        this._panelMainOpen = result?.visible !== false;
        this.requestUpdate();
    }

    async _loadBranding() {
        try {
            const configManager = window.configManager || (window.require && window.require('./utils/configManager.js'));
            const apiBaseUrl = configManager?.getApiBaseUrl?.();
            if (!apiBaseUrl) return;

            const response = await fetch(new URL('/auth/branding', apiBaseUrl));
            if (!response.ok) return;
            const branding = await response.json();
            const resolveLogo = value => {
                if (typeof value !== 'string' || !value.trim()) return '';
                try {
                    const logoUrl = new URL(value.trim(), apiBaseUrl);
                    return ['http:', 'https:', 'data:'].includes(logoUrl.protocol) ? logoUrl.toString() : '';
                } catch {
                    return '';
                }
            };
            this._branding = {
                logo_light: resolveLogo(branding.logo_light),
                logo_dark: resolveLogo(branding.logo_dark)
            };
            this.requestUpdate();
        } catch (error) {
            console.warn('Could not load app branding.');
        }
    }

    notifyPanelAuth(authenticated) {
        if (this.windowType !== 'main' || !window.require) return;
        window.require('electron').ipcRenderer.send('panel-auth-state', Boolean(authenticated));
    }

    _getBrandLogoUrl() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        return isDark
            ? (this._branding?.logo_dark || this._branding?.logo_light || '')
            : (this._branding?.logo_light || this._branding?.logo_dark || '');
    }

    async openUserHistory() {
        try {
            if (!window.require) throw new Error('External links are unavailable in this window.');

            const configManager = window.require('./utils/configManager.js');
            const historyUrl = new URL('/sessions', configManager.getWebBaseUrl()).toString();
            const { ipcRenderer } = window.require('electron');
            const result = await ipcRenderer.invoke('open-external', historyUrl);
            if (!result?.success) throw new Error(result?.error || 'Unable to open session history.');
        } catch (error) {
            console.error('Failed to open session history:', error);
            this.setStatus(error.message || 'Unable to open session history.');
        }
    }

    async handleSendText(message) {
        if (!message || !message.trim()) return;
        this._resetIdleTimer();
        
        // Instantly display question card on screen
        this.addNewResponse({
            question: message,
            answer: 'â³ *Generating response...*'
        });

        const result = await window.hideWin.sendTextMessage(message);
        if (!result.success) {
            this.setStatus('Error sending message: ' + (result.error || 'Unknown error'));
            this.updateCurrentResponse({
                question: message,
                answer: `âš ï¸ **Unable to generate response**: ${result.error || 'Please ensure your Google Gemini API key is entered in Settings.'}`
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
        
        if (changedProperties.has('currentView') || changedProperties.has('isAuthenticated')) {
            // Pill mode is disabled to restore the main window background
            this.classList.remove('pill-mode');
        }

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

    // â”€â”€ Helpers â”€â”€

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
        // Only move from non-interactive panel space, including nested SVG/icon targets.
        if (e.button !== 0) return;
        let target = e.target;
        while (target && target !== this) {
            const tag = target.tagName?.toLowerCase();
            if (['button', 'a', 'input', 'select', 'textarea', 'option'].includes(tag) ||
                target.isContentEditable || target.getAttribute?.('role') === 'button') return;
            target = target.parentElement || target.getRootNode?.().host;
        }
        e.preventDefault();

        const { ipcRenderer } = window.require('electron');
        const startBounds = await ipcRenderer.invoke('get-window-bounds');
        if (!startBounds) return;

        const startScreenX = e.screenX;
        const startScreenY = e.screenY;

        const handleMouseMove = (event) => {
            if (this.windowType === 'panel' && (Math.abs(event.screenX - startScreenX) > 3 || Math.abs(event.screenY - startScreenY) > 3)) {
                this._panelDragging = true;
            }
            const newX = startBounds.x + (event.screenX - startScreenX);
            const newY = startBounds.y + (event.screenY - startScreenY);
            ipcRenderer.invoke(this.windowType === 'panel' ? 'panel-move-windows' : 'move-window', { x: newX, y: newY });
        };

        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            if (this.windowType === 'panel' && this._panelDragging) setTimeout(() => { this._panelDragging = false; }, 0);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }

    // â”€â”€ Render â”€â”€

    renderCurrentView() {
        return renderCurrentView.call(this);
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
        return renderTopToolbar.call(this);
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
        return renderLiveBar.call(this);
    }

    render() {
        try {
        if (this.windowType === 'panel') {
            const logoUrl = this._getBrandLogoUrl();
            return html`
                <div class="floating-brand-panel" @mousedown=${e => this._startMove(e)} @click=${e => { if (!e.target.closest('button')) this._handlePanelClick(); }} style="display:flex;align-items:center;justify-content:space-between;width:calc(100% - 12px);height:54px;margin:6px;padding:6px 9px 6px 12px;gap:10px;border:1px solid rgba(255,255,255,.16);border-radius:28px;background:linear-gradient(135deg,rgba(34,43,59,.98),rgba(17,23,34,.98));box-shadow:0 10px 28px rgba(0,0,0,.34),inset 0 1px rgba(255,255,255,.12);color:#f8fafc;">
                    <div style="display:flex;align-items:center;min-width:0;flex:1;pointer-events:none;">
                        ${logoUrl ? html`<img src=${logoUrl} alt="HideWin" style="display:block;max-width:120px;width:auto;height:36px;object-fit:contain;object-position:left center;" />` : ''}
                    </div>
                    ${this.isAuthenticated ? html`
                        <button @click=${async e => { e.stopPropagation(); const { ipcRenderer } = window.require('electron'); const result = await ipcRenderer.invoke('panel-toggle-main'); this._panelMainOpen = result?.visible !== false; this.requestUpdate(); }} aria-label=${this._panelMainOpen ? 'Hide main window' : 'Show main window'} title=${this._panelMainOpen ? 'Hide main window' : 'Show main window'} style="width:34px;height:34px;border:0;border-radius:50%;background:rgba(255,255,255,.12);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${this._panelMainOpen ? html`<path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.2A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a15.5 15.5 0 0 1-3.2 4.2M6.2 6.2C3.5 8 2 12 2 12s3.5 7 10 7a10.8 10.8 0 0 0 4-.7"/>` : html`<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="2.5"/>`}</svg>
                        </button>
                        <button @click=${async e => { e.stopPropagation(); const { ipcRenderer } = window.require('electron'); await ipcRenderer.invoke('panel-open-settings'); this._panelMainOpen = true; this.requestUpdate(); }} aria-label="Open settings" title="Settings" style="width:34px;height:34px;border:0;border-radius:50%;background:transparent;color:rgba(255,255,255,.82);display:flex;align-items:center;justify-content:center;cursor:pointer;">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 2.95-.08-.02a1.7 1.7 0 0 0-1.82.56l-.05.07h-3.4l-.03-.08a1.7 1.7 0 0 0-1.55-1.08 1.7 1.7 0 0 0-1.17.45l-.06.06-2.95-1.7.02-.08a1.7 1.7 0 0 0-.56-1.82l-.07-.05v-3.4l.08-.03a1.7 1.7 0 0 0 1.08-1.55 1.7 1.7 0 0 0-.45-1.17l-.06-.06 1.7-2.95.08.02a1.7 1.7 0 0 0 1.82-.56l.05-.07h3.4l.03.08a1.7 1.7 0 0 0 1.55 1.08 1.7 1.7 0 0 0 1.17-.45l.06-.06 2.95 1.7-.02.08a1.7 1.7 0 0 0 .56 1.82l.07.05v3.4l-.08.03a1.7 1.7 0 0 0-1.08 1.55z"/></svg>
                        </button>
                    ` : html`
                        <button @click=${e => { e.stopPropagation(); this._openSignIn(); }} style="height:36px;padding:0 16px;border:1px solid rgba(255,255,255,.12);border-radius:20px;background:#3b82f6;color:white;font-size:12px;font-weight:650;white-space:nowrap;cursor:pointer;box-shadow:0 2px 8px rgba(59,130,246,.28);">Sign in to continue <span aria-hidden="true">→</span></button>
                    `}
                </div>
            `;
        }
        // Onboarding is fullscreen, no toolbar
        if (this.currentView === 'onboarding') {
            return html`
                            <!-- Resize Handles (Corner Only) -->
            ${!this.isSessionHidden ? html`
                ${this.windowType === 'session' ? html`<div class="resize-handle top-left" @mousedown=${e => this._startResize(e, 'top-left')}></div><div class="resize-handle top-right" @mousedown=${e => this._startResize(e, 'top-right')}></div><div class="resize-handle bottom-left" @mousedown=${e => this._startResize(e, 'bottom-left')}></div>` : ''}
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
                ${this.windowType === 'session' ? html`<div class="resize-handle top-left" @mousedown=${e => this._startResize(e, 'top-left')}></div><div class="resize-handle top-right" @mousedown=${e => this._startResize(e, 'top-right')}></div><div class="resize-handle bottom-left" @mousedown=${e => this._startResize(e, 'bottom-left')}></div>` : ''}
                <div class="resize-handle bottom-right" @mousedown=${e => this._startResize(e, 'bottom-right')}></div>
            ` : ''}
            <div class="app-shell" style="${this.isSessionHidden ? 'display: none;' : ''}">
                ${this.renderTopToolbar()}
                <div class="content">
                    <div class="content-inner ${isLive ? 'live' : ''}">
                        ${this.renderCurrentView()}
                    </div>
                </div>
            </div>


            
            ${this.showProfileModal ? html`
                <div class="modal-overlay" style="position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:99999; display:flex; align-items:center; justify-content:center; ">
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









