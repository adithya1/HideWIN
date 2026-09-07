import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';
import { unifiedPageStyles } from './sharedPageStyles.js';

export class CustomizeView extends LitElement {


    static styles = [
        unifiedPageStyles,
        css`
            * { box-sizing: border-box; }

            .sidebar-layout {
                display: flex;
                height: 100%;
                background: var(--bg-app);
                color: var(--text-primary);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }

            .sidebar {
                width: 240px;
                background: var(--bg-surface);
                border-right: 1px solid var(--border);
                display: flex;
                flex-direction: column;
                padding: 24px 0;
                flex-shrink: 0;
            }

            .sidebar-group {
                display: flex;
                flex-direction: column;
                margin-bottom: 24px;
            }

            .sidebar-group-title {
                font-size: 11px;
                font-weight: 600;
                color: #9CA3AF;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                padding: 0 24px;
                margin-bottom: 8px;
            }

            .sidebar-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px 24px;
                font-size: 14px;
                font-weight: 500;
                color: var(--text-secondary);
                cursor: pointer;
                border-left: 3px solid transparent;
                transition: all 0.2s;
            }

            .sidebar-item:hover {
                background: var(--bg-hover);
                color: var(--text-primary);
            }

            .sidebar-item.active {
                background: var(--bg-hover);
                color: var(--text-primary);
                border-left-color: #3B82F6;
            }

            .sidebar-item svg {
                width: 18px;
                height: 18px;
                opacity: 0.7;
            }

            .sidebar-item.active svg {
                opacity: 1;
                color: #3B82F6;
            }

            .main-content {
                flex: 1;
                overflow-y: auto;
                padding: 40px;
                background: var(--bg-app);
            }

            /* Billing specific CSS */
            .billing-header {
                text-align: center;
                margin-bottom: 40px;
            }

            .billing-header h1 {
                font-size: 28px;
                font-weight: 700;
                color: var(--text-primary);
                margin: 0 0 8px 0;
            }

            .billing-header p {
                font-size: 14px;
                color: var(--text-muted);
                margin: 0;
            }

            .billing-toggle {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 12px;
                margin-bottom: 32px;
                font-size: 14px;
                color: var(--text-secondary);
            }

            .billing-toggle .badge {
                background: #EFF6FF;
                color: #3B82F6;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
            }

            .pricing-cards {
                display: flex;
                gap: 24px;
                justify-content: center;
                margin: 0;
            }

            .pricing-card {
                flex: 1;
                border-radius: 20px;
                padding: 32px;
                display: flex;
                flex-direction: column;
                position: relative;
                overflow: hidden;
            }

            .pricing-card.blue {
                background: #60A5FA;
                color: white;
            }

            .pricing-card.dark {
                background: #4B5563;
                color: white;
            }

            .pricing-title {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 16px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .popular-badge {
                background: rgba(255,255,255,0.2);
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 12px;
            }

            .pricing-price {
                display: flex;
                align-items: baseline;
                gap: 8px;
                margin-bottom: 32px;
            }

            .pricing-price .strikethrough {
                font-size: 18px;
                opacity: 0.6;
                text-decoration: line-through;
            }

            .pricing-price .current {
                font-size: 32px;
                font-weight: 700;
            }

            .pricing-price .period {
                font-size: 14px;
                opacity: 0.8;
            }

            .feature-list {
                display: flex;
                flex-direction: column;
                gap: 16px;
                margin-bottom: 32px;
                flex: 1;
            }

            .feature-item {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                font-size: 14px;
                line-height: 1.4;
            }

            .feature-icon {
                width: 20px;
                height: 20px;
                background: rgba(255,255,255,0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }

            .feature-icon svg {
                width: 12px;
                height: 12px;
            }

            .upgrade-btn {
                width: 100%;
                padding: 12px;
                border-radius: 8px;
                font-size: 15px;
                font-weight: 600;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                cursor: pointer;
                border: none;
                transition: opacity 0.2s;
            }

            .upgrade-btn:hover {
                opacity: 0.9;
            }

            .upgrade-btn.white {
                background: white;
                color: #3B82F6;
            }

            .upgrade-btn.blue {
                background: #3B82F6;
                color: white;
            }

            .btn-badge {
                font-size: 11px;
                padding: 2px 6px;
                border-radius: 10px;
                background: rgba(0,0,0,0.1);
            }

            .graphic-placeholder {
                height: 120px;
                background: rgba(255,255,255,0.1);
                border-radius: 8px;
                border: 1px dashed rgba(255,255,255,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: 16px;
                margin-bottom: 32px;
                font-size: 12px;
                opacity: 0.8;
            }

            /* Legacy Settings CSS wrapper */
            .legacy-settings-wrapper {
                margin: 0;
                background: #FFFFFF;
                border: 1px solid #E5E7EB;
                border-radius: 12px;
                padding: 24px;
                color: var(--text-primary);
            }

            .legacy-settings-wrapper .settings-card {
                background: var(--bg-app);
                border: 1px solid #E5E7EB;
                margin-bottom: 16px;
                color: var(--text-primary);
            }

            .legacy-settings-wrapper .form-label {
                color: #374151;
            }

            .legacy-settings-wrapper .form-control {
                background: #FFFFFF;
                border: 1px solid #D1D5DB;
                color: var(--text-primary);
            }

            .legacy-settings-wrapper .settings-card-title {
                color: var(--text-secondary);
            }


            .settings-card {
                background: var(--bg-surface, rgba(255, 255, 255, 0.03));
                border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
                border-radius: 12px;
                padding: 20px 24px;
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .settings-card-title {
                font-size: 12px;
                font-weight: 700;
                color: var(--text-muted);
                text-transform: uppercase;
                letter-spacing: 0.06em;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .form-row {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .form-row-horizontal {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 16px;
            }

            .form-label {
                font-size: 13px;
                font-weight: 600;
                color: var(--text-primary);
            }

            .form-control {
                height: 38px;
                padding: 0 12px;
                background: rgba(255, 255, 255, 0.04);
                border: 1px solid rgba(255, 255, 255, 0.12);
                border-radius: 8px;
                color: var(--text-primary);
                font-size: 13px;
                font-family: var(--font);
                outline: none;
                transition: all 0.2s ease;
                width: 100%;
            }

            .form-control:focus {
                border-color: var(--accent);
                box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
            }

            .input-with-button {
                display: flex;
                align-items: center;
                gap: 8px;
                width: 100%;
            }

            .input-with-button .form-control {
                flex: 1;
            }

            .eye-btn {
                height: 38px;
                padding: 0 14px;
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.06);
                border: 1px solid rgba(255, 255, 255, 0.12);
                color: var(--text-primary);
                font-size: 12px;
                font-weight: 600;
                cursor: default;
                white-space: nowrap;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 4px;
                transition: all 0.2s ease;
            }

            .eye-btn:hover {
                background: rgba(99, 102, 241, 0.2);
                border-color: var(--accent);
            }

            .form-hint {
                font-size: 11px;
                color: var(--text-muted);
                margin-top: 2px;
            }

            .slider-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 4px;
            }

            .slider-badge {
                font-family: var(--font-mono);
                font-size: 11px;
                font-weight: 600;
                color: var(--accent);
                background: rgba(99, 102, 241, 0.12);
                border: 1px solid rgba(99, 102, 241, 0.3);
                border-radius: 4px;
                padding: 2px 8px;
            }

            .slider-input {
                -webkit-appearance: none;
                appearance: none;
                width: 100%;
                height: 5px;
                border-radius: 3px;
                background: var(--border);
                outline: none;
                cursor: default;
            }

            .slider-input::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: var(--text-primary);
                cursor: default;
                transition: transform 0.15s ease;
            }

            .slider-input::-webkit-slider-thumb:hover {
                transform: scale(1.25);
            }

            .danger-card {
                border-color: rgba(239, 68, 68, 0.3);
                background: rgba(239, 68, 68, 0.02);
            }

            .danger-button {
                padding: 8px 16px;
                border-radius: 8px;
                border: 1px solid rgba(239, 68, 68, 0.4);
                background: rgba(239, 68, 68, 0.1);
                color: #ef4444;
                font-size: 12px;
                font-weight: 600;
                cursor: default;
                transition: all 0.2s ease;
            }

            .danger-button:hover:not(:disabled) {
                background: rgba(239, 68, 68, 0.25);
                border-color: #ef4444;
            }

            .status-msg {
                font-size: 12px;
                margin-top: 6px;
            }
            .status-msg.success { color: #10b981; }
            .status-msg.error { color: #ef4444; }

        @media (max-width: 768px) {
            .sidebar-layout {
                flex-direction: column !important;
                height: 100% !important;
                background: var(--bg-app) !important;
            }
            .sidebar {
                display: none !important; /* Moved to main drawer */
            }
            .sidebar
            .sidebar-group {
                display: flex !important;
                flex-direction: row !important;
                margin-bottom: 0 !important;
                align-items: center !important;
            }
            .sidebar-group-title {
                display: none !important;
            }
            .sidebar-item {
                padding: 8px 16px !important;
                border-radius: 20px !important;
                margin-bottom: 0 !important;
                margin-right: 8px !important;
                white-space: nowrap !important;
                background: transparent !important;
                font-size: 14px !important;
            }
            .sidebar-item.active {
                background: var(--accent) !important;
                color: #fff !important;
            }
            .sidebar-item.active svg {
                color: #fff !important;
            }
            .main-content {
                padding: 16px !important;
                flex: 1 !important;
                overflow-y: auto !important;
                background: var(--bg-app) !important;
            }
            .legacy-settings-wrapper {
                padding: 0 !important;
            }
            .setting-row {
                flex-direction: column !important;
                align-items: flex-start !important;
                gap: 8px !important;
            }
            .setting-row > div:last-child {
                width: 100% !important;
            }
            .setting-row input, .setting-row select {
                width: 100% !important;
            }
        }

        `
    ];

