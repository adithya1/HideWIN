import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';
import { render, _startWaveformAnimation } from './AssistantViewRenderers.js';
import { assistantStyles } from './AssistantView.styles.js';

export class AssistantView extends LitElement {
    static styles = assistantStyles;


    static properties = {
        isWhatToSayEnabled: { type: Boolean, state: true },
        isFollowUpsEnabled: { type: Boolean, state: true },
        isNotesOpening: { type: Boolean, state: true },
        profileNotification: { type: String, state: true },
        formattedDuration: { type: String },
        responses: { type: Array },
        currentResponseIndex: { type: Number },
        selectedProfile: { type: String },
        selectedModeCategory: { type: String },
        profiles: { type: Array },
        onProfileChange: { type: Function },
        onModeCategoryChange: { type: Function },
        onSendText: { type: Function },
        shouldAnimateResponse: { type: Boolean },
        isAnalyzing: { type: Boolean, state: true },
        autoScroll: { type: Boolean },
        isRefreshing: { type: Boolean, state: true },
        refreshSuccess: { type: Boolean, state: true },
        actionMode: { type: String, state: true },
        isProfileMenuOpen: { type: Boolean, state: true },
        isModeMenuOpen: { type: Boolean, state: true },
        isPaused: { type: Boolean },
        isClickThrough: { type: Boolean },
        isThemeMenuOpen: { type: Boolean, state: true },
        themeSession: { type: String, state: true },
        transparencySession: { type: Number, state: true },
        fontSizeSession: { type: Number, state: true },
        statusText: { type: String }
    };

    constructor() {
        super();
        this.responses = [];
        this.currentResponseIndex = -1;
        this.selectedProfile = '';
        this.selectedModeCategory = '';
        this.profiles = [];
        this.onProfileChange = () => {};
        this.onModeCategoryChange = () => {};
        this.onSendText = () => {};
        this.isAnalyzing = false;
        this._animFrame = null;
        this.autoScroll = true;
        this.actionMode = 'Smart';
        this.isProfileMenuOpen = false;
        this.isModeMenuOpen = false;
        this.isThemeMenuOpen = false;
        this.themeSession = 'dark';
        this.transparencySession = 0.3;
        this.fontSizeSession = 14;
        this.statusText = '';
    }

    getProfileNames() {
        return {
            interview: 'Job Interview',
            sales: 'Sales Call',
            meeting: 'Business Meeting',
            presentation: 'Presentation',
            negotiation: 'Negotiation',
            exam: 'Exam Assistant',
        };
    }

    getCurrentResponse() {
        const profileNames = this.getProfileNames();
        return this.responses.length > 0 && this.currentResponseIndex >= 0
            ? this.responses[this.currentResponseIndex]
            : `Listening to your ${profileNames[this.selectedProfile] || 'session'}...`;
    }

    renderMarkdown(content) {
        if (typeof window !== 'undefined' && window.marked) {
            try {
                const renderer = new window.marked.Renderer();
                renderer.code = (code, lang, escaped) => {
                    let highlighted;
                    if (lang && window.hljs && window.hljs.getLanguage(lang)) {
                        try {
                            highlighted = window.hljs.highlight(code, { language: lang }).value;
                        } catch (e) {
                            highlighted = code;
                        }
                    } else if (window.hljs) {
                        try {
                            highlighted = window.hljs.highlightAuto(code).value;
                        } catch (e) {
                            highlighted = code;
                        }
                    } else {
                        highlighted = code;
                    }

                    const lines = highlighted.split(/\r?\n/);
                    if (lines.length > 0 && lines[lines.length - 1].trim() === '') {
                        lines.pop();
                    }

                    const lineRows = lines.map((line, idx) => {
                        return `<div class="code-line"><span class="line-number" data-num="${idx + 1}">${idx + 1}</span><span class="line-content">${line || ' '}</span></div>`;
                    }).join('');

                    return `<pre class="hljs"><code class="language-${lang || 'plaintext'}">${lineRows}</code></pre>`;
                };

                ipcRenderer.on('session-status-changed', (_, status) => {
                if (status.startTime && !this.isPaused) {
                    this.startTime = status.startTime;
                    this.requestUpdate();
                }
            });    let rendered = window.marked.parse(content);
                rendered = this.wrapWordsInSpans(rendered);
                return rendered;
            } catch (error) {
                console.warn('Error parsing markdown:', error);
                return content;
            }
        }
        return content;
    }

