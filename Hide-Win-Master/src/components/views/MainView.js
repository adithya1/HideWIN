import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';

export class MainView extends LitElement {
    static styles = css`
        * {
            font-family: var(--font);
            cursor: default;
            user-select: none;
            box-sizing: border-box;
        }

        @keyframes errorShake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-4px); }
            40%, 80% { transform: translateX(4px); }
        }
        .error-shake {
            animation: errorShake 0.4s ease-in-out;
            border-color: #ef4444 !important;
            box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.5) !important;
        }

        @keyframes slideDownFade {
            0% { opacity: 0; transform: translateY(-10px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .child-dropdown {
            animation: slideDownFade 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
              /* IE and Edge */
              /* Firefox */
        }
        .child-dropdown

        :host {
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: var(--space-xl) var(--space-lg);
        }

        .form-wrapper {
            width: 100%;
            max-width: 420px;
            display: flex;
            flex-direction: column;
            gap: var(--space-md);
        }

        .page-title {
            font-size: var(--font-size-xl);
            font-weight: var(--font-weight-semibold);
            color: var(--text-primary);
            margin-bottom: var(--space-xs);
        }

        .page-title .mode-suffix {
            opacity: 0.5;
        }

        .page-subtitle {
            font-size: var(--font-size-sm);
            color: var(--text-muted);
            margin-bottom: var(--space-md);
        }

        /* ── Cloud promo card ── */

        .cloud-promo {
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 16px 20px;
            border-radius: 12px;
            border: 1px solid rgba(99, 102, 241, 0.2);
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.04) 100%);
            cursor: default;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cloud-promo:hover {
            border-color: rgba(99, 102, 241, 0.4);
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%);
            box-shadow: 0 0 30px rgba(99, 102, 241, 0.1), 0 0 60px rgba(139, 92, 246, 0.05);
            transform: translateY(-2px);
        }

        .cloud-promo-glow {
            position: absolute;
            top: -40%;
            right: -20%;
            width: 140px;
            height: 140px;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
            pointer-events: none;
            transition: opacity 0.3s ease;
        }

        .cloud-promo:hover .cloud-promo-glow {
            opacity: 1;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%);
        }

        .cloud-promo-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .cloud-promo-title {
            font-size: var(--font-size-sm);
            font-weight: 600;
            color: var(--text-primary);
            letter-spacing: 0.02em;
        }

        .cloud-promo-arrow {
            color: var(--accent);
            font-size: 16px;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cloud-promo:hover .cloud-promo-arrow {
            transform: translateX(4px);
        }

        .cloud-promo-desc {
            font-size: 13px;
            color: var(--text-secondary);
            line-height: 1.5;
        }

        /* ── Form controls ── */

        .form-group {
            display: flex;
            flex-direction: column;
            gap: var(--space-xs);
        }

        .form-label {
            font-size: var(--font-size-xs);
            font-weight: var(--font-weight-medium);
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        input, select, textarea {
            background: rgba(255, 255, 255, 0.04);
            color: var(--text-primary);
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: 10px 14px;
            width: 100%;
            border-radius: 12px;
            font-size: var(--font-size-sm);
            font-family: var(--font);
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        input:hover:not(:focus), select:hover:not(:focus), textarea:hover:not(:focus) {
            border-color: rgba(255, 255, 255, 0.15);
            background: rgba(255, 255, 255, 0.06);
        }

        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: rgba(99, 102, 241, 0.5);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15), inset 0 1px 2px rgba(0, 0, 0, 0.2);
            background: rgba(255, 255, 255, 0.08);
        }

        input::placeholder, textarea::placeholder {
            color: rgba(255, 255, 255, 0.3);
        }

        input.error {
            border-color: var(--danger, #EF4444);
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
        }

        select {
            cursor: default;
            appearance: none;
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='rgba(255,255,255,0.5)' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
            background-position: right 12px center;
            background-repeat: no-repeat;
            background-size: 14px;
            padding-right: 32px;
        }

        option {
            background-color: #1e1e24;
            color: var(--text-primary);
        }

        textarea {
            resize: vertical;
            min-height: 80px;
            line-height: 1.5;
        }

        .form-hint {
            font-size: var(--font-size-xs);
            color: var(--text-muted);
        }

        .form-hint a, .form-hint span.link {
            color: var(--accent);
            text-decoration: none;
            cursor: default;
        }

        .form-hint span.link:hover {
            text-decoration: underline;
        }

        .whisper-label-row {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .whisper-spinner {
            width: 12px;
            height: 12px;
            border: 2px solid var(--border);
            border-top-color: var(--accent);
            border-radius: 50%;
            animation: whisper-spin 0.8s linear infinite;
        }

        @keyframes whisper-spin {
            to { transform: rotate(360deg); }
        }

        /* ── Start button ── */

        .start-button {
            width: 100%;
            padding: 14px 40px;
            border-radius: 12px;
            border: none;
            background: #185fc4;
            color: white;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 14px rgba(24, 95, 196, 0.4);
        }

        .start-button:hover:not(:disabled) {
            transform: translateY(-2px);
            background: #1550a6;
            box-shadow: 0 6px 20px rgba(24, 95, 196, 0.6) !important;
        }

        .start-button:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3) !important;
        }

        .spinner {
            width: 18px;
            height: 18px;
            border: 2px solid rgba(59, 130, 246, 0.3);
            border-top-color: var(--accent);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .start-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            box-shadow: none !important;
            transform: none;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.05);
            color: var(--text-muted);
        }

        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--space-md);
        }

        .form-grid.single {
            grid-template-columns: 1fr;
        }

        /* ── Divider ── */

        .divider {
            display: flex;
            align-items: center;
            gap: var(--space-md);
            margin: var(--space-sm) 0;
        }

        .divider-line {
            flex: 1;
            height: 1px;
            background: var(--border);
        }

        .divider-text {
            font-size: var(--font-size-xs);
            color: var(--text-muted);
            text-transform: lowercase;
        }

        /* ── Mode switch links ── */

        .mode-links {
            display: flex;
            justify-content: center;
            gap: var(--space-lg);
        }

        .mode-link {
            font-size: var(--font-size-sm);
            color: var(--text-secondary);
            cursor: default;
            background: none;
            border: none;
            padding: 0;
            transition: color var(--transition);
        }

        .mode-link:hover {
            color: var(--text-primary);
        }

        /* ── Mode option cards ── */

        .mode-cards {
            display: flex;
            gap: var(--space-sm);
        }

        .mode-card {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 4px;
            padding: 12px 14px;
            border-radius: var(--radius-md);
            border: 1px solid var(--border);
            background: var(--bg-elevated);
            cursor: default;
            transition: border-color 0.2s, background 0.2s;
        }

        .mode-card:hover {
            border-color: var(--text-muted);
            background: var(--bg-hover);
        }

        .mode-card-title {
            font-size: var(--font-size-sm);
            font-weight: var(--font-weight-semibold);
            color: var(--text-primary);
        }

        .mode-card-desc {
            font-size: var(--font-size-xs);
            color: var(--text-muted);
            line-height: var(--line-height);
        }

        /* ── Title row with help ── */

        .title-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--space-md);
        }
        .brand-logo {
            width: 120px;
            height: 32px;
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

        .title-row .page-title {
            margin-bottom: 0;
        }

        .help-btn {
            background: none;
            border: none;
            color: var(--text-muted);
            cursor: default;
            padding: 4px;
            border-radius: var(--radius-sm);
            transition: color 0.2s;
            display: flex;
            align-items: center;
        }

        .help-btn:hover {
            color: var(--text-secondary);
        }

        .help-btn * {
            pointer-events: none;
        }

        /* ── Help content ── */

        .help-content {
            display: flex;
            flex-direction: column;
            gap: var(--space-md);
            max-height: 500px;
            overflow-y: auto;
        }

        .help-section {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .help-section-title {
            font-size: var(--font-size-xs);
            font-weight: var(--font-weight-semibold);
            color: var(--text-primary);
        }

        .help-section-text {
            font-size: var(--font-size-xs);
            color: var(--text-secondary);
            line-height: var(--line-height);
        }

        .help-code {
            font-family: var(--font-mono);
            font-size: 11px;
            background: var(--bg-hover);
            padding: 6px 8px;
            border-radius: var(--radius-sm);
            color: var(--text-primary);
            display: block;
        }

        .help-link {
            color: var(--accent);
            cursor: default;
            text-decoration: none;
        }

        .help-link:hover {
            text-decoration: underline;
        }

        .help-models {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .help-model {
            font-size: var(--font-size-xs);
            color: var(--text-secondary);
            display: flex;
            justify-content: space-between;
        }

        .help-model-name {
            font-family: var(--font-mono);
            font-size: 11px;
            color: var(--text-primary);
        }

        .help-divider {
            border: none;
            border-top: 1px solid var(--border);
            margin: 0;
        }

        .help-cloud-btn {
            background: #e8e8e8;
            color: #111111;
            border: none;
            padding: 10px var(--space-md);
            border-radius: var(--radius-sm);
            font-size: var(--font-size-sm);
            font-family: var(--font);
            font-weight: var(--font-weight-semibold);
            cursor: default;
            width: 100%;
            transition: opacity 0.15s;
        }

        .help-cloud-btn:hover {
            opacity: 0.9;
        }

        .help-warn {
            font-size: var(--font-size-xs);
            color: var(--warning);
            line-height: var(--line-height);
        }

        /* ── NEW HOME LAYOUT ── */
        .home-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            padding: 40px 60px;
            box-sizing: border-box;
            background: var(--bg-app);
            overflow-y: auto;
        }

        .home-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            margin-bottom: 24px;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .header-right {
            display: flex;
            align-items: center;
            gap: 24px;
        }

        .refresh-btn {
            background: transparent;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            transition: background 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .refresh-btn:hover {
            background: rgba(255,255,255,0.05);
            color: var(--text-primary);
        }

        .start-btn-blue {
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 100px;
            padding: 10px 24px;
            font-size: 15px;
            font-weight: 600;
            display: flex;
            align-items: center;
            cursor: pointer;
            transition: transform 0.2s, background 0.2s;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        .start-btn-blue:hover {
            background: #2563eb;
            transform: scale(1.02);
        }

        .meetings-left-text {
            font-size: 11px;
            color: var(--text-muted);
            margin-top: 6px;
        }

        .avatar-circle {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: #3b82f6;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            font-weight: bold;
            letter-spacing: 0.5px;
        }

        .home-subtext {
            font-size: 14px;
            color: var(--text-secondary);
            margin-bottom: 40px;
        }

        .history-list-container {
            display: flex;
            flex-direction: column;
            gap: 24px;
            width: 100%;
        }

        .history-group {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .history-group-title {
            font-size: 13px;
            color: var(--text-muted);
            font-weight: 600;
        }

        .history-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            border-radius: 8px;
            background: var(--bg-surface);
            border: 1px solid var(--border);
            cursor: pointer;
            transition: background 0.2s;
            width: 100%;
        }

        .history-row:hover {
            background: var(--bg-hover);
        }

        .history-title {
            font-size: 14px;
            font-weight: 500;
            color: var(--text-primary);
        }

        .history-time {
            font-size: 12px;
            color: var(--text-muted);
        }
    `;

