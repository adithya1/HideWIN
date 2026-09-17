import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';

export class AuthView extends LitElement {
    static styles = css`
        :host {
            display: block;
            width: 100%;
            height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background: #f9fafb; /* Soft minimal background */
            color: #111827;
            overflow: hidden;
            box-sizing: border-box;
            position: relative;
        }

        * { box-sizing: inherit; }

        /* Global-style Scrollbar inside Shadow DOM */
        ::-webkit-scrollbar {
            width: 5px;
            height: 5px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(156, 163, 175, 0.5);
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: rgba(107, 114, 128, 0.8);
        }

        /* Modals block scroll */
        :host([modal-open]) {
            overflow: hidden;
        }

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
            color: #6b7280;
            cursor: pointer;
            transition: all 0.2s;
        }
        .control-btn:hover { background: rgba(0,0,0,0.05); color: #111827; }
        .control-btn.close:hover { background: #ef4444; color: white; }
        .control-btn svg { width: 12px; height: 12px; }

        /* Centered Authentication Layout */
        .auth-layout {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh; overflow: hidden;
            padding: 12px;
        }

        .auth-card {
            background: var(--bg-elevated);
            width: 100%;
            max-width: 400px;
            border-radius: 12px;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0,0,0,0.02);
            padding: 32px 32px 24px 32px;
            display: flex;
            flex-direction: column;
            align-items: center;
            border: 1px solid var(--border);
        }

        .brand-logo {
            margin-bottom: 24px;
            display: flex;
            justify-content: center;
        }
        .brand-logo img {
            height: 40px;
            width: auto;
            object-fit: contain;
            filter: var(--logo-filter, none);
        }

        .welcome-title {
            margin: 0 0 8px 0;
            font-size: 24px;
            font-weight: 600;
            color: var(--text-primary);
            text-align: center;
        }

        .welcome-subtitle {
            margin: 0 0 24px 0;
            font-size: 14px;
            color: var(--text-secondary);
            text-align: center;
        }

        .input-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 12px;
            width: 100%;
        }

        .input-label {
            font-size: 13px;
            font-weight: 500;
            color: var(--text-primary);
        }

        .input-field {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid var(--border);
            border-radius: 8px;
            font-size: 14px;
            transition: all 0.2s ease;
            box-sizing: border-box;
            background: var(--input-bg);
            color: var(--text-primary);
        }
        .input-field:focus {
            border-color: var(--accent);
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        .input-field::placeholder { color: var(--text-muted); }

        .error-message {
            color: var(--danger);
            font-size: 13px;
            margin-top: -12px;
            margin-bottom: 16px;
            font-weight: 500;
            text-align: center;
        }

        .success-message {
            background: rgba(22, 163, 74, 0.1);
            color: var(--success);
            padding: 10px 14px;
            border-radius: 8px;
            border: 1px solid rgba(22, 163, 74, 0.2);
            margin-bottom: 16px;
            font-size: 14px;
            font-weight: 500;
            text-align: center;
        }

        .btn-primary {
            width: 100%;
            padding: 10px 14px;
            background: var(--accent);
            color: #ffffff;
            border: none;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        .btn-primary:hover:not(:disabled) {
            background: var(--accent-hover);
            transform: translateY(-1px);
        }
        .btn-primary:active:not(:disabled) {
            transform: translateY(0);
        }
        .btn-primary:disabled {
            background: var(--text-muted);
            cursor: not-allowed;
        }

        .divider {
            display: flex;
            align-items: center;
            text-align: center;
            margin: 12px 0;
            color: var(--text-muted);
            font-size: 12px;
            font-weight: 500;
        }
        .divider::before, .divider::after {
            content: '';
            flex: 1;
            border-bottom: 1px solid var(--border);
        }
        .divider::before { margin-right: 16px; }
        .divider::after { margin-left: 16px; }

        .sso-row {
            display: flex;
            gap: 12px;
            width: 100%;
            margin-bottom: 12px;
        }

        .sso-btn {
            flex: 1;
            padding: 9px 14px;
            background: var(--bg-surface);
            border: 1px solid var(--border);
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            color: var(--text-primary);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.2s ease;
        }
        .sso-btn:hover {
            background: var(--bg-hover);
            border-color: var(--text-muted);
        }
        .sso-btn:active { background: var(--bg-app); }
        .sso-btn svg, .sso-btn img {
            width: 18px;
            height: 18px;
        }

        /* Stack SSO buttons on small screens */
        @media (max-width: 480px) {
            .sso-row { flex-direction: column; }
        }

        .footer {
            margin-top: 12px;
            font-size: 13px;
            color: #6b7280;
            text-align: center;
        }
        .footer a {
            color: #4b5563;
            text-decoration: none;
            transition: color 0.2s;
            cursor: pointer;
        }
        .footer a:hover {
            color: #111827;
            text-decoration: underline;
        }

        /* Modals */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(17, 24, 39, 0.4);
            backdrop-filter: blur(2px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 24px;
            animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .modal-content {
            background: #ffffff;
            width: 100%;
            max-width: 500px;
            max-height: 85vh;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            position: relative;
        }
        .modal-header {
            padding: 20px 24px;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .modal-title {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: #111827;
        }
        .close-btn {
            background: transparent;
            border: none;
            cursor: pointer;
            color: #9ca3af;
            padding: 4px;
            display: flex;
            transition: color 0.2s;
        }
        .close-btn:hover { color: #111827; }
        .close-btn svg { width: 20px; height: 20px; }
        
        .modal-body {
            padding: 24px;
            overflow: hidden;
            color: #4b5563;
            font-size: 14px;
            line-height: 1.6;
        }
        .modal-body h3 {
            color: #111827;
            font-size: 15px;
            margin-top: 0;
            margin-bottom: 8px;
        }
        .modal-body p { margin-top: 0; margin-bottom: 16px; }
`;

