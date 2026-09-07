import { css } from '../../../assets/lit-core-2.7.4.min.js';
import { unifiedPageStyles } from './sharedPageStyles.js';

export const inviteStyles = [
    unifiedPageStyles,
    css`
            * { box-sizing: border-box; }

            :host {
                display: block;
                height: 100%;
                overflow-y: auto;
            }

            
            .toast-notification {
                position: fixed;
                bottom: 24px;
                right: 24px;
                padding: 12px 24px;
                border-radius: 8px;
                color: white;
                font-weight: 600;
                font-size: 14px;
                z-index: 9999;
                box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .toast-notification.success {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                border: 1px solid #34d399;
            }
            .toast-notification.error {
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                border: 1px solid #f87171;
            }
            @keyframes slideIn {
                from { transform: translateY(100px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .admit-modal {
                position: fixed;
                top: 24px;
                left: 50%;
                transform: translateX(-50%);
                background: #1e293b;
                border: 1px solid #334155;
                padding: 16px 24px;
                border-radius: 12px;
                box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2), 0 10px 10px -5px rgba(0,0,0,0.1);
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 12px;
                animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                min-width: 300px;
            }
            .admit-modal-title { font-weight: 600; color: white; font-size: 15px; }
            .admit-modal-actions { display: flex; gap: 10px; justify-content: flex-end; }
            .admit-btn { background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500; }
            .admit-btn:hover { background: #2563eb; }
            .deny-btn { background: transparent; color: #cbd5e1; border: 1px solid #475569; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500; }
            .deny-btn:hover { background: #334155; }
            @keyframes slideDown { from { transform: translate(-50%, -50px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
            
            .posh-meeting-container {
                display: flex;
                flex-direction: column;
                height: 100vh;
                background: white;
                margin: -24px; /* offset the .invite-container padding */
            }
            .meeting-top-bar {
                height: 60px;
                background: white;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 16px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                z-index: 20;
            }
            .top-bar-left { display: flex; align-items: center; gap: 12px; width: 200px; }
            .top-bar-center { display: flex; align-items: center; gap: 4px; justify-content: center; flex: 1; }
            .top-bar-right { display: flex; align-items: center; gap: 12px; width: 200px; justify-content: flex-end; }

            .meeting-timer {
                font-size: 14px;
                font-weight: 600;
                color: #374151;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .meeting-action-btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: transparent;
                border: none;
                cursor: pointer;
                color: #4b5563;
                min-width: 68px;
                height: 52px;
                border-radius: 8px;
                transition: background 0.15s ease;
            }
            .meeting-action-btn:hover, .meeting-action-btn.active {
                background: #f3f4f6;
                color: #111827;
            }
            .meeting-action-btn svg { width: 20px; height: 20px; margin-bottom: 4px; }
            .meeting-action-btn span { font-size: 11px; font-weight: 500; }

            .leave-btn {
                background: #ef4444;
                color: white;
                border-radius: 6px;
                padding: 6px 16px;
                font-weight: 600;
                font-size: 14px;
                border: none;
                cursor: pointer;
                transition: background 0.15s ease;
            }
            .leave-btn:hover { background: #dc2626; }

            .meeting-main-area {
                display: flex;
                flex: 1;
                background: #f3f2f1;
                position: relative;
                overflow: hidden;
            }

            .meeting-stage {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                position: relative;
            }

            .avatar-circle {
                width: 120px;
                height: 120px;
                border-radius: 50%;
                background: #fce7f3;
                color: #831843;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 40px;
                font-weight: 500;
                margin-bottom: 24px;
            }
            .waiting-text {
                font-size: 18px;
                color: #374151;
                font-weight: 500;
            }

            .meeting-sidebar {
                width: 320px;
                background: white;
                border-left: 1px solid #e5e7eb;
                display: flex;
                flex-direction: column;
                box-shadow: -4px 0 15px rgba(0,0,0,0.03);
                z-index: 10;
            }
            .sidebar-header {
                padding: 16px 20px;
                border-bottom: 1px solid #e5e7eb;
                font-size: 16px;
                font-weight: 600;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .sidebar-close {
                background: none; border: none; cursor: pointer; color: #6b7280; padding: 4px; border-radius: 4px;
                display: flex; align-items: center; justify-content: center;
            }
            .sidebar-close:hover { background: #f3f4f6; color: #111827; }
            .sidebar-content {
                flex: 1;
                overflow-y: auto;
            }

            .invite-container {


                margin: 0;
                padding: 24px;
            }

            .section-card {
                background: var(--bg-card);
                border: 1px solid var(--border);
                border-radius: 12px;
                padding: 24px;
                margin-bottom: 24px;
            }

            .section-title {
                font-size: 14px;
                font-weight: 600;
                color: var(--text-secondary);
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 16px;
            }

            .input-group {
                margin-bottom: 20px;
            }

            .input-label {
                display: block;
                font-size: 13px;
                color: var(--text-primary);
                margin-bottom: 8px;
            }

            .text-input {
                width: 100%;
                max-width: 400px;
                background: var(--bg-input);
                border: 1px solid var(--border);
                color: var(--text-primary);
                padding: 10px 14px;
                border-radius: 8px;
                font-size: 14px;
                transition: border-color 0.2s;
            }

            .text-input:focus {
                outline: none;
                border-color: #3b82f6;
            }

            .primary-btn {
                background: #3b82f6;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: background 0.2s;
            }

            .primary-btn:hover {
                background: #2563eb;
            }

            .secondary-btn {
                background: var(--bg-hover);
                color: var(--text-primary);
                border: 1px solid var(--border);
                padding: 10px 20px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                transition: all 0.2s;
            }

            .secondary-btn:hover {
                background: var(--bg-active);
            }

            .danger-btn {
                background: rgba(239, 68, 68, 0.1);
                color: #ef4444;
                border: 1px solid rgba(239, 68, 68, 0.2);
                padding: 10px 20px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
            }

            .danger-btn:hover {
                background: rgba(239, 68, 68, 0.2);
            }

            .meeting-id {
                font-size: 24px;
                font-weight: 700;
                color: var(--text-primary);
                letter-spacing: 1px;
                margin-bottom: 16px;
                font-family: monospace;
            }

            .participant-list {
                margin-top: 24px;
            }

            .participant-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 16px;
                background: var(--bg-app);
                border: 1px solid var(--border);
                border-radius: 8px;
                margin-bottom: 8px;
            }

            .participant-info {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .status-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
            }
            .status-dot.active { background: #10b981; }
            .status-dot.waiting { background: #f59e0b; }

            .participant-name {
                font-size: 14px;
                font-weight: 500;
                color: var(--text-primary);
            }

            .participant-role {
                font-size: 13px;
                color: var(--text-secondary);
            }

            .actions {
                display: flex;
                gap: 8px;
            }

            .action-btn {
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                border: none;
            }
            .action-btn.accept {
                background: rgba(16, 185, 129, 0.1);
                color: #10b981;
            }
            .action-btn.accept:hover { background: rgba(16, 185, 129, 0.2); }
            
            .action-btn.reject {
                background: rgba(239, 68, 68, 0.1);
                color: #ef4444;
            }
            .action-btn.reject:hover { background: rgba(239, 68, 68, 0.2); }

            .sharing-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 16px;
                margin-bottom: 24px;
            }

            .checkbox-label {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 14px;
                color: var(--text-primary);
                cursor: pointer;
            }

            .checkbox-label input[type="checkbox"
];