    static properties = {
        onStart: { type: Function },
        onExternalLink: { type: Function },
        onNavigate: { type: Function },
        selectedProfile: { type: String },
        onProfileChange: { type: Function },
        isInitializing: { type: Boolean },
        whisperDownloading: { type: Boolean },
        statusText: { type: String },
        isPaused: { type: Boolean },
        isClickThrough: { type: Boolean },
        onToggleClickThrough: { type: Function },
        _profiles: { state: true },
        
        _selectedModeCategory: { state: true },
        _modeCategoryError: { state: true },
        _profileError: { state: true },

        // Internal state
        _mode: { state: true },
        _token: { state: true },
        _geminiKey: { state: true },
        _groqKey: { state: true },
        _openaiKey: { state: true },
        _tokenError: { state: true },
        _keyError: { state: true },
        // Local AI state
        _ollamaHost: { state: true },
        _ollamaModel: { state: true },
        _whisperModel: { state: true },
        _showLocalHelp: { state: true },
        _sessions: { state: true },
        _loadingSessions: { state: true },
        isModeMenuOpen: { type: Boolean, state: true },
        isProfileMenuOpen: { type: Boolean, state: true }
    };

    constructor() {
        super();
        this.onStart = () => {};
        this.onExternalLink = () => {};
        this.onNavigate = () => {};
        this.selectedProfile = '';
        this.onProfileChange = () => {};
        this.isInitializing = false;
        this.whisperDownloading = false;
        this.isClickThrough = false;
        this.onToggleClickThrough = () => {};
        this.isModeMenuOpen = false;
        this.isProfileMenuOpen = false;
        this._profiles = [];

        this._selectedModeCategory = '';
        this._modeCategoryError = false;
        this._profileError = false;

        this._mode = 'byok';
        this._token = '';
        this._geminiKey = '';
        this._groqKey = '';
        this._openaiKey = '';
        this._tokenError = false;
        this._keyError = false;
        this._showLocalHelp = false;
        this._ollamaHost = 'http://127.0.0.1:11434';
        this._ollamaModel = 'llama3.1';
        this._whisperModel = 'Xenova/whisper-small';

        this._animId = null;
        this._time = 0;
        this._mouseX = -1;
        this._mouseY = -1;

        this._sessions = [];
        this._loadingSessions = false;

        this.boundKeydownHandler = this._handleKeydown.bind(this);
        this._loadFromStorage();
    }

