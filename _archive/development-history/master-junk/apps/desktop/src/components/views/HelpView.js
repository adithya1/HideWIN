import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';
import { unifiedPageStyles } from './sharedPageStyles.js';

export class HelpView extends LitElement {
    static styles = [
        unifiedPageStyles,
        css`
            .accordion-item {
                border: 1px solid var(--border);
                border-radius: var(--radius-sm);
                margin-bottom: 8px;
                background: var(--bg-surface);
                overflow: hidden;
                transition: border-color 0.2s, box-shadow 0.2s;
            }

            .accordion-item:hover {
                border-color: var(--border-hover);
            }

            .accordion-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
                cursor: pointer;
                background: transparent;
                border: none;
                width: 100%;
                text-align: left;
            }

            .accordion-header:hover {
                background: var(--bg-hover);
            }

            .accordion-label {
                color: var(--text-primary);
                font-size: var(--font-size-sm);
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .accordion-right {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .accordion-icon {
                color: var(--text-muted);
                font-size: 18px;
                font-weight: 300;
                line-height: 1;
                width: 16px;
                text-align: center;
                transition: transform 0.2s, color 0.2s;
            }

            .accordion-header:hover .accordion-icon {
                color: var(--text-primary);
            }

            .accordion-content {
                padding: 0 16px;
                max-height: 0;
                opacity: 0;
                overflow: hidden;
                transition: max-height 0.3s ease, padding 0.3s ease, opacity 0.3s ease;
                color: var(--text-secondary);
                font-size: var(--font-size-sm);
                line-height: 1.5;
            }

            .accordion-item.open .accordion-content {
                max-height: 200px;
                padding: 0 16px 16px 16px;
                opacity: 1;
            }

            .accordion-item.open .accordion-icon {
                color: var(--accent);
            }

            .shortcut-keys {
                display: inline-flex;
                gap: 4px;
                flex-wrap: wrap;
                justify-content: flex-end;
            }

            .key {
                border: 1px solid var(--border);
                border-radius: var(--radius-sm);
                padding: 2px 6px;
                font-size: var(--font-size-xs);
                color: var(--text-primary);
                background: var(--bg-surface);
                font-family: var(--font-mono);
                font-weight: 600;
            }

            .link-row {
                display: flex;
                flex-wrap: wrap;
                gap: var(--space-sm);
            }

            .link-button {
                border: 1px solid var(--border);
                border-radius: var(--radius-sm);
                padding: 8px 14px;
                background: var(--bg-elevated);
                color: var(--text-primary);
                font-size: var(--font-size-sm);
                font-weight: 600;
                cursor: default;
                transition: all var(--transition);
            }

            .link-button:hover {
                color: var(--text-primary);
                border-color: var(--accent);
                background: rgba(99, 102, 241, 0.15);
                transform: translateY(-1px);
            }

            @media (max-width: 820px) {
                .shortcut-grid {
                    grid-template-columns: 1fr;
                }
            }
        `
    ];

    static properties = {
        onExternalLinkClick: { type: Function },
        keybinds: { type: Object },
        _expandedItem: { type: Number }
    };

    constructor() {
        super();
        this.onExternalLinkClick = () => {};
        this.keybinds = this.getDefaultKeybinds();
        this._expandedItem = -1;
        this._loadKeybinds();
    }

    async _loadKeybinds() {
        try {
            const keybinds = await hideWin.storage.getKeybinds();
            if (keybinds) {
                this.keybinds = { ...this.getDefaultKeybinds(), ...keybinds };
                this.requestUpdate();
            }
        } catch (error) {
            console.error('Error loading keybinds:', error);
        }
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
            emergencyErase: 'Ctrl+Shift+E',
        };
    }

    _formatKeybind(keybind) {
        if (!keybind) return '';
        return keybind.split('+').map(key => html`<span class="key">${key}</span>`);
    }

    _open(url) {
        this.onExternalLinkClick(url);
    }

    render() {
        return html`
            <div class="unified-page">
                <div class="unified-wrap">
                    <div class="page-title">Help & Reference</div>

                    <section class="surface">
                        <div class="surface-title">Support & Documentation</div>
                        <div class="link-row">
                            <button class="link-button" @click=${() => this._open('https://hidewin.com')}>🌐 Website</button>
                            <button class="link-button" @click=${() => this._open('https://github.com/sohzm/hide-win')}>⭐ GitHub Repository</button>
                            <button class="link-button" @click=${() => this._open('https://discord.gg/GCBdubnXfJ')}>💬 Discord Community</button>
                        </div>
                    </section>
                </div>
            </div>
        `;
    }
}

customElements.define('help-view', HelpView);