    static properties = {
        dnsDomain: { type: String },
        dnsIP: { type: String },
        dnsPort: { type: String },
        selectedProfile: { type: String },
        transcriptionLanguage: { type: String },
        outputLanguage: { type: String },
        selectedImageQuality: { type: String },
        layoutMode: { type: String },
        keybinds: { type: Object },
        googleSearchEnabled: { type: Boolean },
        transparencyMain: { type: Number },
        transparencySession: { type: Number },
        fontSizeMain: { type: Number },
        fontSizeSession: { type: Number },
        themeMain: { type: String },
        themeSession: { type: String },
        autoScroll: { type: Boolean },
        stealthCursorStyle: { type: String },
        pureStealthMode: { type: Boolean },
        keybinds: { type: Object },
        geminiKey: { state: true },
        groqKey: { state: true },
        showGeminiKey: { state: true },
        showGroqKey: { state: true },
        onProfileChange: { type: Function },
        onTranscriptionLanguageChange: { type: Function },
        onOutputLanguageChange: { type: Function },
        onImageQualityChange: { type: Function },
        onLayoutModeChange: { type: Function },
        isClearing: { type: Boolean },
        isRestoring: { type: Boolean },
        clearStatusMessage: { type: String },
        clearStatusType: { type: String },
        activeTab: { type: String },
        userFullName: { type: String },
        userEmail: { type: String },
        onUserFullNameChange: { type: Function },
        resetPasswordStatus: { state: true }
    };

    constructor() {
        super();
        this._showSignOutModal = false;
        this.selectedProfile = 'interview';
        this.transcriptionLanguage = 'en-US';
        this.outputLanguage = 'en-US';
        this.selectedImageQuality = 'medium';
        this.layoutMode = 'normal';
        this.keybinds = this.getDefaultKeybinds();
        this.onProfileChange = () => {};
        this.onTranscriptionLanguageChange = () => {};
        this.onOutputLanguageChange = () => {};
        this.onImageQualityChange = () => {};
        this.onLayoutModeChange = () => {};
        this.googleSearchEnabled = true;
        this.isClearing = false;
        this.isRestoring = false;
        this.clearStatusMessage = '';
        this.clearStatusType = '';
        this.activeTab = 'billing';
        this.audioMode = 'both';
        this.customPrompt = '';
        this.autoScroll = true;

        this.geminiKey = '';
        this.groqKey = '';
        this.showGeminiKey = false;
        this.showGroqKey = false;

        this._loadFromStorage();
    }

    async connectedCallback() {
        super.connectedCallback();
        await this._loadFromStorage();
    }

    getThemes() {
        return hideWin.theme.getAll();
    }

