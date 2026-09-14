import re

fpath = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\AuthView.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

new_render = '''
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
                        
                        ${this.step === 'email' ? html`
                            <h1 class="welcome-title" style="margin-bottom: 8px;">Sign in to HideWin</h1>
                            <p class="welcome-subtitle" style="margin-bottom: 32px; font-size: 16px;">Enter your email and we will send you a login code</p>
                            
                            <form @submit="${this._handleSendOtp}" style="width: 100%; display: flex; flex-direction: column; align-items: center;">
                                <div class="input-group">
                                    <label class="input-label">Email address</label>
                                    <input type="email" class="input-field" required .value="${this.email}" @input="${e => this.email = e.target.value}" placeholder="name@company.com" />
                                </div>
                                
                                ${this.error ? html`<p class="error-message">${this.error}</p>` : ''}
                                
                                <button type="submit" class="btn-continue" ?disabled="${this.loading}" style="margin-top: 8px;">
                                    ${this.loading ? 'Sending...' : 'Continue with Email'}
                                </button>
                            </form>

                            <div style="margin: 32px 0; text-align: center; position: relative; width: 100%; max-width: 320px;">
                                <hr style="border: none; border-top: 1px solid #e2e8f0;" />
                                <span style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #ffffff; padding: 0 16px; color: #94a3b8; font-size: 14px;">
                                    OR
                                </span>
                            </div>

                            <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
                                <button type="button" class="sso-btn" @click="${() => this._handleSSO('Google')}">
                                    <img src="https://www.google.com/favicon.ico" alt="Google" style="width: 16px; height: 16px;" />
                                    Continue with Google
                                </button>
                                <button type="button" class="sso-btn" @click="${() => this._handleSSO('Apple')}">
                                    <svg viewBox="0 0 384 512" style="width: 16px; height: 16px;"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                                    Continue with Apple
                                </button>
                                <button type="button" class="sso-btn" @click="${() => this._handleSSO('SAML')}">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                    Single Sign-On (SSO)
                                </button>
                            </div>
                        ` : ''}

                        ${this.step === 'otp' ? html`
                            <h1 class="welcome-title" style="margin-bottom: 8px;">Check your email</h1>
                            <p class="welcome-subtitle" style="margin-bottom: 32px; font-size: 16px;">Enter the code sent to ${this.email}</p>
                            
                            ${this.successMsg ? html`<div class="success-message">${this.successMsg}</div>` : ''}
                            
                            <form @submit="${this._handleVerifyOtp}" style="width: 100%; display: flex; flex-direction: column; align-items: center;">
                                <div class="input-group">
                                    <label class="input-label">6-digit Code</label>
                                    <input type="text" class="input-field" required .value="${this.otp}" @input="${e => this.otp = e.target.value}" placeholder="123456" maxlength="6" style="font-size: 24px; letter-spacing: 4px; text-align: center;" />
                                </div>
                                
                                ${this.error ? html`<p class="error-message" style="text-align: center;">${this.error}</p>` : ''}
                                
                                <button type="submit" class="btn-continue" ?disabled="${this.loading}" style="margin-top: 8px;">
                                    ${this.loading ? 'Verifying...' : 'Verify Code'}
                                </button>
                                
                                <button type="button" @click="${() => { this.step = 'email'; this.otp = ''; this.successMsg = ''; }}" style="background: none; border: none; color: #64748b; margin-top: 24px; cursor: pointer; text-decoration: underline;">
                                    Back to login
                                </button>
                            </form>
                        ` : ''}

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
'''

content = re.sub(
    r'    render\(\) \{.*',
    new_render + '\n}\n\ncustomElements.define(\'auth-view\', AuthView);\n',
    content,
    flags=re.DOTALL
)

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated AuthView.js render method successfully.")
