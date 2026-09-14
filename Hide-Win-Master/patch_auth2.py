import re

fpath = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\AuthView.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

methods_code = '''
    async _handleSendOtp(e) {
        if (e) e.preventDefault();
        this.loading = true;
        this.error = '';
        
        try {
            const response = await fetch('http://localhost:8000/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: this.email })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to send OTP');
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
            const response = await fetch('http://localhost:8000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: this.email, password: this.otp })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Invalid code. Please try again.');
            }
            
            const data = await response.json();
            const token = data.token;
            
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

    _handleSSO(provider) {
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.invoke('open-external', http://localhost:8000/auth/sso//login);
        } else {
            window.location.href = http://localhost:8000/auth/sso//login;
        }
    }
'''

# Find the end of _handleClose() and insert the new methods
content = re.sub(
    r'(    _handleClose\(\) \{.*?\n    \})',
    r'\1\n' + methods_code,
    content,
    flags=re.DOTALL
)

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated AuthView.js methods.")