    async _loadFromStorage() {
        try {
            const [prefs, keybinds] = await Promise.all([hideWin.storage.getPreferences(), hideWin.storage.getKeybinds()]);
            this.googleSearchEnabled = prefs.googleSearchEnabled ?? true;
            this.dnsDomain = prefs.dnsDomain || '';
            this.dnsIP = prefs.dnsIP || '127.0.0.1';
            this.dnsPort = prefs.dnsPort || '8001';
            this.transparencyMain = prefs.transparencyMain ?? 0.95;
            this.transparencySession = prefs.transparencySession ?? 0.3;
            this.fontSizeMain = prefs.fontSizeMain ?? 14;
            this.fontSizeSession = prefs.fontSizeSession ?? 14;
            this.audioMode = prefs.audioMode ?? 'both';
            this.customPrompt = prefs.customPrompt ?? '';
            this.themeMain = prefs.themeMain ?? 'light';
            this.themeSession = prefs.themeSession ?? 'dark';
            this.autoScroll = prefs.autoScroll ?? true;
            this.stealthCursorStyle = prefs.stealthCursorStyle ?? 'native';
            this.pureStealthMode = prefs.pureStealthMode ?? false;
            if (keybinds) {
                this.keybinds = { ...this.getDefaultKeybinds(), ...keybinds };
            }

            this.geminiKey = await hideWin.storage.getApiKey().catch(() => '') || '';
            this.groqKey = await hideWin.storage.getGroqApiKey().catch(() => '') || '';

            this.requestUpdate();
        } catch (error) {
            console.error('Error loading customize settings from storage:', error);
        }
    }

    async handleGeminiKeyInput(e) {
        this.geminiKey = e.target.value;
        await hideWin.storage.setApiKey(this.geminiKey);
        this.requestUpdate();
    }

    async handleGroqKeyInput(e) {
        this.groqKey = e.target.value;
        await hideWin.storage.setGroqApiKey(this.groqKey);
        this.requestUpdate();
    }

    getProfiles() {
        return [
            { value: 'interview', name: 'Job Interview' },
            { value: 'sales', name: 'Sales Call' },
            { value: 'meeting', name: 'Business Meeting' },
            { value: 'presentation', name: 'Presentation' },
            { value: 'negotiation', name: 'Negotiation' },
            { value: 'exam', name: 'Exam Assistant' },
        ];
    }

    getLanguages() {
        return [
            { value: 'en-US', name: 'English (US)' },
            { value: 'en-GB', name: 'English (UK)' },
            { value: 'en-AU', name: 'English (Australia)' },
            { value: 'en-IN', name: 'English (India)' },
            { value: 'de-DE', name: 'German (Germany)' },
            { value: 'es-US', name: 'Spanish (US)' },
            { value: 'es-ES', name: 'Spanish (Spain)' },
            { value: 'fr-FR', name: 'French (France)' },
            { value: 'fr-CA', name: 'French (Canada)' },
            { value: 'hi-IN', name: 'Hindi (India)' },
            { value: 'pt-BR', name: 'Portuguese (Brazil)' },
            { value: 'ar-XA', name: 'Arabic (Generic)' },
            { value: 'id-ID', name: 'Indonesian (Indonesia)' },
            { value: 'it-IT', name: 'Italian (Italy)' },
            { value: 'ja-JP', name: 'Japanese (Japan)' },
            { value: 'tr-TR', name: 'Turkish (Turkey)' },
            { value: 'vi-VN', name: 'Vietnamese (Vietnam)' },
            { value: 'bn-IN', name: 'Bengali (India)' },
            { value: 'gu-IN', name: 'Gujarati (India)' },
            { value: 'kn-IN', name: 'Kannada (India)' },
            { value: 'ml-IN', name: 'Malayalam (India)' },
            { value: 'mr-IN', name: 'Marathi (India)' },
            { value: 'ta-IN', name: 'Tamil (India)' },
            { value: 'te-IN', name: 'Telugu (India)' },
            { value: 'nl-NL', name: 'Dutch (Netherlands)' },
            { value: 'ko-KR', name: 'Korean (South Korea)' },
            { value: 'cmn-CN', name: 'Mandarin Chinese (China)' },
            { value: 'pl-PL', name: 'Polish (Poland)' },
            { value: 'ru-RU', name: 'Russian (Russia)' },
            { value: 'th-TH', name: 'Thai (Thailand)' },
        ];
    }

    getDefaultKeybinds() {
        const isMac = hideWin.isMacOS || navigator.platform.includes('Mac');
        return {
            moveUp: isMac ? 'Alt+Up' : 'Ctrl+Up',
            moveDown: isMac ? 'Alt+Down' : 'Ctrl+Down',
            moveLeft: isMac ? 'Alt+Left' : 'Ctrl+Left',
            moveRight: isMac ? 'Alt+Right' : 'Ctrl+Right',
            toggleVisibility: isMac ? 'Cmd+\\' : 'Ctrl+\\',
            toggleClickThrough: isMac ? 'Cmd+M' : 'Ctrl+M',
            nextStep: isMac ? 'Cmd+Enter' : 'Ctrl+Enter',
            previousResponse: isMac ? 'Cmd+P' : 'Ctrl+P',
            nextResponse: isMac ? 'Cmd+N' : 'Ctrl+N',
            scrollUp: isMac ? 'Alt+Up' : 'Alt+Up',
            scrollDown: isMac ? 'Alt+Down' : 'Alt+Down',
            scrollLeft: isMac ? 'Alt+Left' : 'Alt+Left',
            scrollRight: isMac ? 'Alt+Right' : 'Alt+Right',
            resizeUp: 'Shift+Up',
            extendUp: isMac ? 'Cmd+E+Up' : 'Ctrl+E+Up',
            decreaseUp: isMac ? 'Cmd+D+Up' : 'Ctrl+D+Up',
            emergencyErase: isMac ? 'Cmd+Shift+E' : 'Ctrl+Shift+E',
            bossKey: isMac ? 'Cmd+Shift+X' : 'Ctrl+Shift+X',
            toggleGhostText: isMac ? 'Cmd+Shift+G' : 'Ctrl+Shift+G',
        };
    }

    handleProfileSelect(e) {
        this.selectedProfile = e.target.value;
        this.onProfileChange(this.selectedProfile);
    }

    handleTranscriptionLanguageSelect(e) {
        this.transcriptionLanguage = e.target.value;
        this.onTranscriptionLanguageChange(this.transcriptionLanguage);
    }

    handleOutputLanguageSelect(e) {
        this.outputLanguage = e.target.value;
        this.onOutputLanguageChange(this.outputLanguage);
    }

    handleImageQualitySelect(e) {
        this.selectedImageQuality = e.target.value;
        this.onImageQualityChange(this.selectedImageQuality);
    }

    handleLayoutModeSelect(e) {
        this.layoutMode = e.target.value;
        this.onLayoutModeChange(this.layoutMode);
    }

