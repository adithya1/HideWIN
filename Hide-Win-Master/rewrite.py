with open('src/components/views/AuthView.js', 'w', encoding='utf-8') as f:
    f.write('''import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';

export class AuthView extends LitElement {
    static styles = css`
        :host {
            display: block;
            width: 100vw;
            height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background: #ffffff;
            color: #111827;
            overflow: hidden;
            box-sizing: border-box;
            position: relative;
        }

        * { box-sizing: inherit; }

        .window-controls {
            position: absolute;
            top: 0;
            right: 0;
            display: flex;
            z-index: 100;
            -webkit-app-region: no-drag;
        }

        .drag-region {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 48px;
            -webkit-app-region: drag;
            z-index: 90;
        }

        .control-btn {
            width: 46px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: none;
            color: #ffffff;
            cursor: pointer;
            transition: all 0.2s;
        }
        .control-btn:hover { background: rgba(255,255,255,0.15); }
        .control-btn.close:hover { background: #ef4444; color: white; }
        .control-btn svg { width: 12px; height: 12px; }

        /* 30/70 Split Layout */
        .auth-layout {
            display: flex;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }

        /* Left Pane - 30% */
        .auth-left {
            flex: 0 0 35%;
            max-width: 500px;
            min-width: 400px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 40px;
            background: #ffffff;
            z-index: 2;
            -webkit-app-region: no-drag;
            box-shadow: 2px 0 10px rgba(0,0,0,0.05);
        }

        .auth-content {
            width: 100%;
            max-width: 320px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }

        /* Right Pane - 70% */
        .auth-right {
            flex: 1;
            position: relative;
            background-color: #1e3a8a;
            background-image: linear-gradient(135deg, rgba(30,58,138,0.85) 0%, rgba(17,24,39,0.7) 100%), url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80');
            background-size: cover;
            background-position: center;
            -webkit-app-region: drag;
        }

        .brand-logo {
            margin-bottom: 32px;
            display: flex;
            align-items: center;
            gap: 12px;
            align-self: center;
        }
        .brand-logo img {
            height: 36px;
            width: auto;
            object-fit: contain;
        }
        .brand-logo span {
            font-size: 22px;
            font-weight: 700;
            color: #111827;
            letter-spacing: -0.5px;
        }

        .welcome-title {
            margin: 0 0 8px 0;
            font-size: 24px;
            font-weight: 700;
            color: #111827;
            align-self: center;
        }

        .welcome-subtitle {
            margin: 0 0 32px 0;
            font-size: 14px;
            color: #6b7280;
            align-self: center;
            text-align: center;
        }

        .input-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 20px;
            width: 100%;
        }

        .input-label {
            font-size: 13px;
            font-weight: 600;
            color: #374151;
        }

        .input-field {
            width: 100%;
            padding: 12px 14px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 14px;
            transition: all 0.2s ease;
            box-sizing: border-box;
            background: #f9fafb;
            color: #111827;
        }
        .input-field:focus {
            border-color: #2563eb;
            background: #ffffff;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
            outline: none;
        }
        .input-field::placeholder { color: #9ca3af; }

        .btn-primary {
            width: 100%;
            padding: 12px 14px;
            background: #2563eb;
            color: #ffffff;
            border: none;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
        }
        .btn-primary:hover:not(:disabled) {
            background: #1d4ed8;
            transform: translateY(-1px);
            box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);
        }
        .btn-primary:active:not(:disabled) {
            transform: translateY(0);
        }

        .divider {
            display: flex;
            align-items: center;
            text-align: center;
            margin: 24px 0;
            color: #9ca3af;
            font-size: 12px;
            font-weight: 600;
            width: 100%;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .divider::before, .divider::after {
            content: '';
            flex: 1;
            border-bottom: 1px solid #e5e7eb;
        }
        .divider::before { margin-right: 12px; }
        .divider::after { margin-left: 12px; }

        /* SSO Row - Side by Side */
        .sso-row {
            display: flex;
            gap: 12px;
            width: 100%;
        }

        .sso-btn {
            flex: 1;
            padding: 10px 0;
            background: #ffffff;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            color: #374151;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.2s ease;
        }
        .sso-btn:hover {
            background: #f9fafb;
            border-color: #9ca3af;
        }
        .sso-btn svg, .sso-btn img {
            width: 18px;
            height: 18px;
        }

        .status-msg {
            margin-top: 16px;
            font-size: 13px;
            font-weight: 500;
            text-align: center;
            width: 100%;
            padding: 8px;
            border-radius: 6px;
        }
        .status-msg.error { background: rgba(239, 68, 68, 0.1); color: #dc2626; border: 1px solid rgba(239, 68, 68, 0.2); }
        .status-msg.info { background: rgba(37, 99, 235, 0.1); color: #2563eb; border: 1px solid rgba(37, 99, 235, 0.2); }
    `;

    static properties = {
        email: { state: true },
        loading: { state: true },
        status: { state: true },
        statusType: { state: true }
    };

    constructor() {
        super();
        this.email = '';
        this.loading = false;
        this.status = '';
        this.statusType = '';
    }

    _handleMinimize() {
        this.dispatchEvent(new CustomEvent('minimize', { bubbles: true, composed: true }));
    }

    _handleMaximize() {
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.invoke('window-maximize');
        }
    }

    _handleClose() {
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.invoke('quit-application');
        }
    }

    // PKCE Security Implementation
    generateRandomString(length) {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
        let result = '';
        const values = new Uint8Array(length);
        window.crypto.getRandomValues(values);
        for (let i = 0; i < length; i++) {
            result += charset[values[i] % charset.length];
        }
        return result;
    }

    async generateCodeChallenge(verifier) {
        const data = new TextEncoder().encode(verifier);
        const digest = await window.crypto.subtle.digest('SHA-256', data);
        return btoa(String.fromCharCode(...new Uint8Array(digest)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    async _handleLoginClick(e) {
        if (e) e.preventDefault();
        
        try {
            this.loading = true;
            this.status = 'Generating secure PKCE session...';
            this.statusType = 'info';

            // 1. Generate PKCE values
            const codeVerifier = this.generateRandomString(64);
            const codeChallenge = await this.generateCodeChallenge(codeVerifier);
            const state = this.generateRandomString(32);

            // 2. Save verifier to localStorage so HideWinAppEvents can use it during exchange
            localStorage.setItem('pkce_code_verifier', codeVerifier);
            localStorage.setItem('pkce_state', state);

            // 3. Construct OAuth URL
            const clientId = 'c0b65c72458d40d5a3f477dcf3c07f4c';
            const redirectUri = 'huddlemate://callback';
            const authorizeUrl = `https://app.huddlemate.ai/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&code_challenge=${codeChallenge}&code_challenge_method=S256&state=${state}&scope=${encodeURIComponent('openid profile email')}`;

            // Append login_hint if email is provided
            const finalUrl = this.email 
                ? `https://app.huddlemate.ai/signin?login_hint=${encodeURIComponent(this.email)}&returnUrl=${encodeURIComponent(authorizeUrl)}` 
                : `https://app.huddlemate.ai/signin?returnUrl=${encodeURIComponent(authorizeUrl)}`;

            // 4. Open external browser
            if (window.require) {
                const { ipcRenderer } = window.require('electron');
                ipcRenderer.invoke('open-external', finalUrl);
            } else {
                window.location.href = finalUrl;
            }

            this.status = 'Please complete login in your browser...';
        } catch (err) {
            console.error(err);
            this.status = 'Failed to initiate secure login.';
            this.statusType = 'error';
        } finally {
            this.loading = false;
        }
    }

    render() {
        return html`
            <div class="drag-region"></div>
            <div class="window-controls">
                <button class="control-btn" @click=${this._handleMinimize} aria-label="Minimize">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
                <button class="control-btn" @click=${this._handleMaximize} aria-label="Maximize">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                </button>
                <button class="control-btn close" @click=${this._handleClose} aria-label="Close">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>

            <div class="auth-layout">
                <div class="auth-left">
                    <div class="auth-content">
                        <div class="brand-logo">
                            <img src="./assets/images/small_icon.png" alt="HideWin Logo" />
                            <span>HideWin</span>
                        </div>
                        
                        <h1 class="welcome-title">Sign in to HideWin</h1>
                        <p class="welcome-subtitle">Enter your email and we will send you a login code</p>
                        
                        <form @submit=${this._handleLoginClick} style="width: 100%;">
                            <div class="input-group">
                                <label class="input-label" for="emailInput">Email address</label>
                                <input id="emailInput" type="email" class="input-field" .value=${this.email} @input=${e => this.email = e.target.value} placeholder="name@company.com" aria-label="Email address" />
                            </div>
                            
                            <button type="submit" class="btn-primary" ?disabled=${this.loading}>
                                Continue with Email
                            </button>
                        </form>

                        <div class="divider">OR</div>

                        <div class="sso-row">
                            <button type="button" class="sso-btn" @click=${this._handleLoginClick} aria-label="Continue with Google">
                                <img src="https://www.google.com/favicon.ico" alt="Google" />
                                Google
                            </button>
                            <button type="button" class="sso-btn" @click=${this._handleLoginClick} aria-label="Continue with Apple">
                                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.111 14.815c-.417.818-1.045 1.554-1.848 2.186-.807.636-1.748 1.054-2.793 1.258-1.053.208-2.13.125-3.197-.246-1.059-.368-2.002-.991-2.8-1.85-.794-.85-1.406-1.921-1.808-3.18-.396-1.238-.52-2.583-.352-4.004.167-1.4.636-2.678 1.396-3.805.748-1.111 1.737-1.996 2.92-2.634 1.16-.624 2.456-.91 3.864-.848 1.432.062 2.766.495 3.968 1.288 1.183.78 2.15 1.87 2.872 3.238.704 1.34 1.077 2.836 1.107 4.444.032 1.63-.332 3.14-.855 4.542-.518 1.39-1.256 2.607-2.19 3.618z" fill="none"/><path d="M15.352 14.152c-.672.484-1.472.76-2.313.76-1.392 0-2.67-.714-3.414-1.902-.27-.432-.472-.9-.602-1.396-.134-.515-.178-1.052-.132-1.594.048-.564.192-1.114.428-1.633.242-.533.582-1.018 1.01-1.442.434-.43 1.018-.722 1.636-.826.626-.106 1.272-.036 1.884.2.597.23 1.12.632 1.527 1.173.398.53.647 1.166.726 1.848.077.67.012 1.356-.192 2.012-.2.646-.538 1.233-.996 1.73zM15.352 14.152" fill="#111827"/></svg>
                                Apple
                            </button>
                        </div>
                        
                        ${this.status ? html`<div class="status-msg ${this.statusType}">${this.status}</div>` : ''}
                    </div>
                </div>
                
                <div class="auth-right">
                    <!-- The background image handles the visual -->
                </div>
            </div>
        `;
    }
}

customElements.define('auth-view', AuthView);
''')
