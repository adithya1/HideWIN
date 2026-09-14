import { css } from '../../assets/lit-core-2.7.4.min.js';

export const appStyles =     css`
    ::-webkit-scrollbar {
        width: 4px;
        height: 4px;
    }
    ::-webkit-scrollbar-track {
        background: transparent;
    }
    ::-webkit-scrollbar-thumb {
        background: rgba(150, 150, 150, 0.3);
        border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: rgba(150, 150, 150, 0.6);
    }
    ::-webkit-scrollbar-corner {
        background: transparent;
    }

        * {
            box-sizing: border-box;
            font-family: var(--font);
            margin: 0;
            padding: 0;
            cursor: default;
            user-select: none;
        }

        /* Stealth mode: force arrow cursor on every element inside shadow DOM */
        :host(.stealth-cursor) *,
        :host(.stealth-cursor) *::before,
        :host(.stealth-cursor) *::after {
            cursor: default !important;
        }

        /* Stealth Red Cursor: Allows the user to see their mouse (red arrow) while indicating stealth mode is active */
        :host(.cursor-hidden) * {
            cursor: none !important;
        }
        .fake-cursor {
            display: none;
            position: fixed;
            width: 16px;
            height: 16px;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="red" stroke="white" stroke-width="1" d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.54.35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z"/></svg>');
            background-size: contain;
            background-repeat: no-repeat;
            pointer-events: none;
            z-index: 999999;
            transform: translate(0, 0);
            pointer-events: none;
        }
        :host(.cursor-hidden) .fake-cursor {
            display: block;
        }



        /* Click-through mode: pass 100% of mouse events and cursor shapes to underlying OS windows */
        :host(.click-through-active) .app-shell {
            pointer-events: none;
        }
        :host(.click-through-active) .mouse-toggle-container,
        :host(.click-through-active) .mouse-toggle-container * {
            pointer-events: auto !important;
        }

        @keyframes border-glow {
            0% { box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.15), 0 0 20px rgba(99, 102, 241, 0.05), 0 8px 32px rgba(0, 0, 0, 0.8); }
            50% { box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.35), 0 0 30px rgba(99, 102, 241, 0.15), 0 8px 32px rgba(0, 0, 0, 0.8); }
            100% { box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.15), 0 0 20px rgba(99, 102, 241, 0.05), 0 8px 32px rgba(0, 0, 0, 0.8); }
        }

        :host {
            display: block;
            position: relative;
            width: 100%;
            height: 100vh;
            background: var(--bg-app);
            color: var(--text-primary);
            border: 3px solid var(--border);
            border-radius: 2px;
            overflow: hidden;
            box-sizing: border-box;
        }

        :host(.is-session-window) {
            background: transparent !important;
            border: none;
            border-radius: 0;
            padding: 15px;
            --response-font-size: clamp(12px, calc(10px + 0.8vw), 18px);
        }

        /* Resize handles */
        .resize-handle {
            position: absolute;
            z-index: 99999;
            background: transparent;
            -webkit-app-region: no-drag;
            transition: border-color 0.2s;
        }
        
        :host(.is-session-window) .resize-handle {
            width: 20px;
            height: 20px;
            background: transparent;
            border: none;
            border-radius: 4px;
        }

        .resize-handle.top-left {
            top: 0;
            left: 0;
            width: 8px;
            height: 8px;
            cursor: nw-resize;
        }

        .resize-handle.top-right {
            top: 0;
            right: 0;
            width: 8px;
            height: 8px;
            cursor: ne-resize;
        }

        .resize-handle.bottom-left {
            bottom: 0;
            left: 0;
            width: 8px;
            height: 8px;
            cursor: sw-resize;
        }

        .resize-handle.bottom-right {
            bottom: 0;
            right: 0;
            width: 8px;
            height: 8px;
            cursor: se-resize;
        }

        /* â”€â”€ Full app shell: top drag bar + horizontal top toolbar + main content â”€â”€ */

        .app-shell {
            display: flex;
            flex-direction: column;
            height: 100%;
            overflow: hidden;
        }

        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            position: relative;
        }

        .content-inner {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            overflow-x: hidden;
            position: relative;
        }

        :host(.is-session-window) .app-shell {
            background: var(--bg-app);
            border-radius: 12px;
            border: 1px solid transparent;
            animation: border-glow 6s ease-in-out infinite;
        }

        .top-drag-bar {
            position: relative;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 40px;
            background: var(--bg-surface);
            border-bottom: 1px solid var(--border);
            -webkit-app-region: drag;
            backdrop-filter: blur(12px);
            padding: 0 8px;
        }

        .drag-region {
            flex: 1;
            height: 100%;
            -webkit-app-region: drag;
        }

        .drag-region:active {
            cursor: grabbing;
        }

        .top-drag-bar.hidden {
            display: none;
        }

        /* Left: app brand */
        .titlebar-brand {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-right: 16px;
        }
        .brand-logo {
            width: 100px;
            height: 28px;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: left center;
            display: inline-block;
            background-image: url('./assets/images/media_1786601281073.png');
        }
        :host-context(html[data-theme='dark']) .brand-logo,
        html[data-theme='dark'] .brand-logo {
            background-image: url('./assets/images/media_1786601281022.png');
        }

        .titlebar-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3B82F6, #8B5CF6);
            box-shadow: 0 0 6px rgba(59,130,246,0.6);
            flex-shrink: 0;
        }

        .titlebar-name {
            font-size: 12px;
            font-weight: 600;
            color: var(--text-muted);
            letter-spacing: 0.04em;
            text-transform: uppercase;
        }

        /* Right: window controls */
        .titlebar-controls {
            display: flex;
            align-items: center;
            gap: 8px;
            padding-right: 8px;
            -webkit-app-region: no-drag;
        }

        .win-btn {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 1px solid rgba(255, 255, 255, 0.08);
            background: rgba(255, 255, 255, 0.03);
            color: var(--text-secondary);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: default;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            padding: 0;
            backdrop-filter: blur(8px);
        }

        .win-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-primary);
            border-color: rgba(255, 255, 255, 0.2);
            transform: scale(1.05);
        }

        .win-btn.close:hover {
            background: rgba(239, 68, 68, 0.2);
            border-color: rgba(239, 68, 68, 0.5);
            color: #f87171;
        }

        .win-btn svg {
            width: 13px;
            height: 13px;
            pointer-events: none;
        }

        /* Horizontal Top Navigation Bar (Snipping Tool Style) */
        .top-toolbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: var(--bg-surface);
            border-bottom: 1px solid var(--border);
            padding: 6px 12px;
            height: 48px;
            -webkit-app-region: no-drag;
            gap: 8px;
        }

        .top-toolbar.hidden {
            display: none;
        }

                .nav-item {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            border: 1px solid transparent;
            background: transparent;
            border-radius: 8px;
            cursor: pointer;
            color: var(--text-secondary);
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s ease;
        }
        .nav-item:hover {
            background: rgba(120, 120, 120, 0.1);
            color: var(--text-primary);
        }
        .nav-item.active {
            background: var(--bg-elevated);
            border-color: var(--border);
            color: var(--accent);
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .nav-item svg {
            width: 16px;
            height: 16px;
        }
        @media (max-width: 600px) {
            .nav-item {
                padding: 8px;
            }
            .nav-item .nav-label {
                display: none;
            }
            /* Show label on hover if possible, or just let tooltip handle it */
            .nav-item:hover::after {
                content: attr(title);
                position: absolute;
                top: 100%;
                margin-top: 4px;
                background: var(--bg-elevated);
                border: 1px solid var(--border);
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 11px;
                color: var(--text-primary);
                white-space: nowrap;
                z-index: 1000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                pointer-events: none;
            }
        }
        .horizontal-nav {
            display: flex;
            align-items: center;
            gap: 6px;
            overflow-x: auto;
            scrollbar-width: none;
        }

        .horizontal-nav::-webkit-scrollbar {
            width: 0px !important;
            height: 0px !important;
            display: none !important;
        }
        .mouse-toggle-container {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #f1f5f9;
            padding: 4px 8px 4px 12px;
            border-radius: 20px;
            border: 1px solid #e2e8f0;
            pointer-events: auto !important; /* Ensure it stays clickable in click-through mode */
            cursor: pointer;
            transition: all 0.2s ease;
        }
        :host-context(html[data-theme='dark']) .mouse-toggle-container,
        html[data-theme='dark'] .mouse-toggle-container {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.1);
        }
        .mouse-toggle-label {
            font-size: 13px;
            font-weight: 500;
            color: #64748b;
            display: flex;
            align-items: center;
            gap: 6px;
            pointer-events: none;
        }
        :host-context(html[data-theme='dark']) .mouse-toggle-label,
        html[data-theme='dark'] .mouse-toggle-label {
            color: #94a3b8;
        }
        .mouse-toggle-switch {
            position: relative;
            width: 32px;
            height: 18px;
            background: #cbd5e1;
            border-radius: 10px;
            transition: background 0.2s ease;
            pointer-events: none;
        }
        :host-context(html[data-theme='dark']) .mouse-toggle-switch,
        html[data-theme='dark'] .mouse-toggle-switch {
            background: #475569;
        }
        .mouse-toggle-container.undetectable .mouse-toggle-switch {
            background: #3b82f6;
        }
        .mouse-toggle-knob {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 14px;
            height: 14px;
            background: white;
            border-radius: 50%;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .mouse-toggle-container.undetectable .mouse-toggle-knob {
            transform: translateX(14px);
        }

        @keyframes pulse-glow {
            0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.1); border-color: rgba(99, 102, 241, 0.2); }
            100% { box-shadow: 0 0 8px 0 rgba(99, 102, 241, 0.3); border-color: rgba(99, 102, 241, 0.5); }
        }
        .stealth-note {
            font-size: 11px;
            font-weight: 500;
            color: var(--text-secondary);
            background: rgba(99, 102, 241, 0.05);
            border: 1px solid rgba(99, 102, 241, 0.2);
            padding: 4px 10px;
            border-radius: 12px;
            margin-left: 8px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            animation: pulse-glow 3s infinite alternate;
        }
        .stealth-note kbd {
            background: rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 4px;
            padding: 1px 4px;
            font-family: var(--font-mono);
            font-size: 10px;
            color: var(--accent);
        }
    `;


