import re

fpath = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\AuthView.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace EVERYTHING in static styles = css` ... `;
new_styles = '''
        :host {
            display: block;
            width: 100%;
            height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background: #ffffff;
            color: #0f172a;
            overflow: hidden;
            box-sizing: border-box;
        }

        * {
            box-sizing: inherit;
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
            color: #64748b;
            cursor: pointer;
            transition: background 0.2s, color 0.2s;
        }

        .control-btn:hover {
            background: rgba(0,0,0,0.05);
            color: #0f172a;
        }

        .control-btn.close:hover {
            background: #ef4444;
            color: white;
        }

        .control-btn svg {
            width: 12px;
            height: 12px;
        }

        .auth-container {
            display: flex;
            width: 100%;
            height: 100%;
            overflow-y: auto;
        }

        .auth-left {
            flex: 1 1 100%;
            display: flex;
            flex-direction: column;
            padding: clamp(24px, 6vw, 64px);
            align-items: center;
            justify-content: center;
        }

        .auth-right {
            display: none;
            flex: 1 1 50%;
            background: linear-gradient(145deg, #f1f5f9 0%, #e2e8f0 100%);
            position: relative;
            overflow: hidden;
            align-items: center;
            justify-content: center;
            padding: 48px;
        }

        @media (min-width: 850px) {
            .auth-left { flex: 0 0 50%; }
            .auth-right { display: flex; }
        }

        @media (min-width: 1100px) {
            .auth-left { flex: 0 0 40%; }
            .auth-right { flex: 1; }
        }

        .auth-form-wrapper {
            width: 100%;
            max-width: 380px;
            display: flex;
            flex-direction: column;
            z-index: 95;
        }

        .brand-logo {
            display: flex;
            align-items: center;
            margin-bottom: 40px;
        }

        .brand-logo img {
            height: 44px; /* Real HideWin logo size */
            width: auto;
            object-fit: contain;
        }

        .welcome-title {
            font-size: clamp(24px, 4vw, 32px);
            font-weight: 700;
            color: #0f172a;
            margin: 0 0 8px 0;
            letter-spacing: -0.02em;
        }

        .welcome-subtitle {
            font-size: clamp(14px, 2vw, 16px);
            color: #64748b;
            margin: 0 0 32px 0;
            font-weight: 400;
            line-height: 1.5;
        }

        .input-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-bottom: 24px;
            width: 100%;
        }

        .input-label {
            font-size: 13px;
            font-weight: 600;
            color: #334155;
        }

        .input-field {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            font-size: 15px;
            color: #0f172a;
            outline: none;
            transition: all 0.2s ease;
            background: #ffffff;
        }

        .input-field:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }
        
        .input-field::placeholder {
            color: #94a3b8;
        }

        .error-message {
            color: #ef4444;
            font-size: 13px;
            margin-top: -12px;
            margin-bottom: 16px;
            font-weight: 500;
        }

        .success-message {
            background: #f0fdf4;
            color: #166534;
            padding: 12px 16px;
            border-radius: 8px;
            border: 1px solid #bbf7d0;
            margin-bottom: 24px;
            font-size: 14px;
            font-weight: 500;
        }

        .btn-continue {
            width: 100%;
            padding: 14px;
            background: #0f172a;
            color: white;
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
        }

        .btn-continue:hover:not(:disabled) {
            background: #1e293b;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
        }

        .btn-continue:active:not(:disabled) {
            transform: translateY(1px);
            box-shadow: 0 2px 4px rgba(15, 23, 42, 0.1);
        }

        .btn-continue:disabled {
            background: #94a3b8;
            cursor: not-allowed;
            opacity: 0.7;
        }

        .divider {
            display: flex;
            align-items: center;
            text-align: center;
            margin: 32px 0;
            color: #94a3b8;
            font-size: 13px;
            font-weight: 500;
        }

        .divider::before, .divider::after {
            content: '';
            flex: 1;
            border-bottom: 1px solid #e2e8f0;
        }

        .divider:not(:empty)::before { margin-right: 16px; }
        .divider:not(:empty)::after { margin-left: 16px; }

        .sso-buttons {
            display: flex;
            flex-direction: column;
            gap: 12px;
            width: 100%;
        }

        .sso-btn {
            width: 100%;
            padding: 12px;
            background: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            color: #334155;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: all 0.2s ease;
        }

        .sso-btn:hover {
            background: #f8fafc;
            border-color: #94a3b8;
        }

        .sso-btn:active {
            background: #f1f5f9;
        }

        .sso-btn svg, .sso-btn img {
            width: 18px;
            height: 18px;
        }

        .terms-text {
            margin-top: 48px;
            font-size: 12px;
            color: #94a3b8;
            text-align: center;
        }

        .terms-text a {
            color: #64748b;
            text-decoration: underline;
            text-decoration-color: #cbd5e1;
            transition: color 0.2s;
        }

        .terms-text a:hover {
            color: #0f172a;
            text-decoration-color: #0f172a;
        }

        /* Right side aesthetic */
        .right-content {
            text-align: left;
            max-width: 480px;
            z-index: 2;
        }

        .right-title {
            font-size: clamp(28px, 4vw, 42px);
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 24px;
            line-height: 1.15;
            letter-spacing: -0.02em;
        }

        .right-subtitle {
            font-size: 18px;
            color: #475569;
            line-height: 1.6;
        }

        .right-bg-pattern {
            position: absolute;
            inset: 0;
            background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
            background-size: 24px 24px;
            opacity: 0.4;
            z-index: 1;
        }
        
        .right-bg-glow {
            position: absolute;
            top: -20%;
            right: -20%;
            width: 70%;
            height: 70%;
            background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(255, 255, 255, 0) 70%);
            border-radius: 50%;
            z-index: 1;
        }
'''

