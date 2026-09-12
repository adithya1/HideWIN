import { css } from '../../assets/lit-core-2.7.4.min.js';

export const scheduleMeetingStyles = [
    css`
            * { box-sizing: border-box; }


            :host {
                display: block;
                height: 100%;
                width: 100%;
                overflow: hidden;

            .social-btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 16px 8px;
                border: 1px solid #e5e7eb;
                border-radius: 12px;
                background: #ffffff;
                color: #4b5563;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 2px 4px rgba(0,0,0,0.02);
            }
            .social-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 16px rgba(0,0,0,0.06);
            }
            .social-btn.copy:hover { border-color: #6b7280; color: #111827; }
            .social-btn.whatsapp:hover { border-color: #25D366; color: #25D366; }
            .social-btn.gmail:hover { border-color: #EA4335; color: #EA4335; }
            .social-btn.outlook:hover { border-color: #0078D4; color: #0078D4; }
            .social-btn.hidewin:hover { border-color: var(--accent); color: var(--accent); }

            @keyframes slideDown {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .step-create .header-title { animation: fadeIn 0.4s ease-out; }
            .step-share { animation: fadeIn 0.4s ease-out; }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            }

            /* Custom Scrollbar */
    
            .editor-content:empty::before {
                content: attr(data-placeholder);
                color: #aaa;
                pointer-events: none;
            }
            .editor-content ul, .editor-content ol {
                margin: 6px 0;
                padding-left: 22px;
            }
            .editor-content li {
                margin: 2px 0;
            }
            .editor-content h1, .editor-content h2 {
                margin: 8px 0 4px;
                font-weight: 700;
            }
            .editor-content blockquote {
                border-left: 3px solid var(--accent, #185fc4);
                margin: 4px 0;
                padding: 4px 12px;
                color: var(--text-secondary, #605e5c);
                background: rgba(0,0,0,0.02);
            }
            .editor-content img {
                max-width: 100%;
                height: auto;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                margin: 8px 0;
            }
        
            
            
            
            
            
            
            

            .teams-container {
                background: white;
                height: 100%;
                display: flex;
                flex-direction: column;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                color: #242424;
            }
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 24px;
                border-bottom: 1px solid #e1dfdd;
            }
            .header-left {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .header-icon {
                background: #185fc4;
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .header-title {
                font-size: 20px;
                font-weight: 600;
                margin: 0;
            }
            .header-actions {
                display: flex;
                gap: 8px;
            }
            .btn {
                padding: 6px 16px;
                border-radius: 4px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                border: 1px solid #d1d1d1;
                background: white;
            }
            .btn-primary {
                background: #185fc4;
                color: white;
                border: none;
                box-shadow: 0 4px 14px rgba(24, 95, 196, 0.4);
            }
            .btn-primary:hover {
                background: #1550a6;
                                box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1);
            }
            .form-body {
                padding: 24px;
                overflow-y: auto;
                flex: 1;
                width: 100%; box-sizing: border-box;
            }
            .tz-selector {
                color: #605e5c;
                font-size: 12px;
                margin-bottom: 24px;
                cursor: pointer;
            }
            .info-banner {
                background: #f3f2f1;
                padding: 12px 16px;
                border-radius: 4px;
                display: flex;
                gap: 12px;
                margin-bottom: 24px;
                font-size: 14px;
            }
            .form-row {
                display: flex;
                align-items: flex-start;
                gap: 16px;
                margin-bottom: 16px;
            }
            .row-icon {
                color: #605e5c;
                margin-top: 8px;
            }
            .input-field {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #d1d1d1;
                border-radius: 4px;
                font-size: 14px;
                font-family: inherit;
            }
            .input-field:focus {
                outline: 2px solid var(--accent);
                border-color: transparent;
            }
            .title-input {
                font-size: 20px;
                font-weight: 600;
            }
            .datetime-row {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .date-picker { width: 140px; }
            .time-picker { width: 110px; }
            
            .attendees-container {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                border: 1px solid #d1d1d1;
                padding: 4px 8px;
                border-radius: 4px;
                min-height: 36px;
                align-items: center;
            }
            .attendee-chip {
                background: rgba(37, 99, 235, 0.1);
                color: var(--accent);
                padding: 2px 8px;
                border-radius: 16px;
                font-size: 12px;
                display: flex;
                align-items: center;
                gap: 4px;
                user-select: none;
            }
            .attendee-chip input {
                border: none;
                background: transparent;
                outline: none;
                color: var(--accent);
                font-size: 12px;
                width: 100px;
            }
            .cc-bcc-btn {
                background: transparent;
                border: none;
                color: #605e5c;
                cursor: pointer;
                font-size: 13px;
                font-weight: 600;
                margin-left: 8px;
            }
            .cc-bcc-btn:hover {
                text-decoration: underline;
                color: var(--accent);
            }
            .attachment-pill {
                display: flex;
                align-items: center;
                gap: 6px;
                background: #f3f2f1;
                padding: 4px 10px;
                border-radius: 16px;
                font-size: 12px;
                border: 1px solid #e1dfdd;
            }

            .attendee-input {
                border: none;
                outline: none;
                flex: 1;
                min-width: 150px;
                font-size: 14px;
            }
            
            .editor-wrapper {
                border: 1px solid #d1d1d1;
                border-radius: 6px;
                overflow: hidden;
                background: var(--bg-app, #fff);
            }
            .editor-toolbar {
                border-bottom: 1px solid #d1d1d1;
                padding: 6px 10px;
                display: flex;
                gap: 2px;
                background: var(--bg-surface, #fafafa);
                flex-wrap: wrap;
                align-items: center;
            }
            .toolbar-group {
                display: flex;
                align-items: center;
                gap: 2px;
            }
            .toolbar-divider {
                width: 1px;
                height: 20px;
                background: #d1d1d1;
                margin: 0 6px;
            }
            .toolbar-btn {
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: none;
                background: transparent;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
                color: var(--text-primary, #323130);
                transition: background 0.12s;
            }
            .toolbar-btn:hover {
                background: rgba(0,0,0,0.07);
            }
            .toolbar-btn svg {
                width: 14px;
                height: 14px;
                stroke: currentColor;
                fill: none;
                stroke-width: 2;
            }
            .editor-content {
                min-height: 160px;
                max-height: 320px;
                overflow-y: auto;
                padding: 12px;
                font-size: 14px;
                line-height: 1.6;
                outline: none;
                font-family: inherit;
            }
            .toast-notification {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #333;
                color: white;
                padding: 12px 24px;
                border-radius: 4px;
                z-index: 1000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .toast-notification.success { background: #107c10; }
            .toast-notification.error { background: #d13438; }
        `
];
