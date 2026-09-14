import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';

export class MainView extends LitElement {
    static styles = css`
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
            font-family: var(--font);
            cursor: default;
            user-select: none;
            box-sizing: border-box;
        }

        /* MASTER RESPONSIVE ARCHITECTURE (2026 DESKTOP UI)          */
        /* ========================================================= */
        
        .home-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center; /* Center the layout container */
            padding: clamp(16px, 4vh, 40px) clamp(16px, 4vw, 60px);
            box-sizing: border-box;
            background: var(--bg-app);
            overflow-y: auto;
            overflow-x: hidden;
        }

        /* --------------------------------------------------------- */
        /* HEADER & NAVIGATION */
        /* --------------------------------------------------------- */
        .home-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            max-width: 1200px; /* Safe readable width */
            margin-bottom: clamp(16px, 3vh, 32px);
        }

        /* --------------------------------------------------------- */
        /* TOOLBAR (FLEX-BASED RESPONSIVE) */
        /* --------------------------------------------------------- */
        .action-bar-wrapper {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            flex-wrap: nowrap;
            gap: clamp(12px, 2vw, 24px);
            width: 100%;
            max-width: 1200px;
            margin: 0 auto clamp(16px, 3vh, 24px) auto;
            padding: 10px 24px;
            background: var(--bg-surface);
            border: 1px solid var(--border);
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.05);
            transition: all 0.2s ease;
        }

        /* Dropdowns */
        .action-dropdown {
            flex: 0 1 auto;
            min-width: 160px;
            max-width: 220px;
            position: relative;
        }

        .action-dropdown-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            padding: 8px 12px;
            height: 38px;
            background: transparent;
            border-radius: 6px;
            border: 1px solid var(--border);
            cursor: pointer;
            transition: all 0.15s ease;
        }
        
        .action-dropdown-content:hover, .action-dropdown-content:focus-within {
            background: rgba(100, 116, 139, 0.05);
            border: 1px solid var(--text-muted);
        }

        .action-dropdown-content span {
            font-size: 14px;
            font-weight: 500;
            color: var(--text-primary);
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* Mouse Detect */
        .mouse-toggle-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            padding-left: clamp(12px, 2vw, 24px);
            border-left: 1px solid var(--border); /* Clean separation */
            flex-shrink: 0;
        }

        /* Start Button */
        .action-buttons-wrapper {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin: 0;
            flex-shrink: 0;
        }

        .primary-action-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 0 20px;
            height: 38px;
            border-radius: 8px;
            border: none;
            background: var(--accent);
            color: #ffffff;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.15s ease, transform 0.1s ease;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            white-space: nowrap;
        }
        
        .primary-action-btn:hover { background: #2563eb; }
        .primary-action-btn:active { transform: scale(0.98); }
        .primary-action-btn svg { width: 16px; height: 16px; }

        /* Popups */
        .child-dropdown {
            position: absolute;
            top: calc(100% + 8px);
            left: 0;
            width: 100%;
            min-width: 200px;
            background: var(--bg-surface);
            border: 1px solid var(--border);
            border-radius: 8px;
            z-index: 100;
            max-height: 280px;
            overflow-y: auto;
            padding: 8px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.1);
        }

        /* --------------------------------------------------------- */
        /* PINNED SHORTCUTS */
        /* --------------------------------------------------------- */
        .pinned-shortcuts-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 16px;
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 24px;
            background: transparent;
            border: none;
            box-shadow: none;
        }

        .pinned-shortcut-card {
            width: 100px;
            height: 90px;
            padding: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            border: 1px solid var(--border);
            background: var(--bg-surface);
            transition: all 0.2s ease;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
        
        .pinned-shortcut-card:hover {
            transform: translateY(-2px);
            background: rgba(100, 116, 139, 0.05);
            border-color: var(--text-muted);
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        /* --------------------------------------------------------- */
        /* RESPONSIVE BREAKPOINTS (Fluid Architecture)               */
        /* --------------------------------------------------------- */
        
        /* COMPACT (2-Row Reflow) */
        @media (max-width: 680px) {
            .action-bar-wrapper {
                flex-wrap: wrap;
                padding: 12px 16px;
                max-width: 500px;
            }
            .action-dropdown {
                flex: 1 1 40%;
                min-width: 140px;
            }
            .mouse-toggle-wrapper {
                flex: 1 1 40%;
                border-left: none;
                padding-left: 0;
                justify-content: flex-start;
            }
            .action-buttons-wrapper {
                flex: 1 1 40%;
                justify-content: flex-end;
            }
        }

        /* SMALL (Vertical Stack) */
        @media (max-width: 500px) {
            .action-bar-wrapper {
                flex-direction: column;
                align-items: stretch;
            }
            .action-dropdown {
                flex: 1 1 100%;
                max-width: 100%;
            }
            .mouse-toggle-wrapper {
                justify-content: space-between;
                margin-top: 8px;
            }
            .action-buttons-wrapper {
                justify-content: stretch;
                margin-top: 8px;
            }
            .primary-action-btn { width: 100%; }
        }

        @keyframes errorShake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-4px); }
            40%, 80% { transform: translateX(4px); }
        }
        .error-shake {
            animation: errorShake 0.4s ease-in-out;
            border-color: #ef4444 !important;
            box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.5) !important;
        }

        @keyframes slideDownFade {
            0% { opacity: 0; transform: translateY(-10px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .child-dropdown {
            animation: slideDownFade 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
        .child-dropdown::-webkit-scrollbar {
            display: none;
        }

        :host {
            min-height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            padding: var(--space-md);
            overflow-y: auto;
            overflow-x: hidden;
        }

        .form-wrapper {
            width: 100%;
            max-width: 420px;
            display: flex;
            flex-direction: column;
            gap: var(--space-md);
        }

        .page-title {
            font-size: var(--font-size-xl);
            font-weight: var(--font-weight-semibold);
            color: var(--text-primary);
            margin-bottom: var(--space-xs);
        }

        .page-title .mode-suffix {
            opacity: 0.5;
        }

        .page-subtitle {
            font-size: var(--font-size-sm);
            color: var(--text-muted);
            margin-bottom: var(--space-md);
        }

        /* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Cloud promo card ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */

        .cloud-promo {
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 16px 20px;
            border-radius: 6px;
            border: 1px solid rgba(99, 102, 241, 0.2);
            background: var(--bg-surface);
            cursor: default;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cloud-promo:hover {
            border-color: rgba(99, 102, 241, 0.4);
            background: var(--bg-surface);
            box-shadow: 0 0 30px rgba(99, 102, 241, 0.1), 0 0 60px rgba(139, 92, 246, 0.05);
            transform: translateY(-2px);
        }

        .cloud-promo-glow {
            position: absolute;
            top: -40%;
            right: -20%;
            width: 140px;
            height: 140px;
            background: transparent;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }

        .cloud-promo:hover .cloud-promo-glow {
            opacity: 1;
            background: transparent;
        }

        .cloud-promo-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .cloud-promo-title {
            font-size: var(--font-size-sm);
            font-weight: 600;
            color: var(--text-primary);
            letter-spacing: 0.02em;
        }

        .cloud-promo-arrow {
            color: var(--accent);
            font-size: 16px;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cloud-promo:hover .cloud-promo-arrow {
            transform: translateX(4px);
        }

        .cloud-promo-desc {
            font-size: 13px;
            color: var(--text-secondary);
            line-height: 1.5;
        }

        /* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Form controls ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */

        .form-group {
            display: flex;
            flex-direction: column;
            gap: var(--space-xs);
        }

        .form-label {
            font-size: var(--font-size-xs);
            font-weight: var(--font-weight-medium);
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        input, select, textarea {
            background: rgba(255, 255, 255, 0.04);
            color: var(--text-primary);
            border: 1px solid var(--border);
            padding: 10px 14px;
            width: 100%;
            border-radius: 6px;
            font-size: var(--font-size-sm);
            font-family: var(--font);
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        input:hover:not(:focus), select:hover:not(:focus), textarea:hover:not(:focus) {
            border-color: rgba(255, 255, 255, 0.15);
            background: rgba(255, 255, 255, 0.06);
        }

        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: rgba(99, 102, 241, 0.5);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15), inset 0 1px 2px rgba(0, 0, 0, 0.2);
            background: var(--border);
        }

        input::placeholder, textarea::placeholder {
            color: rgba(255, 255, 255, 0.3);
        }

        input.error {
            border-color: var(--danger, #EF4444);
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
        }

        select {
            cursor: default;
            appearance: none;
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='rgba(255,255,255,0.5)' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
            background-position: right 12px center;
            background-repeat: no-repeat;
            background-size: 14px;
            padding-right: 32px;
        }

        option {
            background-color: var(--bg-surface);
            color: var(--text-primary);
        }

        textarea {
            resize: vertical;
            min-height: 80px;
            line-height: 1.5;
        }

        .form-hint {
            font-size: var(--font-size-xs);
            color: var(--text-muted);
        }

        .form-hint a, .form-hint span.link {
            color: var(--accent);
            text-decoration: none;
            cursor: default;
        }

        .form-hint span.link:hover {
            text-decoration: underline;
        }

        .whisper-label-row {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .whisper-spinner {
            width: 12px;
            height: 12px;
            border: 2px solid var(--border);
            border-top-color: var(--accent);
            border-radius: 50%;
            animation: whisper-spin 0.8s linear infinite;
        }

        @keyframes whisper-spin {
            to { transform: rotate(360deg); }
        }

        /* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Start button ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */

        .start-button {
            width: 100%;
            padding: 14px 40px;
            border-radius: 6px;
            border: none;
            background: var(--accent);
            color: white;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 14px rgba(24, 95, 196, 0.4);
        }

        .start-button:hover:not(:disabled) {
            transform: translateY(-2px);
            background: var(--accent-hover);
            box-shadow: 0 6px 20px rgba(24, 95, 196, 0.6) !important;
        }

        .start-button:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3) !important;
        }

        .spinner {
            width: 18px;
            height: 18px;
            border: 2px solid rgba(59, 130, 246, 0.3);
            border-top-color: var(--accent);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .start-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            box-shadow: none !important;
            transform: none;
            background: var(--bg-hover);
            border: 1px solid var(--bg-hover);
            color: var(--text-muted);
        }

        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--space-md);
        }

        .form-grid.single {
            grid-template-columns: 1fr;
        }

        /* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Divider ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */

        .divider {
            display: flex;
            align-items: center;
            gap: var(--space-md);
            margin: var(--space-sm) 0;
        }

        .divider-line {
            flex: 1;
            height: 1px;
            background: var(--border);
        }

        .divider-text {
            font-size: var(--font-size-xs);
            color: var(--text-muted);
            text-transform: lowercase;
        }

        /* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Mode switch links ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */

        .mode-links {
            display: flex;
            justify-content: center;
            gap: var(--space-lg);
        }

        .mode-link {
            font-size: var(--font-size-sm);
            color: var(--text-secondary);
            cursor: default;
            background: none;
            border: none;
            padding: 0;
            transition: color var(--transition);
        }

        .mode-link:hover {
            color: var(--text-primary);
        }

        /* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Mode option cards ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */

        .mode-cards {
            display: flex;
            gap: var(--space-sm);
        }

        .mode-card {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 4px;
            padding: 12px 14px;
            border-radius: var(--radius-md);
            border: 1px solid var(--border);
            background: var(--bg-elevated);
            cursor: default;
            transition: border-color 0.2s, background 0.2s;
        }

        .mode-card:hover {
            border-color: var(--text-muted);
            background: var(--bg-hover);
        }

        .mode-card-title {
            font-size: var(--font-size-sm);
            font-weight: var(--font-weight-semibold);
            color: var(--text-primary);
        }

        .mode-card-desc {
            font-size: var(--font-size-xs);
            color: var(--text-muted);
            line-height: var(--line-height);
        }

        /* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Title row with help ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */

        .title-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--space-md);
        }
        .brand-logo {
            width: 120px;
            height: 32px;
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

        .title-row .page-title {
            margin-bottom: 0;
        }

        .help-btn {
            background: none;
            border: none;
            color: var(--text-muted);
            cursor: default;
            padding: 4px;
            border-radius: var(--radius-sm);
            transition: color 0.2s;
            display: flex;
            align-items: center;
        }

        .help-btn:hover {
            color: var(--text-secondary);
        }

        .help-btn * {
            pointer-events: none;
        }

        /* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Help content ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */

        .help-content {
            display: flex;
            flex-direction: column;
            gap: var(--space-md);
            max-height: 500px;
            overflow-y: auto;
        }

        .help-section {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .help-section-title {
            font-size: var(--font-size-xs);
            font-weight: var(--font-weight-semibold);
            color: var(--text-primary);
        }

        .help-section-text {
            font-size: var(--font-size-xs);
            color: var(--text-secondary);
            line-height: var(--line-height);
        }

        .help-code {
            font-family: var(--font-mono);
            font-size: 11px;
            background: var(--bg-hover);
            padding: 6px 8px;
            border-radius: var(--radius-sm);
            color: var(--text-primary);
            display: block;
        }

        .help-link {
            color: var(--accent);
            cursor: default;
            text-decoration: none;
        }

        .help-link:hover {
            text-decoration: underline;
        }

        .help-models {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .help-model {
            font-size: var(--font-size-xs);
            color: var(--text-secondary);
            display: flex;
            justify-content: space-between;
        }

        .help-model-name {
            font-family: var(--font-mono);
            font-size: 11px;
            color: var(--text-primary);
        }

        .help-divider {
            border: none;
            border-top: 1px solid var(--border);
            margin: 0;
        }

        .help-cloud-btn {
            background: #e8e8e8;
            color: #111111;
            border: none;
            padding: 10px var(--space-md);
            border-radius: var(--radius-sm);
            font-size: var(--font-size-sm);
            font-family: var(--font);
            font-weight: var(--font-weight-semibold);
            cursor: default;
            width: 100%;
            transition: opacity 0.15s;
        }

        .help-cloud-btn:hover {
            opacity: 0.9;
        }

        .help-warn {
            font-size: var(--font-size-xs);
            color: var(--warning);
            line-height: var(--line-height);
        }

        .home-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            margin-bottom: 24px;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .header-right {
            display: flex;
            align-items: center;
            gap: 24px;
        }

        .refresh-btn {
            background: transparent;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            transition: background 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .refresh-btn:hover {
            background: var(--bg-hover);
            color: var(--text-primary);
        }

        .start-btn-blue {
            background: var(--accent);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 10px 24px;
            font-size: 15px;
            font-weight: 600;
            display: flex;
            align-items: center;
            cursor: pointer;
            transition: transform 0.2s, background 0.2s;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        .start-btn-blue:hover {
            background: #2563eb;
            transform: scale(1.02);
        }

        .meetings-left-text {
            font-size: 11px;
            color: var(--text-muted);
            margin-top: 6px;
        }

        .avatar-circle {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: var(--accent);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            font-weight: bold;
            letter-spacing: 0.5px;
        }

        .home-subtext {
            font-size: 14px;
            color: var(--text-muted);
            margin-top: 8px;
        }

        .pinned-shortcuts-container::-webkit-scrollbar {
            width: 6px;
        }
        .pinned-shortcuts-container::-webkit-scrollbar-track {
            background: transparent;
        }
        .pinned-shortcuts-container::-webkit-scrollbar-thumb {
            background: var(--bg-hover);
            border-radius: 4px;
        }
        .pinned-shortcuts-container::-webkit-scrollbar-thumb:hover {
            background: var(--border-strong);
        }

        .pinned-shortcut-card {
            position: relative;
        }

        .unpin-btn {
            position: absolute;
            top: 12px;
            right: 12px;
            background: rgba(15, 23, 42, 0.8);
            
            border: 1px solid var(--bg-hover);
            border-radius: 50%;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ef4444;
            opacity: 0;
            transform: scale(0.9);
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            z-index: 10;
        }

        .pinned-shortcut-card:hover .unpin-btn {
            opacity: 1;
            transform: scale(1);
        }

        .unpin-btn:hover {
            background: #ef4444;
            color: white;
            border-color: #ef4444;
            transform: scale(1.1) !important;
        }

        .modal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: fadeIn 0.2s ease-out;
        }

        .modal-content {
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 24px;
            width: 340px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
            animation: slideUpFade 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            color: var(--text-primary);
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUpFade {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .history-list-container {
            display: flex;
            flex-direction: column;
            gap: 24px;
            width: 100%;
        }

        .history-group {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .history-group-title {
            font-size: 13px;
            color: var(--text-muted);
            font-weight: 600;
        }

        .history-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            border-radius: 8px;
            background: var(--bg-surface);
            border: 1px solid var(--border);
            cursor: pointer;
            transition: background 0.2s;
            width: 100%;
        }

        .history-row:hover {
            background: var(--bg-hover);
        }

        .history-title {
            font-size: 14px;
            font-weight: 500;
            color: var(--text-primary);
        }

        .history-time {
            font-size: 12px;
            color: var(--text-muted);
        }
    `;

