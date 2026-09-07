import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';

export class AssistantView extends LitElement {
    static styles = css`
            * { box-sizing: border-box; }

        :host {
            height: 100%;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            position: relative;
        }

        * {
            font-family: var(--font);
            cursor: default;
        }

        /* Stealth mode: force arrow cursor everywhere when active */
        :host-context(body.stealth-cursor) *,
        :host-context(body.stealth-cursor) *::before,
        :host-context(body.stealth-cursor) *::after {
            cursor: default !important;
        }

        /* Click-through mode: disable all pointer events in AssistantView so OS cursors pass through */
        :host-context(.click-through-active),
        :host-context(.click-through-active) *,
        :host-context(body.click-through-active) *,
        :host-context(body.click-through-active) {
            pointer-events: none !important;
        }

        /* ── Response area ── */

        /* ── Response area & Q&A Stream ── */

        .response-container {
            flex: 1;
            overflow-y: auto;
            font-size: var(--response-font-size, 15px);
            line-height: var(--line-height);
            background: transparent;
            padding: 24px 20px;
            scroll-behavior: smooth;
            user-select: text;
            cursor: text;
            color: var(--text-primary);
        }

        .qa-stream {
            display: flex;
            flex-direction: column;
            gap: 24px;
            padding-bottom: 20px;
        }

        /* ── Chat Bubbles ── */
        .chat-row-user {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 12px;
        }

        .chat-bubble-user {
            background: rgba(28, 58, 102, 0.8);
            color: #e0f2fe;
            padding: 12px 18px;
            border-radius: 20px;
            border-bottom-right-radius: 4px;
            max-width: 80%;
            font-size: 14px;
            line-height: 1.5;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .chat-row-ai {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 24px;
        }

        .chat-text-ai {
            color: var(--text-primary, #ffffff);
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 8px;
        }

        .chat-copy-btn {
            background: transparent;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: color 0.2s, background 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .chat-copy-btn:hover {
            color: var(--text-primary);
            background: rgba(255, 255, 255, 0.05);
        }

        .response-container * {
            user-select: text;
            cursor: text;
        }

        .response-container a {
            cursor: default;
        }

        .response-container [data-word] {
            display: inline-block;
        }

        /* ── Markdown ── */

        .response-container h1,
        .response-container h2,
        .response-container h3,
        .response-container h4,
        .response-container h5,
        .response-container h6 {
            margin: 0.6em 0 0.3em 0;
            color: var(--text-primary);
            font-weight: var(--font-weight-semibold);
        }

        .response-container h1 { font-size: 1.5em; }
        .response-container h2 { font-size: 1.3em; }
        .response-container h3 { font-size: 1.15em; }
        .response-container h4 { font-size: 1.05em; }
        .response-container h5,
        .response-container h6 { font-size: 1em; }

        .response-container p {
            margin: 0.4em 0;
            color: var(--text-primary);
        }

        .response-container ul,
        .response-container ol {
            margin: 0.4em 0;
            padding-left: 1.2em;
            color: var(--text-primary);
        }

        .response-container li {
            margin: 0.15em 0;
        }

        .response-container blockquote {
            margin: 0.5em 0;
            padding: 0.4em 0.8em;
            border-left: 2px solid var(--border-strong);
            background: var(--bg-surface);
            border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
        }

        .response-container code {
            background: var(--bg-elevated);
            padding: 0.15em 0.4em;
            border-radius: var(--radius-sm);
            font-family: var(--font-mono);
            font-size: 0.85em;
        }

        .response-container pre {
            background: #0d1117 !important;
            border: 1px solid #30363d;
            border-radius: var(--radius-md);
            padding: var(--space-xs) 0;
            overflow: visible;
            margin: 0.5em 0;
        }

        .response-container pre code {
            background: none;
            padding: 0;
            font-size: 1.05em;
            font-family: var(--font-mono);
            display: block;
        }

        /* ── Code Blocks and Line Numbers ── */
        .code-line {
            display: flex;
            align-items: stretch;
            line-height: 1.5;
            white-space: pre;
            min-height: 1.5em;
        }

        .line-number {
            display: inline-block;
            width: 3rem;
            min-width: 3rem;
            text-align: right;
            padding-right: 0.8rem;
            margin-right: 0.8rem;
            border-right: 1px solid #30363d;
            color: #8b949e;
            user-select: none;
            -webkit-user-select: none;
        }

        .line-content {
            flex: 1;
            white-space: pre;
            color: #ffffff;
            padding-right: var(--space-md);
        }

        /* Override comment color for highlight.js */
        .hljs-comment,
        .hljs-quote,
        .hljs-comment * {
            color: #6A9955 !important;
            font-style: italic !important;
        }

        /* Highlight.js Styles (GitHub Dark Theme adapted) */
        .hljs {
            color: #ffffff !important;
            background: #0d1117 !important;
        }

        .hljs-doctag,
        .hljs-keyword,
        .hljs-meta .hljs-keyword,
        .hljs-template-tag,
        .hljs-template-variable,
        .hljs-type,
        .hljs-variable.language_ {
            color: #ff7b72;
        }

        .hljs-title,
        .hljs-title.class_,
        .hljs-title.class_.inherited__,
        .hljs-title.function_ {
            color: #d2a8ff;
        }

        .hljs-attr,
        .hljs-attribute,
        .hljs-literal,
        .hljs-meta,
        .hljs-number,
        .hljs-operator,
        .hljs-selector-attr,
        .hljs-selector-class,
        .hljs-selector-id,
        .hljs-variable {
            color: #79c0ff;
        }

        .hljs-meta .hljs-string,
        .hljs-regexp,
        .hljs-string {
            color: #a5d6ff;
        }

        .hljs-built_in,
        .hljs-symbol {
            color: #ffa657;
        }

        .hljs-code,
        .hljs-formula {
            color: #8b949e;
        }

        .hljs-name,
        .hljs-selector-pseudo,
        .hljs-selector-tag {
            color: #7ee787;
        }

        .hljs-subst {
            color: #c9d1d9;
        }

        .hljs-section {
            color: #1f6feb;
            font-weight: 700;
        }

        .hljs-bullet {
            color: #f2cc60;
        }

        .hljs-emphasis {
            color: #c9d1d9;
            font-style: italic;
        }

        .hljs-strong {
            color: #c9d1d9;
            font-weight: 700;
        }

        .hljs-addition {
            color: #aff5b4;
            background-color: #033a16;
        }

        .hljs-deletion {
            color: #ffdcd7;
            background-color: #67060c;
        }

        .response-container a {
            color: var(--accent);
            text-decoration: underline;
            text-underline-offset: 2px;
        }

        .response-container strong,
        .response-container b {
            font-weight: var(--font-weight-semibold);
        }

        .response-container hr {
            border: none;
            border-top: 1px solid var(--border);
            margin: 1.5em 0;
        }

        .response-container table {
            border-collapse: collapse;
            width: 100%;
            margin: 0.8em 0;
        }

        .response-container th,
        .response-container td {
            border: 1px solid var(--border);
            padding: var(--space-sm);
            text-align: left;
        }

        .response-container th {
            background: var(--bg-surface);
            font-weight: var(--font-weight-semibold);
        }

        .response-container

        .response-container

        .response-container

        .response-container

        /* 🎨 Bottom input bar & Chips 🎨 */

        .input-area-wrapper {
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: var(--space-md);
            padding-bottom: 24px;
            background: var(--bg-app);
        }

        .suggestion-chips {
            display: flex;
            align-items: center;
            gap: 4px;
            flex-wrap: nowrap;
            overflow: visible;
            
            
            padding-left: 4px;
            padding-bottom: 2px;
            font-size: 11.5px;
            font-weight: 500;
            color: var(--text-secondary);
        }

        .suggestion-chips

        .suggestion-chip {
            background: transparent;
            border: 1px solid transparent;
            color: var(--text-secondary);
            border-radius: 6px;
            padding: 4px 8px;
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            opacity: 0.85;
            white-space: nowrap;
            flex-shrink: 0;
        }

        .scroll-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: rgba(30, 32, 38, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: var(--text-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            opacity: 0;
            pointer-events: none;
            transition: background 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease;
            backdrop-filter: blur(8px);
            z-index: 10;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }
        .suggestion-chips-wrapper:hover .scroll-btn.visible {
            opacity: 1;
            pointer-events: auto;
        }
        .scroll-btn:hover {
            background: rgba(40, 42, 48, 0.95);
            border-color: rgba(255, 255, 255, 0.2);
            transform: translateY(-50%) scale(1.1);
        }
        .scroll-btn.left { left: -8px; }
        .scroll-btn.right { right: -8px; }

        .suggestion-chip:hover {
            background: rgba(255,255,255,0.06);
            border-color: rgba(255,255,255,0.03);
            color: var(--text-primary);
            opacity: 1;
        }
        
        .suggestion-chip.active {
            background: rgba(59, 130, 246, 0.15);
            color: var(--accent);
        }
        
        .suggestion-dot {
            color: var(--text-muted);
            font-size: 14px;
            line-height: 1;
            user-select: none;
            margin: 0 2px;
        }

        .input-box-container {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            background: var(--bg-elevated, #18181b);
            border: 1px solid rgba(255, 255, 255, 0.2); /* Show border even when not clicked */
            border-radius: 16px;
            padding: 12px;
            height: auto;
            min-height: 80px;
            gap: 8px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
            position: relative;
        }

        option {
            background-color: var(--bg-elevated, #18181b);
            color: var(--text-primary, #fafafa);
        }

        :host-context(html[data-theme='light']) .input-box-container {
            background: rgba(255, 255, 255, 0.8);
            border: 1px solid rgba(0, 0, 0, 0.2);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }

        .input-box-container:focus-within {
            border-color: var(--accent);
            box-shadow: 0 0 0 2px var(--accent), 0 4px 20px rgba(100, 100, 255, 0.25); /* Add shade/glow */
        }
        
        .input-box-top-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .input-box-bottom-row {
            display: flex;
            align-items: center;
            background: rgba(40, 40, 45, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 100px; /* Premium pill shape */
            padding: 4px 6px 4px 16px;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .input-box-bottom-row:focus-within {
            border-color: var(--accent);
            box-shadow: 0 0 0 1px var(--accent), inset 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .premium-input {
            flex: 1;
            background: transparent;
            border: none;
            color: var(--text-primary);
            font-size: 14px;
            font-weight: 500;
            font-family: var(--font);
            height: 100%;
            min-height: 40px;
            outline: none;
            order: unset;
        }

        .premium-input::placeholder {
            color: var(--text-muted);
            font-weight: 400;
        }

        .input-controls-left {
            display: flex;
            align-items: center;
            gap: 6px;
            order: unset;
            padding-left: 0;
        }

        .control-btn {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.04);
            color: var(--text-secondary);
            font-size: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 32px;
            border-radius: 100px;
            transition: all 0.2s ease;
            cursor: pointer;
        }
        
        :host-context(html[data-theme='light']) .control-btn {
            background: rgba(0, 0, 0, 0.04);
            border: 1px solid rgba(0, 0, 0, 0.05);
            color: var(--text-primary);
        }

        .control-btn:hover {
            background: var(--bg-hover);
            color: var(--text-primary);
        }

        .control-btn.pill-btn {
            padding: 0 14px;
        }

        .control-btn.icon-btn {
            width: 32px;
            padding: 0;
        }

        .control-btn.dropdown-btn {
            padding: 0 12px 0 14px;
            gap: 6px;
        }

        .dropdown-arrow {
            font-size: 10px;
            opacity: 0.6;
        }

        .input-controls-right {
            order: 3;
            padding-right: 2px;
        }

        .send-btn {
            background: var(--accent);
            border: none;
            color: white;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
        }

        .send-btn:hover:not(.analyzing) {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
        }

        .send-btn:active:not(.analyzing) {
            transform: scale(0.95);
        }

        .send-btn svg {
            margin-left: 2px;
        }

        .send-btn.analyzing {
            background: transparent;
            border: 1px solid var(--accent);
            cursor: default;
            box-shadow: none;
        }

        .send-btn-content {
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.4s ease;
            z-index: 1;
            position: relative;
        }

        .send-btn.analyzing .send-btn-content {
            opacity: 0;
        }

        .analyze-canvas {
            position: absolute;
            inset: -1px;
            width: calc(100% + 2px);
            height: calc(100% + 2px);
            pointer-events: none;
        }

        .custom-dropdown-menu {
            position: absolute;
            top: calc(100% + 8px);
            left: 50%;
            transform: translateX(-50%);
            background: rgba(30, 30, 35, 0.75);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 8px;
            min-width: 160px;
            z-index: 100;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
            animation: dropdownExpand 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            transform-origin: center top;
        }

        .pulse-dot {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes spin {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }

        @keyframes dropdownExpand {
            0% {
                opacity: 0;
                transform: translateX(-50%) scaleY(0);
            }
            100% {
                opacity: 1;
                transform: translateX(-50%) scaleY(1);
            }
        }

        .custom-dropdown-item {
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            color: var(--text-primary);
            transition: all 0.15s ease;
            white-space: nowrap;
        }

        .custom-dropdown-item:hover {
            background: rgba(255,255,255,0.1);
        }

        .custom-dropdown-item:active {
            background: rgba(255, 255, 255, 0.05);
        }

        .mini-scan-btn {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: var(--text-primary);
            border-radius: 6px;
            padding: 4px 10px;
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .mini-scan-btn:hover {
            background: rgba(59, 130, 246, 0.8);
            border-color: rgba(59, 130, 246, 1);
            box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
                    }
        .mini-scan-btn:active {
                    }

        /* --- Split Layout Styles --- */
        .split-layout {
            display: flex;
            height: 100%;
            width: 100%;
            background: #000000;
        }
        .left-panel {
            flex: 0 0 320px;
            border-right: 1px solid rgba(255,255,255,0.08);
            display: flex;
            flex-direction: column;
            background: #050505;
        }
        .right-panel {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: #000000;
            position: relative;
        }
        .panel-header {
            padding: 16px 20px;
            font-size: 14px;
            font-weight: 600;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            min-height: 60px;
        }
        .panel-header-left {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .transcript-container {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 0;
        }
        .transcript-item {
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .transcript-item:last-child {
            border-bottom: none;
        }
        .transcript-time {
            font-size: 11px;
            color: #9ca3af;
            margin-bottom: 8px;
            font-weight: 500;
        }
        .transcript-text {
            font-size: 14px;
            color: #e5e7eb;
            line-height: 1.5;
            font-weight: 500;
        }
        .response-types-container {
            padding: 20px;
            background: rgba(255,255,255,0.02);
            border-top: 1px solid rgba(255,255,255,0.05);
        }
        .response-types-title {
            font-size: 10px;
            text-transform: uppercase;
            color: #9ca3af;
            margin-bottom: 12px;
            font-weight: 700;
            letter-spacing: 0.5px;
        }
        .response-types-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        .ai-item {
            margin-bottom: 32px;
        }
        .ai-title {
            font-size: 18px;
            font-weight: 700;
            color: #a78bfa;
            margin-bottom: 20px;
        }
        .ai-text {
            font-size: 15px;
            color: #f3f4f6;
            line-height: 1.7;
        }
    `;

