import { css } from '../../assets/lit-core-2.7.4.min.js';
import { unifiedPageStyles } from './sharedPageStyles.js';

export const meetingDashboardStyles = [
    unifiedPageStyles,
    css`
            * { box-sizing: border-box; }

            /* Minimal overrides to reuse unified styles for Meetings */

            .share-modal-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.4);
                backdrop-filter: blur(4px);
                -webkit-backdrop-filter: blur(4px);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.2s ease;
            }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            
            .share-modal {
                background: #ffffff;
                width: 90%;
                max-width: 420px;
                border-radius: 24px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.15);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .share-modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20px 24px;
                border-bottom: 1px solid #f3f4f6;
            }
            .share-modal-title {
                font-size: 18px;
                font-weight: 700;
                color: #111827;
                margin: 0;
            }
            .share-modal-close {
                background: transparent;
                border: none;
                cursor: pointer;
                color: #6b7280;
                padding: 4px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s;
            }
            .share-modal-close:hover {
                background: #f3f4f6;
                color: #111827;
            }
            .share-modal-body {
                padding: 24px;
                display: flex;
                flex-direction: column;
                gap: 24px;
            }
            .share-info-block {
                display: flex;
                flex-direction: column;
                gap: 16px;
                background: #f9fafb;
                padding: 16px;
                border-radius: 16px;
                border: 1px solid #f3f4f6;
            }
            .share-info-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .share-info-label {
                font-size: 13px;
                color: #6b7280;
                font-weight: 500;
            }
            .share-info-value {
                font-size: 15px;
                color: #111827;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .share-copy-btn {
                background: transparent;
                border: none;
                color: #4f46e5;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
            }
            .share-copy-btn:hover {
                background: #e0e7ff;
            }
            
            .share-apps-row {
                display: flex;
                align-items: flex-start;
                gap: 20px;
                overflow-x: auto;
                padding-bottom: 8px;
                
            }
            .share-apps-row
            .share-app-btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                background: transparent;
                border: none;
                cursor: pointer;
                min-width: 60px;
                padding: 0;
            }
            .share-app-icon {
                width: 52px;
                height: 52px;
                border-radius: 50%;
                background: #f3f4f6;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #111827;
                transition: transform 0.2s, background 0.2s;
            }
            .share-app-btn:hover .share-app-icon {
                transform: scale(1.05);
                background: #e5e7eb;
            }
            .share-app-label {
                font-size: 12px;
                color: #4b5563;
                font-weight: 500;
            }
            .share-join-btn {
                background: #4f46e5;
                color: white;
                border: none;
                padding: 16px;
                border-radius: 16px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.2s, transform 0.1s;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            .share-join-btn:hover {
                background: #4338ca;
            }
            .share-join-btn:active {
                transform: scale(0.98);
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
            
            .card-type-badge.ACTIVE { background: #dff6dd; color: #107c10; }
            .card-type-badge.SCHEDULED { background: #e1dfdd; color: #323130; }

            .posh-card {
                background: #ffffff;
                border-radius: 16px;
                padding: 24px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.02);
                border: 1px solid #f3f4f6;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                display: flex;
                flex-direction: column;
                position: relative;
                overflow: hidden;
            }
            .posh-card:hover {
                                box-shadow: 0 12px 30px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.04);
            }
            
            .posh-card-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 16px;
            }
            .posh-card-title {
                font-size: 18px;
                font-weight: 700;
                color: #111827;
                margin: 0;
                line-height: 1.3;
            }
            .posh-badge {
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 0.5px;
                text-transform: uppercase;
            }
            .posh-badge.SCHEDULED { background: #e0e7ff; color: #4338ca; }
            .posh-badge.ACTIVE { background: #dcfce7; color: #166534; }
            .posh-badge.COMPLETED { background: #f3f4f6; color: #4b5563; }
            
            .posh-card-body {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin-bottom: 24px;
                flex: 1;
            }
            .posh-detail-row {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #4b5563;
                font-size: 14px;
                font-weight: 500;
            }
            .posh-detail-icon {
                color: #9ca3af;
                width: 16px;
                height: 16px;
            }
            
            .posh-actions-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-bottom: 16px;
            }
            .posh-btn {
                border: none;
                border-radius: 8px;
                padding: 10px 16px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            .posh-btn-primary {
                background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
                color: white;
                box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
            }
            .posh-btn-primary:hover {
                box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
                            }
            .posh-btn-secondary {
                background: #f3f4f6;
                color: #374151;
            }
            .posh-btn-secondary:hover {
                background: #e5e7eb;
            }
            .posh-btn-danger {
                background: #fef2f2;
                color: #ef4444;
            }
            .posh-btn-danger:hover {
                background: #fee2e2;
            }
            
            .posh-social-row {
                display: flex;
                justify-content: center;
                gap: 12px;
                padding-top: 16px;
                border-top: 1px solid #f3f4f6;
            }
            .posh-social-btn {
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 50%;
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: #6b7280;
                transition: all 0.2s ease;
            }
            .posh-social-btn:hover {
                background: #f9fafb;
                color: #111827;
                border-color: #d1d5db;
                            }
            
            
            .posh-list-layout {
                display: flex;
                flex-direction: column;
                gap: 16px;
                padding: 16px 24px 32px 24px;
                margin: 0 auto;
                width: 100%;
                max-width: 1100px;
            }
            .posh-list-item {
                background: #ffffff;
                border-radius: 12px;
                padding: 20px 24px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                border: 1px solid #f3f4f6;
                display: flex;
                align-items: center;
                justify-content: space-between;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            .posh-list-item:hover {
                                box-shadow: 0 8px 20px rgba(0,0,0,0.06);
            }
            .posh-list-info {
                flex: 1;
            }
            .posh-list-actions {
                display: flex;
                align-items: center;
            }

            .posh-grid-layout {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                gap: 24px;
                padding: 8px 4px 24px 4px;
            }

        `
];
