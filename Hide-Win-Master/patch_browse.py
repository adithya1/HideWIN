import re
path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\BrowseView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add a did-fail-load event listener to the webview template
replacement = """                        @did-navigate-in-page=${e => this.handleWebviewEvent(tab.id, 'did-navigate-in-page', e)}
                        @did-fail-load=${e => this.handleWebviewEvent(tab.id, 'did-fail-load', e)}
                    ></webview>"""
content = content.replace("@did-navigate-in-page=${e => this.handleWebviewEvent(tab.id, 'did-navigate-in-page', e)}\n                    ></webview>", replacement)

# Add logic for did-fail-load in handleWebviewEvent
logic = """        } else if (eventName === 'did-navigate-in-page') {
            tab.url = e.url;
            if (this.activeTabId === id) this.addressInputValue = tab.url;
        } else if (eventName === 'did-fail-load') {
            console.error(`Webview failed to load ${e.validatedURL} with error code ${e.errorCode}: ${e.errorDescription}`);
            if (e.errorCode === -3 || e.errorCode === -2) {
                // If it's ERR_ABORTED or ERR_FAILED, usually due to security policies like X-Frame-Options blocking webviews.
                if (e.validatedURL.includes('google.com')) {
                    console.log('Google blocked the webview. Redirecting to duckduckgo as fallback.');
                    setTimeout(() => {
                        const wv = this.shadowRoot.getElementById('wv-' + id);
                        if (wv) wv.loadURL('https://duckduckgo.com/?q=' + encodeURIComponent(e.validatedURL.split('q=')[1] || ''));
                    }, 500);
                }
            }
        }
        this.tabs = [...this.tabs]; // trigger update"""

content = re.sub(r"\} else if \(eventName === 'did-navigate-in-page'\) \{.*?\n\s*\}\n\s*this\.tabs = \[\.\.\.this\.tabs\]; // trigger update", logic, content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
