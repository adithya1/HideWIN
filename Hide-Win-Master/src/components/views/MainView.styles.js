import { css } from '../../assets/lit-core-2.7.4.min.js';

export const mainViewStyles =     css`
        * {
            font-family: var(--font);
            cursor: default;
            user-select: none;
            box-sizing: border-box;
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
              /* IE and Edge */
              /* Firefox */
        }
        .child-dropdown

        :host {
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: var(--space-xl) var(--space-lg);
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

        /* ── Cloud promo card ── */

        .cloud-promo {
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 16px 20px;
            border-radius: 12px;
            border: 1px solid rgba(99, 102, 241, 0.2);
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.04) 100%);
            cursor: default;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cloud-promo:hover {
            border-color: rgba(99, 102, 241, 0.4);
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%);
            box-shadow: 0 0 30px rgba(99, 102, 241, 0.1), 0 0 60px rgba(139, 92, 246, 0.05);
            transform: translateY(-2px);
        }

        .cloud-promo-glow {
            position: absolute;
            top: -40%;
            right: -20%;
            width: 140px;
            height: 140px;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
            pointer-events: none;
            transition: opacity 0.3s ease;
        }

        .cloud-promo:hover .cloud-promo-glow {
            opacity: 1;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%);
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

        /* ── Form controls ── */

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
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: 10px 14px;
            width: 100%;
            border-radius: 12px;
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
            background: rgba(255, 255, 255, 0.08);
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
            background-color: #1e1e24;
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

        /* ── Start button ── */

        .start-button {
            width: 100%;
            padding: 14px 40px;
            border-radius: 12px;
            border: none;
            background: #185fc4;
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
            background: #1550a6;
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
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.05);
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

        /* ── Divider ── */

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

        /* ── Mode switch links ── */

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

        /* ── Mode option cards ── */

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

        /* ── Title row with help ── */

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

        /* ── Help content ── */

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

        /* ── NEW HOME LAYOUT ── */
        .home-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            padding: 40px 60px;
            box-sizing: border-box;
            background: var(--bg-app);
            overflow-y: auto;
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
            background: rgba(255,255,255,0.05);
            color: var(--text-primary);
        }

        .start-btn-blue {
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 100px;
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
            background: #3b82f6;
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
            color: var(--text-secondary);
            margin-bottom: 40px;
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
