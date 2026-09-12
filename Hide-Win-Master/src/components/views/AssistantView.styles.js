import { css } from '../../assets/lit-core-2.7.4.min.js';

export const assistantStyles =     css`
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

        .response-container::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        .response-container::-webkit-scrollbar-track {
            background: transparent;
            margin: 4px;
        }

        .response-container::-webkit-scrollbar-thumb {
            background-color: rgba(255, 255, 255, 0.15);
            border-radius: 10px;
            border: 2px solid transparent;
            background-clip: padding-box;
            transition: background-color 0.2s;
        }

        .response-container::-webkit-scrollbar-thumb:hover {
            background-color: rgba(255, 255, 255, 0.3);
        }

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
            scrollbar-width: none;
            -ms-overflow-style: none;
            padding-left: 4px;
            padding-bottom: 2px;
            font-size: 11.5px;
            font-weight: 500;
            color: var(--text-secondary);
        }

        .suggestion-chips::-webkit-scrollbar {
            display: none;
        }

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
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
            transform: translateY(-1px);
        }
        .mini-scan-btn:active {
            transform: translateY(1px);
        }
    `;