    async handleAudioModeSelect(e) {
        this.audioMode = e.target.value;
        await hideWin.storage.updatePreference('audioMode', this.audioMode);
        this.requestUpdate();
    }

    async handleThemeChange(type, e) {
        if (type === 'main') {
            this.themeMain = e.target.value;
            await hideWin.storage.updatePreference('themeMain', this.themeMain);
        } else {
            this.themeSession = e.target.value;
            await hideWin.storage.updatePreference('themeSession', this.themeSession);
        }
        
        // Re-apply if the current window matches the type changed
        const urlParams = new URLSearchParams(window.location.search);
        const windowType = urlParams.get('windowType') || 'main';
        if (windowType === type) {
            await hideWin.theme.load();
        }
        this.requestUpdate();
    }

    async handleBackgroundTransparencyChange(type, e) {
        const val = parseFloat(e.target.value);
        if (type === 'main') {
            this.transparencyMain = val;
            await hideWin.storage.updatePreference('transparencyMain', this.transparencyMain);
        } else {
            this.transparencySession = val;
            await hideWin.storage.updatePreference('transparencySession', this.transparencySession);
        }
        
        const urlParams = new URLSearchParams(window.location.search);
        const windowType = urlParams.get('windowType') || 'main';
        if (windowType === type) {
            await hideWin.theme.load();
        }
        this.requestUpdate();
    }

    async handleFontSizeChange(type, e) {
        const val = parseInt(e.target.value, 10);
        if (type === 'main') {
            this.fontSizeMain = val;
            await hideWin.storage.updatePreference('fontSizeMain', this.fontSizeMain);
        } else {
            this.fontSizeSession = val;
            await hideWin.storage.updatePreference('fontSizeSession', this.fontSizeSession);
        }
        
        const urlParams = new URLSearchParams(window.location.search);
        const windowType = urlParams.get('windowType') || 'main';
        if (windowType === type) {
            document.documentElement.style.setProperty('--response-font-size', `${val}px`);
        }
        this.requestUpdate();
    }

    async handleAutoScrollChange(e) {
        this.autoScroll = e.target.checked;
        await hideWin.storage.updatePreference('autoScroll', this.autoScroll);
        this.dispatchEvent(new CustomEvent('auto-scroll-changed', {
            detail: { autoScroll: this.autoScroll },
            bubbles: true,
            composed: true
        }));
        this.requestUpdate();
    }

    async handleStealthCursorStyleChange(e) {
        this.stealthCursorStyle = e.target.value;
        await hideWin.storage.updatePreference('stealthCursorStyle', this.stealthCursorStyle);
        this.dispatchEvent(new CustomEvent('preferences-changed', { bubbles: true, composed: true }));
        this.requestUpdate();
    }

    async handlePureStealthModeChange(e) {
        this.pureStealthMode = e.target.checked;
        await hideWin.storage.updatePreference('pureStealthMode', this.pureStealthMode);
        this.dispatchEvent(new CustomEvent('preferences-changed', { bubbles: true, composed: true }));
        this.requestUpdate();
    }

    async restoreAllSettings() {
        if (this.isRestoring) return;
        this.isRestoring = true;
        this.clearStatusMessage = '';
        this.clearStatusType = '';
        this.requestUpdate();
        try {
            const defaults = {
                customPrompt: '',
                selectedProfile: 'interview',
                transcriptionLanguage: 'en-US',
                outputLanguage: 'en-US',
                selectedImageQuality: 'medium',
                layoutMode: 'normal',
                theme: 'system',
                backgroundTransparency: 0.8,
                fontSize: 20,
                audioMode: 'both',
                autoScroll: true
            };

            this.selectedProfile = defaults.selectedProfile;
            this.transcriptionLanguage = defaults.transcriptionLanguage;
            this.outputLanguage = defaults.outputLanguage;
            this.selectedImageQuality = defaults.selectedImageQuality;
            this.layoutMode = defaults.layoutMode;
            this.theme = defaults.theme;
            this.backgroundTransparency = defaults.backgroundTransparency;
            this.fontSize = defaults.fontSize;
            this.audioMode = defaults.audioMode;
            this.autoScroll = defaults.autoScroll;

            for (const [key, value] of Object.entries(defaults)) {
                await hideWin.storage.updatePreference(key, value);
            }

            this.dispatchEvent(new CustomEvent('auto-scroll-changed', {
                detail: { autoScroll: this.autoScroll },
                bubbles: true,
                composed: true
            }));

            this.onProfileChange(defaults.selectedProfile);
            this.onTranscriptionLanguageChange(defaults.transcriptionLanguage);
            this.onOutputLanguageChange(defaults.outputLanguage);
            this.onImageQualityChange(defaults.selectedImageQuality);

            this.updateBackgroundAppearance();
            this.updateFontSize();
            await hideWin.theme.save(defaults.theme);

            this.clearStatusMessage = 'All settings restored to defaults';
            this.clearStatusType = 'success';
        } catch (error) {
            console.error('Error restoring settings:', error);
            this.clearStatusMessage = `Error restoring settings: ${error.message}`;
            this.clearStatusType = 'error';
        } finally {
            this.isRestoring = false;
            this.requestUpdate();
        }
    }

    async clearLocalData() {
        if (this.isClearing) return;
        this.isClearing = true;
        this.clearStatusMessage = '';
        this.clearStatusType = '';
        this.requestUpdate();
        try {
            await hideWin.storage.clearAll();
            this.clearStatusMessage = 'Successfully cleared all local data';
            this.clearStatusType = 'success';
            this.requestUpdate();
        } catch (error) {
            console.error('Error clearing data:', error);
            this.clearStatusMessage = `Error clearing data: ${error.message}`;
            this.clearStatusType = 'error';
        } finally {
            this.isClearing = false;
            this.requestUpdate();
        }
    }

    renderApiKeysSection() {
        return html``;
    }

    renderAudioSection() {
        return html`
            <div class="settings-card">
                <div class="settings-card-title">🎙️ Audio & Media Input</div>
                <div class="form-row">
                    <label class="form-label">Audio Mode</label>
                    <select class="form-control" .value=${this.audioMode} @change=${this.handleAudioModeSelect}>
                        <option value="both">Both Speaker & Microphone (Recommended)</option>
                        <option value="speaker_only">Speaker Only (Interviewer Audio)</option>
                        <option value="mic_only">Microphone Only (Candidate Audio)</option>
                    </select>
                </div>
                <div class="form-row">
                    <label class="form-label">Screen Capture Image Quality</label>
                    <select class="form-control" .value=${this.selectedImageQuality} @change=${this.handleImageQualitySelect}>
                        <option value="high">High Quality (Clear diagrams & small text)</option>
                        <option value="medium">Medium Quality (Standard, balanced)</option>
                        <option value="low">Low Quality (Fastest processing)</option>
                    </select>
                </div>
            </div>
        `;
    }