    async _loadFromStorage() {
        try {
            const [prefs, creds] = await Promise.all([
                hideWin.storage.getPreferences(),
                hideWin.storage.getCredentials().catch(() => ({})),
            ]);

            const storedMode = prefs.providerMode || 'byok';
            this._mode = storedMode === 'cloud' ? 'byok' : storedMode;

            if (storedMode === 'cloud') {
                await hideWin.storage.updatePreference('providerMode', this._mode);
            }

            // Load keys
            this._token = creds.cloudToken || '';
            this._geminiKey = await hideWin.storage.getApiKey().catch(() => '') || '';
            this._groqKey = await hideWin.storage.getGroqApiKey().catch(() => '') || '';
            this._openaiKey = creds.openaiKey || '';

            // Load local AI settings
            this._ollamaHost = prefs.ollamaHost || 'http://127.0.0.1:11434';
            this._ollamaModel = prefs.ollamaModel || 'llama3.1';
            this._whisperModel = prefs.whisperModel || 'Xenova/whisper-small';

            // Load profiles
            this._profiles = await hideWin.storage.getProfiles().catch(() => []);

            // Load history sessions
            this._loadingSessions = true;
            this.requestUpdate();
            this._sessions = await hideWin.storage.getAllSessions().catch(() => []);
            this._loadingSessions = false;

            this.requestUpdate();
        } catch (e) {
            console.error('Error loading MainView storage:', e);
        }
    }

