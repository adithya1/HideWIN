import { css } from '../../assets/lit-core-2.7.4.min.js';
import { unifiedPageStyles } from './sharedPageStyles.js';

export const aiCustomizeStyles = [
    unifiedPageStyles,
    css`
            :host {
                display: flex;
                flex-direction: column;
                height: 100%;
                background: var(--bg-app);
                color: var(--text-primary);
                font-family: var(--font);
                overflow: hidden;
            }

            .profiles-container {
                display: flex;
                flex-direction: column;
                height: 100%;
                padding: var(--space-md);
                gap: var(--space-md);
                overflow: hidden;
            }

            /* ── Top Header Banner with Big Create Button ── */
            .profiles-header-banner {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%);
                padding: 14px 20px;
                border-radius: var(--radius-lg);
                border: 1px solid rgba(99, 102, 241, 0.3);
                gap: 16px;
                flex-wrap: wrap;
            }

            .btn-create-big {
                display: inline-flex;
                align-items: center;
                gap: 10px;
                padding: 10px 24px;
                border-radius: 12px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                border: none;
                background: #185fc4;
                color: white;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 4px 14px rgba(24, 95, 196, 0.4);
            }

            .btn-create-big:hover {
                transform: translateY(-2px);
                background: #1550a6;
                box-shadow: 0 6px 20px rgba(24, 95, 196, 0.6) !important;
            }

            .btn-create-big svg {
                width: 18px;
                height: 18px;
            }

            
            .notes-toolbar { display: flex; align-items: center; justify-content: space-between; gap: var(--space-sm); background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); padding: var(--space-sm) var(--space-md); border-radius: 16px; border: 1px solid rgba(59, 130, 246, 0.2); box-shadow: 0 4px 24px -8px rgba(59, 130, 246, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.5); flex-wrap: wrap; color: #0f172a; margin-bottom: var(--space-md); }
            .icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 10px; border: 1px solid transparent; background: transparent; color: #64748b; cursor: pointer; transition: all 0.2s; }
            .icon-btn:hover { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
            .icon-btn.active { background: #ffffff; border-color: rgba(59, 130, 246, 0.3); color: #3b82f6; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1); }
            .icon-btn svg { width: 18px; height: 18px; }
            .notes-list { display: flex; flex-direction: column; gap: var(--space-sm); overflow-y: auto; }
            .profile-card.list-mode { display: flex; flex-direction: row; align-items: center; justify-content: space-between; padding: 12px 16px; height: auto; min-height: unset; gap: var(--space-md); }
            .profile-card.list-mode .card-body { padding: 0; flex: 1; flex-direction: row; align-items: center; gap: var(--space-md); }
            .profile-card.list-mode .title-row { margin-bottom: 0; flex: 1; }
            .profile-card.list-mode .doc-labels { justify-content: flex-end; }
            .search-box {
                display: flex;
                align-items: center;
                gap: 8px;
                background: #ffffff;
                border: 1px solid rgba(59, 130, 246, 0.3);
                box-shadow: inset 0 2px 4px rgba(59, 130, 246, 0.05);
                border-radius: 12px;
                padding: 4px 10px;
                min-width: 220px;
                height: 42px;
                box-sizing: border-box;
                transition: all 0.2s;
            }

            .search-box:focus-within {
                border-color: #3b82f6;
                background: #ffffff;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2), inset 0 2px 4px rgba(59, 130, 246, 0.05);
            }

            .search-box svg {
                width: 14px;
                height: 14px;
                color: #64748b;
                flex-shrink: 0;
            }

            .search-input {
                background: transparent;
                border: none;
                color: #0f172a;
                font-size: 14px;
                outline: none;
                width: 100%;
                padding: 0;
            }

            .search-input::placeholder {
                color: #94a3b8;
            }

            /* ── Grid Viewport ── */
            .grid-viewport {
                flex: 1;
                overflow-y: auto;
                padding-right: 4px;
            }

            .profiles-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: var(--space-md);
                padding-bottom: 20px;
            }

            /* ── User Profile Card ── */
            .profile-card {
                display: flex;
                flex-direction: column;
                background: #ffffff;
                border: 1px solid rgba(59, 130, 246, 0.2);
                border-radius: var(--radius-lg);
                padding: 14px;
                gap: 10px;
                position: relative;
                cursor: default;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                min-height: 185px;
                color: #0f172a;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.05);
            }

            .profile-card:hover {
                border-color: #3b82f6;
                box-shadow: 0 6px 20px rgba(59, 130, 246, 0.15);
                transform: translateY(-2px);
            }

            .profile-card.active {
                border-color: #3b82f6;
                background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
            }

            .card-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
            }

            .id-badge {
                font-size: 10px;
                font-weight: 700;
                color: var(--accent);
                background: rgba(99, 102, 241, 0.15);
                padding: 2px 8px;
                border-radius: 4px;
                border: 1px solid rgba(99, 102, 241, 0.3);
            }

            .user-name {
                font-size: 14px;
                font-weight: 700;
                color: #0f172a;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                flex: 1;
            }

            .type-badge {
                font-size: 10px;
                font-weight: 600;
                padding: 2px 8px;
                border-radius: 4px;
                text-transform: uppercase;
                background: rgba(59, 130, 246, 0.1);
                color: #3b82f6;
                border: 1px solid rgba(59, 130, 246, 0.2);
            }

            .card-details {
                display: flex;
                flex-direction: column;
                gap: 6px;
                flex: 1;
            }

            .detail-row {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            .detail-label {
                font-size: 10px;
                font-weight: 600;
                color: #64748b;
                text-transform: uppercase;
            }

            .file-tag {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                font-size: 11px;
                color: var(--success);
                background: rgba(34, 197, 94, 0.12);
                padding: 2px 8px;
                border-radius: 4px;
                width: fit-content;
            }

            .snippet-text {
                font-size: 11px;
                line-height: 1.4;
                color: var(--text-secondary);
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                word-break: break-word;
            }

            .card-footer {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top: auto;
                padding-top: 10px;
                border-top: 1px solid var(--border);
            }

            .btn-action {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                padding: 6px 14px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 600;
                cursor: pointer;
                border: 1px solid rgba(59, 130, 246, 0.3);
                background: #ffffff;
                color: #0f172a;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .btn-action:hover {
                border-color: #3b82f6;
                background: #f8fafc;
            }

            .btn-action.active {
                background: #185fc4;
                color: #ffffff;
                border: none;
                box-shadow: 0 4px 14px rgba(24, 95, 196, 0.4);
            }

            .action-btn-icon {
                background: transparent;
                border: none;
                color: var(--text-muted);
                padding: 4px;
                border-radius: var(--radius-sm);
                cursor: default;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .action-btn-icon:hover {
                color: var(--danger);
                background: rgba(239, 68, 68, 0.15);
            }

            /* ── 800x800 Focus Window Modal ── */
            .modal-backdrop {
                position: fixed;
                inset: 0;
                z-index: 99999;
                background: rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(4px);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: var(--space-md);
            }

            .modal-card {
                background: var(--bg-surface);
                border: 1px solid var(--border-strong);
                border-radius: var(--radius-lg);
                width: 90vw;
                max-width: 800px;
                height: 85vh;
                max-height: 800px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                box-shadow: 0 16px 40px rgba(0, 0, 0, 0.85);
            }

            .modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 14px 20px;
                border-bottom: 1px solid var(--border);
                background: var(--bg-elevated);
            }

            .modal-title {
                font-size: 15px;
                font-weight: 700;
                color: var(--text-primary);
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .modal-body {
                padding: 20px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 16px;
                flex: 1;
            }

            .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
            }

            .form-group {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .form-label {
                font-size: 11px;
                font-weight: 600;
                color: var(--text-muted);
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .form-control {
                background: var(--bg-elevated);
                border: 1px solid rgba(128, 128, 128, 0.4);
                box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
                color: var(--text-primary);
                padding: 10px 12px;
                border-radius: var(--radius-sm);
                font-size: 13px;
                font-family: inherit;
                outline: none;
                transition: all var(--transition);
            }

            .form-control:focus {
                border-color: var(--accent);
                box-shadow: 0 0 0 2px rgba(128, 128, 128, 0.2);
            }

            textarea.form-control {
                min-height: 110px;
                resize: vertical;
                line-height: 1.5;
            }

            .modal-footer {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 14px 20px;
                border-top: 1px solid var(--border);
                background: var(--bg-elevated);
            }

            .hidden-file-input {
                display: none;
            }
        
            .analyze-canvas {
            position: absolute;
            inset: -1px;
            width: calc(100% + 2px);
            height: calc(100% + 2px);
            pointer-events: none;
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
    `
];