    wrapWordsInSpans(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const tagsToSkip = ['PRE', 'CODE', 'SCRIPT', 'STYLE'];

        function wrap(node) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() && !tagsToSkip.includes(node.parentNode.tagName)) {
                const words = node.textContent.split(/(\s+)/);
                const frag = document.createDocumentFragment();
                words.forEach(word => {
                    if (word.trim()) {
                        const span = document.createElement('span');
                        span.setAttribute('data-word', '');
                        span.textContent = word;
                        frag.appendChild(span);
                    } else {
                        frag.appendChild(document.createTextNode(word));
                    }
                });
                node.parentNode.replaceChild(frag, node);
            } else if (node.nodeType === Node.ELEMENT_NODE && !tagsToSkip.includes(node.tagName)) {
                Array.from(node.childNodes).forEach(wrap);
            }
        }
        Array.from(doc.body.childNodes).forEach(wrap);
        return doc.body.innerHTML;
    }

    navigateToPreviousResponse() {
        const cards = Array.from(this.shadowRoot.querySelectorAll('.qa-card'));
        if (cards.length === 0) return;
        if (this.currentResponseIndex > 0) {
            this.currentResponseIndex--;
        } else {
            this.currentResponseIndex = 0;
        }
        const target = cards[this.currentResponseIndex];
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        this.dispatchEvent(new CustomEvent('response-index-changed', { detail: { index: this.currentResponseIndex } }));
        this.requestUpdate();
    }

    navigateToNextResponse() {
        const cards = Array.from(this.shadowRoot.querySelectorAll('.qa-card'));
        if (cards.length === 0) return;
        if (this.currentResponseIndex < cards.length - 1) {
            this.currentResponseIndex++;
        } else {
            this.currentResponseIndex = cards.length - 1;
        }
        const target = cards[this.currentResponseIndex];
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        this.dispatchEvent(new CustomEvent('response-index-changed', { detail: { index: this.currentResponseIndex } }));
        this.requestUpdate();
    }

    scrollResponseUp() {
        const container = this.shadowRoot.querySelector('.response-container');
        if (container) {
            const scrollAmount = container.clientHeight * 0.3;
            container.scrollTop = Math.max(0, container.scrollTop - scrollAmount);
        }
    }

    scrollResponseDown() {
        const container = this.shadowRoot.querySelector('.response-container');
        if (container) {
            const scrollAmount = container.clientHeight * 0.3;
            container.scrollTop = Math.min(container.scrollHeight - container.clientHeight, container.scrollTop + scrollAmount);
        }
    }

    scrollResponseLeft() {
        // Scroll focused pre/code block horizontally, or the whole container if none focused
        const container = this.shadowRoot.querySelector('.response-container');
        if (!container) return;
        const focused = container.querySelector('pre:hover') || container.querySelector('pre');
        const target = focused || container;
        target.scrollLeft = Math.max(0, target.scrollLeft - 200);
    }

    scrollResponseRight() {
        const container = this.shadowRoot.querySelector('.response-container');
        if (!container) return;
        const focused = container.querySelector('pre:hover') || container.querySelector('pre');
        const target = focused || container;
        target.scrollLeft = Math.min(target.scrollWidth - target.clientWidth, target.scrollLeft + 200);
    }

    connectedCallback() {
        super.connectedCallback();
        
        this._closeMenus = (e) => {
            // Don't close if clicking inside the theme menu
            if (e && e.target && e.target.closest && e.target.closest('.theme-settings-menu')) return;
            this.isProfileMenuOpen = false;
            this.isModeMenuOpen = false;
            this.isThemeMenuOpen = false;
        };
        window.addEventListener('click', this._closeMenus);
        
        this._loadSessionPreferences();

        if (window.require) {
            const { ipcRenderer } = window.require('electron');

            this.handlePreviousResponse = () => this.navigateToPreviousResponse();
            this.handleNextResponse = () => this.navigateToNextResponse();
            this.handleScrollUp = () => this.scrollResponseUp();
            this.handleScrollDown = () => this.scrollResponseDown();
            this.handleScrollLeft = () => this.scrollResponseLeft();
            this.handleScrollRight = () => this.scrollResponseRight();

            ipcRenderer.on('navigate-previous-response', this.handlePreviousResponse);
            ipcRenderer.on('navigate-next-response', this.handleNextResponse);
            ipcRenderer.on('scroll-response-up', this.handleScrollUp);
            ipcRenderer.on('scroll-response-down', this.handleScrollDown);
            ipcRenderer.on('scroll-response-left', this.handleScrollLeft);
            ipcRenderer.on('scroll-response-right', this.handleScrollRight);
        }
    }

    async _loadSessionPreferences() {
        if (!window.hideWin || !window.hideWin.storage) return;
        const prefs = await window.hideWin.storage.getPreferences();
        this.themeSession = prefs.themeSession || 'dark';
        this.transparencySession = prefs.transparencySession !== undefined ? prefs.transparencySession : 0.3;
        this.fontSizeSession = prefs.fontSizeSession || 14;
    }

    async _handleThemeSessionChange(e) {
        this.themeSession = e.target.value;
        if (window.hideWin && window.hideWin.storage) {
            await window.hideWin.storage.updatePreference('themeSession', this.themeSession);
            if (window.hideWin.theme) await window.hideWin.theme.load();
        }
    }

    async _handleTransparencySessionChange(e) {
        this.transparencySession = parseFloat(e.target.value);
        if (window.hideWin && window.hideWin.storage) {
            await window.hideWin.storage.updatePreference('transparencySession', this.transparencySession);
            if (window.hideWin.theme) await window.hideWin.theme.load();
        }
    }

    async _handleFontSizeSessionChange(e) {
        this.fontSizeSession = parseInt(e.target.value, 10);
        if (window.hideWin && window.hideWin.storage) {
            await window.hideWin.storage.updatePreference('fontSizeSession', this.fontSizeSession);
            if (window.hideWin.theme) await window.hideWin.theme.load();
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._stopWaveformAnimation();
        
        window.removeEventListener('click', this._closeMenus);

        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            if (this.handlePreviousResponse) ipcRenderer.removeListener('navigate-previous-response', this.handlePreviousResponse);
            if (this.handleNextResponse) ipcRenderer.removeListener('navigate-next-response', this.handleNextResponse);
            if (this.handleScrollUp) ipcRenderer.removeListener('scroll-response-up', this.handleScrollUp);
            if (this.handleScrollDown) ipcRenderer.removeListener('scroll-response-down', this.handleScrollDown);
            if (this.handleScrollLeft) ipcRenderer.removeListener('scroll-response-left', this.handleScrollLeft);
            if (this.handleScrollRight) ipcRenderer.removeListener('scroll-response-right', this.handleScrollRight);
        }
    }

    async handleSendText() {
        const textInput = this.shadowRoot.querySelector('#textInput');
        if (textInput) {
            const trimmed = textInput.value.trim();
            if (!trimmed) {
                return this.handleScreenAnswer();
            }
            let message = trimmed;
            const promptType = this.actionMode || 'Smart';
            if (promptType !== 'Smart') {
                message = `[Action Mode: ${promptType}] ` + message;
            }
            textInput.value = '';
            
            // Release the mode after use
            this.actionMode = 'Smart';
            
            await this.onSendText(message);
        }
    }

    handleTextKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleSendText();
        }
    }

    async handleScreenAnswer() {
        if (this.isAnalyzing) return;
        if (window.captureManualScreenshot) {
            this.isAnalyzing = true;
            this._responseCountWhenStarted = this.responses.length;
            
            let finalPrompt = "You are an expert human assistant. Help fully assess the screen to generate the answer. Provide the program architecture and best plan to implement. Use 100% human written format and terminology, variable assign everywhere, 100% human tone. No BS.";
            
            if (this.isWhatToSayEnabled) {
                finalPrompt += " Based on this screen, also explain what I should say next, explaining it naturally like a real person.";
            }
            if (this.isFollowUpsEnabled) {
                finalPrompt += " Also suggest logical follow-up questions or conversational continuations.";
            }
            
            this.actionMode = 'Smart';
            window.captureManualScreenshot(null, finalPrompt);
            
            // Optionally auto-reset toggles after use:
            // this.isWhatToSayEnabled = false;
            // this.isFollowUpsEnabled = false;
        }
    }

    async handleWhatToSay() {
        this.isWhatToSayEnabled = !this.isWhatToSayEnabled;
        this.requestUpdate();
    }

    async handleFollowUps() {
        this.isFollowUpsEnabled = !this.isFollowUpsEnabled;
        this.requestUpdate();
    }

    async handleNotesAction() {
        if (this.isNotesOpening) return;
        this.isNotesOpening = true;
        this.requestUpdate();

        // Dispatch to app level logic
        this.dispatchEvent(new CustomEvent('open-notes', { bubbles: true, composed: true }));

        // Wait a short duration to show the "active" state
        setTimeout(() => {
            this.isNotesOpening = false;
            this.requestUpdate();
        }, 300);
    }

    async handleRefreshAction() {
        if (this.isRefreshing) return;
        this.isRefreshing = true;
        this.isAnalyzing = false;
        this.requestUpdate();

        // Dispatch to app level logic
        this.dispatchEvent(new CustomEvent('refresh-app', { bubbles: true, composed: true }));

        // Wait a short duration to show the "refreshing" state
        setTimeout(() => {
            this.isRefreshing = false;
            this.refreshSuccess = true;
            this.requestUpdate();

            // Revert back to normal after "Done!"
            setTimeout(() => {
                this.refreshSuccess = false;
                this.requestUpdate();
            }, 1500);
        }, 800);
    }

    _startWaveformAnimation() {
        return _startWaveformAnimation.call(this);
    }

    _stopWaveformAnimation() {
        if (this._animFrame) {
            cancelAnimationFrame(this._animFrame);
            this._animFrame = null;
        }
        const canvas = this.shadowRoot.querySelector('.analyze-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    scrollToBottom() {
        setTimeout(() => {
            const container = this.shadowRoot.querySelector('.response-container');
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }, 0);
    }

    toggleAutoScroll() {
        this.autoScroll = !this.autoScroll;
        this.dispatchEvent(new CustomEvent('auto-scroll-changed', {
            detail: { autoScroll: this.autoScroll },
            bubbles: true,
            composed: true
        }));
        if (this.autoScroll) {
            this.scrollToBottom();
        }
    }

    firstUpdated() {
        super.firstUpdated();
        this.updateResponseContent();
    }

    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('responses') || changedProperties.has('currentResponseIndex')) {
            this.updateResponseContent();
        }

        if (changedProperties.has('isAnalyzing')) {
            if (this.isAnalyzing) {
                this._startWaveformAnimation();
            } else {
                this._stopWaveformAnimation();
            }
        }

        if (changedProperties.has('responses') && this.isAnalyzing) {
            if (this.responses.length > this._responseCountWhenStarted) {
                this.isAnalyzing = false;
            }
        }
    }

    updateResponseContent() {
        const container = this.shadowRoot.querySelector('#responseContainer');
        if (container) {
            if (this.responses.length === 0) {
                container.innerHTML = `<div style="display: flex; height: 100%; align-items: center; justify-content: center; color: var(--text-muted); font-size: 13px;">Waiting for audio...</div>`;
            } else {
                const cardsHtml = this.responses.map((item, idx) => {
                    const isObj = typeof item === 'object' && item !== null;
                    let rawQuestion = isObj ? (item.question || item.prompt || item.transcription || '') : '';
                    const questionText = rawQuestion ? rawQuestion.replace(/^\[(Interviewer|Candidate)\]:\s*/gi, '').trim() : `Question #${idx + 1}`;
                    const answer = isObj ? (item.answer || item.response || item.content || '') : String(item);
                    const renderedAnswer = this.renderMarkdown(answer);
                    let htmlContent = '';
                    if (questionText) {
                        htmlContent += `
                            <div class="chat-row-user">
                                <div class="chat-bubble-user">${questionText}</div>
                            </div>
                        `;
                    }
                    if (renderedAnswer) {
                        // Very simple escape for clipboard
                        const escapeHtml = (str) => str.replace(/`/g, '\\`').replace(/\$/g, '\\$');
                        htmlContent += `
                            <div class="chat-row-ai">
                                <div class="chat-text-ai">${renderedAnswer}</div>
                                <button class="chat-copy-btn" title="Copy to clipboard" onclick="navigator.clipboard.writeText(\`${escapeHtml(answer)}\`)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                </button>
                            </div>
                        `;
                    }

                    return htmlContent;
                }).join('');

                container.innerHTML = `<div class="qa-stream">${cardsHtml}</div>`;
            }

            if (this.shouldAnimateResponse) {
                this.dispatchEvent(new CustomEvent('response-animation-complete', { bubbles: true, composed: true }));
            }
            if (this.autoScroll) {
                this.scrollToBottom();
            }
        }
    }

    render() {
        return render.call(this);
    }

}
customElements.define('assistant-view', AssistantView);