    async connectedCallback() {
        super.connectedCallback();
        document.addEventListener('keydown', this.boundKeydownHandler);
        
        this._handleOutsideClick = () => {
            if (this.isModeMenuOpen || this.isProfileMenuOpen) {
                this.isModeMenuOpen = false;
                this.isProfileMenuOpen = false;
                this.requestUpdate();
            }
        };
        document.addEventListener('click', this._handleOutsideClick);

        // Listen for profile updates from other views
        this._profilesListener = () => this._loadFromStorage();
        window.addEventListener('profiles-updated', this._profilesListener);

        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            this._sessionStatusListener = (event, status) => {
                this._sessionState = status.state || (status.active ? 'active' : 'idle');
                this._sessionStartTime = status.startTime;
                this._updateClock();
                this.requestUpdate();
            };
            ipcRenderer.on('session-status-changed', this._sessionStatusListener);
            
            // Check initial status
            ipcRenderer.invoke('get-session-status').then(status => {
                this._sessionState = status.state || (status.active ? 'active' : 'idle');
                this._sessionStartTime = status.startTime;
                this._updateClock();
                this.requestUpdate();
            }).catch(() => {});
            
            this._clockInterval = setInterval(() => {
                if (this._sessionState && this._sessionState !== 'idle' && this._sessionStartTime) {
                    this._updateClock();
                    this.requestUpdate();
                }
            }, 1000);
        }
        