    static properties = {
        onStart: { type: Function },
        onExternalLink: { type: Function },
        onNavigate: { type: Function },
        selectedProfile: { type: String },
        onProfileChange: { type: Function },
        isInitializing: { type: Boolean },
        whisperDownloading: { type: Boolean },
        statusText: { type: String },
        isPaused: { type: Boolean },
        isClickThrough: { type: Boolean },
        onToggleClickThrough: { type: Function },
        _profiles: { state: true },
        
        _selectedModeCategory: { state: true },
        _modeCategoryError: { state: true },
        _profileError: { state: true },

        // Internal state
        _mode: { state: true },
        _token: { state: true },
        _geminiKey: { state: true },
        _groqKey: { state: true },
        _openaiKey: { state: true },
        _tokenError: { state: true },
        _keyError: { state: true },
        // Local AI state
        _ollamaHost: { state: true },
        _ollamaModel: { state: true },
        _whisperModel: { state: true },
        _showLocalHelp: { state: true },
        _notes: { state: true },
        _loadingNotes: { state: true },
        _noteToUnpin: { state: true },
        _viewingNoteId: { state: true },
        isModeMenuOpen: { type: Boolean, state: true },
        isProfileMenuOpen: { type: Boolean, state: true }
    };

    constructor() {
        super();
        this.onStart = () => {};
        this.onExternalLink = () => {};
        this.onNavigate = () => {};
        this.selectedProfile = '';
        this.onProfileChange = () => {};
        this.isInitializing = false;
        this.whisperDownloading = false;
        this.isClickThrough = false;
        this.onToggleClickThrough = () => {};
        this.isModeMenuOpen = false;
        this.isProfileMenuOpen = false;
        this._profiles = [];

        this._selectedModeCategory = '';
        this._modeCategoryError = false;
        this._profileError = false;

        this._mode = 'byok';
        this._token = '';
        this._geminiKey = '';
        this._groqKey = '';
        this._openaiKey = '';
        this._tokenError = false;
        this._keyError = false;
        this._showLocalHelp = false;
        this._ollamaHost = 'http://127.0.0.1:11434';
        this._ollamaModel = 'llama3.1';
        this._whisperModel = 'Xenova/whisper-small';

        this._animId = null;
        this._time = 0;
        this._mouseX = -1;
        this._mouseY = -1;

        this._notes = [];
        this._loadingNotes = false;
        this._noteToUnpin = null;
        this._viewingNoteId = null;

        this.boundKeydownHandler = this._handleKeydown.bind(this);
        this._loadFromStorage();
    }