content = re.sub(r'    static styles = css`.*?`;', '    static styles = css`' + new_styles + '`;', content, flags=re.DOTALL)

# Replace EVERYTHING in render() { ... }
new_render = '''
    render() {
        return html`
            <div class="drag-region"></div>
            
            <div class="window-controls">
                <button class="control-btn" @click=${this._handleMinimize} title="Minimize">
                    <svg viewBox="0 0 10 10"><path fill="none" stroke="currentColor" stroke-width="1.5" d="M1 5h8"/></svg>
                </button>
                <button class="control-btn" @click=${this._handleMaximize} title="Maximize">
                    <svg viewBox="0 0 10 10"><path fill="none" stroke="currentColor" stroke-width="1.5" d="M1 1h8v8H1z"/></svg>
                </button>
                <button class="control-btn close" @click=${this._handleClose} title="Close">
                    <svg viewBox="0 0 10 10"><path fill="none" stroke="currentColor" stroke-width="1.5" d="M1 1l8 8m0-8L1 9"/></svg>
                </button>
            </div>

            <div class="auth-container">
                <div class="auth-left">
                    <div class="auth-form-wrapper">
                        <div class="brand-logo">
                            <!-- USE REAL LOGO ASSET WITH CORRECT PATH -->
                            <img src="./assets/logo.png" alt="HideWin" />
                        </div>
                        
                        ${this.step === 'email' ? html`
                            <h1 class="welcome-title">Sign in to HideWin</h1>
                            <p class="welcome-subtitle">Enter your email and we'll send you a secure login code.</p>
                            
                            <form @submit=${this._handleSendOtp}>
                                <div class="input-group">
                                    <label class="input-label">Email address</label>
                                    <input type="email" class="input-field" required .value=${this.email} @input=${e => this.email = e.target.value} placeholder="name@company.com" />
                                </div>
                                
                                ${this.error ? html`<div class="error-message">${this.error}</div>` : ''}
                                
                                <button type="submit" class="btn-continue" ?disabled=${this.loading}>
                                    ${this.loading ? 'Sending...' : 'Continue with Email'}
                                </button>
                            </form>

                            <div class="divider">OR</div>

                            <div class="sso-buttons">
                                <button type="button" class="sso-btn" @click=${() => this._handleSSO('Google')}>
                                    <img src="https://www.google.com/favicon.ico" alt="Google" />
                                    Continue with Google
                                </button>
                                <button type="button" class="sso-btn" @click=${() => this._handleSSO('Apple')}>
                                    <svg viewBox="0 0 384 512"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                                    Continue with Apple
                                </button>
                                <button type="button" class="sso-btn" @click=${() => this._handleSSO('SAML')}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                    Single Sign-On (SSO)
                                </button>
                            </div>
                        ` : ''}

                        ${this.step === 'otp' ? html`
                            <h1 class="welcome-title">Check your email</h1>
                            <p class="welcome-subtitle">Enter the 6-digit code sent to<br><strong>${this.email}</strong></p>
                            
                            ${this.successMsg ? html`<div class="success-message">${this.successMsg}</div>` : ''}
                            
                            <form @submit=${this._handleVerifyOtp}>
                                <div class="input-group">
                                    <label class="input-label">Secure Code</label>
                                    <input type="text" class="input-field" required .value=${this.otp} @input=${e => this.otp = e.target.value} placeholder="123456" maxlength="6" style="font-size: 24px; letter-spacing: 6px; text-align: center; font-weight: 500;" />
                                </div>
                                
                                ${this.error ? html`<div class="error-message" style="text-align: center;">${this.error}</div>` : ''}
                                
                                <button type="submit" class="btn-continue" ?disabled=${this.loading}>
                                    ${this.loading ? 'Verifying...' : 'Verify Code'}
                                </button>
                                
                                <button type="button" @click=${() => { this.step = 'email'; this.otp = ''; this.successMsg = ''; this.error = ''; }} style="background: transparent; border: none; color: #64748b; margin-top: 24px; cursor: pointer; text-decoration: underline; width: 100%; font-size: 14px; font-weight: 500;">
                                    Back to login
                                </button>
                            </form>
                        ` : ''}

                        <div class="terms-text">
                            By signing in, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                        </div>
                    </div>
                </div>

                <div class="auth-right">
                    <div class="right-bg-pattern"></div>
                    <div class="right-bg-glow"></div>
                    <div class="right-content">
                        <h2 class="right-title">Real-time meeting assistant,<br>always ready to help</h2>
                        <p class="right-subtitle">HideWin seamlessly integrates with your workflow, providing intelligent insights and secure management for all your desktop communications.</p>
                    </div>
                </div>
            </div>
        `;
    }
'''

content = re.sub(r'    render\(\) \{.*', new_render + '\n}\n\ncustomElements.define(\'auth-view\', AuthView);\n', content, flags=re.DOTALL)

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated AuthView.js CSS and Layout for 2026 responsiveness.")
