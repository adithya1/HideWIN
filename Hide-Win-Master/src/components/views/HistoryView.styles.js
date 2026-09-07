import { css } from '../../../assets/lit-core-2.7.4.min.js';
import { unifiedPageStyles } from './sharedPageStyles.js';

export const historyStyles = [
    unifiedPageStyles,
    css`
            .unified-page {
                overflow-y: hidden;
                display: flex;
                flex-direction: column;
                height: 100%;
            }

            .unified-wrap {
                height: 100%;
                display: flex;
                flex-direction: column;
            }

            .page-header-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: var(--space-md);
            }

            .page-title {
                font-size: 24px;
                font-weight: 700;
                color: #1e3a8a;
                letter-spacing: -0.01em;
            }

            
            .notes-toolbar { display: flex; align-items: center; justify-content: space-between; gap: var(--space-sm); background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); padding: var(--space-sm) var(--space-md); border-radius: 16px; border: 1px solid rgba(59, 130, 246, 0.2); box-shadow: 0 4px 24px -8px rgba(59, 130, 246, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.5); flex-wrap: wrap; color: #0f172a; margin-bottom: var(--space-md); }
            .search-box { display: flex; align-items: center; gap: 6px; background: #ffffff; border: 1px solid rgba(59, 130, 246, 0.3); box-shadow: inset 0 2px 4px rgba(59, 130, 246, 0.05); border-radius: 12px; padding: 4px 10px; min-width: 180px; transition: all 0.2s; height: 42px; box-sizing: border-box; flex: 1; }
            .search-box:focus-within { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2), inset 0 2px 4px rgba(59, 130, 246, 0.05); }
            .search-box input { background: transparent; border: none; color: #0f172a; width: 100%; font-size: var(--font-size-sm); outline: none; padding: 0; }
            .icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 10px; border: 1px solid transparent; background: transparent; color: #64748b; cursor: pointer; transition: all 0.2s; }
            .icon-btn:hover { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
            .icon-btn.active { background: #ffffff; border-color: rgba(59, 130, 246, 0.3); color: #3b82f6; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1); }
            .icon-btn svg { width: 18px; height: 18px; }
            .notes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: var(--space-md); }
            .grid-viewport { flex: 1; overflow-y: auto; padding-right: 4px; }
            .session-card.grid-mode { flex-direction: column; align-items: flex-start; }
            .search-wrap {
                position: relative;
                max-width: 100%;
            }

            .search-icon {
                position: absolute;
                left: 14px;
                top: 50%;
                transform: translateY(-50%);
                width: 16px;
                height: 16px;
                color: var(--text-muted);
                pointer-events: none;
                opacity: 0.6;
            }

            .search-wrap .control {
                width: 100%;
                padding: 0 16px 0 40px;
                border-radius: 12px;
                background: #ffffff;
                border: 1px solid rgba(59, 130, 246, 0.3);
                box-shadow: inset 0 2px 4px rgba(59, 130, 246, 0.05);
                color: #0f172a;
                height: 42px;
                font-size: 14px;
                transition: all 0.3s ease;
            }

            .search-wrap .control:focus {
                background: #ffffff;
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2), inset 0 2px 4px rgba(59, 130, 246, 0.05);
                outline: none;
            }

            .list-shell {
                flex: 1;
                display: flex;
                flex-direction: column;
                min-height: 0;
                border-radius: 16px;
                background: transparent;
            }

            .sessions-list {
                overflow-y: auto;
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 12px;
                padding: 4px;
                padding-right: 8px; /* For scrollbar */
            }

            .session-card {
                width: 100%;
                border: 1px solid rgba(59, 130, 246, 0.2);
                border-radius: 16px;
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(12px);
                text-align: left;
                padding: 16px 20px;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: var(--space-md);
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.05);
            }

            .session-card:hover {
                background: rgba(255, 255, 255, 1);
                border-color: rgba(59, 130, 246, 0.4);
                transform: translateY(-2px);
                box-shadow: 0 8px 24px rgba(59, 130, 246, 0.15);
            }

            .session-left {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .session-profile {
                color: #0f172a;
                font-size: 16px;
                font-weight: 600;
                letter-spacing: 0.01em;
            }

            .session-date {
                color: #64748b;
                font-size: 13px;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            
            .session-date svg {
                opacity: 0.6;
            }

            .session-badge {
                color: #a5b4fc;
                font-size: 12px;
                font-weight: 600;
                background: rgba(99, 102, 241, 0.1);
                border: 1px solid rgba(99, 102, 241, 0.2);
                border-radius: 20px;
                padding: 4px 12px;
                white-space: nowrap;
                box-shadow: 0 2px 8px rgba(99, 102, 241, 0.1);
            }

            /* Detail View */
            .detail-top {
                display: flex;
                align-items: center;
                gap: 16px;
                margin-bottom: var(--space-md);
                padding: 14px 16px;
                background: #ffffff;
                border: 1px solid rgba(59, 130, 246, 0.2);
                border-radius: 16px;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.05);
            }

            .back-btn {
                border: 1px solid rgba(59, 130, 246, 0.2);
                background: rgba(59, 130, 246, 0.1);
                border-radius: 50%;
                width: 36px;
                height: 36px;
                color: #3b82f6;
                padding: 0;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .back-btn:hover {
                background: rgba(255,255,255,0.1);
                border-color: rgba(255,255,255,0.15);
                transform: translateX(-4px);
            }

            .detail-info {
                color: #0f172a;
                font-size: 16px;
                font-weight: 600;
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            .detail-info-sub {
                font-size: 12px;
                color: #64748b;
                font-weight: 400;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .tab-row {
                display: flex;
                gap: 4px;
                margin-bottom: 16px;
                background: rgba(59, 130, 246, 0.1);
                padding: 4px;
                border-radius: 12px;
                align-self: flex-start;
                border: 1px solid rgba(59, 130, 246, 0.2);
            }

            .tab-btn {
                border: none;
                border-radius: 8px;
                background: transparent;
                color: #64748b;
                padding: 8px 16px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 600;
                transition: all 0.2s ease;
            }

            .tab-btn:hover {
                color: #1e3a8a;
                background: rgba(255,255,255,0.5);
            }

            .tab-btn.active {
                background: #ffffff;
                color: #1e3a8a;
                box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
            }

            .details-scroll {
                overflow-y: auto;
                flex: 1;
                min-height: 0;
                display: flex;
                flex-direction: column;
                gap: 20px;
                padding: 8px 16px 24px 8px;
            }

            /* Ultra Chat Bubbles */
            .message-row {
                display: flex;
                flex-direction: column;
                max-width: 85%;
                animation: slideUp 0.3s ease-out forwards;
            }

            @keyframes slideUp {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .message-row.user {
                align-self: flex-end;
                align-items: flex-end;
            }

            .message-row.ai,
            .message-row.screen {
                align-self: flex-start;
                align-items: flex-start;
            }

            .message {
                border-radius: 8px; /* Blockier look */
                padding: 16px 20px;
                word-break: break-word;
                user-select: text;
                cursor: text;
                font-size: 14.5px;
                line-height: 1.6;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                position: relative;
            }

            .message-body {
                white-space: pre-wrap;
            }

            /* User Question */
            .message-row.user .message {
                background: #f1f5f9; /* Light gray block */
                color: #0f172a;
                border: 1px solid #e2e8f0;
            }

            /* AI Answer */
            .message-row.ai .message,
            .message-row.screen .message {
                background: #ffffff; /* White block */
                color: #0f172a;
                border: 1px solid #cbd5e1;
            }

            .message-meta {
                font-size: 11px;
                color: #64748b;
                margin-top: 6px;
                display: flex;
                align-items: center;
                gap: 6px;
                font-weight: 500;
            }

            .message-row.user .message-meta {
                justify-content: flex-end;
                padding-right: 4px;
            }

            .message-row.ai .message-meta,
            .message-row.screen .message-meta {
                justify-content: flex-start;
                padding-left: 4px;
            }

            .message-meta svg {
                opacity: 0.6;
            }

            /* Context Row */
            .context-row {
                display: flex;
                align-items: flex-start;
                gap: 16px;
                padding: 16px;
                border: 1px solid rgba(59, 130, 246, 0.2);
                border-radius: 12px;
                background: #ffffff;
                box-shadow: 0 2px 8px rgba(59, 130, 246, 0.05);
            }

            .context-key {
                width: 100px;
                color: var(--text-muted);
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                font-weight: 600;
                flex-shrink: 0;
            }

            .context-value {
                color: var(--text-primary);
                font-size: 14px;
                line-height: 1.5;
                white-space: pre-wrap;
                word-break: break-word;
                user-select: text;
                cursor: text;
            }

            .empty {
                color: var(--text-muted);
                font-size: 15px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 12px;
                min-height: 160px;
                border: 1px dashed rgba(255,255,255,0.1);
                border-radius: 16px;
                background: rgba(255,255,255,0.01);
            }

        

        
        @media (max-width: 768px) {
            .notes-toolbar {
                flex-direction: column !important;
                align-items: stretch !important;
                padding: 6px 40px !important;
                gap: 6px !important;
                height: auto !important;
            }
            .search-box { width: 100% !important; height: 32px !important; }
            .search-box input { width: 100% !important; font-size: 12px !important; }
            .grid-viewport { padding: 8px !important; }
            .notes-grid { grid-template-columns: 1fr !important; gap: 8px !important; }
            .session-card { flex-direction: column; align-items: flex-start; padding: 10px !important; }
            .detail-top { padding: 8px !important; }
            .detail-info { font-size: 14px !important; }
            .session-profile { font-size: 14px !important; }
            .session-date { font-size: 11px !important; }
            .message-body { font-size: 12px !important; padding: 8px 12px !important; }
            .tab-btn { font-size: 11px !important; padding: 6px 12px !important; }
            .context-row { padding: 8px !important; flex-direction: column; gap: 4px; }
        }
`
];