    async _loadFromStorage() {
        try {
            const [prefs, creds] = await Promise.all([
                hideWin.storage.getPreferences(),
                hideWin.storage.getCredentials().catch(() => ({})),
            ]);

            const storedMode = prefs.providerMode || 'byok';
            this._mode = storedMode === 'cloud' ? 'byok' : storedMode;

            if (storedMode === 'cloud') {
                await hideWin.storage.updatePreference('providerMode', this._mode);
            }

            // Load keys
            this._token = creds.cloudToken || '';
            this._geminiKey = await hideWin.storage.getApiKey().catch(() => '') || '';
            this._groqKey = await hideWin.storage.getGroqApiKey().catch(() => '') || '';
            this._openaiKey = creds.openaiKey || '';

            // Load local AI settings
            this._ollamaHost = prefs.ollamaHost || 'http://127.0.0.1:11434';
            this._ollamaModel = prefs.ollamaModel || 'llama3.1';
            this._whisperModel = prefs.whisperModel || 'Xenova/whisper-small';

            // Load profiles
            this._profiles = await hideWin.storage.getProfiles().catch(() => []);

            // Load pinned notes
            const allNotes = (await hideWin.storage.getNotes().catch(() => [])) || [];
            this.homeNotes = allNotes.filter(n => n.pinned);

            // Load pinned notes (shortcuts)
            this._loadingNotes = true;
            this.requestUpdate();
            this._notes = await hideWin.storage.getNotes().catch(() => []);
            this._loadingNotes = false;

            this.requestUpdate();
        } catch (e) {
            console.error('Error loading MainView storage:', e);
        }
    }