        await this._loadFromStorage();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('keydown', this.boundKeydownHandler);
        document.removeEventListener('click', this._handleOutsideClick);
        window.removeEventListener('profiles-updated', this._profilesListener);
        if (this._clockInterval) {
            clearInterval(this._clockInterval);
            this._clockInterval = null;
        }
        if (window.require && this._sessionStatusListener) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.removeListener('session-status-changed', this._sessionStatusListener);
        }
        if (this._animId) cancelAnimationFrame(this._animId);
    }

    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('_mode')) {
            // Stop old animation when switching modes
            if (this._animId) {
                cancelAnimationFrame(this._animId);
                this._animId = null;
            }
        }
    }

    getAppStatus() {
        if (this.isPaused) return 'paused';
        if (!this.statusText) return 'listening';
        const txt = this.statusText.toLowerCase();
        if (txt.includes('generating') || txt.includes('analyzing') || txt.includes('processing')) {
            return 'processing';
        }
        return 'listening';
    }

    renderStatusDot() {
        const status = this.getAppStatus();
        let color = '#22c55e';
        if (status === 'paused') color = '#eab308';
        else if (status === 'processing') color = '#ef4444';

        return html`
            <div style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px;">
                <div style="width: 8px; height: 8px; border-radius: 50%; background-color: ${color}; box-shadow: 0 0 10px ${color}; animation: pulse-status-main 2s infinite ease-in-out;"></div>
            </div>
            <style>
                @keyframes pulse-status-main {
                    0% { transform: scale(0.95); opacity: 0.5; box-shadow: 0 0 0 0 rgba(${status === 'paused' ? '234, 179, 8' : status === 'processing' ? '239, 68, 68' : '34, 197, 94'}, 0.7); }
                    70% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 6px rgba(0, 0, 0, 0); }
                    100% { transform: scale(0.95); opacity: 0.5; box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
                }
            </style>
        `;
    }

    _updateClock() {
        if (!this._sessionStartTime) {
            this._sessionTimerText = "00:00";
            return;
        }
        const diff = Math.floor((Date.now() - this._sessionStartTime) / 1000);
        const m = Math.floor(diff / 60).toString().padStart(2, '0');
        const s = (diff % 60).toString().padStart(2, '0');
        this._sessionTimerText = `${m}:${s}`;
    }

    _handleKeydown(e) {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        if ((isMac ? e.metaKey : e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            this._handleStart();
        }
    }

    // ── Persistence ──

    async _saveMode(mode) {
        this._mode = mode;
        this._tokenError = false;
        this._keyError = false;
        await hideWin.storage.updatePreference('providerMode', mode);
        this.requestUpdate();
    }

    async _saveToken(val) {
        this._token = val;
        this._tokenError = false;
        try {
            const creds = await hideWin.storage.getCredentials().catch(() => ({}));
            await hideWin.storage.setCredentials({ ...creds, cloudToken: val });
        } catch (e) {}
        this.requestUpdate();
    }

    async _saveGeminiKey(val) {
        this._geminiKey = val;
        this._keyError = false;
        await hideWin.storage.setApiKey(val);
        this.requestUpdate();
    }

    async _saveGroqKey(val) {
        this._groqKey = val;
        await hideWin.storage.setGroqApiKey(val);
        this.requestUpdate();
    }

    async _saveOpenaiKey(val) {
        this._openaiKey = val;
        try {
            const creds = await hideWin.storage.getCredentials().catch(() => ({}));
            await hideWin.storage.setCredentials({ ...creds, openaiKey: val });
        } catch (e) {}
        this.requestUpdate();
    }

    async _saveOllamaHost(val) {
        this._ollamaHost = val;
        await hideWin.storage.updatePreference('ollamaHost', val);
        this.requestUpdate();
    }

    async _saveOllamaModel(val) {
        this._ollamaModel = val;
        await hideWin.storage.updatePreference('ollamaModel', val);
        this.requestUpdate();
    }

    async _saveWhisperModel(val) {
        this._whisperModel = val;
        await hideWin.storage.updatePreference('whisperModel', val);
        this.requestUpdate();
    }

    _handleProfileChange(e) {
        const val = e.target.value;
        if (val === '__CREATE_NEW__') {
            this.onNavigate('ai-customize');
        } else {
            this.selectedProfile = val;
            this.onProfileChange(val);
            this.requestUpdate();
        }
    }

    // ── Start ──

    _handleStart() {
        if (this.isInitializing) return;

        // Only validate mode if we are starting a NEW session
        if (this._sessionState !== 'paused' && !this._selectedModeCategory) {
            this._modeCategoryError = true;
            this.requestUpdate();
            setTimeout(() => { this._modeCategoryError = false; this.requestUpdate(); }, 2000);
            return;
        }

        this.onStart(this._selectedModeCategory, this.selectedProfile);
    }
    
    async _handleEndSessionCompletely() {
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('end-session-completely');
            this._isSessionActive = false;
            this.requestUpdate();
        }
    }

    triggerApiKeyError() {
        this._keyError = this._mode !== 'local';
        this.requestUpdate();
        setTimeout(() => {
            this._tokenError = false;
            this._keyError = false;
            this.requestUpdate();
        }, 3000);
    }

    _formatDateGroup(dateString) {
        if (!dateString) return 'Unknown Date';
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
        
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    }

    _formatTime(dateString) {
        if (!dateString) return '';
        return new Date(dateString).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    }

    // ── Render helpers ──

    _renderStartButton() {
        return html`
            <button
                class="start-button ${this._keyError ? 'error' : ''}"
                style="${this._keyError ? 'background: var(--danger, #EF4444); color: white;' : ''}"
                @click=${() => this._handleStart()}
                ?disabled=${this.isInitializing}
            >
                ${this._keyError ? html`
                    Missing API Key (Check Settings)
                ` : this.isInitializing ? html`
                    <div class="spinner"></div> Starting...
                ` : html`
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Start Session
                `}
            </button>
        `;
    }

    _renderDivider() {
        return html`
            <div class="divider">
                <div class="divider-line"></div>
                <span class="divider-text">or</span>
                <div class="divider-line"></div>
            </div>
        `;
    }

    // ── Cloud mode ──
    // Cloud UI intentionally disabled. Backend cloud wiring is still present in
    // the codebase, but the renderer no longer exposes this setup path.

    // ── Mode + Profile selectors (rendered before Start button in all modes) ──

    _renderActionBar() {
        const MODES = [
            { value: '', label: 'Select Mode' },
            { value: 'Job Interview', label: 'Job Interview' },
            { value: 'Business Meeting', label: 'Business Meeting' },
            { value: 'Sales Call', label: 'Sales Call' },
            { value: 'Presentation', label: 'Presentation' },
            { value: 'Negotiation', label: 'Negotiation' },
            { value: 'Exam Assistant', label: 'Exam Assistant' },
            { value: 'Custom', label: 'Custom' }
        ];

        // Profile options filtered based on selected mode
        const profileOptions = this._selectedModeCategory 
            ? (this._profiles || []).filter(p => p.type === this._selectedModeCategory) 
            : [];

        const isProfileValid = this.selectedProfile && profileOptions.some(p => (p.id || p.name) === this.selectedProfile);
        const displayProfileName = isProfileValid ? profileOptions.find(p => (p.id || p.name) === this.selectedProfile).name : 'Select Profile';

        // Dynamic border color based on validation error
        const borderColor = this._modeCategoryError ? '#ef4444' : 'var(--accent, #3b82f6)';
        const outlineColor = this._modeCategoryError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)';

        return html`
            <div style="display: flex; flex-direction: column; align-items: center; margin: 24px 0 40px 0; width: 100%;">
                <div style="display: flex; align-items: center; border: 1px solid ${borderColor === 'var(--accent, #3b82f6)' ? 'var(--border)' : borderColor}; box-shadow: 0 12px 40px rgba(0,0,0,0.15), 0 0 0 4px ${outlineColor}; border-radius: 50px; background: var(--bg-surface); padding: 8px 12px 8px 24px; width: 100%; max-width: 850px; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);">
                    
                    <!-- Mode Select (Custom Dropdown) -->
                    <div style="width: 220px; flex-shrink: 0; flex-grow: 0; display: flex; flex-direction: column; position: relative;" @click=${(e) => { e.stopPropagation(); this.isModeMenuOpen = !this.isModeMenuOpen; this.isProfileMenuOpen = false; this.requestUpdate(); }}>
                        <div style="display: flex; align-items: center; gap: 12px; padding: 6px 0; cursor: pointer; width: 100%;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted); flex-shrink: 0;">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <span style="font-size: 15px; font-weight: ${this._selectedModeCategory ? '600' : '500'}; color: ${this._selectedModeCategory ? 'var(--text-primary)' : 'var(--text-muted)'}; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                ${this._selectedModeCategory ? (MODES.find(m => m.value === this._selectedModeCategory)?.label || this._selectedModeCategory) : 'Select Mode'}
                            </span>
                        </div>
                        
                        ${this.isModeMenuOpen ? html`
                            <div class="child-dropdown" style="position: absolute; top: calc(100% + 16px); left: -12px; width: calc(100% + 24px); background: var(--bg-surface); border: 1px solid var(--border); border-radius: 16px; z-index: 100; max-height: 280px; overflow-y: auto; padding: 8px; box-shadow: 0 16px 40px rgba(0,0,0,0.4);">
                                ${MODES.slice(1).map(m => html`
                                    <div style="padding: 12px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; color: ${this._selectedModeCategory === m.value ? 'var(--accent)' : 'var(--text-primary)'}; background: ${this._selectedModeCategory === m.value ? 'rgba(59, 130, 246, 0.1)' : 'transparent'}; transition: background 0.15s;" 
                                        @mouseover=${e => { if (this._selectedModeCategory !== m.value) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                                        @mouseout=${e => { if (this._selectedModeCategory !== m.value) e.currentTarget.style.background = 'transparent'; }}
                                        @click=${(e) => {
                                            e.stopPropagation();
                                            this._selectedModeCategory = m.value;
                                            this.selectedProfile = '';
                                            this._modeCategoryError = false;
                                            this.isModeMenuOpen = false;
                                            this.requestUpdate();
                                        }}>
                                        ${m.label}
                                    </div>
                                `)}
                            </div>
                        ` : ''}
                    </div>

                    <div style="width: 1px; height: 32px; background: var(--border); margin: 0 20px;"></div>

                    <!-- Profile Select (Custom Dropdown) -->
                    <div style="width: 220px; flex-shrink: 0; flex-grow: 0; display: flex; flex-direction: column; position: relative;" @click=${(e) => { 
                        e.stopPropagation(); 
                        if (!this._selectedModeCategory) {
                            this._modeCategoryError = true;
                            this.requestUpdate();
                            setTimeout(() => { this._modeCategoryError = false; this.requestUpdate(); }, 2000);
                            return;
                        }
                        this.isProfileMenuOpen = !this.isProfileMenuOpen; 
                        this.isModeMenuOpen = false; 
                        this.requestUpdate(); 
                    }}>
                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 0; cursor: pointer; width: 100%; gap: 8px;">
                            <span style="font-size: 15px; font-weight: ${isProfileValid ? '600' : '500'}; color: ${isProfileValid ? 'var(--text-primary)' : 'var(--text-muted)'}; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                ${displayProfileName}
                            </span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted); flex-shrink: 0;">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>
                        
                        ${this.isProfileMenuOpen ? html`
                            <div class="child-dropdown" style="position: absolute; top: calc(100% + 16px); left: -12px; width: calc(100% + 24px); background: var(--bg-surface); border: 1px solid var(--border); border-radius: 16px; z-index: 100; max-height: 280px; overflow-y: auto; padding: 8px; box-shadow: 0 16px 40px rgba(0,0,0,0.4);">
                                <div style="padding: 12px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; color: ${!isProfileValid ? 'var(--accent)' : 'var(--text-primary)'}; background: ${!isProfileValid ? 'rgba(59, 130, 246, 0.1)' : 'transparent'}; transition: background 0.15s;" 
                                    @mouseover=${e => { if (isProfileValid) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                                    @mouseout=${e => { if (isProfileValid) e.currentTarget.style.background = 'transparent'; }}
                                    @click=${(e) => {
                                        e.stopPropagation();
                                        this.selectedProfile = '';
                                        this.isProfileMenuOpen = false;
                                        this.requestUpdate();
                                    }}>
                                    No Profile (AI Mode)
                                </div>
                                ${profileOptions.map(p => html`
                                    <div style="padding: 12px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; color: ${this.selectedProfile === (p.id || p.name) ? 'var(--accent)' : 'var(--text-primary)'}; background: ${this.selectedProfile === (p.id || p.name) ? 'rgba(59, 130, 246, 0.1)' : 'transparent'}; transition: background 0.15s;" 
                                        @mouseover=${e => { if (this.selectedProfile !== (p.id || p.name)) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                                        @mouseout=${e => { if (this.selectedProfile !== (p.id || p.name)) e.currentTarget.style.background = 'transparent'; }}
                                        @click=${(e) => {
                                            e.stopPropagation();
                                            this.selectedProfile = p.id || p.name;
                                            this.isProfileMenuOpen = false;
                                            this.requestUpdate();
                                        }}>
                                        ${p.name}
                                    </div>
                                `)}
                                <div style="height: 1px; background: var(--border); margin: 6px 0;"></div>
                                <div style="padding: 12px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; color: var(--accent); transition: background 0.15s;" 
                                    @mouseover=${e => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'}
                                    @mouseout=${e => e.currentTarget.style.background = 'transparent'}
                                    @click=${(e) => {
                                        e.stopPropagation();
                                        this.selectedProfile = '';
                                        this.isProfileMenuOpen = false;
                                        if (this.onNavigate) this.onNavigate('customize-ai');
                                    }}>
                                    + Add New Profile
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    <div style="width: 1px; height: 32px; background: var(--border); margin: 0 12px;"></div>

                    <!-- Mouse Toggle (Centered with pointer-events fix and fixed width) -->
                    <div class="mouse-toggle-container stealth-tooltip" data-tooltip="Stealth Mode" style="pointer-events: auto; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; padding: 0 8px; margin-right: 8px; width: 130px; max-width: 130px; flex-shrink: 0;" @click=${() => this.onToggleClickThrough && this.onToggleClickThrough()}>
                        <span style="font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); margin-bottom: 6px; transition: color 0.2s; text-align: center; width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${this.isClickThrough ? 'Mouse Un-Detect' : 'Mouse Detect'}
                        </span>
                        <div style="width: 42px; height: 22px; border-radius: 6px; background: ${this.isClickThrough ? 'var(--bg-elevated)' : 'var(--text-muted)'}; border: 1px solid var(--border); position: relative; transition: all 0.3s ease; box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);">
                            <div style="width: 18px; height: 18px; border-radius: 4px; background: #ffffff; position: absolute; top: 1px; left: ${this.isClickThrough ? '21px' : '1px'}; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.15);">
                                <div style="width: 10px; height: 10px; border-radius: 2px; background: ${this.isClickThrough ? 'var(--bg-elevated)' : 'var(--text-muted)'}; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">
                                    <div style="width: 5px; height: 1.5px; background: #ffffff; border-radius: 1px; transform: rotate(-45deg);"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Start/Active Buttons -->
                    <div style="display: flex; gap: 12px; margin-left: 12px;">
                        ${this._sessionState === 'active' ? html`
                            <button class="start-btn-blue" @click=${() => this._handleStart()} style="border-radius: 40px; padding: 14px 40px; display: flex; align-items: center; gap: 8px; border: none; outline: none; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4); background: rgba(59, 130, 246, 0.1); border: 1px solid var(--accent); color: var(--accent); font-weight: 600; font-size: 15px; letter-spacing: 0.5px; cursor: pointer; transition: all 0.2s;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                    <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                                    <rect x="14" y="4" width="4" height="16" rx="1"></rect>
                                </svg>
                                <span>Started</span>
                            </button>
                        ` : this._sessionState === 'paused' ? html`
                            <button class="start-btn-blue" @click=${() => this._handleStart()} style="border-radius: 40px; padding: 14px 40px; display: flex; align-items: center; gap: 8px; border: none; outline: none; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.5); font-weight: 600; font-size: 15px; letter-spacing: 0.5px; cursor: pointer;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                <span>Resume</span>
                            </button>
                        ` : html`
                            <button class="start-btn-blue" @click=${() => this._handleStart()} style="border-radius: 40px; padding: 14px 40px; display: flex; align-items: center; gap: 8px; border: none; outline: none; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.5); font-weight: 600; font-size: 15px; letter-spacing: 0.5px; cursor: pointer;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                <span>Start</span>
                            </button>
                        `}
                    </div>
                </div>

                <!-- Active Session Timer and Stop Button below the panel -->
                ${this._sessionState && this._sessionState !== 'idle' ? html`
                    <div style="display: flex; align-items: center; justify-content: center; gap: 24px; width: 100%; max-width: 850px; margin-top: 16px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            ${this.renderStatusDot()}
                            <span style="font-size: 20px; font-weight: 700; color: var(--text-primary); font-variant-numeric: tabular-nums; letter-spacing: 1px;">
                                ${this._sessionTimerText || '00:00'}
                            </span>
                        </div>
                        <button class="start-btn-blue" @click=${() => this._handleEndSessionCompletely()} style="border-radius: 8px; padding: 0 24px; height: 40px; background: var(--danger, #ef4444); display: flex; align-items: center; justify-content: center; gap: 8px; border: none; outline: none; box-shadow: 0 4px 14px rgba(239, 68, 68, 0.4); cursor: pointer; transition: transform 0.2s;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                <rect x="5" y="5" width="14" height="14" rx="2" ry="2"></rect>
                            </svg>
                            <span style="font-weight: 600; font-size: 14px; color: white;">Stop</span>
                        </button>
                    </div>
                ` : ''}

                <!-- Validation message beneath the pill -->
                <div style="height: 20px; width: 100%; max-width: 800px; display: flex; align-items: center; padding-left: 20px; margin-top: 8px;">
                    ${this._modeCategoryError ? html`
                        <span style="color: #ef4444; font-size: 12px; font-weight: 500; margin-top: 8px;">Please select mode</span>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // ── BYOK mode ──

    _renderByokMode() {
        return html`
            <div class="form-wrapper">
                ${this._renderModeProfileSelectors()}
                ${this._renderStartButton()}
            </div>
        `;
    }

    // ── Local AI mode ──

    _renderLocalMode() {
        return html`
            <div class="form-group">
                <label class="form-label">Ollama Host</label>
                <input
                    type="text"
                    placeholder="http://127.0.0.1:11434"
                    .value=${this._ollamaHost}
                    @input=${e => this._saveOllamaHost(e.target.value)}
                />
                <div class="form-hint">Ollama must be running locally</div>
            </div>

            <div class="form-group">
                <label class="form-label">Ollama Model</label>
                <input
                    type="text"
                    placeholder="llama3.1"
                    .value=${this._ollamaModel}
                    @input=${e => this._saveOllamaModel(e.target.value)}
                />
                <div class="form-hint">Run <code style="font-family: var(--font-mono); font-size: 11px; background: var(--bg-elevated); padding: 1px 4px; border-radius: 3px;">ollama pull ${this._ollamaModel}</code> first</div>
            </div>

            <div class="form-group">
                <div class="whisper-label-row">
                    <label class="form-label">Whisper Model</label>
                    ${this.whisperDownloading ? html`<div class="whisper-spinner"></div>` : ''}
                </div>
                <select
                    .value=${this._whisperModel}
                    @change=${e => this._saveWhisperModel(e.target.value)}
                >
                    <option value="Xenova/whisper-tiny" ?selected=${this._whisperModel === 'Xenova/whisper-tiny'}>Tiny (fastest, least accurate)</option>
                    <option value="Xenova/whisper-base" ?selected=${this._whisperModel === 'Xenova/whisper-base'}>Base</option>
                    <option value="Xenova/whisper-small" ?selected=${this._whisperModel === 'Xenova/whisper-small'}>Small (recommended)</option>
                    <option value="Xenova/whisper-medium" ?selected=${this._whisperModel === 'Xenova/whisper-medium'}>Medium (most accurate, slowest)</option>
                </select>
                <div class="form-hint">${this.whisperDownloading ? 'Downloading model...' : 'Downloaded automatically on first use'}</div>
            </div>

            ${this._renderStartButton()}

            <!-- Cloud promo intentionally removed from the active UI. -->
        `;
    }

    render() {
        const groupedSessions = {};
        if (this._sessions && this._sessions.length > 0) {
            this._sessions.forEach(session => {
                const group = this._formatDateGroup(session.updatedAt || session.createdAt);
                if (!groupedSessions[group]) groupedSessions[group] = [];
                groupedSessions[group].push(session);
            });
        }

        return html`
            <div class="home-container">
                <!-- Header -->
                <div class="home-header">
                    <div class="header-left">
                        <div class="brand-logo" style="margin-right: 16px;"></div>

                    </div>

                    <div class="header-right">
                        <div style="display:flex; flex-direction:column; align-items:center; margin-right: 16px;">
                            <span class="meetings-left-text" style="font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.7);">Unlimited sessions left</span>
                        </div>
                        
                        <div class="avatar-circle">
                            AV
                        </div>
                    </div>
                </div>

                ${this._renderActionBar()}

                <div style="margin-top: 32px; padding: 0 16px;">
                    <div style="font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 12px; padding-left: 8px;">Pinned Shortcuts</div>
                    <div class="pinned-shortcuts-container" style="display: grid; grid-template-columns: repeat(auto-fill, 90px); gap: 16px; padding: 16px; border: 1px solid var(--border); border-radius: 16px; background: var(--bg-surface); box-shadow: 0 4px 20px rgba(0,0,0,0.05); overflow-x: auto;">
                        
                        <div class="pinned-shortcut-card" @click=${() => this.onNavigate('notes')} style="width: 90px; height: 90px; background: transparent; border: 2px dashed var(--border); border-radius: 12px; padding: 8px; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; transition: all 0.2s ease;">
                            <div style="width: 20px; height: 20px; border-radius: 50%; background: rgba(59, 130, 246, 0.1); display: flex; align-items: center; justify-content: center; color: #3b82f6;">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="10" height="10"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            </div>
                            <div style="font-size: 10px; font-weight: 500; color: var(--text-primary); text-align: center;">Add</div>
                        </div>

                        ${this.homeNotes ? this.homeNotes.map(note => html`<div class="pinned-shortcut-card" @click=${() => this.openNoteViewer(note)} style="width: 90px; height: 90px; background: rgba(120, 120, 120, 0.05); border: 1px solid var(--border); border-radius: 12px; padding: 8px; cursor: pointer; display: flex; flex-direction: column; gap: 4px; transition: all 0.2s ease;">
                                <div style="display: flex; align-items: center; justify-content: center; width: 100%;">
                                    <div style="width: 20px; height: 20px; border-radius: 6px; background: rgba(59, 130, 246, 0.15); display: flex; align-items: center; justify-content: center; color: #3b82f6;">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="10" height="10"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                    </div>
                                </div>
                                <div style="font-size: 10px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;">${note.title}</div>
                                <div style="font-size: 8px; font-weight: 500; color: var(--text-secondary); text-align: center; margin-top: auto;">TEXT NOTE</div>
                            </div>`) : ''}
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('main-view', MainView);
