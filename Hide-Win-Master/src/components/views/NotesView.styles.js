import { css } from '../../../assets/lit-core-2.7.4.min.js';
import { unifiedPageStyles } from './sharedPageStyles.js';

export const notesStyles = [
    unifiedPageStyles,
    css`
            :host {
                display: flex;
                flex-direction: column;
                height: 100%;
                background: transparent;
                color: var(--text-primary);
                font-family: var(--font);
                overflow: hidden;
            }

            .notes-container {
                display: flex;
                flex-direction: column;
                height: 100%;
                padding: var(--space-md);
                gap: var(--space-md);
                box-sizing: border-box;
            }

            .upload-progress-card {
                background: rgba(38, 40, 48, 0.6);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: var(--radius-lg);
                padding: var(--space-md);
                display: flex;
                flex-direction: column;
                gap: var(--space-sm);
            }
            .upload-progress-info {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .upload-progress-file {
                display: flex;
                align-items: center;
                gap: var(--space-sm);
                font-size: var(--font-size-sm);
                color: var(--text-primary);
                font-weight: 500;
            }
            .upload-progress-file svg {
                width: 16px;
                height: 16px;
                color: var(--accent);
            }
            .upload-progress-eta {
                font-size: var(--font-size-xs);
                color: var(--text-muted);
            }
            .upload-progress-track {
                height: 6px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 3px;
                overflow: hidden;
            }
            .upload-progress-fill {
                height: 100%;
                background: var(--accent);
                transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .card-media {
                margin: -16px -16px 8px -16px;
                height: 120px;
                overflow: hidden;
            }
            .card-media img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .empty-state {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 16px;
                height: 100%;
                color: var(--text-muted);
                text-align: center;
            }
            .empty-state svg {
                width: 48px;
                height: 48px;
                opacity: 0.2;
            }
            .expanded-overlay {
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(15, 23, 42, 0.95);
                backdrop-filter: blur(8px);
                z-index: 100;
                display: flex;
                flex-direction: column;
                padding: var(--space-lg);
                animation: fade-in 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
            @keyframes fade-in {
                from { opacity: 0; transform: scale(0.98); }
                to { opacity: 1; transform: scale(1); }
            }
            .expanded-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding-bottom: var(--space-md);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                margin-bottom: var(--space-md);
            }
            .expanded-title {
                font-size: 18px;
                font-weight: 600;
                color: #fff;
            }
            .expanded-content {
                flex: 1;
                overflow-y: auto;
                color: var(--text-secondary);
                line-height: 1.6;
                font-size: 14px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: var(--radius-md);
                padding: var(--space-md);
            }
            .expanded-media {
                max-width: 100%;
                max-height: 60vh;
                object-fit: contain;
                border-radius: var(--radius-md);
                margin-bottom: var(--space-md);
            }

`
];