    renderLanguageSection() {
        return html`
            <div class="settings-card">
                <div class="settings-card-title">🌐 Speech & Language</div>
                <div class="form-row">
                    <label class="form-label">Transcription Language (Speech-to-Text)</label>
                    <select class="form-control" .value=${this.transcriptionLanguage} @change=${this.handleTranscriptionLanguageSelect}>
                        ${this.getLanguages().map(language => html`<option value=${language.value}>${language.name}</option>`)}
                    </select>
                </div>
                <div class="form-row" style="margin-top: 16px;">
                    <label class="form-label">AI Output Language (Response)</label>
                    <select class="form-control" .value=${this.outputLanguage} @change=${this.handleOutputLanguageSelect}>
                        ${this.getLanguages().map(language => html`<option value=${language.value}>${language.name}</option>`)}
                    </select>
                </div>
            </div>
        `;
    }

    renderAppearanceSection() {
        return html`
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                <!-- Main Window Settings -->
                <div class="settings-card">
                    <div class="settings-card-title">🖥️ Main Window</div>
                    
                    <div class="form-row">
                        <label class="form-label">Theme</label>
                        <select class="form-control" .value=${this.themeMain || 'light'} @change=${(e) => this.handleThemeChange('main', e)}>
                            ${this.getThemes().map(theme => html`<option value=${theme.value}>${theme.name}</option>`)}
                        </select>
                    </div>

                    <div class="form-row">
                        <div class="slider-header">
                            <label class="form-label">Background Transparency</label>
                            <span class="slider-badge">${Math.round((this.transparencyMain || 0.95) * 100)}%</span>
                        </div>
                        <input
                            class="slider-input"
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            .value=${this.transparencyMain !== undefined ? this.transparencyMain : 0.95}
                            @input=${(e) => this.handleBackgroundTransparencyChange('main', e)}
                        />
                    </div>

                    <div class="form-row">
                        <div class="slider-header">
                            <label class="form-label">Response Font Size</label>
                            <span class="slider-badge">${this.fontSizeMain || 14}px</span>
                        </div>
                        <input
                            class="slider-input"
                            type="range"
                            min="10"
                            max="32"
                            step="1"
                            .value=${this.fontSizeMain || 14}
                            @input=${(e) => this.handleFontSizeChange('main', e)}
                        />
                    </div>
                </div>

                <!-- Session Window Settings -->
                <div class="settings-card">
                    <div class="settings-card-title">👻 Session Window</div>
                    
                    <div class="form-row">
                        <label class="form-label">Theme</label>
                        <select class="form-control" .value=${this.themeSession || 'dark'} @change=${(e) => this.handleThemeChange('session', e)}>
                            ${this.getThemes().map(theme => html`<option value=${theme.value}>${theme.name}</option>`)}
                        </select>
                    </div>

                    <div class="form-row">
                        <div class="slider-header">
                            <label class="form-label">Stealth Background Transparency</label>
                            <span class="slider-badge">${Math.round((this.transparencySession !== undefined ? this.transparencySession : 0.3) * 100)}%</span>
                        </div>
                        <input
                            class="slider-input"
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            .value=${this.transparencySession !== undefined ? this.transparencySession : 0.3}
                            @input=${(e) => this.handleBackgroundTransparencyChange('session', e)}
                        />
                    </div>

                    <div class="form-row">
                        <div class="slider-header">
                            <label class="form-label">Response Font Size</label>
                            <span class="slider-badge">${this.fontSizeSession || 14}px</span>
                        </div>
                        <input
                            class="slider-input"
                            type="range"
                            min="10"
                            max="32"
                            step="1"
                            .value=${this.fontSizeSession || 14}
                            @input=${(e) => this.handleFontSizeChange('session', e)}
                        />
                    </div>
                </div>
            </div>

                <div class="form-row-horizontal" style="margin-top: 4px;">
                    <label for="autoScrollToggle" class="form-label" style="cursor: default;">Auto-scroll when new AI response arrives</label>
                    <input
                        id="autoScrollToggle"
                        type="checkbox"
                        style="width: 18px; height: 18px; accent-color: var(--accent); cursor: default;"
                        .checked=${this.autoScroll}
                        @change=${this.handleAutoScrollChange}
                    />
                </div>

                <div class="form-row" style="margin-top: 16px;">
                    <label class="form-label">Stealth Cursor Style</label>
                    <select class="form-control" .value=${this.stealthCursorStyle || 'native'} @change=${this.handleStealthCursorStyleChange}>
                        <option value="native">Native Pointer (Disguised)</option>
                        <option value="arrow">Red Arrow (Classic)</option>
                    </select>
                </div>

                <div class="form-row-horizontal" style="margin-top: 4px;">
                    <label for="pureStealthToggle" class="form-label" style="cursor: default;">Run purely in System Tray (Hide from Alt+Tab)</label>
                    <input
                        id="pureStealthToggle"
                        type="checkbox"
                        style="width: 18px; height: 18px; accent-color: var(--accent); cursor: default;"
                        .checked=${this.pureStealthMode}
                        @change=${this.handlePureStealthModeChange}
                    />
                </div>
            </div>
        `;
    }

    renderPrivacySection() {
        return html`
            <div class="settings-card danger-card">
                <div class="settings-card-title" style="color: #ef4444;">⚠️ Privacy & Data Management</div>
                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                    <button class="danger-button" @click=${this.restoreAllSettings} ?disabled=${this.isRestoring}>
                        ${this.isRestoring ? 'Restoring...' : 'Restore All Settings'}
                    </button>
                    <button class="danger-button" @click=${this.clearLocalData} ?disabled=${this.isClearing}>
                        ${this.isClearing ? 'Clearing...' : 'Delete All Local Data'}
                    </button>
                </div>
                ${this.clearStatusMessage ? html`
                    <div class="status-msg ${this.clearStatusType === 'success' ? 'success' : 'error'}">${this.clearStatusMessage}</div>
                ` : ''}
            </div>
        `;
    }