    async connectedCallback() {
        super.connectedCallback();
        document.addEventListener('keydown', this.boundKeydownHandler);
        
        this._handleOutsideClick = () => {
            if (this.isModeMenuOpen || this.isProfileMenuOpen) {
                this.isModeMenuOpen = false;
                this.isProfileMenuOpen = false;
                this.requestUpdate();
            }
        };
        document.addEventListener('click', this._handleOutsideClick);

        // Listen for profile updates from other views
        this._profilesListener = () => this._loadFromStorage();
        window.addEventListener('profiles-updated', this._profilesListener);
        window.addEventListener('notes-updated', this._profilesListener);

        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            this._sessionStatusListener = (event, status) => {
                this._sessionState = status.state || (status.active ? 'active' : 'idle');
                this._sessionStartTime = status.startTime;
                this._updateClock();
                this.requestUpdate();
            };
            ipcRenderer.on('session-status-changed', this._sessionStatusListener);
            
            // Check initial status
            ipcRenderer.invoke('get-session-status').then(status => {
                this._sessionState = status.state || (status.active ? 'active' : 'idle');
                this._sessionStartTime = status.startTime;
                this._updateClock();
                this.requestUpdate();
            }).catch(() => {});
            
            this._clockInterval = setInterval(() => {
                if (this._sessionState && this._sessionState !== 'idle' && this._sessionStartTime) {
                    this._updateClock();
                    this.requestUpdate();
                }
            }, 1000);
        }
        
