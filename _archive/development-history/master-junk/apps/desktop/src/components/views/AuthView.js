import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';

export class AuthView extends LitElement {
    static styles = css`
        :host {
            display: block;
            width: 100%;
            height: 100%;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background: #ffffff;
            color: #1e293b;
        }

        .window-controls {
            position: absolute;
            top: 0;
            right: 0;
            display: flex;
            z-index: 100;
            -webkit-app-region: no-drag;
        }

        .control-btn {
            width: 46px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: none;
            color: #64748b;
            cursor: pointer;
            transition: background 0.2s, color 0.2s;
        }

        .control-btn:hover {
            background: #f1f5f9;
            color: #0f172a;
        }

        .control-btn.close:hover {
            background: #ef4444;
            color: white;
        }

        .control-btn svg {
            width: 14px;
            height: 14px;
        }

        .drag-region {
            position: absolute;
            top: 0;
            left: 0;
            right: 140px; /* Leave space for controls */
            height: 32px;
            -webkit-app-region: drag;
            z-index: 99;
        }

        .auth-container {
            display: flex;
            width: 100%;
            height: 100vh;
        }

        .auth-left {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 40px;
            text-align: center;
            background: #ffffff;
        }

        .auth-right {
            flex: 1;
            background: #f8fafc;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 40px;
            border-left: 1px solid #e2e8f0;
        }

        .brand-logo {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 28px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 24px;
        }

        .brand-logo svg {
            width: 32px;
            height: 32px;
            color: #0f172a;
        }

        .welcome-title {
            font-size: 42px;
            font-weight: 700;
            color: #334155;
            margin: 0 0 16px 0;
            letter-spacing: -0.02em;
        }

        .welcome-subtitle {
            font-size: 20px;
            color: #94a3b8;
            margin: 0 0 48px 0;
            font-weight: 400;
        }

        .btn-continue {
            background: linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 16px 32px;
            font-size: 16px;
            font-weight: 600;
            width: 100%;
            max-width: 320px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .btn-continue:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35);
        }

        .btn-continue:active {
            transform: translateY(1px);
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
        }

        .terms-text {
            margin-top: auto;
            font-size: 13px;
            color: #94a3b8;
            padding-top: 40px;
        }

        .terms-text a {
            color: #64748b;
            text-decoration: none;
            font-weight: 600;
        }

        .status-msg {
            margin-top: 24px;
            padding: 12px 24px;
            border-radius: 8px;
            background: #f1f5f9;
            color: #475569;
            font-size: 14px;
            font-weight: 500;
            display: none;
        }

        .status-msg.visible {
            display: block;
        }
    `;

    static properties = {
        _isWaiting: { state: true }
    };

    constructor() {
        super();
        this._isWaiting = false;
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
            <div class="drag-region"></div>
            
            <div class="window-controls">
                <button class="control-btn" @click="${this._handleMinimize}" title="Minimize">
                    <svg viewBox="0 0 10 10"><path fill="none" stroke="currentColor" stroke-width="1" d="M1 5h8"/></svg>
                </button>
                <button class="control-btn" @click="${this._handleMaximize}" title="Maximize">
                    <svg viewBox="0 0 10 10"><path fill="none" stroke="currentColor" stroke-width="1" d="M1 1h8v8H1z"/></svg>
                </button>
                <button class="control-btn close" @click="${this._handleClose}" title="Close">
                    <svg viewBox="0 0 10 10"><path fill="none" stroke="currentColor" stroke-width="1" d="M1 1l8 8m0-8L1 9"/></svg>
                </button>
            </div>

            <div class="auth-container">
                <div class="auth-left">
                    <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;">
                        <div class="brand-logo">
                            <img src="../../assets/logo.png" style="height: 64px;" alt="HideWin Logo" />
                        </div>
                        
                        <h1 class="welcome-title">Welcome to HideWin</h1>
                        <p class="welcome-subtitle">The ultimate AI meeting assistant</p>

                        <button class="btn-continue" @click="${this._handleContinue}" ?disabled="${this._isWaiting}">
                            ${this._isWaiting ? 'Opening browser...' : 'Continue'}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
                        </button>
                        
                        <div class="status-msg ${this._isWaiting ? 'visible' : ''}">
                            Waiting for authentication in browser...
                        </div>
                    </div>

                    <div class="terms-text">
                        By signing up, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                    </div>
                </div>

                <div class="auth-right">
                    <div style="text-align: center;">
                        <h2 style="font-size: 32px; color: #1e293b; margin-bottom: 16px;">Real-time meeting assistant,<br>always ready to help</h2>
                        <div style="width: 400px; height: 300px; background: #e2e8f0; border-radius: 16px; margin-top: 32px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
                            <!-- Graphic placeholder -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('auth-view', AuthView);