    static properties = {
            leftPanelWidth: { type: Number },
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
        this.leftPanelWidth = 320;
        this._isDraggingSplitter = false;
        this._onSplitterMouseMove = this._onSplitterMouseMove.bind(this);
        this._onSplitterMouseUp = this._onSplitterMouseUp.bind(this);
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

    
    _startSplitterDrag(e) {
        e.preventDefault();
        this._isDraggingSplitter = true;
        document.body.style.cursor = 'col-resize';
        window.addEventListener('mousemove', this._onSplitterMouseMove);
        window.addEventListener('mouseup', this._onSplitterMouseUp);
    }

    _onSplitterMouseMove(e) {
        if (!this._isDraggingSplitter) return;
        requestAnimationFrame(() => {
            const containerBounds = this.shadowRoot.querySelector('.split-layout').getBoundingClientRect();
            let newWidth = e.clientX - containerBounds.left;
            newWidth = Math.max(200, Math.min(newWidth, containerBounds.width - 250));
            this.leftPanelWidth = newWidth;
        });
    }

    _onSplitterMouseUp(e) {
        this._isDraggingSplitter = false;
        document.body.style.cursor = '';
        window.removeEventListener('mousemove', this._onSplitterMouseMove);
        window.removeEventListener('mouseup', this._onSplitterMouseUp);
    }

    disconnectedCallback() {
        window.removeEventListener('mousemove', this._onSplitterMouseMove);
        window.removeEventListener('mouseup', this._onSplitterMouseUp);
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
        const canvas = this.shadowRoot.querySelector('.analyze-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const dangerColor = getComputedStyle(this).getPropertyValue('--danger').trim() || '#EF4444';
        const startTime = performance.now();
        const FADE_IN = 0.5; // seconds
        const PARTICLE_SPREAD = 4; // px inward from border
        const PARTICLE_COUNT = 250;

        // Pill perimeter helpers
        const w = rect.width;
        const h = rect.height;
        const r = h / 2; // pill radius = half height
        const straightLen = w - 2 * r;
        const arcLen = Math.PI * r;
        const perimeter = 2 * straightLen + 2 * arcLen;

        // Given a distance along the perimeter, return {x, y, nx, ny} (position + inward normal)
        const pointOnPerimeter = (d) => {
            d = ((d % perimeter) + perimeter) % perimeter;
            // Top straight: left to right
            if (d < straightLen) {
                return { x: r + d, y: 0, nx: 0, ny: 1 };
            }
            d -= straightLen;
            // Right arc
            if (d < arcLen) {
                const angle = -Math.PI / 2 + (d / arcLen) * Math.PI;
                return {
                    x: w - r + Math.cos(angle) * r,
                    y: r + Math.sin(angle) * r,
                    nx: -Math.cos(angle),
                    ny: -Math.sin(angle),
                };
            }
            d -= arcLen;
            // Bottom straight: right to left
            if (d < straightLen) {
                return { x: w - r - d, y: h, nx: 0, ny: -1 };
            }
            d -= straightLen;
            // Left arc
            const angle = Math.PI / 2 + (d / arcLen) * Math.PI;
            return {
                x: r + Math.cos(angle) * r,
                y: r + Math.sin(angle) * r,
                nx: -Math.cos(angle),
                ny: -Math.sin(angle),
            };
        };

        // Pre-seed random offsets for stable particles
        const seeds = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            seeds.push({ pos: Math.random(), drift: Math.random(), depthSeed: Math.random() });
        }

        const draw = (now) => {
            const elapsed = (now - startTime) / 1000;
            const fade = Math.min(1, elapsed / FADE_IN);

            ctx.clearRect(0, 0, w, h);

            // ── Particle border ──
            ctx.fillStyle = dangerColor;
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const s = seeds[i];
                const along = (s.pos + s.drift * elapsed * 0.03) * perimeter;
                const depth = s.depthSeed * PARTICLE_SPREAD;
                const density = 1 - depth / PARTICLE_SPREAD;

                if (Math.random() > density) continue;

                const p = pointOnPerimeter(along);
                const px = p.x + p.nx * depth;
                const py = p.y + p.ny * depth;
                const size = 0.8 + density * 0.6;

                ctx.globalAlpha = fade * density * 0.85;
                ctx.beginPath();
                ctx.arc(px, py, size, 0, Math.PI * 2);
                ctx.fill();
            }

            // ── Waveform ──
            const midY = h / 2;
            const waves = [
                { freq: 3, amp: 0.35, speed: 2.5, opacity: 0.9, width: 1.8 },
                { freq: 5, amp: 0.2, speed: 3.5, opacity: 0.5, width: 1.2 },
                { freq: 7, amp: 0.12, speed: 5, opacity: 0.3, width: 0.8 },
            ];

            for (const wave of waves) {
                ctx.beginPath();
                ctx.strokeStyle = dangerColor;
                ctx.globalAlpha = wave.opacity * fade;
                ctx.lineWidth = wave.width;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                for (let x = 0; x <= w; x++) {
                    const norm = x / w;
                    const envelope = Math.sin(norm * Math.PI);
                    const y = midY + Math.sin(norm * Math.PI * 2 * wave.freq + elapsed * wave.speed) * (midY * wave.amp) * envelope;
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            ctx.globalAlpha = 1;
            this._animFrame = requestAnimationFrame(draw);
        };

        this._animFrame = requestAnimationFrame(draw);
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
            const tContainer = this.shadowRoot.querySelector('#transcriptContainer');
            if (tContainer) tContainer.scrollTop = tContainer.scrollHeight;
            const rContainer = this.shadowRoot.querySelector('#responseContainer');
            if (rContainer) rContainer.scrollTop = rContainer.scrollHeight;
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
        const tContainer = this.shadowRoot.querySelector('#transcriptContainer');
        const rContainer = this.shadowRoot.querySelector('#responseContainer');
        
        if (tContainer && rContainer) {
            if (this.responses.length === 0) {
                tContainer.innerHTML = `<div style="display: flex; height: 100%; align-items: center; justify-content: center; color: var(--text-muted); font-size: 13px;">Waiting for audio...</div>`;
                rContainer.innerHTML = `<div style="display: flex; height: 100%; align-items: center; justify-content: center; color: var(--text-muted); font-size: 13px;">Waiting for response...</div>`;
            } else {
                let transcriptsHtml = '';
                let aiHtml = '';
                
                this.responses.forEach((item, idx) => {
                    const isObj = typeof item === 'object' && item !== null;
                    let rawQuestion = isObj ? (item.question || item.prompt || item.transcription || '') : '';
                    const questionText = rawQuestion ? rawQuestion.replace(/^\[(Interviewer|Candidate)\]:\s*/gi, '').trim() : `Question #${idx + 1}`;
                    const answer = isObj ? (item.answer || item.response || item.content || '') : String(item);
                    const renderedAnswer = this.renderMarkdown(answer);
                    
                    if (questionText) {
                        const time = item.time || new Date().toLocaleTimeString([], {hour: 'numeric', minute:'2-digit', second:'2-digit'});
                        transcriptsHtml += `
                            <div class="transcript-item">
                                <div class="transcript-time">${time}</div>
                                <div class="transcript-text">${questionText}</div>
                            </div>
                        `;
                    }
                    if (renderedAnswer) {
                        const escapeHtml = (str) => str.replace(/`/g, '\\`').replace(/\$/g, '\\$');
                        aiHtml += `
                            <div class="ai-item">
                                ${questionText ? `<div class="ai-title">${questionText}</div>` : ''}
                                <div class="ai-text">${renderedAnswer}</div>
                                <div style="margin-top: 12px;">
                                    <button class="chat-copy-btn" title="Copy to clipboard" onclick="navigator.clipboard.writeText(\`${escapeHtml(answer)}\`)">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                    </button>
                                </div>
                            </div>
                        `;
                    }
                });
                
                tContainer.innerHTML = transcriptsHtml;
                rContainer.innerHTML = aiHtml;
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
        return html`
            ${this.isThemeMenuOpen ? html`
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 2000; display: flex; align-items: center; justify-content: center;" @click=${() => { this.isThemeMenuOpen = false; this.requestUpdate(); }}>
                    <div style="background: var(--bg-primary, rgba(30,32,38,0.95)); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; width: 300px; max-width: 90%; box-shadow: 0 12px 32px rgba(0,0,0,0.4);" @click=${e => e.stopPropagation()}>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <h3 style="margin: 0; font-size: 16px; color: var(--text-primary);">Session Theme Settings</h3>
                            <button @click=${() => { this.isThemeMenuOpen = false; this.requestUpdate(); }} style="background: none; border: none; color: var(--text-secondary); cursor: pointer; padding: 4px;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                            </button>
                        </div>
                        
                        <div style="display: flex; flex-direction: column; gap: 16px;">
                            <div>
                                <label style="display: block; margin-bottom: 8px; font-size: 13px; color: var(--text-secondary);">Theme</label>
                                <select style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: var(--text-primary); border-radius: 8px; padding: 8px;" @change=${async (e) => {
                                    this.themeSession = e.target.value;
                                    if (window.hideWin && window.hideWin.storage) await window.hideWin.storage.updatePreference('themeSession', this.themeSession);
                                    if (window.hideWin && window.hideWin.theme) window.hideWin.theme.applySessionTheme(this.themeSession);
                                    this.requestUpdate();
                                }}>
                                    <option value="dark" ?selected=${this.themeSession === 'dark'}>Dark (Default)</option>
                                    <option value="light" ?selected=${this.themeSession === 'light'}>Light</option>
                                    <option value="amoled" ?selected=${this.themeSession === 'amoled'}>AMOLED Black</option>
                                    <option value="matrix" ?selected=${this.themeSession === 'matrix'}>Matrix Hacker</option>
                                    <option value="terminal" ?selected=${this.themeSession === 'terminal'}>Terminal Green</option>
                                    <option value="blue" ?selected=${this.themeSession === 'blue'}>Deep Blue</option>
                                    <option value="discord" ?selected=${this.themeSession === 'discord'}>Discord Dark</option>
                                </select>
                            </div>
                            
                            <div>
                                <label style="display: block; margin-bottom: 8px; font-size: 13px; color: var(--text-secondary);">Background Transparency (${Math.round((this.transparencySession || 0.3) * 100)}%)</label>
                                <input type="range" min="0" max="1" step="0.01" .value=${this.transparencySession !== undefined ? this.transparencySession : 0.3} style="width: 100%;" @input=${async (e) => {
                                    this.transparencySession = parseFloat(e.target.value);
                                    if (window.hideWin && window.hideWin.storage) await window.hideWin.storage.updatePreference('transparencySession', this.transparencySession);
                                    document.documentElement.style.setProperty('--app-bg-transparency', this.transparencySession);
                                    this.requestUpdate();
                                }} />
                            </div>
                            
                            <div>
                                <label style="display: block; margin-bottom: 8px; font-size: 13px; color: var(--text-secondary);">Text Size (${this.fontSizeSession || 15}px)</label>
                                <input type="range" min="12" max="24" step="1" .value=${this.fontSizeSession !== undefined ? this.fontSizeSession : 15} style="width: 100%;" @input=${async (e) => {
                                    this.fontSizeSession = parseInt(e.target.value, 10);
                                    if (window.hideWin && window.hideWin.storage) await window.hideWin.storage.updatePreference('fontSizeSession', this.fontSizeSession);
                                    document.documentElement.style.setProperty('--response-font-size', this.fontSizeSession + 'px');
                                    this.requestUpdate();
                                }} />
                            </div>
                        </div>
                    </div>
                </div>
            ` : ''}

            
            <div class="split-layout">
                <!-- Left Panel -->
                <div class="left-panel" style="flex: 0 0 ${this.leftPanelWidth}px;">
                    <div class="panel-header">
                        <div class="panel-header-left">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
                            <span>Listening</span>
                        </div>
                    </div>
                    <div class="transcript-container" id="transcriptContainer"></div>
                    <div class="response-types-container">
                        <div class="response-types-title">RESPONSE TYPES</div>
                        <div class="response-types-buttons">
                            <!-- New STAR button -->
                            <button class="suggestion-chip" style="font-size: 13px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 6px 16px;">
                                STAR
                            </button>
                            <!-- Existing options -->
                            <button class="suggestion-chip ${this.isWhatToSayEnabled ? 'active' : ''}" @click=${this.handleWhatToSay} style="font-size: 13px;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8;">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                </svg>
                                What to say?
                            </button>
                            
                            <button class="suggestion-chip ${this.isFollowUpsEnabled ? 'active' : ''}" @click=${this.handleFollowUps} style="font-size: 13px;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8;">
                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                </svg>
                                Follow-ups
                            </button>
                            
                            <button class="suggestion-chip ${this.isRefreshing ? 'active' : ''}" @click=${this.handleRefreshAction} style="font-size: 13px; transition: all 0.2s ease;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8; ${this.isRefreshing ? 'animation: spin 1s linear infinite;' : ''}">
                                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                                    <path d="M3 3v5h5"></path>
                                </svg>
                                ${this.isRefreshing ? 'Refreshing...' : (this.refreshSuccess ? 'Done!' : 'Refresh')}
                            </button>
                            
                            <button class="suggestion-chip ${this.isNotesOpening ? 'active' : ''}" @click=${this.handleNotesAction} style="font-size: 13px; transition: all 0.2s ease;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" style="opacity: 0.8;"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="14 2 14 8 20 8"/><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="16" y1="13" x2="8" y2="13"/><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="16" y1="17" x2="8" y2="17"/><polyline fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="10 9 9 9 8 9"/></svg>
                                Notes
                            </button>
                        </div>
                    </div>
                </div>

                  <!-- Custom Splitter -->
                  <div style="width: 12px; margin-left: -6px; margin-right: -6px; z-index: 10; cursor: default; display: flex; align-items: center; justify-content: center; position: relative;">
                      <div class="stealth-tooltip" data-tooltip="Resize" @mousedown=${this._startSplitterDrag} style="width: 8px; height: 32px; border-radius: 4px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; background: rgba(255,255,255,0.1); cursor: ew-resize; transition: background 0.2s;">
                          <div style="width: 3px; height: 3px; background: rgba(255,255,255,0.6); border-radius: 50%; pointer-events: none;"></div>
                          <div style="width: 3px; height: 3px; background: rgba(255,255,255,0.6); border-radius: 50%; pointer-events: none;"></div>
                      </div>
                  </div>
                  <!-- Right Panel -->
                <div class="right-panel">
                    <div class="panel-header">
                        <div class="panel-header-left">
                            <span>AI Response</span>
                            <!-- Status dot -->
                            <div style="display: flex; align-items: center; gap: 4px; margin-left: 8px;">
                                ${(() => {
                                    const isProcessing = this.isAnalyzing || (this.statusText && (this.statusText.toLowerCase().includes('generating') || this.statusText.toLowerCase().includes('analyzing') || this.statusText.toLowerCase().includes('processing')));
                                    const color = isProcessing ? '#ef4444' : (this.isPaused ? '#eab308' : '#22c55e');
                                    const pulseAnim = !this.isPaused ? 'pulse 2s infinite' : 'none';
                                    return html`
                                        <div style="width: 6px; height: 6px; border-radius: 50%; background-color: ${color}; box-shadow: 0 0 6px ${color}; animation: ${pulseAnim};"></div>
                                    `;
                                })()}
                            </div>
                        </div>
                        
                        <!-- Top Right Controls: all existing buttons placed here neatly -->
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <!-- Theme Button -->
                            <button @click=${() => { this.isThemeMenuOpen = true; this.requestUpdate(); }} style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.05); color: var(--text-primary); width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;" title="Toggle Session Theme Settings">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="5"></circle>
                                    <line x1="12" y1="1" x2="12" y2="3"></line>
                                    <line x1="12" y1="21" x2="12" y2="23"></line>
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                    <line x1="1" y1="12" x2="3" y2="12"></line>
                                    <line x1="21" y1="12" x2="23" y2="12"></line>
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                                </svg>
                            </button>

                            <!-- Mode Selector -->
                            <div class="suggestion-chip mode-selector" style="position:relative; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 4px 12px; font-size: 12px; display: flex; align-items: center; gap: 6px; cursor: pointer;" @click=${(e) => { e.stopPropagation(); this.isModeMenuOpen = !this.isModeMenuOpen; this.isProfileMenuOpen = false; }}>
                                <span style="font-weight: 400; display: flex; align-items: center;">
                                    ${this.selectedModeCategory ? (
                                        this.selectedModeCategory === 'Custom' || !['Job Interview', 'Business Meeting', 'Sales Call', 'Presentation', 'Negotiation', 'Exam Assistant'].includes(this.selectedModeCategory) 
                                        ? html`<input type="text" 
                                            style="background: transparent; border: none; color: var(--text-primary); font-size: 12px; outline: none; width: 80px; border-bottom: 1px solid rgba(255,255,255,0.2);" 
                                            placeholder="Enter mode..."
                                            .value=${this.selectedModeCategory === 'Custom' ? '' : this.selectedModeCategory}
                                            @click=${e => e.stopPropagation()}
                                            @keyup=${e => {
                                                if(e.key === 'Enter' && e.target.value.trim()) {
                                                    this.onModeCategoryChange && this.onModeCategoryChange(e.target.value.trim());
                                                }
                                            }}
                                            @blur=${e => {
                                                if (e.target.value.trim()) {
                                                    this.onModeCategoryChange && this.onModeCategoryChange(e.target.value.trim());
                                                }
                                            }}
                                            autofocus
                                        />`
                                        : (this.selectedModeCategory === 'Job Interview' ? 'Interview' : this.selectedModeCategory === 'Business Meeting' ? 'Business' : this.selectedModeCategory)
                                    ) : 'Select Mode'}
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.6;">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                                
                                ${this.isModeMenuOpen ? html`
                                    <div class="custom-dropdown-menu" style="bottom: 100%; top: auto; margin-bottom: 8px;">
                                        ${['Job Interview', 'Business Meeting', 'Sales Call', 'Presentation', 'Negotiation', 'Exam Assistant', 'Custom'].map(mode => html`
                                            <div class="custom-dropdown-item ${this.selectedModeCategory === mode ? 'active' : ''}" @click=${(e) => { e.stopPropagation(); this.isModeMenuOpen = false; this.onModeCategoryChange && this.onModeCategoryChange(mode); }}>
                                                ${mode === 'Job Interview' ? 'Interview' : mode === 'Business Meeting' ? 'Business' : mode}
                                            </div>
                                        `)}
                                    </div>
                                ` : ''}
                            </div>

                            <!-- Profile Selector -->
                            <div style="position:relative; margin-left: 4px;">
                                <div class="suggestion-chip profile-selector stealth-tooltip" 
                                    data-tooltip="Select AI Profile"
                                    @click=${(e) => { e.stopPropagation(); this.isProfileMenuOpen = !this.isProfileMenuOpen; this.isModeMenuOpen = false; }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                </div>
                                
                                ${this.isProfileMenuOpen ? html`
                                    <div class="custom-dropdown-menu" style="bottom: 100%; right: 0; top: auto; margin-bottom: 8px; min-width: 180px;">
                                        ${!this.selectedModeCategory ? html`
                                            <div style="padding: 8px 12px; font-size: 11px; color: var(--text-muted); text-align: center;">
                                                Select a Mode first
                                            </div>
                                        ` : this.profiles.filter(p => p.type === this.selectedModeCategory).length > 0 
                                            ? this.profiles.filter(p => p.type === this.selectedModeCategory).map(p => html`
                                                <div class="custom-dropdown-item ${this.selectedProfile === p.id ? 'active' : ''}" 
                                                     @click=${(e) => { 
                                                         e.stopPropagation(); 
                                                         this.isProfileMenuOpen = false; 
                                                         this.onProfileChange && this.onProfileChange(p.id); 
                                                     }}>
                                                    ${p.name?.split(' ')[0]}
                                                </div>
                                            `)
                                            : html`
                                                <div style="padding: 8px 12px; font-size: 11px; color: var(--text-muted); text-align: center;">
                                                    No profiles for ${this.selectedModeCategory}
                                                </div>
                                            `
                                        }
                                        <div style="height: 1px; background: rgba(255,255,255,0.1); margin: 4px 0;"></div>
                                        <div class="custom-dropdown-item" style="color: var(--accent);" @click=${(e) => { e.stopPropagation(); this.isProfileMenuOpen = false; this.onAddProfileClick && this.onAddProfileClick(); }}>
                                            + Add Profile
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                            
                            <!-- Mouse Toggle -->
                            <div class="mouse-toggle-container stealth-tooltip" data-tooltip="Stealth Mode" style="pointer-events: auto; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; padding: 0 4px; margin-left: 4px; width: 42px; max-width: 42px; flex-shrink: 0;" @click=${() => this.dispatchEvent(new CustomEvent('toggle-click-through', { bubbles: true, composed: true }))}>
                                <div style="width: 42px; height: 22px; border-radius: 6px; background: ${this.isClickThrough ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.08)'}; border: 1px solid rgba(255,255,255,0.05); position: relative; transition: all 0.3s ease; box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);">
                                    <div style="width: 18px; height: 18px; border-radius: 4px; background: #ffffff; position: absolute; top: 1px; left: ${this.isClickThrough ? '21px' : '1px'}; transition: background 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.15);">
                                        <div style="width: 10px; height: 10px; border-radius: 2px; background: ${this.isClickThrough ? '#ef4444' : 'rgba(0,0,0,0.3)'}; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">
                                            <div style="width: 5px; height: 1.5px; background: #ffffff; border-radius: 1px; transform: rotate(-45deg);"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Play/Pause -->
                            <button @click=${() => this.dispatchEvent(new CustomEvent('toggle-pause', { bubbles: true, composed: true }))} class="stealth-tooltip" data-tooltip=${this.isPaused ? 'Resume Session' : 'Pause Session'} style="-webkit-app-region: no-drag; background: ${this.isPaused ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)'}; border: 1px solid ${this.isPaused ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}; color: ${this.isPaused ? '#ef4444' : '#10b981'}; width: 48px; height: 28px; border-radius: 20px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease; margin-left: 4px;">
                                ${this.isPaused ? html`
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                ` : html`
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                                `}
                            </button>
                            
                            <!-- End Session -->
                            <button @click=${() => window.require && window.require('electron').ipcRenderer.invoke('end-session-completely')} class="stealth-tooltip" data-tooltip="End Session Completely" style="-webkit-app-region: no-drag; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.05); color: var(--text-primary); width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; margin-left: 4px;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <div class="response-container" id="responseContainer" style="flex: 1; overflow-y: auto; padding: 20px;"></div>
                    
                    <div class="input-area-wrapper" style="padding: 16px 20px; background: #000; border-top: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: row; align-items: center;">
                        <div class="input-box-bottom-row" style="flex: 1; display: flex; align-items: center; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 6px 6px 6px 16px;">
                            <textarea
                                id="textInput"
                                class="premium-input"
                                placeholder="Type to ask HuddleMate anything..."
                                @keydown=${this.handleTextKeydown}
                                rows="1"
                                style="flex: 1; background: transparent; border: none; color: #fff; font-size: 14px; outline: none; resize: none; line-height: 24px; font-family: inherit; margin: 0;"
                            ></textarea>
                            
                            <button class="send-btn ${this.isAnalyzing ? 'analyzing' : ''}" @click=${this.handleScreenAnswer} style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); color: #fff; padding: 8px 16px; border-radius: 20px; font-size: 13px; margin-left: 8px; cursor: pointer; white-space: nowrap; height: auto; width: auto; font-weight: 500;">
                                What should I say next ?
                            </button>
                        </div>
                    </div>
                </div>
            </div>
`;
    }
}

customElements.define('assistant-view', AssistantView);