        await this._loadFromStorage();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('keydown', this.boundKeydownHandler);
        document.removeEventListener('click', this._handleOutsideClick);
        window.removeEventListener('profiles-updated', this._profilesListener);
        window.removeEventListener('notes-updated', this._profilesListener);
        if (this._clockInterval) {
            clearInterval(this._clockInterval);
            this._clockInterval = null;
        }
        if (window.require && this._sessionStatusListener) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.removeListener('session-status-changed', this._sessionStatusListener);
        }
        if (this._animId) cancelAnimationFrame(this._animId);
    }

    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('_mode')) {
            // Stop old animation when switching modes
            if (this._animId) {
                cancelAnimationFrame(this._animId);
                this._animId = null;
            }
        }
    }

    getAppStatus() {
        if (this.isPaused) return 'paused';
        if (!this.statusText) return 'listening';
        const txt = this.statusText.toLowerCase();
        if (txt.includes('generating') || txt.includes('analyzing') || txt.includes('processing')) {
            return 'processing';
        }
        return 'listening';
    }

    renderStatusDot() {
        const status = this.getAppStatus();
        let color = '#22c55e';
        if (status === 'paused') color = '#eab308';
        else if (status === 'processing') color = '#ef4444';

        return html`
            <div style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px;">
                <div style="width: 8px; height: 8px; border-radius: 50%; background-color: ${color}; box-shadow: 0 0 10px ${color}; animation: pulse-status-main 2s infinite ease-in-out;"></div>
            </div>
            <style>
                @keyframes pulse-status-main {
                    0% { transform: scale(0.95); opacity: 0.5; box-shadow: 0 0 0 0 rgba(${status === 'paused' ? '234, 179, 8' : status === 'processing' ? '239, 68, 68' : '34, 197, 94'}, 0.7); }
                    70% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 6px rgba(0, 0, 0, 0); }
                    100% { transform: scale(0.95); opacity: 0.5; box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
                }
            </style>
        `;
    }

    _updateClock() {
        if (!this._sessionStartTime) {
            this._sessionTimerText = "00:00";
            return;
        }
        const diff = Math.floor((Date.now() - this._sessionStartTime) / 1000);
        const m = Math.floor(diff / 60).toString().padStart(2, '0');
        const s = (diff % 60).toString().padStart(2, '0');
        this._sessionTimerText = `${m}:${s}`;
    }

    _handleKeydown(e) {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        if ((isMac ? e.metaKey : e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            this._handleStart();
        }
    }

    // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Persistence ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬

    async _saveMode(mode) {
        this._mode = mode;
        this._tokenError = false;
        this._keyError = false;
        await hideWin.storage.updatePreference('providerMode', mode);
        this.requestUpdate();
    }

    async _saveToken(val) {
        this._token = val;
        this._tokenError = false;
        try {
            const creds = await hideWin.storage.getCredentials().catch(() => ({}));
            await hideWin.storage.setCredentials({ ...creds, cloudToken: val });
        } catch (e) {}
        this.requestUpdate();
    }

    async _saveGeminiKey(val) {
        this._geminiKey = val;
        this._keyError = false;
        await hideWin.storage.setApiKey(val);
        this.requestUpdate();
    }

    async _saveGroqKey(val) {
        this._groqKey = val;
        await hideWin.storage.setGroqApiKey(val);
        this.requestUpdate();
    }

    async _saveOpenaiKey(val) {
        this._openaiKey = val;
        try {
            const creds = await hideWin.storage.getCredentials().catch(() => ({}));
            await hideWin.storage.setCredentials({ ...creds, openaiKey: val });
        } catch (e) {}
        this.requestUpdate();
    }

    async _saveOllamaHost(val) {
        this._ollamaHost = val;
        await hideWin.storage.updatePreference('ollamaHost', val);
        this.requestUpdate();
    }

    async _saveOllamaModel(val) {
        this._ollamaModel = val;
        await hideWin.storage.updatePreference('ollamaModel', val);
        this.requestUpdate();
    }

    async _saveWhisperModel(val) {
        this._whisperModel = val;
        await hideWin.storage.updatePreference('whisperModel', val);
        this.requestUpdate();
    }

    _handleProfileChange(e) {
        const val = e.target.value;
        if (val === '__CREATE_NEW__') {
            this.onNavigate('ai-customize');
        } else {
            this.selectedProfile = val;
            this.onProfileChange(val);
            this.requestUpdate();
        }
    }

    // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Start ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬

    _handleStart() {
        if (this.isInitializing) return;

        // Only validate mode if we are starting a NEW session
        if (this._sessionState !== 'paused' && !this._selectedModeCategory) {
            this._modeCategoryError = true;
            this.requestUpdate();
            setTimeout(() => { this._modeCategoryError = false; this.requestUpdate(); }, 2000);
            return;
        }

        this.onStart(this._selectedModeCategory, this.selectedProfile);
    }
    
    async _handleEndSessionCompletely() {
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('end-session-completely');
            this._isSessionActive = false;
            this.requestUpdate();
        }
    }

    triggerApiKeyError() {
        this._keyError = this._mode !== 'local';
        this.requestUpdate();
        setTimeout(() => {
            this._tokenError = false;
            this._keyError = false;
            this.requestUpdate();
        }, 3000);
    }

    _formatDateGroup(dateString) {
        if (!dateString) return 'Unknown Date';
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
        
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    }

    _formatTime(dateString) {
        if (!dateString) return '';
        return new Date(dateString).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    }

    // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Render helpers ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬

    _renderStartButton() {
        return html`
            <button
                class="start-button ${this._keyError ? 'error' : ''}"
                style="${this._keyError ? 'background: var(--danger, #EF4444); color: white;' : ''}"
                @click=${() => this._handleStart()}
                ?disabled=${this.isInitializing}
            >
                ${this._keyError ? html`
                    Missing API Key (Check Settings)
                ` : this.isInitializing ? html`
                    <div class="spinner"></div> Starting...
                ` : html`
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Start Session
                `}
            </button>
        `;
    }

    _renderDivider() {
        return html`
            <div class="divider">
                <div class="divider-line"></div>
                <span class="divider-text">or</span>
                <div class="divider-line"></div>
            </div>
        `;
    }

    // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Cloud mode ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
    // Cloud UI intentionally disabled. Backend cloud wiring is still present in
    // the codebase, but the renderer no longer exposes this setup path.

    // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Mode + Profile selectors (rendered before Start button in all modes) ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬

    _renderActionBar() {
        const MODES = [
            { value: '', label: 'Select Mode' },
            { value: 'Job Interview', label: 'Job Interview' },
            { value: 'Business Meeting', label: 'Business Meeting' },
            { value: 'Sales Call', label: 'Sales Call' },
            { value: 'Presentation', label: 'Presentation' },
            { value: 'Negotiation', label: 'Negotiation' },
            { value: 'Exam Assistant', label: 'Exam Assistant' },
            { value: 'Custom', label: 'Custom' }
        ];

        // Profile options filtered based on selected mode
        const profileOptions = this._selectedModeCategory 
            ? (this._profiles || []).filter(p => p.type === this._selectedModeCategory) 
            : [];

        const isProfileValid = this.selectedProfile && profileOptions.some(p => (p.id || p.name) === this.selectedProfile);
        const displayProfileName = isProfileValid ? profileOptions.find(p => (p.id || p.name) === this.selectedProfile).name : 'Select Profile';

        // Dynamic border color based on validation error
        const borderColor = this._modeCategoryError ? '#ef4444' : 'var(--accent, var(--accent))';
        const outlineColor = this._modeCategoryError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)';

        return html`
            <div style="display: flex; flex-direction: column; align-items: center; margin: 0; padding: 0; width: 100%;">
                <div class="action-bar-wrapper">
                    
                    <!-- Mode Select (Custom Dropdown) -->
                      <div class="action-dropdown" @click=${(e) => { e.stopPropagation(); this.isModeMenuOpen = !this.isModeMenuOpen; this.isProfileMenuOpen = false; this.requestUpdate(); }}>
                        <div class="action-dropdown-content">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted); flex-shrink: 0;">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <span style="font-size: 15px; font-weight: ${this._selectedModeCategory ? '600' : '500'}; color: ${this._selectedModeCategory ? 'var(--text-primary)' : 'var(--text-muted)'}; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                ${this._selectedModeCategory ? (MODES.find(m => m.value === this._selectedModeCategory)?.label || this._selectedModeCategory) : 'Select Mode'}
                            </span>
                        </div>
                        
                        ${this.isModeMenuOpen ? html`
                            <div class="child-dropdown" style="position: absolute; top: calc(100% + 16px); left: -12px; width: calc(100% + 24px); background: var(--bg-surface); border: 1px solid var(--border); border-radius: 8px; z-index: 100; max-height: 280px; overflow-y: auto; padding: 8px; box-shadow: 0 16px 40px rgba(0,0,0,0.4);">
                                ${MODES.slice(1).map(m => html`
                                    <div style="padding: 12px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; color: ${this._selectedModeCategory === m.value ? 'var(--accent)' : 'var(--text-primary)'}; background: ${this._selectedModeCategory === m.value ? 'rgba(59, 130, 246, 0.1)' : 'transparent'}; transition: background 0.15s;" 
                                        @mouseover=${e => { if (this._selectedModeCategory !== m.value) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                                        @mouseout=${e => { if (this._selectedModeCategory !== m.value) e.currentTarget.style.background = 'transparent'; }}
                                        @click=${(e) => {
                                            e.stopPropagation();
                                            this._selectedModeCategory = m.value;
                                            this.selectedProfile = '';
                                            this._modeCategoryError = false;
                                            this.isModeMenuOpen = false;
                                            this.requestUpdate();
                                        }}>
                                        ${m.label}
                                    </div>
                                `)}
                            </div>
                        ` : ''}
                    </div>

                    

                    <!-- Profile Select (Custom Dropdown) -->
                      <div class="action-dropdown" @click=${(e) => { 
                        e.stopPropagation(); 
                        if (!this._selectedModeCategory) {
                            this._modeCategoryError = true;
                            this.requestUpdate();
                            setTimeout(() => { this._modeCategoryError = false; this.requestUpdate(); }, 2000);
                            return;
                        }
                        this.isProfileMenuOpen = !this.isProfileMenuOpen; 
                        this.isModeMenuOpen = false; 
                        this.requestUpdate(); 
                    }}>
                        <div class="action-dropdown-content">
                            <span style="font-size: 15px; font-weight: ${isProfileValid ? '600' : '500'}; color: ${isProfileValid ? 'var(--text-primary)' : 'var(--text-muted)'}; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                ${displayProfileName}
                            </span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted); flex-shrink: 0;">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>
                        
                        ${this.isProfileMenuOpen ? html`
                            <div class="child-dropdown" style="position: absolute; top: calc(100% + 16px); left: -12px; width: calc(100% + 24px); background: var(--bg-surface); border: 1px solid var(--border); border-radius: 8px; z-index: 100; max-height: 280px; overflow-y: auto; padding: 8px; box-shadow: 0 16px 40px rgba(0,0,0,0.4);">
                                <div style="padding: 12px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; color: ${!isProfileValid ? 'var(--accent)' : 'var(--text-primary)'}; background: ${!isProfileValid ? 'rgba(59, 130, 246, 0.1)' : 'transparent'}; transition: background 0.15s;" 
                                    @mouseover=${e => { if (isProfileValid) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                                    @mouseout=${e => { if (isProfileValid) e.currentTarget.style.background = 'transparent'; }}
                                    @click=${(e) => {
                                        e.stopPropagation();
                                        this.selectedProfile = '';
                                        this.isProfileMenuOpen = false;
                                        this.requestUpdate();
                                    }}>
                                    No Profile (AI Mode)
                                </div>
                                ${profileOptions.map(p => html`
                                    <div style="padding: 12px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; color: ${this.selectedProfile === (p.id || p.name) ? 'var(--accent)' : 'var(--text-primary)'}; background: ${this.selectedProfile === (p.id || p.name) ? 'rgba(59, 130, 246, 0.1)' : 'transparent'}; transition: background 0.15s;" 
                                        @mouseover=${e => { if (this.selectedProfile !== (p.id || p.name)) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                                        @mouseout=${e => { if (this.selectedProfile !== (p.id || p.name)) e.currentTarget.style.background = 'transparent'; }}
                                        @click=${(e) => {
                                            e.stopPropagation();
                                            this.selectedProfile = p.id || p.name;
                                            this.isProfileMenuOpen = false;
                                            this.requestUpdate();
                                        }}>
                                        ${p.name}
                                    </div>
                                `)}
                                <div style="height: 1px; background: var(--border); margin: 6px 0;"></div>
                                <div style="padding: 12px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; color: var(--accent); transition: background 0.15s;" 
                                    @mouseover=${e => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'}
                                    @mouseout=${e => e.currentTarget.style.background = 'transparent'}
                                    @click=${(e) => {
                                        e.stopPropagation();
                                        this.selectedProfile = '';
                                        this.isProfileMenuOpen = false;
                                        if (this.onNavigate) this.onNavigate('customize-ai');
                                    }}>
                                    + Add New Profile
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    <div style="width: 1px; height: 32px; background: var(--border); margin: 0 12px;"></div>

                    <!-- Mouse Toggle -->
                    <div class="mouse-toggle-wrapper stealth-tooltip" data-tooltip="Stealth Mode" @click=${(e) => { e.stopPropagation(); this.onToggleClickThrough && this.onToggleClickThrough(); }} style="pointer-events: auto; display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 8px; cursor: pointer;">
                        <span style="font-size: 13px; font-weight: 600; color: var(--text-primary); white-space: nowrap;">
                            ${this.isClickThrough ? 'Mouse Un-Detect' : 'Mouse Detect'}
                        </span>
                        <div style="width: 42px; height: 22px; border-radius: 6px; background: ${this.isClickThrough ? 'var(--bg-elevated)' : 'var(--text-muted)'}; border: 1px solid var(--border); position: relative; transition: all 0.3s ease; box-shadow: inset 0 1px 2px rgba(0,0,0,0.1); flex-shrink: 0;">
                            <div style="width: 18px; height: 18px; border-radius: 4px; background: #ffffff; position: absolute; top: 1px; left: ${this.isClickThrough ? '21px' : '1px'}; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.15);">
                                <div style="width: 10px; height: 10px; border-radius: 2px; background: ${this.isClickThrough ? 'var(--bg-elevated)' : 'var(--text-muted)'}; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">
                                    <div style="width: 5px; height: 1.5px; background: #ffffff; border-radius: 1px; transform: rotate(-45deg);"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Start/Active Buttons -->
                    <div class="action-buttons-wrapper">
                        ${this._sessionState === 'active' ? html`
                            <button class="primary-action-btn" @click=${() => this._handleStart()} >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                    <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                                    <rect x="14" y="4" width="4" height="16" rx="1"></rect>
                                </svg>
                                <span>Started</span>
                            </button>
                        ` : this._sessionState === 'paused' ? html`
                            <button class="primary-action-btn" @click=${() => this._handleStart()} >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                <span>Resume</span>
                            </button>
                        ` : html`
                            <button class="primary-action-btn" @click=${() => this._handleStart()} >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                <span>Start</span>
                            </button>
                        `}
                    </div>
                </div>

                <!-- Active Session Timer and Stop Button below the panel -->
                ${this._sessionState && this._sessionState !== 'idle' ? html`
                    <div style="display: flex; align-items: center; justify-content: center; gap: 24px; width: 100%; max-width: 850px; margin-top: 16px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            ${this.renderStatusDot()}
                            <span style="font-size: 20px; font-weight: 700; color: var(--text-primary); font-variant-numeric: tabular-nums; letter-spacing: 1px;">
                                ${this._sessionTimerText || '00:00'}
                            </span>
                        </div>
                        <button class="primary-action-btn" @click=${() => this._handleEndSessionCompletely()} >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                <rect x="5" y="5" width="14" height="14" rx="2" ry="2"></rect>
                            </svg>
                            <span style="font-weight: 600; font-size: 14px; color: white;">Stop</span>
                        </button>
                    </div>
                ` : ''}

                <!-- Validation message beneath the pill -->
                <div style="height: 20px; width: 100%; max-width: 800px; display: flex; align-items: center; padding-left: 20px; margin-top: 8px;">
                    ${this._modeCategoryError ? html`
                        <span style="color: #ef4444; font-size: 12px; font-weight: 500; margin-top: 8px;">Please select mode</span>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ BYOK mode ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬

    _renderByokMode() {
        return html`
            <div class="form-wrapper">
                ${this._renderModeProfileSelectors()}
                ${this._renderStartButton()}
            </div>
        `;
    }

    // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Local AI mode ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬

    _renderLocalMode() {
        return html`
            <div class="form-group">
                <label class="form-label">Ollama Host</label>
                <input
                    type="text"
                    placeholder="http://127.0.0.1:11434"
                    .value=${this._ollamaHost}
                    @input=${e => this._saveOllamaHost(e.target.value)}
                />
                <div class="form-hint">Ollama must be running locally</div>
            </div>

            <div class="form-group">
                <label class="form-label">Ollama Model</label>
                <input
                    type="text"
                    placeholder="llama3.1"
                    .value=${this._ollamaModel}
                    @input=${e => this._saveOllamaModel(e.target.value)}
                />
                <div class="form-hint">Run <code style="font-family: var(--font-mono); font-size: 11px; background: var(--bg-elevated); padding: 1px 4px; border-radius: 3px;">ollama pull ${this._ollamaModel}</code> first</div>
            </div>

            <div class="form-group">
                <div class="whisper-label-row">
                    <label class="form-label">Whisper Model</label>
                    ${this.whisperDownloading ? html`<div class="whisper-spinner"></div>` : ''}
                </div>
                <select
                    .value=${this._whisperModel}
                    @change=${e => this._saveWhisperModel(e.target.value)}
                >
                    <option value="Xenova/whisper-tiny" ?selected=${this._whisperModel === 'Xenova/whisper-tiny'}>Tiny (fastest, least accurate)</option>
                    <option value="Xenova/whisper-base" ?selected=${this._whisperModel === 'Xenova/whisper-base'}>Base</option>
                    <option value="Xenova/whisper-small" ?selected=${this._whisperModel === 'Xenova/whisper-small'}>Small (recommended)</option>
                    <option value="Xenova/whisper-medium" ?selected=${this._whisperModel === 'Xenova/whisper-medium'}>Medium (most accurate, slowest)</option>
                </select>
                <div class="form-hint">${this.whisperDownloading ? 'Downloading model...' : 'Downloaded automatically on first use'}</div>
            </div>

            ${this._renderStartButton()}

            <!-- Cloud promo intentionally removed from the active UI. -->
        `;
    }

    async confirmUnpin() {
        if (!this._noteToUnpin) return;
        const note = this._notes.find(n => n.id === this._noteToUnpin.id);
        if (note) {
            note.pinned = false;
            note.shortcutName = null;
            await hideWin.storage.saveNotes(this._notes);
            window.dispatchEvent(new CustomEvent('notes-updated'));
            this._notes = await hideWin.storage.getNotes().catch(() => []);
            this.requestUpdate();
        }
        this._noteToUnpin = null;
    }

    cancelUnpin() {
        this._noteToUnpin = null;
    }

    openNoteViewer(note) {
        this._viewingNoteId = note.id;
    }

    closeNoteViewer() {
        this._viewingNoteId = null;
    }

    render() {
        const pinnedNotes = (this._notes || []).filter(n => n.pinned);

        return html`
            <div class="home-container">
                <!-- Header -->
                <div class="home-header">
                    <div class="header-left">
                        

                    </div>

                    <div class="header-right">
                        <div style="display:flex; flex-direction:column; align-items:center;">
                            <span class="meetings-left-text" style="font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.7);">Unlimited sessions left</span>
                        </div>
                    </div>
                </div>

                ${this._renderActionBar()}

                <div class="home-subtext" style="font-size: 14px; font-weight: 600; color: var(--text-primary); text-align: center; margin-top: clamp(8px, 2vh, 24px); margin-bottom: 0;">
                    Pinned Shortcuts
                </div>

                <div class="pinned-shortcuts-container">
                    <div class="pinned-shortcut-card" @click=${() => this.onNavigate('notes')} style="flex-shrink: 0; width: 100px; height: 100px; background: transparent; border: 2px dashed var(--border); border-radius: 6px; padding: 12px; cursor: pointer; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; position: relative;" onmouseover="this.style.background='rgba(59, 130, 246, 0.05)'; this.style.borderColor='rgba(59, 130, 246, 0.4)'; this.style.transform='translateY(-4px)';" onmouseout="this.style.background='transparent'; this.style.borderColor='var(--border)'; this.style.transform='translateY(0)';">
                        <div style="width: 24px; height: 24px; border-radius: 50%; background: rgba(59, 130, 246, 0.1); display: flex; align-items: center; justify-content: center; color: var(--accent); transition: transform 0.2s;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </div>
                        <div style="font-size: 11px; font-weight: 500; color: var(--text-primary); text-align: center;">
                            Add
                        </div>
                    </div>
                    ${pinnedNotes.map(note => html`
                        <div class="pinned-shortcut-card" @click=${() => this.openNoteViewer(note)} style="flex-shrink: 0; width: 100px; height: 100px; background: rgba(120, 120, 120, 0.05); border: 1px solid var(--border); border-radius: 6px; padding: 12px; cursor: pointer; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); display: flex; flex-direction: column; gap: 8px; position: relative;" onmouseover="this.style.background='rgba(120, 120, 120, 0.08)'; this.style.transform='translateY(-4px)'; this.style.borderColor='rgba(99, 102, 241, 0.4)'; this.style.boxShadow='0 12px 24px rgba(0,0,0,0.1), 0 0 0 1px rgba(99,102,241,0.2)';" onmouseout="this.style.background='rgba(120, 120, 120, 0.05)'; this.style.transform='translateY(0)'; this.style.borderColor='var(--border)'; this.style.boxShadow='none';">
                            <button class="unpin-btn" title="Unpin from Home" @click=${(e) => { e.stopPropagation(); this._noteToUnpin = note; }} style="position: absolute; top: -6px; right: -6px; width: 20px; height: 20px; padding: 0;">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                            <div style="display: flex; align-items: center; justify-content: center; width: 100%;">
                                <div style="width: 24px; height: 24px; border-radius: 6px; background: rgba(59, 130, 246, 0.15); display: flex; align-items: center; justify-content: center; color: var(--accent);">
                                    ${note.type === 'image' ? html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>` : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`}
                                </div>
                            </div>
                            <div style="font-size: 11px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: auto; text-align: center; width: 100%;">
                                ${note.shortcutName || note.title || 'Untitled Note'}
                            </div>
                            <div style="font-size: 9px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-transform: uppercase; letter-spacing: 0.5px; text-align: center; width: 100%;">
                                ${note.type === 'image' ? 'Image Note' : note.ext || 'Text Note'}
                            </div>
                        </div>
                    `)}
                </div>

                <!-- Unpin Confirmation Modal -->
                ${this._noteToUnpin ? html`
                    <div class="modal-overlay" @click=${() => this.cancelUnpin()}>
                        <div class="modal-content" @click=${e => e.stopPropagation()} style="display: flex; flex-direction: column; align-items: center; text-align: center; padding: 32px;">
                            <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(239, 68, 68, 0.1); color: #ef4444; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                            </div>
                            <h3 style="margin:0 0 12px 0; font-size: 18px; font-weight: 600;">Unpin Shortcut?</h3>
                            <p style="margin:0 0 24px 0; font-size: 14px; color: var(--text-muted); line-height: 1.5;">
                                This will remove "<strong>${this._noteToUnpin.shortcutName || this._noteToUnpin.title}</strong>" from your Home screen. The note itself will not be deleted.
                            </p>
                            <div style="display:flex; justify-content:center; gap: 12px; width: 100%;">
                                <button @click=${() => this.cancelUnpin()} style="flex: 1; padding: 10px 16px; border: 1px solid var(--border-color); background: var(--bg-hover); color: var(--text-primary); cursor: pointer; border-radius: 8px; font-weight: 500; transition: background 0.2s;" onmouseover="this.style.background='var(--bg-hover)'" onmouseout="this.style.background='var(--bg-hover)'">Cancel</button>
                                <button @click=${() => this.confirmUnpin()} style="flex: 1; padding: 10px 16px; border: none; background: #ef4444; color: white; cursor: pointer; border-radius: 8px; font-weight: 500; transition: background 0.2s; box-shadow: 0 4px 12px rgba(239,68,68,0.3);" onmouseover="this.style.background='#dc2626'" onmouseout="this.style.background='#ef4444'">Unpin</button>
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- Inline Viewer Modal -->
                ${this._viewingNoteId ? (() => {
                    const viewingNote = this._notes.find(n => n.id === this._viewingNoteId);
                    if (!viewingNote) return '';
                    return html`
                        <style>
                            .modal-content.fullscreen-viewer {
                                width: 100vw !important;
                                height: 100vh !important;
                                border-radius: 0 !important;
                                background: var(--bg-surface);
                            }
                            .fullscreen-viewer .doc-viewer-wrapper {
                                width: 100%;
                                height: 100%;
                                display: flex;
                                flex-direction: column;
                            }
                            .fullscreen-viewer .doc-viewer-body {
                                flex: 1;
                                display: flex;
                                height: 100%;
                            }
                            .fullscreen-viewer .doc-viewer-sidebar {
                                display: none !important;
                            }
                            .fullscreen-viewer .doc-viewer-embed {
                                flex: 1;
                                width: 100%;
                                height: 100%;
                                border: none;
                            }
                            .fullscreen-viewer .doc-sidebar-header {
                                padding: 12px 16px;
                                font-weight: 600;
                                font-size: 14px;
                                color: var(--text-primary);
                                border-bottom: 1px solid var(--border-color);
                            }
                            .fullscreen-viewer .doc-page-btn {
                                padding: 8px 16px;
                                border: none;
                                background: transparent;
                                width: 100%;
                                text-align: left;
                                cursor: pointer;
                                color: var(--text-secondary);
                            }
                            .fullscreen-viewer .doc-page-btn:hover {
                                background: var(--bg-hover);
                            }
                        </style>
                        <div class="modal-overlay" @click=${() => this.closeNoteViewer()} style="background:rgba(0,0,0,0.9); z-index: 9999;">
                            <div class="modal-content fullscreen-viewer" @click=${e => e.stopPropagation()} style="display: flex; flex-direction: column; padding: 0; overflow: hidden;">
                                <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; border-bottom: 1px solid var(--border-color); background: var(--bg-elevated);">
                                    <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: var(--text-primary);">${viewingNote.title || 'Untitled Note'}</h3>
                                    <button @click=${() => this.closeNoteViewer()} style="background:transparent; border:none; color:var(--text-muted); cursor:pointer; padding:8px; border-radius:8px;" onmouseover="this.style.background='var(--bg-hover)'" onmouseout="this.style.background='transparent'">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                </div>
                                <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column;">
                                    ${viewingNote.type === 'image' && viewingNote.imageData ? html`
                                        <div style="flex: 1; display:flex; justify-content:center; align-items:center; padding: 24px; background: rgba(0,0,0,0.2);">
                                            <img src=${viewingNote.imageData} style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
                                        </div>
                                    ` : html`
                                        <div style="flex: 1; width: 100%; height: 100%; line-height: 1.6; color: var(--text-secondary); font-size: 14px; white-space: pre-wrap; ${viewingNote.content?.includes('doc-viewer-wrapper') ? 'padding: 0;' : 'padding: 24px;'}" .innerHTML=${viewingNote.content || '<em>No content</em>'}></div>
                                    `}
                                </div>
                            </div>
                        </div>
                    `;
                })() : ''}
            </div>
        `;
    }
}

customElements.define('main-view', MainView);








