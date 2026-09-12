import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';

export class BrowseView extends LitElement {
    static properties = {
        tabs: { type: Array },
        activeTabId: { type: String },
        addressInputValue: { type: String }
    };

    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            height: 100%;
            background: #ffffff;
            color: #333333;
            font-family: system-ui, -apple-system, sans-serif;
            overflow: hidden;
        }

        .browser-toolbar {
            display: flex;
            align-items: center;
            background: #f1f3f4;
            padding: 8px 16px;
            gap: 12px;
            border-bottom: 1px solid #dadce0;
        }

        .nav-btn {
            background: transparent;
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #5f6368;
            transition: background 0.2s;
        }

        .nav-btn:hover {
            background: #e8eaed;
        }

        .nav-btn:active {
            background: #dadce0;
        }

        .address-bar-wrapper {
            flex: 1;
            display: flex;
            align-items: center;
            background: #ffffff;
            border: 1px solid transparent;
            border-radius: 24px;
            padding: 0 16px;
            height: 36px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .address-bar-wrapper:focus-within {
            border-color: #4285f4;
            box-shadow: 0 1px 4px rgba(66, 133, 244, 0.3);
        }

        .address-input {
            flex: 1;
            border: none;
            outline: none;
            background: transparent;
            font-size: 14px;
            color: #202124;
            padding: 0 8px;
        }

        .tabs-bar {
            display: flex;
            align-items: flex-end;
            background: #dee1e6;
            padding: 8px 8px 0 8px;
            gap: 4px;
            overflow-x: auto;
        }

        .tab {
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-width: 120px;
            max-width: 240px;
            height: 34px;
            background: transparent;
            border-radius: 8px 8px 0 0;
            padding: 0 12px;
            cursor: pointer;
            position: relative;
            font-size: 13px;
            color: #5f6368;
            transition: background 0.2s;
        }

        .tab:hover {
            background: rgba(255,255,255,0.4);
        }

        .tab.active {
            background: #ffffff;
            color: #3c4043;
        }

        .tab.active::before, .tab.active::after {
            content: '';
            position: absolute;
            bottom: 0;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            pointer-events: none;
        }

        .tab.active::before {
            left: -16px;
            box-shadow: 8px 8px 0 0 #ffffff;
        }

        .tab.active::after {
            right: -16px;
            box-shadow: -8px 8px 0 0 #ffffff;
        }

        .tab-title {
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            user-select: none;
        }

        .close-tab-btn {
            background: transparent;
            border: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #5f6368;
            opacity: 0;
            margin-left: 8px;
        }

        .tab:hover .close-tab-btn, .tab.active .close-tab-btn {
            opacity: 1;
        }

        .close-tab-btn:hover {
            background: #e8eaed;
        }

        .new-tab-btn {
            background: transparent;
            border: none;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #5f6368;
            margin-bottom: 3px;
        }

        .new-tab-btn:hover {
            background: #d4d7db;
        }

        .webviews-container {
            flex: 1;
            position: relative;
            background: #ffffff;
        }

        webview {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
        }

        webview.hidden {
            display: none;
        }
    `;

    constructor() {
        super();
        this.tabs = [];
        this.activeTabId = null;
        this.addressInputValue = '';
    }

    firstUpdated() {
        this.addTab('https://www.google.com');
    }

    addTab(url = 'https://www.google.com') {
        const id = 'tab_' + Math.random().toString(36).substr(2, 9);
        this.tabs = [...this.tabs, { id, url, title: 'New Tab', isLoading: false }];
        this.activeTabId = id;
        this.addressInputValue = url;
    }

    closeTab(e, id) {
        e.stopPropagation();
        const idx = this.tabs.findIndex(t => t.id === id);
        this.tabs = this.tabs.filter(t => t.id !== id);
        if (this.activeTabId === id) {
            if (this.tabs.length > 0) {
                const newActive = this.tabs[Math.max(0, idx - 1)];
                this.activeTabId = newActive.id;
                this.addressInputValue = newActive.url;
            } else {
                this.addTab(); // open a new one if all closed
            }
        }
    }

    switchTab(id) {
        this.activeTabId = id;
        const activeTab = this.tabs.find(t => t.id === id);
        if (activeTab) {
            this.addressInputValue = activeTab.url;
        }
    }

    handleAddressKeydown(e) {
        if (e.key === 'Enter') {
            let val = this.addressInputValue.trim();
            if (!val.startsWith('http://') && !val.startsWith('https://')) {
                if (val.includes('.') && !val.includes(' ')) {
                    val = 'https://' + val;
                } else {
                    val = 'https://www.google.com/search?q=' + encodeURIComponent(val);
                }
            }
            const activeTab = this.tabs.find(t => t.id === this.activeTabId);
            if (activeTab) {
                activeTab.url = val;
                this.tabs = [...this.tabs]; // trigger update
                this.addressInputValue = val;
                
                // Navigate webview manually if it exists
                setTimeout(() => {
                    const wv = this.shadowRoot.getElementById('wv-' + this.activeTabId);
                    if (wv) wv.loadURL(val);
                }, 0);
            }
        }
    }

    handleWebviewEvent(id, eventName, e) {
        const tab = this.tabs.find(t => t.id === id);
        if (!tab) return;
        
        const wv = e.target;
        
        if (eventName === 'did-start-loading') {
            tab.isLoading = true;
        } else if (eventName === 'did-stop-loading') {
            tab.isLoading = false;
        } else if (eventName === 'page-title-updated') {
            tab.title = e.title;
        } else if (eventName === 'will-navigate' || eventName === 'did-navigate' || eventName === 'did-navigate-in-page') {
            tab.url = e.url;
            if (this.activeTabId === id) {
                this.addressInputValue = e.url;
            }
        }
        this.tabs = [...this.tabs]; // trigger update
    }

    navigateWebview(action) {
        const wv = this.shadowRoot.getElementById('wv-' + this.activeTabId);
        if (wv) {
            if (action === 'back' && wv.canGoBack()) wv.goBack();
            if (action === 'forward' && wv.canGoForward()) wv.goForward();
            if (action === 'reload') wv.reload();
        }
    }

    render() {
        return html`
            <div class="tabs-bar">
                ${this.tabs.map(tab => html`
                    <div class="tab ${this.activeTabId === tab.id ? 'active' : ''}" @click=${() => this.switchTab(tab.id)}>
                        <span class="tab-title">${tab.title}</span>
                        <button class="close-tab-btn" @click=${(e) => this.closeTab(e, tab.id)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                `)}
                <button class="new-tab-btn" @click=${() => this.addTab()}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
            </div>

            <div class="browser-toolbar">
                <button class="nav-btn" @click=${() => this.navigateWebview('back')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <button class="nav-btn" @click=${() => this.navigateWebview('forward')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
                <button class="nav-btn" @click=${() => this.navigateWebview('reload')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                </button>
                
                <div class="address-bar-wrapper">
                    <input type="text" class="address-input" 
                        .value=${this.addressInputValue}
                        @input=${e => this.addressInputValue = e.target.value}
                        @keydown=${e => this.handleAddressKeydown(e)}
                    />
                </div>
            </div>

            <div class="webviews-container">
                ${this.tabs.map(tab => html`
                    <webview 
                        id="wv-${tab.id}"
                        class="${this.activeTabId === tab.id ? '' : 'hidden'}"
                        src="${tab.url}"
                        allowpopups
                        @new-window=${e => { e.preventDefault(); this.addTab(e.url); }}
                        @did-start-loading=${e => this.handleWebviewEvent(tab.id, 'did-start-loading', e)}
                        @did-stop-loading=${e => this.handleWebviewEvent(tab.id, 'did-stop-loading', e)}
                        @page-title-updated=${e => this.handleWebviewEvent(tab.id, 'page-title-updated', e)}
                        @will-navigate=${e => this.handleWebviewEvent(tab.id, 'will-navigate', e)}
                        @did-navigate=${e => this.handleWebviewEvent(tab.id, 'did-navigate', e)}
                                                @did-navigate-in-page=${e => this.handleWebviewEvent(tab.id, 'did-navigate-in-page', e)}
                        @did-fail-load=${e => this.handleWebviewEvent(tab.id, 'did-fail-load', e)}
                    ></webview>
                `)}
            </div>
        `;
    }
}

customElements.define('browse-view', BrowseView);