    renderProfileTab() {
        return html`
            <div class="legacy-settings-wrapper" style="max-width: 100%; padding: 24px; margin: 0 auto; overflow-y: auto; height: 100%;">
                <h2 style="margin-top: 0; margin-bottom: 24px; font-size: 20px;">Account Settings</h2>
                <div class="settings-card">
                    <div class="settings-card-title">👤 Personal Information</div>
                    <div class="form-row">
                        <label class="form-label">Email Address</label>
                        <input
                            type="email"
                            class="form-control"
                            .value=${this.userEmail || ''}
                            disabled
                            style="opacity: 0.7; cursor: not-allowed; background-color: var(--bg-secondary);"
                        />
                        <div class="form-hint" style="margin-top: 4px;">
                            Email is locked and cannot be changed once signed up.
                        </div>
                    </div>
                </div>

                <div class="settings-card">
                    <div class="settings-card-title">🔐 Security</div>
                    <div class="form-row">
                        <label class="form-label">Password</label>
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <span style="color: var(--text-secondary); font-size: 14px;">••••••••</span>
                            <button class="upgrade-btn blue" style="padding: 8px 16px; font-size: 13px; width: auto;" @click=${() => {
                                this.resetPasswordStatus = 'An OTP has been sent to your email.';
                                this.requestUpdate();
                                setTimeout(() => { this.resetPasswordStatus = ''; this.requestUpdate(); }, 5000);
                            }}>
                                Reset Password
                            </button>
                        </div>
                        ${this.resetPasswordStatus ? html`
                            <div class="status-msg success" style="margin-top: 12px; padding: 8px 12px; font-size: 13px;">${this.resetPasswordStatus}</div>
                        ` : ''}
                    </div>
                </div>

                <!-- Admin Dashboard Section -->
                <div class="settings-card">
                    <div class="settings-card-title" style="color: var(--accent);">🛡️ Admin Dashboard</div>
                    <div class="form-row">
                        <label class="form-label">Manage Users and Settings</label>
                        <button class="upgrade-btn" style="background: var(--accent); color: white; padding: 10px 20px; font-size: 14px;" @click=${() => hideWin.ipcRenderer.send('open-admin-dashboard')}>
                            Open Admin Panel
                        </button>
                        <div class="form-hint" style="margin-top: 8px;">
                            Only accessible if your account has administrative privileges.
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    _formatKeybind(keybind) {
        if (!keybind) return '';
        return keybind.split('+').map(key => html`<span class="key">${key}</span>`);
    }

    renderKeybindsTab() {
        const isMac = typeof hideWin !== 'undefined' ? (hideWin.isMacOS || navigator.platform.includes('Mac')) : false;
        const shortcuts = [
            { label: 'Move Window', keys: 'Ctrl+Arrows', desc: 'Moves the app around your screen so you can place it exactly where you want it to hide.' },
            { label: 'Hide / Show App', keys: this.keybinds.toggleVisibility || (isMac ? 'Cmd+\\' : 'Ctrl+\\'), desc: 'Instantly turns the app completely invisible. Press it again to make it come back!' },
            { label: 'Make App Detectable (Normal Mode)', keys: 'Ctrl+A', desc: 'Lets your mouse click buttons inside the app normally. Use this when you need to type or change settings.' },
            { label: 'Make App Undetectable (Ghost Mode)', keys: 'Ctrl+S', desc: 'Turns the app into a ghost! Your mouse will click straight through it to whatever is behind it.' },
            { label: 'Momentary Magic Cursor (Hold & Release)', keys: this.keybinds.momentaryStealth || (isMac ? 'Cmd+Alt+A' : 'Alt+A'), desc: 'Hold this key down to freeze your cursor and use the red arrow quickly. Release to snap your real cursor back immediately.' },
            { label: 'Stealth Red Arrow (Magic Cursor)', keys: this.keybinds.toggleMouseVisibility || (isMac ? 'Alt+M' : 'Alt+M'), desc: 'Gives you a secret red arrow that lets you click things inside the app even when Ghost Mode is turned on.' },
            { label: 'Ghost Text Toggle', keys: this.keybinds.toggleGhostText || (isMac ? 'Cmd+Shift+G' : 'Ctrl+Shift+G'), desc: 'Instantly toggles Ghost Text (invisible text) on or off.' },
            { label: 'Panic Boss Key', keys: this.keybinds.bossKey || (isMac ? 'Cmd+Shift+X' : 'Ctrl+Shift+X'), desc: 'Instantly destroys the stealth window and aborts everything.' },
            { label: 'Emergency Erase History', keys: this.keybinds.emergencyErase || (isMac ? 'Cmd+Shift+E' : 'Ctrl+Shift+E'), desc: 'Clears the current conversation instantly.' },
            { label: 'Ask Next Step / Continue', keys: this.keybinds.nextStep || (isMac ? 'Cmd+Enter' : 'Ctrl+Enter'), desc: 'Tells the AI to give you the next part of the answer or continue where it left off.' },
            { label: 'Previous / Next Answer', keys: 'Ctrl+P/N', desc: 'Lets you flip back and forth between different answers the AI has given you, like flipping pages in a book.' },
            { label: 'Scroll Responses & Code', keys: 'Alt+Arrows', desc: 'Lets you scroll up and down through the text, or left and right through long code blocks, without needing a mouse.' },
            { label: 'Resize Window', keys: 'Shift+Arrows', desc: 'Makes the app window bigger or smaller.' },
            { label: 'Stretch / Shrink Edges', keys: 'Ctrl+E/D', desc: 'Stretches out one side of the window to make it wider, or shrinks it to make it thinner.' },
            { label: 'Emergency Erase & Quit', keys: 'Ctrl+Shift+E', desc: 'The panic button! This instantly deletes all your chats, wipes your screen, and closes the app completely to keep you safe.' }
        ];

        return html`
            <div class="legacy-settings-wrapper" style="max-width: 100%; padding: 24px; margin: 0 auto; overflow-y: auto; height: 100%;">
                <h2 style="margin-top: 0; margin-bottom: 24px; font-size: 20px;">Keybinds & Shortcuts</h2>

                <div style="
                    display:flex;align-items:flex-start;gap:10px;
                    padding:16px;margin-bottom:24px;
                    background:rgba(99,102,241,0.08);
                    border:1px solid rgba(99,102,241,0.25);
                    border-radius:8px;
                    font-size:14px;
                    color:#4B5563;
                    line-height:1.6;
                ">
                    <span style="font-size:20px;line-height:1;">💡</span>
                    <span>
                        <strong style="color:#111827;">Stealth Cursor & Hands-Free Navigation</strong> — When Stealth Mode is active, mouse clicks pass through to underlying windows. Use 
                        <kbd class="key" style="background:#E5E7EB;padding:2px 6px;border-radius:4px;font-size:12px;">Alt+Up/Down</kbd> to scroll AI answers,
                        <kbd class="key" style="background:#E5E7EB;padding:2px 6px;border-radius:4px;font-size:12px;">Alt+Left/Right</kbd> to scroll code blocks, and 
                        <kbd class="key" style="background:#E5E7EB;padding:2px 6px;border-radius:4px;font-size:12px;">Shift+Arrows</kbd> to resize the stealth window — <strong style="color:#111827">no mouse cursor movement needed</strong>.
                    </span>
                </div>

                <div style="
                    display:flex;align-items:flex-start;gap:10px;
                    padding:16px;margin-bottom:32px;
                    background:rgba(16,185,129,0.08);
                    border:1px solid rgba(16,185,129,0.25);
                    border-radius:8px;
                    font-size:14px;
                    color:#4B5563;
                    line-height:1.6;
                ">
                    <span style="font-size:20px;line-height:1;">🎯</span>
                    <span>
                        <strong style="color:#111827;">Stealth Magic Cursor & Mouse Detect / Undetect</strong> — 
                        Use <kbd class="key" style="background:#E5E7EB;padding:2px 6px;border-radius:4px;font-size:12px;">Ctrl+A</kbd> to make the app clickable so you can interact with it. 
                        Use <kbd class="key" style="background:#E5E7EB;padding:2px 6px;border-radius:4px;font-size:12px;">Ctrl+S</kbd> to turn on Ghost Mode so your clicks pass straight through it. 
                        If you are in Ghost Mode but suddenly need to click a button, use <kbd class="key" style="background:#E5E7EB;padding:2px 6px;border-radius:4px;font-size:12px;">Alt+M</kbd> to activate the secret Magic Red Arrow!
                    </span>
                </div>

                <div style="display: flex; flex-direction: column; gap: 16px;">
                    ${shortcuts.map(shortcut => html`
                        <div style="background: white; border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <span style="font-weight: 600; color: var(--text-primary); font-size: 15px;">${shortcut.label}</span>
                                <div style="display: flex; gap: 4px;">
                                    ${shortcut.keys.split('+').map(key => html`<span style="background: var(--bg-surface); color: #374151; font-weight: 600; padding: 4px 8px; border-radius: 6px; font-size: 12px; border: 1px solid #D1D5DB; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">${key}</span>`)}
                                </div>
                            </div>
                            <div style="color: var(--text-muted); font-size: 14px; line-height: 1.5;">
                                ${shortcut.desc}
                            </div>
                        </div>
                    `)}
                </div>
            </div>
        `;
    }

    renderBillingTab() {
        return html`
            <div class="billing-header">
                <h1>Choose your plan</h1>
                <p>Unlock all features with HideWin Pro</p>
            </div>

            <div class="billing-toggle">
                <span>Monthly</span>
                <span style="font-weight: 600; color: var(--text-primary);">Annual</span>
                <span class="badge">Save 45%</span>
            </div>

            <div class="pricing-cards">
                <!-- Pro Plan Card -->
                <div class="pricing-card blue">
                    <div class="pricing-title">Pro plan</div>
                    <div class="pricing-price">
                        <span class="strikethrough">$19.99</span>
                        <span class="current">$11.99</span>
                        <span class="period">/month</span>
                    </div>

                    <div class="feature-list">
                        <div class="feature-item">
                            <div class="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
                            </div>
                            <span>Unlimited AI Responses</span>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
                            </div>
                            <span>Unlimited meetings</span>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <span>Access to newest AI models</span>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <span>Priority chat support</span>
                        </div>
                    </div>

                    <button class="upgrade-btn white" @click=${() => console.log('Upgrade Pro')}>
                        Upgrade <span class="btn-badge">-45%</span>
                    </button>
                </div>

                <!-- Pro + Undetectability Card -->
                <div class="pricing-card dark">
                    <div class="pricing-title">
                        Pro + Undetectability 
                        <span class="popular-badge">Popular</span>
                    </div>
                    <div class="pricing-price">
                        <span class="strikethrough">$149.99</span>
                        <span class="current">$79.99</span>
                        <span class="period">/month</span>
                    </div>

                    <div class="feature-list">
                        <div class="feature-item">
                            <div class="feature-icon" style="background: #3B82F6; color: white;">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <div>
                                <div style="font-weight: 600; margin-bottom: 4px;">HideWin Undetectability</div>
                                <div style="font-size: 13px; opacity: 0.8;">HideWin will be invisible to screen share during meetings</div>
                            </div>
                        </div>
                        
                        <div class="graphic-placeholder">
                            [ Screen Share Invisible Graphic ]
                        </div>
                    </div>

                    <button class="upgrade-btn blue" @click=${() => console.log('Upgrade Pro+Undetectability')}>
                        Upgrade <span class="btn-badge" style="background: rgba(255,255,255,0.2);">-45%</span>
                    </button>
                </div>
            </div>
        `;
    }

    
    async handleDNSUpdate(field, value) {
        this[field] = value;
        try {
            await hideWin.storage.updatePreferences({
                dnsDomain: this.dnsDomain,
                dnsIP: this.dnsIP,
                dnsPort: this.dnsPort
            });
        } catch(e) {}
    }
    

    renderDnsTab() {
        
        return html`
            <div class="settings-section fade-in">
                <div class="section-title">DNS & Network Configuration</div>
                <div class="section-desc">Configure local or remote server settings for WebRTC signaling and collaboration.</div>
                
                <div class="setting-row">
                    <div class="setting-info">
                        <div class="setting-name">Server IP Address</div>
                        <div class="setting-desc">The local network or public IP of your signaling server.</div>
                    </div>
                    <div class="setting-control">
                        <input type="text" class="text-input" style="width: 200px" 
                            .value=${this.dnsIP || '127.0.0.1'} 
                            @input=${e => this.handleDNSUpdate('dnsIP', e.target.value)} 
                            placeholder="e.g. 192.168.1.25">
                    </div>
                </div>

                <div class="setting-row">
                    <div class="setting-info">
                        <div class="setting-name">Server Port</div>
                        <div class="setting-desc">The port your signaling server runs on.</div>
                    </div>
                    <div class="setting-control">
                        <input type="text" class="text-input" style="width: 200px" 
                            .value=${this.dnsPort || '8001'} 
                            @input=${e => this.handleDNSUpdate('dnsPort', e.target.value)} 
                            placeholder="e.g. 8001">
                    </div>
                </div>

                <div class="setting-row">
                    <div class="setting-info">
                        <div class="setting-name">Custom Domain (Future VPC/AWS)</div>
                        <div class="setting-desc">Optional. If provided, the app will use this domain instead of the IP address (e.g. hidewin.com).</div>
                    </div>
                    <div class="setting-control">
                        <input type="text" class="text-input" style="width: 200px" 
                            .value=${this.dnsDomain || ''} 
                            @input=${e => this.handleDNSUpdate('dnsDomain', e.target.value)} 
                            placeholder="e.g. hidewin.com">
                    </div>
                </div>
            </div>
        `.replace("html", "html");
    }

    render() {
        return html`
            <div class="sidebar-layout">
                <!-- Left Sidebar -->
                <div class="sidebar">
                    <div class="sidebar-group">
                        <div class="sidebar-item ${this.activeTab === 'general' ? 'active' : ''}" @click=${() => this.activeTab = 'general'}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                            General
                        </div>
                        <div class="sidebar-item ${this.activeTab === 'theme' ? 'active' : ''}" @click=${() => this.activeTab = 'theme'}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
                            Theme
                        </div>
                        <div class="sidebar-item ${this.activeTab === 'keybinds' ? 'active' : ''}" @click=${() => this.activeTab = 'keybinds'}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7V4h16v3M9 20h6M12 4v16"></path></svg>
                            Keybinds
                        </div>
                        <div class="sidebar-item ${this.activeTab === 'profile' ? 'active' : ''}" @click=${() => this.activeTab = 'profile'}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            Account
                        </div>
                        <div class="sidebar-item ${this.activeTab === 'security' ? 'active' : ''}" @click=${() => this.activeTab = 'security'}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            Security
                        </div>
                        <div class="sidebar-item ${this.activeTab === 'language' ? 'active' : ''}" @click=${() => this.activeTab = 'language'}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                            Language
                        </div>
                        
                        <div class="sidebar-item ${this.activeTab === 'dns' ? 'active' : ''}" @click=${() => this.activeTab = 'dns'}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
                            DNS & Network
                        </div>

                        <div class="sidebar-item ${this.activeTab === 'billing' ? 'active' : ''}" @click=${() => this.activeTab = 'billing'}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                            Billing
                        </div>
                    </div>

                    <div class="sidebar-group" style="margin-top: auto;">
                        <div class="sidebar-group-title">Support</div>
                        <div class="sidebar-item" @click=${() => console.log('Release Notes')}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            Release Notes
                        </div>
                        <div class="sidebar-item" @click=${() => console.log('Help Center')}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                            Help Center
                        </div>
                        <div class="sidebar-item" @click=${() => console.log('Contact Support')}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            Contact Support
                        </div>
                    </div>
                    
                    <div class="sidebar-group" style="margin-bottom: 0;">
                        <div class="sidebar-item" @click=${() => { this._showSignOutModal = true; this.requestUpdate(); }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                            Sign out
                        </div>
                        <div class="sidebar-item" @click=${() => console.log('Quit HideWin')}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                            Quit HideWin
                        </div>
                    </div>
                </div>

                <!-- Main Content Area -->
                <div class="main-content">
                    ${this.activeTab === 'billing' ? this.renderBillingTab() : ''}
                    
                    ${this.activeTab === 'general' ? html`
                        <div class="legacy-settings-wrapper">
                            <h2 style="margin-top: 0; margin-bottom: 24px; font-size: 20px;">General Settings</h2>
                            ${this.renderApiKeysSection()}
                            ${this.renderAudioSection()}
                            ${this.renderPrivacySection()}
                        </div>
                    ` : ''}

                    ${this.activeTab === 'theme' ? html`
                        <div class="legacy-settings-wrapper">
                            <h2 style="margin-top: 0; margin-bottom: 24px; font-size: 20px;">Theme & Appearance</h2>
                            ${this.renderAppearanceSection()}
                        </div>
                    ` : ''}

                    ${this.activeTab === 'language' ? html`
                        <div class="legacy-settings-wrapper">
                            <h2 style="margin-top: 0; margin-bottom: 24px; font-size: 20px;">Language Settings</h2>
                            ${this.renderLanguageSection()}
                        </div>
                    ` : ''}

                    ${this.activeTab === 'keybinds' ? this.renderKeybindsTab() : ''}
                    
                    ${this.activeTab === 'profile' ? this.renderProfileTab() : ''}

                    ${['security'].includes(this.activeTab) ? html`
                        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--text-muted);">
                            <h2>${this.activeTab.charAt(0).toUpperCase() + this.activeTab.slice(1)} configuration coming soon</h2>
                        </div>
                    ` : ''}
                </div>
            </div>

            ${this._showSignOutModal ? html`
                <div class="modal-backdrop" @click=${() => { this._showSignOutModal = false; this.requestUpdate(); }} style="display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 9999; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
                    <div class="modal-content" @click=${e => e.stopPropagation()} style="background: white; width: 400px; padding: 32px; border-radius: 16px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2); display: flex; flex-direction: column; animation: slideUp 0.2s ease-out;">
                        <h2 style="margin-top: 0; font-size: 20px; color: var(--text-primary); font-weight: 600; margin-bottom: 12px;">Sign Out</h2>
                        <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 32px; line-height: 1.5;">
                            Are you sure you want to sign out? You will need to re-authenticate with an OTP to continue using HideWin.
                        </p>
                        <div style="display: flex; justify-content: flex-end; gap: 12px;">
                            <button class="btn btn-secondary" @click=${() => { this._showSignOutModal = false; this.requestUpdate(); }} style="padding: 10px 20px; border-radius: 8px; border: 1px solid #D1D5DB; background: white; color: #374151; font-weight: 500; cursor: pointer; transition: background 0.2s;">Cancel</button>
                            <button class="btn" style="padding: 10px 20px; border-radius: 8px; border: none; background: #ef4444; color: white; font-weight: 500; cursor: pointer; box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3); transition: background 0.2s;" @click=${() => {
                                this._showSignOutModal = false;
                                this.dispatchEvent(new CustomEvent('sign-out', { bubbles: true, composed: true }));
                            }}>Sign Out</button>
                        </div>
                    </div>
                </div>
            ` : ''}
        `;
    }
}

customElements.define('customize-view', CustomizeView);
