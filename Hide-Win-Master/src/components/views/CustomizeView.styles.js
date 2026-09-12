import { css } from '../../assets/lit-core-2.7.4.min.js';
import { unifiedPageStyles } from './sharedPageStyles.js';

export const customizeStyles = [
    unifiedPageStyles,
    css`
            .sidebar-layout {
                display: flex;
                height: 100vh;
                background: var(--bg-app);
                color: var(--text-primary);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }

            .sidebar {
                width: 240px;
                background: var(--bg-surface);
                border-right: 1px solid var(--border);
                display: flex;
                flex-direction: column;
                padding: 24px 0;
                flex-shrink: 0;
            }

            .sidebar-group {
                display: flex;
                flex-direction: column;
                margin-bottom: 24px;
            }

            .sidebar-group-title {
                font-size: 11px;
                font-weight: 600;
                color: #9CA3AF;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                padding: 0 24px;
                margin-bottom: 8px;
            }

            .sidebar-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px 24px;
                font-size: 14px;
                font-weight: 500;
                color: var(--text-secondary);
                cursor: pointer;
                border-left: 3px solid transparent;
                transition: all 0.2s;
            }

            .sidebar-item:hover {
                background: var(--bg-hover);
                color: var(--text-primary);
            }

            .sidebar-item.active {
                background: var(--bg-hover);
                color: var(--text-primary);
                border-left-color: #3B82F6;
            }

            .sidebar-item svg {
                width: 18px;
                height: 18px;
                opacity: 0.7;
            }

            .sidebar-item.active svg {
                opacity: 1;
                color: #3B82F6;
            }

            .main-content {
                flex: 1;
                overflow-y: auto;
                padding: 40px;
                background: var(--bg-app);
            }

            /* Billing specific CSS */
            .billing-header {
                text-align: center;
                margin-bottom: 40px;
            }

            .billing-header h1 {
                font-size: 28px;
                font-weight: 700;
                color: var(--text-primary);
                margin: 0 0 8px 0;
            }

            .billing-header p {
                font-size: 14px;
                color: var(--text-muted);
                margin: 0;
            }

            .billing-toggle {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 12px;
                margin-bottom: 32px;
                font-size: 14px;
                color: var(--text-secondary);
            }

            .billing-toggle .badge {
                background: #EFF6FF;
                color: #3B82F6;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
            }

            .pricing-cards {
                display: flex;
                gap: 24px;
                justify-content: center;
                max-width: 800px;
                margin: 0 auto;
            }

            .pricing-card {
                flex: 1;
                border-radius: 20px;
                padding: 32px;
                display: flex;
                flex-direction: column;
                position: relative;
                overflow: hidden;
            }

            .pricing-card.blue {
                background: #60A5FA;
                color: white;
            }

            .pricing-card.dark {
                background: #4B5563;
                color: white;
            }

            .pricing-title {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 16px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .popular-badge {
                background: rgba(255,255,255,0.2);
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 12px;
            }

            .pricing-price {
                display: flex;
                align-items: baseline;
                gap: 8px;
                margin-bottom: 32px;
            }

            .pricing-price .strikethrough {
                font-size: 18px;
                opacity: 0.6;
                text-decoration: line-through;
            }

            .pricing-price .current {
                font-size: 32px;
                font-weight: 700;
            }

            .pricing-price .period {
                font-size: 14px;
                opacity: 0.8;
            }

            .feature-list {
                display: flex;
                flex-direction: column;
                gap: 16px;
                margin-bottom: 32px;
                flex: 1;
            }

            .feature-item {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                font-size: 14px;
                line-height: 1.4;
            }

            .feature-icon {
                width: 20px;
                height: 20px;
                background: rgba(255,255,255,0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }

            .feature-icon svg {
                width: 12px;
                height: 12px;
            }

            .upgrade-btn {
                width: 100%;
                padding: 12px;
                border-radius: 8px;
                font-size: 15px;
                font-weight: 600;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                cursor: pointer;
                border: none;
                transition: opacity 0.2s;
            }

            .upgrade-btn:hover {
                opacity: 0.9;
            }

            .upgrade-btn.white {
                background: white;
                color: #3B82F6;
            }

            .upgrade-btn.blue {
                background: #3B82F6;
                color: white;
            }

            .btn-badge {
                font-size: 11px;
                padding: 2px 6px;
                border-radius: 10px;
                background: rgba(0,0,0,0.1);
            }

            .graphic-placeholder {
                height: 120px;
                background: rgba(255,255,255,0.1);
                border-radius: 8px;
                border: 1px dashed rgba(255,255,255,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: 16px;
                margin-bottom: 32px;
                font-size: 12px;
                opacity: 0.8;
            }

            /* Legacy Settings CSS wrapper */
            .legacy-settings-wrapper {
                max-width: 680px;
                margin: 0 auto;
                background: #FFFFFF;
                border: 1px solid #E5E7EB;
                border-radius: 12px;
                padding: 24px;
                color: var(--text-primary);
            }

            .legacy-settings-wrapper .settings-card {
                background: var(--bg-app);
                border: 1px solid #E5E7EB;
                margin-bottom: 16px;
                color: var(--text-primary);
            }

            .legacy-settings-wrapper .form-label {
                color: #374151;
            }

            .legacy-settings-wrapper .form-control {
                background: #FFFFFF;
                border: 1px solid #D1D5DB;
                color: var(--text-primary);
            }

            .legacy-settings-wrapper .settings-card-title {
                color: var(--text-secondary);
            }


            .settings-card {
                background: var(--bg-surface, rgba(255, 255, 255, 0.03));
                border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
                border-radius: 12px;
                padding: 20px 24px;
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .settings-card-title {
                font-size: 12px;
                font-weight: 700;
                color: var(--text-muted);
                text-transform: uppercase;
                letter-spacing: 0.06em;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .form-row {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .form-row-horizontal {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 16px;
            }

            .form-label {
                font-size: 13px;
                font-weight: 600;
                color: var(--text-primary);
            }

            .form-control {
                height: 38px;
                padding: 0 12px;
                background: rgba(255, 255, 255, 0.04);
                border: 1px solid rgba(255, 255, 255, 0.12);
                border-radius: 8px;
                color: var(--text-primary);
                font-size: 13px;
                font-family: var(--font);
                outline: none;
                transition: all 0.2s ease;
                width: 100%;
            }

            .form-control:focus {
                border-color: var(--accent);
                box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
            }

            .input-with-button {
                display: flex;
                align-items: center;
                gap: 8px;
                width: 100%;
            }

            .input-with-button .form-control {
                flex: 1;
            }

            .eye-btn {
                height: 38px;
                padding: 0 14px;
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.06);
                border: 1px solid rgba(255, 255, 255, 0.12);
                color: var(--text-primary);
                font-size: 12px;
                font-weight: 600;
                cursor: default;
                white-space: nowrap;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 4px;
                transition: all 0.2s ease;
            }

            .eye-btn:hover {
                background: rgba(99, 102, 241, 0.2);
                border-color: var(--accent);
            }

            .form-hint {
                font-size: 11px;
                color: var(--text-muted);
                margin-top: 2px;
            }

            .slider-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 4px;
            }

            .slider-badge {
                font-family: var(--font-mono);
                font-size: 11px;
                font-weight: 600;
                color: var(--accent);
                background: rgba(99, 102, 241, 0.12);
                border: 1px solid rgba(99, 102, 241, 0.3);
                border-radius: 4px;
                padding: 2px 8px;
            }

            .slider-input {
                -webkit-appearance: none;
                appearance: none;
                width: 100%;
                height: 5px;
                border-radius: 3px;
                background: var(--border);
                outline: none;
                cursor: default;
            }

            .slider-input::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: var(--text-primary);
                cursor: default;
                transition: transform 0.15s ease;
            }

            .slider-input::-webkit-slider-thumb:hover {
                transform: scale(1.25);
            }

            .danger-card {
                border-color: rgba(239, 68, 68, 0.3);
                background: rgba(239, 68, 68, 0.02);
            }

            .danger-button {
                padding: 8px 16px;
                border-radius: 8px;
                border: 1px solid rgba(239, 68, 68, 0.4);
                background: rgba(239, 68, 68, 0.1);
                color: #ef4444;
                font-size: 12px;
                font-weight: 600;
                cursor: default;
                transition: all 0.2s ease;
            }

            .danger-button:hover:not(:disabled) {
                background: rgba(239, 68, 68, 0.25);
                border-color: #ef4444;
            }

            .status-msg {
                font-size: 12px;
                margin-top: 6px;
            }
            .status-msg.success { color: #10b981; }
            .status-msg.error { color: #ef4444; }

        @media (max-width: 768px) {
            .sidebar-layout {
                flex-direction: column !important;
                height: 100% !important;
                background: var(--bg-app) !important;
            }
            .sidebar {
                display: none !important; /* Moved to main drawer */
            }
            .sidebar::-webkit-scrollbar {
                display: none;
            }
            .sidebar-group {
                display: flex !important;
                flex-direction: row !important;
                margin-bottom: 0 !important;
                align-items: center !important;
            }
            .sidebar-group-title {
                display: none !important;
            }
            .sidebar-item {
                padding: 8px 16px !important;
                border-radius: 20px !important;
                margin-bottom: 0 !important;
                margin-right: 8px !important;
                white-space: nowrap !important;
                background: transparent !important;
                font-size: 14px !important;
            }
            .sidebar-item.active {
                background: var(--accent) !important;
                color: #fff !important;
            }
            .sidebar-item.active svg {
                color: #fff !important;
            }
            .main-content {
                padding: 16px !important;
                flex: 1 !important;
                overflow-y: auto !important;
                background: var(--bg-app) !important;
            }
            .legacy-settings-wrapper {
                padding: 0 !important;
            }
            .setting-row {
                flex-direction: column !important;
                align-items: flex-start !important;
                gap: 8px !important;
            }
            .setting-row > div:last-child {
                width: 100% !important;
            }
            .setting-row input, .setting-row select {
                width: 100% !important;
            }
        }

        `
];