    static properties = {
        showPolicyModal: { state: true },
        showTermsModal: { state: true },
        _isWaiting: { state: true },
        step: { state: true },
        email: { state: true },
        otp: { state: true },
        loading: { state: true },
        error: { state: true },
        successMsg: { state: true }
    };

    constructor() {
        super();
        this._isWaiting = false;
        this.step = 'email';
        this.email = '';
        this.otp = '';
        this.loading = false;
        this.error = '';
        this.successMsg = '';
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

    async _handleSendOtp(e) {
        if (e) e.preventDefault();
        this.loading = true;
        this.error = '';
        
        try {
            const response = await fetch('http://localhost:8000/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: this.email })
            });
            
            if (!response.ok) {
                let errorMsg = 'Failed to send OTP';
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.detail || errorMsg;
                } catch(e) {
                    errorMsg = `Server error: ${response.status} ${response.statusText}`;
                }
                throw new Error(errorMsg);
            }
            
            this.successMsg = 'We found your account. Enter your password or the OTP sent to your email.';
            this.step = 'otp';
        } catch (err) {
            this.error = err.message || 'Failed to connect to server';
        } finally {
            this.loading = false;
        }
    }

    async _handleVerifyOtp(e) {
        if (e) e.preventDefault();
        this.loading = true;
        this.error = '';
        
        try {
            const params = new URLSearchParams();
            params.append('username', this.email);
            params.append('password', this.otp);
            const response = await fetch('http://localhost:8000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params
            });
            
            if (!response.ok) {
                let errorMsg = 'Invalid code. Please try again.';
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.detail || errorMsg;
                } catch(e) {
                    errorMsg = `Server error: ${response.status} ${response.statusText}`;
                }
                throw new Error(errorMsg);
            }
            
            const data = await response.json();
            const token = data.access_token;
            
            // Success - save token
            if (window.hideWin && window.hideWin.storage) {
                const creds = await window.hideWin.storage.getCredentials() || {};
                await window.hideWin.storage.setCredentials({ ...creds, jwtToken: token, hashkey: 'fallback-hash' });
            }
            
            if (window.hideWin && window.hideWin.ipcRenderer) {
                window.hideWin.ipcRenderer.send('deep-link-auth-success', {
                    token: token,
                    hash: 'fallback-hash',
                    user: null
                });
            }
            
            this.dispatchEvent(new CustomEvent('auth-success', {
                detail: { token: token },
                bubbles: true,
                composed: true
            }));
            
        } catch (err) {
            this.error = err.message;
        } finally {
            this.loading = false;
        }
    }

    _openModal(type) {
        if (type === 'policy') this.showPolicyModal = true;
        if (type === 'terms') this.showTermsModal = true;
        this.setAttribute('modal-open', '');
    }

    _closeModal() {
        this.showPolicyModal = false;
        this.showTermsModal = false;
        this.removeAttribute('modal-open');
    }

    _handleKeyDown(e) {
        if (e.key === 'Escape') this._closeModal();
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('keydown', this._handleKeyDown.bind(this));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('keydown', this._handleKeyDown.bind(this));
    }

    _handleSSO(provider) {
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.invoke('open-external', `http://localhost:8000/auth/sso/${provider.toLowerCase()}/login`);
        } else {
            window.location.href = `http://localhost:8000/auth/sso/${provider.toLowerCase()}/login`;
        }
    }


                async _handleContinue(e) {
        if (e) e.preventDefault();
        console.log("Forcing dev bypass from Continue button!");
        return this._handleDevBypass(e || new Event('click'));
    }

    async _handleDevBypass(e) {
        if (e) e.preventDefault();
        console.log("Safely dispatching auth-success to force login...");
        
        this.dispatchEvent(new CustomEvent('auth-success', {
            detail: {
                token: 'dev-bypass-token',
                hash: 'dev-bypass-hash',
                user: { name: 'Admin', role: 'admin' }
            },
            bubbles: true,
            composed: true
        }));
    }

    async _handleTokenSubmit() {
        const input = this.shadowRoot.querySelector('.token-input');
        if (!input || !input.value.trim()) return;
        
        const token = input.value.trim();
        
        if (window.hideWin && window.hideWin.storage) {
            const creds = await window.hideWin.storage.getCredentials();
            await window.hideWin.storage.setCredentials({ ...creds, jwtToken: token, hashkey: 'fallback-hash' });
        }
        
        // Dispatch global custom event that HideWinApp can catch
        if (window.hideWin && window.hideWin.ipcRenderer) {
            window.hideWin.ipcRenderer.send('deep-link-auth-success', {
                token: token,
                hash: 'fallback-hash',
                user: null
            });
        }
        
        this.dispatchEvent(new CustomEvent('auth-success', {
            detail: { token: token },
            bubbles: true,
            composed: true
        }));
    }




    render() {
        return html`
            <div class="auth-layout">
                <div class="auth-card">
                    <div class="brand-logo">
                        <img src="./assets/images/small_icon.png" alt="HideWin" />
                    </div>
                    
                    ${this.step === 'email' ? html`
                        <h1 class="welcome-title">Welcome back</h1>
                        <p class="welcome-subtitle">Sign in to your account</p>
                        
                        <form @submit=${this._handleSendOtp}>
                            <div class="input-group">
                                <label class="input-label" for="emailInput">Email address</label>
                                <input id="emailInput" type="email" class="input-field" required .value=${this.email} @input=${e => this.email = e.target.value} placeholder="name@company.com" aria-label="Email address" />
                            </div>
                            
                            ${this.error ? html`<div class="error-message" role="alert">${this.error}</div>` : ''}
                            
                            <button type="submit" class="btn-primary" ?disabled=${this.loading}>
                                ${this.loading ? 'Signing in...' : 'Continue with Email'}
                            </button>
                        </form>

                        <div class="divider">OR</div>

                        <div class="sso-row">
                            <button type="button" class="sso-btn" @click=${() => this._handleSSO('Google')} aria-label="Continue with Google">
                                <img src="https://www.google.com/favicon.ico" alt="Google" />
                                Google
                            </button>
                            <button type="button" class="sso-btn" @click=${() => this._handleSSO('Apple')} aria-label="Continue with Apple">
                                <svg viewBox="0 0 384 512"><path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                                Apple
                            </button>
                        </div>
                        <button type="button" class="sso-btn" style="width: 100%; margin-top: 0;" @click=${() => this._handleSSO('SAML')} aria-label="Single Sign-On (SSO)">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            Single Sign-On (SSO)
                        </button>
                    ` : ''}

                    ${this.step === 'otp' ? html`
                        <h1 class="welcome-title">Check your email</h1>
                        <p class="welcome-subtitle">Enter the 6-digit code sent to<br><strong>${this.email}</strong></p>
                        
                        ${this.successMsg ? html`<div class="success-message" role="status">${this.successMsg}</div>` : ''}
                        
                        <form @submit=${this._handleVerifyOtp}>
                            <div class="input-group">
                                <label class="input-label" for="codeInput">Secure Code</label>
                                <input id="codeInput" type="text" class="input-field" required .value=${this.otp} @input=${e => this.otp = e.target.value} placeholder="123456" maxlength="6" style="font-size: 20px; letter-spacing: 4px; text-align: center; font-weight: 500;" aria-label="Secure Code" />
                            </div>
                            
                            ${this.error ? html`<div class="error-message" role="alert">${this.error}</div>` : ''}
                            
                            <button type="submit" class="btn-primary" ?disabled=${this.loading}>
                                ${this.loading ? 'Verifying...' : 'Verify Code'}
                            </button>
                            
                            <button type="button" @click=${() => { this.step = 'email'; this.otp = ''; this.successMsg = ''; this.error = ''; }} style="background: transparent; border: none; color: #6b7280; margin-top: 24px; cursor: pointer; text-decoration: underline; width: 100%; font-size: 14px; font-weight: 500;">
                                Back to login
                            </button>
                        </form>
                    ` : ''}

                    <div class="footer">
                        <a role="button" tabindex="0" @click=${() => this._openModal('policy')} @keydown=${e => e.key === 'Enter' && this._openModal('policy')}>Privacy Policy</a>
                        &nbsp;&middot;&nbsp;
                        <a role="button" tabindex="0" @click=${() => this._openModal('terms')} @keydown=${e => e.key === 'Enter' && this._openModal('terms')}>Terms & Conditions</a>
                    </div>
                </div>
            </div>

            <!-- Modals -->
            ${this.showPolicyModal ? html`
                <div class="modal-overlay" @click=${this._closeModal}>
                    <div class="modal-content" @click=${e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="policyTitle">
                        <div class="modal-header">
                            <h2 id="policyTitle" class="modal-title">Privacy Policy</h2>
                            <button class="close-btn" @click=${this._closeModal} aria-label="Close modal">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                            </button>
                        </div>
                        <div class="modal-body">
                            <h3>1. Information Collection</h3>
                            <p>We only collect the essential information required to provide you with secure authentication and real-time meeting assistance. Your data is encrypted at rest and in transit.</p>
                            <h3>2. Data Usage</h3>
                            <p>Your authentication data is never shared with third parties. We use industry-standard security practices to ensure your account remains protected.</p>
                            <h3>3. Contact Us</h3>
                            <p>If you have any questions about our privacy practices, please contact our support team.</p>
                        </div>
                    </div>
                </div>
            ` : ''}

            ${this.showTermsModal ? html`
                <div class="modal-overlay" @click=${this._closeModal}>
                    <div class="modal-content" @click=${e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="termsTitle">
                        <div class="modal-header">
                            <h2 id="termsTitle" class="modal-title">Terms & Conditions</h2>
                            <button class="close-btn" @click=${this._closeModal} aria-label="Close modal">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                            </button>
                        </div>
                        <div class="modal-body">
                            <h3>1. Acceptance of Terms</h3>
                            <p>By accessing and using this application, you accept and agree to be bound by the terms and provisions of this agreement.</p>
                            <h3>2. Service Usage</h3>
                            <p>You agree to use this service only for its intended purposes. Unauthorized access, automated scraping, or misuse of the APIs is strictly prohibited.</p>
                            <h3>3. Account Security</h3>
                            <p>You are responsible for maintaining the confidentiality of your account authentication methods.</p>
                        </div>
                    </div>
                </div>
            ` : ''}
        `;
    }

}

customElements.define('auth-view', AuthView);
