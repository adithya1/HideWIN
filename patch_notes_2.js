import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';
import { unifiedPageStyles } from './sharedPageStyles.js';

export class NotesView extends LitElement {
    static styles = [
        unifiedPageStyles,
        css`
            * { box-sizing: border-box; }

            :host {
                display: flex;
                flex-direction: column;
                height: 100%;
                background: transparent;
                color: var(--text-primary);
                font-family: var(--font);
                overflow: hidden;
                position: relative;
            }

            .notes-container {
                display: flex;
                flex-direction: column;
                height: 100%;
                padding: var(--space-md);
                gap: var(--space-md);
                overflow: hidden;
            }

            /* ── Header Toolbar ── */
            .notes-toolbar {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: var(--space-sm);
                background: rgba(255, 255, 255, 0.85);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                padding: var(--space-sm) var(--space-md);
                border-radius: 16px;
                border: 1px solid rgba(59, 130, 246, 0.2);
                box-shadow: 0 4px 24px -8px rgba(59, 130, 246, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.5);
                flex-wrap: wrap;
                color: #0f172a;
            }

            .toolbar-actions {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .notes-btn {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 6px 14px;
                border-radius: 12px;
                font-size: var(--font-size-xs);
                font-weight: 600;
                cursor: pointer;
                border: 1px solid rgba(59, 130, 246, 0.2);
                background: #ffffff;
                color: #0f172a;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: inset 0 2px 4px rgba(59, 130, 246, 0.05);
            }

            .notes-btn:hover {
                background: #f8fafc;
                border-color: #3b82f6;
                            }

            .notes-btn.primary {
                background: #185fc4;
                color: white;
                border: none;
                box-shadow: 0 4px 14px rgba(24, 95, 196, 0.4);
            }

            .notes-btn.primary:hover {
                background: #1550a6;
                                box-shadow: 0 6px 20px rgba(24, 95, 196, 0.6) !important;
            }

            .notes-btn.danger:hover {
                background: rgba(239, 68, 68, 0.2);
                border-color: rgba(239, 68, 68, 0.5);
                color: #f87171;
            }

            .notes-btn svg {
                width: 14px;
                height: 14px;
                flex-shrink: 0;
            }

            .search-box {
                display: flex;
                align-items: center;
                gap: 6px;
                background: #ffffff;
                border: 1px solid rgba(59, 130, 246, 0.3);
                box-shadow: inset 0 2px 4px rgba(59, 130, 246, 0.05);
                border-radius: 12px;
                padding: 4px 10px;
                min-width: 180px;
                transition: all 0.2s;
                height: 42px;
                box-sizing: border-box;
            }

            .search-box svg {
                width: 14px;
                height: 14px;
                color: #64748b;
                flex-shrink: 0;
            }

            .search-box:focus-within {
                border-color: #3b82f6;
                background: #ffffff;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2), inset 0 2px 4px rgba(59, 130, 246, 0.05);
            }

            .search-box input {
                background: transparent;
                border: none;
                color: #0f172a;
                width: 100%;
                font-size: var(--font-size-sm);
                outline: none;
                box-shadow: none;
                padding: 0;
            }

            .search-input::placeholder {
                color: #94a3b8;
            }

            /* ── Cards Grid Container ── */
            .grid-viewport {
                flex: 1;
                overflow-y: auto;
                padding-right: 4px;
            }

            .notes-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
                gap: var(--space-md);
                padding-bottom: 20px;
            }

            /* ── Card Block ── */
            .note-card {
                display: flex;
                flex-direction: column;
                background: rgba(38, 40, 48, 0.4);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 16px;
                padding: 16px;
                gap: 8px;
                position: relative;
                cursor: default;
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                min-height: 150px;
                max-height: 260px;
                overflow: hidden;
                box-shadow: 0 4px 24px -8px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.05);
            }

            .note-card:hover {
                                box-shadow: 0 8px 32px -8px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.12);
            }

            .card-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 6px;
            }

            .card-title {
                font-size: 13px;
                font-weight: 600;
                color: var(--text-primary);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                flex: 1;
            }

            .card-type-badge {
                font-size: 10px;
                font-weight: 600;
                padding: 2px 6px;
                border-radius: 4px;
                text-transform: uppercase;
                background: rgba(99, 102, 241, 0.15);
                color: var(--accent);
                border: 1px solid rgba(99, 102, 241, 0.2);
            }

            .card-type-badge.image {
                background: rgba(34, 197, 94, 0.15);
                color: var(--success);
                border-color: rgba(34, 197, 94, 0.2);
            }

            .card-media {
                width: 100%;
                height: 110px;
                border-radius: var(--radius-md);
                overflow: hidden;
                background: #000;
                border: 1px solid var(--border);
            }

            .card-media img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .card-content {
                font-size: 12px;
                line-height: 1.5;
                color: var(--text-secondary);
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 4;
                -webkit-box-orient: vertical;
                word-break: break-word;
                flex: 1;
            }

            .card-footer {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top: auto;
                padding-top: 6px;
                border-top: 1px solid var(--border);
            }

            .card-date {
                font-size: 10px;
                color: var(--text-muted);
            }

            .card-actions {
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .action-btn {
                background: transparent;
                border: none;
                color: var(--text-muted);
                padding: 4px;
                border-radius: var(--radius-sm);
                cursor: default;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all var(--transition);
            }

            .action-btn:hover {
                color: var(--text-primary);
                background: var(--bg-hover);
            }

            .action-btn.delete:hover {
                color: var(--danger);
                background: rgba(239, 68, 68, 0.15);
            }

            .action-btn svg {
                width: 13px;
                height: 13px;
            }

            /* ── Empty Grid View ── */
            .empty-state {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                color: var(--text-muted);
                gap: 12px;
                text-align: center;
                padding: 40px;
            }

            .empty-state svg {
                width: 48px;
                height: 48px;
                opacity: 0.4;
            }

            /* ── 100% Full-Window Expanded View ── */
            .full-note-view {
                position: absolute;
                inset: 0;
                z-index: 1000;
                background: var(--bg-app);
                display: flex;
                flex-direction: column;
                height: 100%;
                width: 100%;
                overflow: hidden;
                padding: 12px;
                gap: 12px;
                animation: slideUp 0.15s ease-out;
            }

            .full-note-view.doc-mode {
                padding: 0;
                gap: 0;
            }

            .full-note-view.doc-mode .full-note-header {
                border-radius: 0;
                border-left: none;
                border-right: none;
                border-top: none;
                padding: 6px 14px;
            }

            .full-note-view.doc-mode .full-note-body-wrapper {
                border-radius: 0;
                border: none;
            }

            @keyframes slideUp {
                from { opacity: 0;  }
                to { opacity: 1;  }
            }

            .full-note-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                background: var(--bg-surface);
                padding: 8px 14px;
                border-radius: var(--radius-lg);
                border: 1px solid var(--border);
            }

            .full-note-title-input {
                background: transparent;
                border: none;
                color: var(--text-primary);
                font-size: 15px;
                font-weight: 600;
                outline: none;
                flex: 1;
            }

            .full-note-body-wrapper {
                flex: 1;
                display: flex;
                flex-direction: column;
                border-radius: var(--radius-lg);
                border: 1px solid var(--border);
                overflow: hidden;
                background: #ffffff;
            }

            .editor-toolbar {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 6px 10px;
                background: #f8f9fa;
                border-bottom: 1px solid #e5e7eb;
                overflow-x: auto;
            }

            .toolbar-group {
                display: flex;
                align-items: center;
                gap: 2px;
            }

            .toolbar-divider {
                width: 1px;
                height: 20px;
                background: #d1d5db;
                margin: 0 6px;
            }

            .toolbar-btn {
                background: transparent;
                border: 1px solid transparent;
                color: #4b5563;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 13px;
                cursor: default;
                font-weight: 600;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .toolbar-btn svg {
                width: 14px;
                height: 14px;
            }

            .toolbar-btn:hover {
                background: #e5e7eb;
                color: #111827;
            }

            .full-note-body {
                flex: 1;
                display: flex;
                flex-direction: row;
                background: #ffffff; /* Notepad++ light mode background */
                overflow: hidden;
            }

            .editor-gutter {
                display: flex;
                flex-direction: column;
                background: #f0f0f0;
                border-right: 1px solid #d4d4d4;
                padding: 12px 8px;
                min-width: 40px;
                text-align: right;
                user-select: none;
                color: #2b91af;
                font-family: Consolas, "Courier New", monospace;
                font-size: 14px;
                line-height: 1.6;
            }

            .editor-line-number {
                display: block;
                height: 22.4px; /* match line-height exactly (14px * 1.6) */
            }

            .full-note-editor {
                flex: 1;
                padding: 12px 16px;
                color: #000000;
                font-family: Consolas, "Courier New", monospace;
                font-size: 14px;
                line-height: 1.6;
                outline: none;
                overflow-y: auto;
                white-space: pre-wrap; /* Preserve spaces and breaks */
                word-break: break-word;
                cursor: text;
            }

            /* Make sure selection works */
            .full-note-editor::selection {
                background: #b5d5ff;
            }

            .full-note-editor *::selection {
                background: #b5d5ff;
            }

            .full-note-editor img {
                max-width: 100%;
                max-height: 400px;
                border-radius: 4px;
                margin: 4px 0;
                display: block;
            }

            .full-note-editor ul, .full-note-editor ol {
                margin: 4px 0;
                padding-left: 24px;
            }

            .full-note-editor h1, .full-note-editor h2, .full-note-editor h3 {
                margin: 12px 0 6px 0;
                color: #111827;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            }

            .full-note-editor h1 { font-size: 24px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
            .full-note-editor h2 { font-size: 20px; }
            .full-note-editor h3 { font-size: 16px; }

            .full-note-editor hr {
                border: 0;
                border-top: 1px solid #e5e7eb;
                margin: 16px 0;
            }

            .file-badge {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 4px 10px;
                background: rgba(99, 102, 241, 0.15);
                border: 1px solid rgba(99, 102, 241, 0.3);
                border-radius: 6px;
                color: var(--accent);
                font-family: var(--font);
                font-size: 12px;
                cursor: pointer;
                user-select: none;
                margin: 4px;
                text-decoration: none;
            }

            .file-badge:hover {
                background: rgba(99, 102, 241, 0.25);
            }

            .file-badge svg {
                width: 14px;
                height: 14px;
            }

            .full-image-wrapper {
                display: none; /* We will use inline images now instead of the top wrapper */
            }

            /* Hidden file input */
            .hidden-file-input {
                display: none;
            }

            /* ── Document Viewer ── */
            .doc-viewer-wrapper {
                position: relative;
                width: 100%;
                margin: 0;
                border: none;
                border-radius: 0;
                overflow: hidden;
                background: #f9fafb;
                box-shadow: none;
            }

            /* Full-bleed doc embed inside editor */
            .full-note-editor.doc-mode {
                padding: 0;
                background: transparent;
            }

            .full-note-editor.doc-mode .doc-viewer-wrapper {
                margin: 0;
            }

            .doc-viewer-toolbar {
                display: none !important;
            }

            .doc-viewer-title {
                font-size: 12px;
                font-weight: 600;
                color: #475569;
                flex: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .doc-viewer-body {
                display: flex;
                width: 100%;
                height: 100%;
                overflow: hidden;
            }

            .doc-viewer-sidebar {
                display: none;
                flex-direction: column;
                width: 80px;
                min-width: 60px;
                max-width: 180px;
                background: #f8fafc;
                border-right: 1px solid #e2e8f0;
                overflow-y: auto;
                flex-shrink: 0;
                resize: horizontal;
                overflow-x: hidden;
            }

            .doc-viewer-sidebar.visible {
                display: flex;
            }

            .doc-sidebar-header {
                padding: 6px 8px;
                font-size: 10px;
                font-weight: 700;
                color: #94a3b8;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                border-bottom: 1px solid #e2e8f0;
                flex-shrink: 0;
            }

            .doc-sidebar-pages {
                display: flex;
                flex-direction: column;
                padding: 6px;
                gap: 4px;
            }

            .doc-page-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 6px 4px;
                border: 1px solid #e2e8f0;
                border-radius: 4px;
                background: white;
                font-size: 11px;
                color: #374151;
                cursor: pointer;
                transition: all 0.15s;
                text-align: center;
                font-weight: 500;
                flex-direction: column;
                gap: 2px;
            }

            .doc-page-btn:hover {
                background: #ede9fe;
                border-color: #6366f1;
                color: #6366f1;
            }

            .doc-page-btn.active {
                background: #6366f1;
                border-color: #6366f1;
                color: white;
            }

            .doc-page-icon {
                width: 28px;
                height: 36px;
                background: #e5e7eb;
                border-radius: 2px;
                margin-bottom: 2px;
            }

            .doc-viewer-controls {
                display: flex;
                align-items: center;
                gap: 3px;
            }

            .doc-ctrl-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                border: 1px solid #cbd5e1;
                border-radius: 4px;
                background: white;
                color: #374151;
                font-size: 12px;
                font-weight: 700;
                cursor: pointer;
                transition: background 0.15s;
                padding: 0;
                line-height: 1;
                user-select: none;
            }

            .doc-ctrl-btn:hover {
                background: #e5e7eb;
            }

            .doc-ctrl-btn.active {
                background: #ede9fe;
                border-color: #6366f1;
                color: #6366f1;
            }

            .doc-zoom-label {
                font-size: 11px;
                color: #6b7280;
                min-width: 34px;
                text-align: center;
                font-weight: 600;
            }

            .doc-viewer-embed {
                flex: 1;
                width: 100%;
                height: 600px;
                border: none;
                display: block;
                transition: height 0.2s;
                min-width: 0;
            }

            /* ── Converting Badge ── */
            .converting-badge {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 8px 14px;
                background: rgba(99, 102, 241, 0.08);
                border: 1px solid rgba(99, 102, 241, 0.3);
                border-radius: 8px;
                color: var(--accent);
                font-size: 12px;
                font-weight: 500;
                margin: 4px;
                animation: pulse-badge 1.4s ease-in-out infinite;
            }

            @keyframes pulse-badge {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.55; }
            }

            .converting-spinner {
                width: 14px;
                height: 14px;
                border: 2px solid rgba(99,102,241,0.3);
                border-top-color: var(--accent);
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            /* ── Upload Progress Bar ── */
            .upload-progress-card {
                display: flex;
                flex-direction: column;
                gap: 6px;
                padding: 8px 14px 10px;
                background: var(--bg-surface);
                border-radius: var(--radius-lg);
                border: 1px solid rgba(16,185,129,0.4);
                flex-shrink: 0;
                animation: slideDown 0.2s ease-out;
            }
            @keyframes slideDown {
                from { opacity: 0;  }
                to   { opacity: 1;  }
            }
            .upload-progress-info {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
            }
            .upload-progress-file {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 12px;
                font-weight: 600;
                color: var(--text-primary);
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                flex: 1;
            }
            .upload-progress-file svg { width: 14px; height: 14px; flex-shrink: 0; color: #10b981; }
            .upload-progress-eta {
                font-size: 11px;
                color: #10b981;
                font-weight: 500;
                flex-shrink: 0;
            }
            .upload-progress-track {
                height: 4px;
                background: rgba(16,185,129,0.15);
                border-radius: 2px;
                overflow: hidden;
            }
            .upload-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #10b981, #34d399);
                border-radius: 2px;
                transition: width 0.3s ease;
            }

            /* ── Header Icon Buttons ── */
            .hdr-icon-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 30px;
                height: 30px;
                border-radius: var(--radius-md);
                border: 1px solid transparent;
                background: transparent;
                color: var(--text-tertiary);
                cursor: pointer;
                transition: all 0.15s;
                flex-shrink: 0;
                padding: 0;
            }
            .hdr-icon-btn:hover {
                background: var(--bg-hover);
                border-color: var(--border);
                color: var(--text-primary);
            }
            .hdr-icon-btn.danger:hover {
                background: rgba(239,68,68,0.08);
                border-color: rgba(239,68,68,0.2);
                color: #ef4444;
            }
            .hdr-icon-btn.success { color: #10b981; }
            .hdr-icon-btn svg { width: 16px; height: 16px; }

            /* ── Icon Buttons (upload, view toggle) ── */
            .icon-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 30px;
                height: 30px;
                border-radius: var(--radius-md);
                border: 1px solid var(--border-strong);
                background: var(--bg-elevated);
                color: var(--text-secondary);
                cursor: pointer;
                transition: all var(--transition);
                flex-shrink: 0;
            }
            .icon-btn:hover { background: var(--bg-hover); color: var(--text-primary); }
            .icon-btn.active { background: var(--accent); border-color: var(--accent); color: white; }
            .icon-btn svg { width: 15px; height: 15px; }

            /* ── List View ── */
            .notes-list {
                display: flex;
                flex-direction: column;
                gap: 4px;
                padding: 0 16px 16px 16px;
                overflow-y: auto;
                flex: 1;
            }
            .list-row {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px 12px;
                border-radius: var(--radius-md);
                border: 1px solid transparent;
                background: var(--bg-surface);
                cursor: pointer;
                transition: all 0.15s;
                min-height: 40px;
            }
            .list-row:hover { border-color: var(--border); background: var(--bg-elevated); }
            .list-row-icon { flex-shrink: 0; color: var(--text-tertiary); }
            .list-row-icon svg { width: 15px; height: 15px; }
            .list-row-title {
                flex: 1;
                font-size: 13px;
                font-weight: 500;
                color: var(--text-primary);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .list-row-preview {
                font-size: 12px;
                color: var(--text-tertiary);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 200px;
            }
            .list-row-type {
                font-size: 10px;
                font-weight: 600;
                padding: 2px 6px;
                border-radius: 10px;
                text-transform: uppercase;
                letter-spacing: 0.04em;
                flex-shrink: 0;
            }
            .list-row-type.text { background: rgba(99,102,241,0.1); color: #6366f1; }
            .list-row-type.image { background: rgba(16,185,129,0.1); color: #10b981; }
            .list-row-type.doc { background: rgba(245,158,11,0.1); color: #f59e0b; }
            .list-row-date { font-size: 11px; color: var(--text-tertiary); flex-shrink: 0; min-width: 70px; text-align: right; }
            .list-row-actions { display: flex; gap: 4px; flex-shrink: 0; opacity: 0; transition: opacity 0.15s; }
            .list-row:hover .list-row-actions { opacity: 1; }
            .row-action-btn {
                display: inline-flex; align-items: center; justify-content: center;
                width: 24px; height: 24px;
                border-radius: 4px; border: none;
                background: transparent; color: var(--text-tertiary);
                cursor: pointer; transition: all 0.15s;
                padding: 0;
            }
            .row-action-btn:hover { background: var(--bg-hover); color: var(--text-primary); }
            .row-action-btn.delete:hover { color: #ef4444; background: rgba(239,68,68,0.08); }
            .row-action-btn svg { width: 13px; height: 13px; }
        `
    ];

    static properties = {
        isFormatPainting: { type: Boolean },
        copiedFormat: { type: Object },
        notes: { type: Array },
        openTabs: { type: Array },
        activeTabId: { type: String },
        splitTabId: { type: String },
        searchQuery: { type: String },
        copiedNoteId: { type: String },
        isSessionMode: { type: Boolean },
        viewMode: { type: String },
        uploadProgress: { type: Object }
    };

    constructor() {
        super();
        this.isFormatPainting = false;
        this.copiedFormat = null;
        this.notes = [];
        this.openTabs = [];
        this.activeTabId = null;
        this.splitTabId = null;
        this.searchQuery = '';
        this.copiedNoteId = null;
        this.isSessionMode = false;
        this.viewMode = 'list';
        this.uploadProgress = null;
        this.loadNotes();
    }

    
    openNoteTab(id) {
        if (!this.openTabs.includes(id)) {
            this.openTabs = [...this.openTabs, id];
        }
        this.activeTabId = id;
        this.requestUpdate();
    }

    async loadNotes() {
        try {
            const loaded = await hideWin.storage.getNotes();
            this.notes = loaded ? [...loaded] : [];
            this.requestUpdate();
        } catch (error) {
            console.error('Failed to load notes:', error);
        }
    }

    async saveNotes(skipUpdate = false) {
        try {
            const cleanNotes = JSON.parse(JSON.stringify(this.notes));
            await hideWin.storage.saveNotes(cleanNotes);
            if (!skipUpdate) {
                this.requestUpdate();
            }
        } catch (error) {
            console.error('Failed to save notes:', error);
        }
    }

    createNote() {
        const newNote = {
            id: Date.now().toString(),
            type: 'text',
            title: this._getUniqueTitle('Untitled Note'),
            content: '',
            imageData: null,
            createdAt: new Date().toLocaleDateString()
        };
        this.notes = [newNote, ...this.notes];
        this.openNoteTab(newNote.id);
        this.saveNotes();
    }

    triggerFileUpload() {
        const input = this.shadowRoot.querySelector('.hidden-file-input');
        if (input) input.click();
    }

    handleImageUpload(e) {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64Data = event.target.result;
                const newImageNote = {
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
                    type: 'image',
                    title: this._getUniqueTitle(file.name.replace(/\.[^/.]+$/, '')),
                    content: '',
                    imageData: base64Data,
                    createdAt: new Date().toLocaleDateString()
                };
                this.notes = [newImageNote, ...this.notes];
                this.saveNotes();
            };
            reader.readAsDataURL(file);
        });

        e.target.value = '';
    }

    triggerMergedUpload() {
        const input = this.shadowRoot.querySelector('.hidden-merged-input');
        if (input) input.click();
    }

    async handleMergedUpload(e) {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        for (const file of files) {
            if (file.type.startsWith('image/')) {
                await new Promise((resolve) => {
                    const reader = new FileReader();
                    const startTime = Date.now();
                    this.uploadProgress = { filename: file.name, pct: 0, eta: 'Reading...' };
                    reader.onprogress = (evt) => {
                        if (evt.lengthComputable) {
                            const pct = Math.round((evt.loaded / evt.total) * 100);
                            const elapsed = (Date.now() - startTime) / 1000 || 0.01;
                            const rate = evt.loaded / elapsed;
                            const rem = rate > 0 ? (evt.total - evt.loaded) / rate : 0;
                            const eta = rem > 2 ? `~${Math.ceil(rem)}s` : 'almost done...';
                            this.uploadProgress = { filename: file.name, pct, eta };
                        }
                    };
                    reader.onload = (event) => {
                        const newNote = {
                            id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
                            type: 'image',
                            title: this._getUniqueTitle(file.name.replace(/\.[^/.]+$/, '')),
                            ext: 'IMAGE',
                            content: '',
                            imageData: event.target.result,
                            createdAt: new Date().toLocaleDateString()
                        };
                        this.notes = [newNote, ...this.notes];
                        this.uploadProgress = null;
                        this.saveNotes();
                        resolve();
                    };
                    reader.readAsDataURL(file);
                });
            } else {
                // Document — validate format and create note with progress simulation, NO auto-expand
                const OFFICE_EXTS = ['.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx'];
                const SUPPORTED_EXTS = [...OFFICE_EXTS, '.pdf', '.txt'];
                const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
                
                if (!SUPPORTED_EXTS.includes(ext)) {
                    hideWin.setStatus(`Unsupported file format: ${ext}`);
                    continue; // Skip unsupported files
                }

                const noteId = Date.now().toString() + Math.random().toString(36).substr(2, 4);
                const newNote = {
                    id: noteId,
                    type: 'text',
                    title: this._getUniqueTitle(file.name),
                    ext: ext.replace('.', '').toUpperCase(), // Save extension for badge
                    content: '',
                    imageData: null,
                    createdAt: new Date().toLocaleDateString()
                };
                this.notes = [newNote, ...this.notes];
                await this.saveNotes();

                if (OFFICE_EXTS.includes(ext)) {
                    // Office conversion — simulate progress while converting
                    const timer = this._simulateProgress(file.name);
                    try {
                        let viewerHtml = '';
                        if (ext === '.xls' || ext === '.xlsx') {
                            const result = await hideWin.convertExcelToHtml(file.path);
                            clearInterval(timer);
                            if (result.success && result.html) {
                                viewerHtml = `<div class="doc-viewer-wrapper" style="width: 100%; height: 500px; overflow: auto; background: #fff; padding: 10px; box-sizing: border-box;">
                                    <style>
                                        .doc-viewer-wrapper table { border-collapse: collapse; min-width: 100%; font-family: sans-serif; font-size: 13px; }
                                        .doc-viewer-wrapper td, .doc-viewer-wrapper th { border: 1px solid #ccc; padding: 4px 8px; white-space: nowrap; }
                                    </style>
                                    ${result.html}
                                </div>`;
                            } else {
                                viewerHtml = `<span class="file-badge">Failed to load Excel file</span>`;
                            }
                        } else {
                            const result = await hideWin.convertToPdf(file.path);
                            clearInterval(timer);
                            viewerHtml = result.success && result.pdfPath
                                ? this._buildDocViewer(result.pdfPath, file.name)
                                : `<span class="file-badge" data-path="${file.path.replace(/\\/g, '\\\\')}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg> ${file.name}</span>`;
                        }
                        const idx = this.notes.findIndex(n => n.id === noteId);
                        if (idx > -1) {
                            this.notes[idx] = { ...this.notes[idx], content: viewerHtml };
                            await this.saveNotes();
                        }
                    } catch (err) { clearInterval(timer); }
                } else {
                    // PDF or TXT — quick embed
                    this.uploadProgress = { filename: file.name, pct: 10, eta: 'Embedding...' };
                    await new Promise(r => setTimeout(r, 200));
                    this.uploadProgress = { filename: file.name, pct: 90, eta: 'Almost done...' };
                    const viewerHtml = ext === '.txt'
                        ? `<iframe src="file:///${file.path.replace(/\\/g, '/')}" width="100%" height="500px" style="border:none;display:block;" contenteditable="false"></iframe>`
                        : this._buildDocViewer(file.path, file.name);
                    const idx = this.notes.findIndex(n => n.id === noteId);
                    if (idx > -1) {
                        this.notes[idx] = { ...this.notes[idx], content: viewerHtml };
                        await this.saveNotes();
                    }
                    await new Promise(r => setTimeout(r, 200));
                }
                this.uploadProgress = null;
            }
        }
        e.target.value = '';
    }

    _simulateProgress(filename) {
        let pct = 0;
        const start = Date.now();
        this.uploadProgress = { filename, pct: 0, eta: 'Converting...' };
        return setInterval(() => {
            const inc = pct < 30 ? 6 : pct < 60 ? 3 : pct < 80 ? 1.5 : 0.4;
            pct = Math.min(94, pct + inc);
            const elapsed = (Date.now() - start) / 1000 || 0.1;
            const rate = pct / elapsed;
            const rem = rate > 0 ? (100 - pct) / rate : 20;
            const eta = rem > 60 ? `${Math.ceil(rem / 60)}m` : rem > 2 ? `~${Math.ceil(rem)}s` : 'almost done...';
            this.uploadProgress = { filename, pct: Math.round(pct), eta };
        }, 300);
    }

    triggerGridDocUpload() {
        const input = this.shadowRoot.querySelector('.hidden-grid-doc-input');
        if (input) input.click();
    }

    async handleGridDocUpload(e) {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        for (const file of files) {
            // Create a new text note for each file
            const newNote = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
                type: 'text',
                title: this._getUniqueTitle(file.name),
                content: '',
                imageData: null,
                createdAt: new Date().toLocaleDateString()
            };
            this.notes = [newNote, ...this.notes];
            this.openNoteTab(newNote.id);
            await this.saveNotes();

            // Wait for next tick for the editor to render
            await new Promise(r => setTimeout(r, 100));

            const editor = this.shadowRoot.querySelector(noteId ? '#editor-' + noteId : '.full-note-editor');
            if (editor) {
                editor.focus();
                await this._insertFileIntoEditor(file, editor);
            }
        }

        e.target.value = '';
    }

    triggerDocUpload() {
        const input = this.shadowRoot.querySelector('.hidden-doc-input');
        if (input) input.click();
    }

    handleDocUpload(e) {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const editor = this.shadowRoot.querySelector(noteId ? '#editor-' + noteId : '.full-note-editor');
        if (editor) editor.focus();

        for (const file of files) {
            this._insertFileIntoEditor(file, editor);
        }

        e.target.value = '';
    }

    _buildDocViewer(pdfPath, fileName) {
        const safePath = pdfPath.replace(/\\/g, '/');
        const id = `doc-viewer-${Date.now()}`;
        const sid = `${id}-sidebar`;
        const eid = `${id}-embed`;
        const zid = `${id}-zoom`;

        // Generate page buttons for navigation sidebar
        let pageButtons = '';
        for (let i = 1; i <= 50; i++) {
            pageButtons += `<button class="doc-page-btn" title="Page ${i}" onclick="(function(){var em=document.getElementById('${eid}');var cur=em.src.split('#')[0];em.src=cur+'#page=${i}';var btns=document.getElementById('${sid}').querySelectorAll('.doc-page-btn');btns.forEach(function(b){b.classList.remove('active');});this.classList.add('active');}).call(this)"><div class='doc-page-icon'></div>${i}</button>`;
        }

        return `<div class="doc-viewer-wrapper" contenteditable="false" id="${id}" data-zoom="100">
            <div class="doc-viewer-body">
                <div class="doc-viewer-sidebar" id="${sid}">
                    <div class="doc-sidebar-header">Pages</div>
                    <div class="doc-sidebar-pages">${pageButtons}</div>
                </div>
                <embed class="doc-viewer-embed" id="${eid}" src="file:///${safePath}" type="application/pdf" />
            </div>
        </div>`;
    }

    async _insertFileIntoEditor(file, editor) {
        const OFFICE_EXTS = ['.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx'];
        const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imgTag = `<img src="${event.target.result}" alt="${file.name}" style="max-width:100%;border-radius:6px;margin:8px 0;"/>`;
                document.execCommand('insertHTML', false, imgTag);
                if (editor) {
                    this.syncLineNumbersSynchronously(editor.innerHTML);
                    const index = this.notes.findIndex(n => n.id === (typeof noteId !== "undefined" ? noteId : this.activeTabId));
                    if (index > -1) {
                        this.notes[index] = { ...this.notes[index], content: editor.innerHTML };
                        this.saveNotes(true);
                    }
                }
            };
            reader.readAsDataURL(file);
        } else if (ext === '.pdf') {
            const viewerHtml = this._buildDocViewer(file.path, file.name);
            document.execCommand('insertHTML', false, viewerHtml);
            this._saveEditorContent(editor);
        } else if (ext === '.txt') {
            const txtHtml = `<iframe src="file:///${file.path.replace(/\\/g, '/')}" width="100%" height="400px" style="border:1px solid #d1d5db;border-radius:8px;margin:10px 0;background:white;display:block;" contenteditable="false"></iframe>`;
            document.execCommand('insertHTML', false, txtHtml);
            this._saveEditorContent(editor);
        } else if (OFFICE_EXTS.includes(ext)) {
            // Step 1: Insert animated loading badge with a unique ID
            const convId = `conv-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
            const loadingBadge = `<span id="${convId}" class="converting-badge" contenteditable="false"><span class="converting-spinner"></span>Converting ${file.name}...</span>`;
            document.execCommand('insertHTML', false, loadingBadge);
            this._saveEditorContent(editor);

            // Step 2: Run the conversion in the background
            try {
                const result = await hideWin.convertToPdf(file.path);
                if (result.success && result.pdfPath) {
                    // Step 3: Swap loading badge with PDF viewer
                    const viewerHtml = this._buildDocViewer(result.pdfPath, file.name);
                    const badgeEl = this.shadowRoot.querySelector(`#${convId}`) || editor.querySelector(`#${convId}`);
                    if (badgeEl) {
                        const tmp = document.createElement('div');
                        tmp.innerHTML = viewerHtml;
                        badgeEl.parentNode.replaceChild(tmp.firstElementChild, badgeEl);
                    } else {
                        document.execCommand('insertHTML', false, viewerHtml);
                    }
                } else {
                    throw new Error(result.error || 'Conversion failed');
                }
            } catch (err) {
                // Fallback: swap loading badge with file badge
                const fallbackHtml = `<span contenteditable="false" class="file-badge" data-path="${file.path.replace(/\\/g, '\\\\')}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    ${file.name} (click to open)
                </span>`;
                const badgeEl = this.shadowRoot.querySelector(`#${convId}`) || editor.querySelector(`#${convId}`);
                if (badgeEl) {
                    const tmp = document.createElement('div');
                    tmp.innerHTML = fallbackHtml;
                    badgeEl.parentNode.replaceChild(tmp.firstElementChild, badgeEl);
                }
            }
            this._saveEditorContent(editor);
        } else {
            // Generic file badge
            const badgeHtml = `<span contenteditable="false" class="file-badge" data-path="${file.path.replace(/\\/g, '\\\\')}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                ${file.name}
            </span>&nbsp;`;
            document.execCommand('insertHTML', false, badgeHtml);
            this._saveEditorContent(editor);
        }
    }

    _saveEditorContent(editor) {
        if (!editor) return;
        this.syncLineNumbersSynchronously(editor.innerHTML);
        const index = this.notes.findIndex(n => n.id === (typeof noteId !== "undefined" ? noteId : this.activeTabId));
        if (index > -1) {
            this.notes[index] = { ...this.notes[index], content: editor.innerHTML };
            this.saveNotes(true);
        }
    }



    async pinToHome(note, e) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        note.pinned = !note.pinned;
        if (note.pinned) {
            // Generate the desktop shortcut (fire and forget so it doesn't block the UI)
            try {
                const { ipcRenderer } = window.hideWin || window.require('electron');
                ipcRenderer.invoke('pin-to-desktop', note.id, note.title || 'Untitled Note').then(result => {
                    if (result && !result.success) console.error("Desktop shortcut generation failed:", result.error);
                }).catch(err => {
                    console.error("IPC invocation for pin-to-desktop failed:", err);
                });
            } catch (err) {
                console.error("Could not find ipcRenderer:", err);
            }
        }
        await this.saveNotes();
        window.dispatchEvent(new CustomEvent('notes-updated'));
        this.requestUpdate();
    }

    deleteNote(id, e) {
        if (e) e.stopPropagation();
        this.notes = this.notes.filter(n => n.id !== id);
        if (this.expandedNoteId === id) this.openTabs = [];
        this.activeTabId = null;
        this.splitTabId = null;
        this.saveNotes();
    }

    copyNoteContent(note, e) {
        if (e) e.stopPropagation();
        const textToCopy = note.type === 'image' ? note.title : `${note.title}\n\n${note.content}`;
        navigator.clipboard.writeText(textToCopy);

        this.copiedNoteId = note.id;
        this.requestUpdate();
        setTimeout(() => {
            if (this.copiedNoteId === note.id) {
                this.copiedNoteId = null;
                this.requestUpdate();
            }
        }, 1500);
    }

    _getUniqueTitle(baseTitle, ignoreNoteId = null) {
        let title = baseTitle;
        let counter = 1;
        // Check if any note has this title (ignoring the current note if provided)
        while (this.notes.some(n => n.id !== ignoreNoteId && n.title.toLowerCase() === title.toLowerCase())) {
            // Check if baseTitle already has an extension
            const dotIdx = baseTitle.lastIndexOf('.');
            if (dotIdx > 0) {
                const name = baseTitle.substring(0, dotIdx);
                const ext = baseTitle.substring(dotIdx);
                title = `${name} (${counter})${ext}`;
            } else {
                title = `${baseTitle} (${counter})`;
            }
            counter++;
        }
        return title;
    }

    handleModalTitleChange(e) {
        const newTitle = e.target.value.trim();
        const index = this.notes.findIndex(n => n.id === (typeof noteId !== "undefined" ? noteId : this.activeTabId));
        if (index > -1) {
            const oldTitle = this.notes[index].title;
            
            // Validation 1: Compulsory name
            if (!newTitle) {
                hideWin.setStatus('File name cannot be empty');
                e.target.value = oldTitle;
                return;
            }

            // Validation 2: Already exists
            const duplicate = this.notes.some(n => n.id !== (typeof noteId !== "undefined" ? noteId : this.activeTabId) && n.title.toLowerCase() === newTitle.toLowerCase());
            if (duplicate) {
                hideWin.setStatus('File name already exists, try another name');
                e.target.value = oldTitle;
                return;
            }

            // Valid, save
            this.notes[index] = { ...this.notes[index], title: newTitle };
            this.saveNotes(true);
            hideWin.setStatus('Saved');
        }
    }

    handleModalContentInput(e) {
        const content = e.target.value;
        const index = this.notes.findIndex(n => n.id === (typeof noteId !== "undefined" ? noteId : this.activeTabId));
        if (index > -1) {
            this.notes[index] = { ...this.notes[index], content };
            this.saveNotes(true);
        }
    }

    syncLineNumbersSynchronously(content) {
        const gutter = this.shadowRoot.querySelector('.editor-gutter');
        if (!gutter) return;
        const linesCount = this.getLineNumbers(content).length;
        const currentCount = gutter.children.length;
        if (linesCount !== currentCount) {
            let html = '';
            for (let i = 1; i <= linesCount; i++) {
                html += `<span class="editor-line-number">${i}</span>`;
            }
            gutter.innerHTML = html;
        }
    }

    handleEditorInput(e, noteId) {
        const content = e.target.innerHTML;
        this.syncLineNumbersSynchronously(content);

        const index = this.notes.findIndex(n => n.id === (typeof noteId !== "undefined" ? noteId : this.activeTabId));
        if (index > -1) {
            this.notes[index] = { ...this.notes[index], content };
            this.saveNotes(true); // skip render to prevent cursor jumping
        }
    }

    handleEditorKeydown(e) {
        // Handle common shortcuts
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 's' || e.key === 'S') {
                e.preventDefault();
                this.saveNotes();
                return;
            }
            if (e.key === 'a' || e.key === 'A') {
                e.preventDefault();
                document.execCommand('selectAll', false, null);
                return;
            }
        }

        // Synchronously update on keydown for backspace/delete held down
        if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Enter') {
            // setTimeout allows the DOM to mutate first
            setTimeout(() => {
                if (e.target) this.syncLineNumbersSynchronously(e.target.innerHTML);
            }, 0);
        }
    }

    handleEditorKeyup(e) {
        if (e.key === 'Enter' || e.key === 'Backspace' || e.key === 'Delete') {
            this.syncLineNumbersSynchronously(e.target.innerHTML);
        }
    }

    async handleEditorPaste(e) {
        e.preventDefault();
        const clipboardData = e.clipboardData;
        const htmlData = clipboardData.getData('text/html');
        const textData = clipboardData.getData('text/plain');

        if (clipboardData.files && clipboardData.files.length > 0) {
            const file = clipboardData.files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64Data = event.target.result;
                    const imgTag = `<img src="${base64Data}" alt="Pasted Image"/>`;
                    document.execCommand('insertHTML', false, imgTag);
                };
                reader.readAsDataURL(file);
                return;
            }
        }

        if (htmlData) {
            // Strip out complex formatting but keep line breaks, paragraphs, and spaces
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlData;
            // Clean up unwanted tags but preserve structure
            const safeHtml = tempDiv.innerHTML.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
            document.execCommand('insertHTML', false, safeHtml);
        } else if (textData) {
            // For plain text, replace newlines with <br> to preserve formatting exactly
            const formattedText = textData.replace(/\r?\n/g, '<br>');
            document.execCommand('insertHTML', false, formattedText);
        }
    }

    async handleEditorDrop(e) {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        if (files.length === 0) return;

        const editor = this.shadowRoot.querySelector(noteId ? '#editor-' + noteId : '.full-note-editor');
        if (editor) editor.focus();

        for (const file of files) {
            await this._insertFileIntoEditor(file, editor);
        }
    }

    getLineNumbers(content) {
        if (!content) return [1];
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        
        let lines = 1;
        // Count blocks that represent a new visual line
        const blocks = tempDiv.querySelectorAll('div, p, br, pre, li, h1, h2, h3, h4, hr').length;
        // Also count raw text newlines for pasted plain text
        const newlines = (tempDiv.innerText || '').split('\n').length;
        
        const totalLines = Math.max(1, Math.max(blocks, newlines));
        return Array.from({ length: totalLines }, (_, i) => i + 1);
    }

    async handleEditorClick(e) {
        const badge = e.target.closest('.file-badge');
        if (badge) {
            const filePath = badge.getAttribute('data-path');
            if (filePath) {
                try {
                    // Send an IPC message to main process to open the file
                    hideWin.openPath(filePath);
                } catch (err) {
                    console.error('Failed to open file:', err);
                }
            }
        }
    }

    
    toggleFormatPainter() {
        if (this.isFormatPainting) {
            this.isFormatPainting = false;
            this.copiedFormat = null;
            this.requestUpdate();
            return;
        }
        
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        
        const parent = selection.anchorNode.nodeType === 3 ? selection.anchorNode.parentElement : selection.anchorNode;
        const styles = window.getComputedStyle(parent);
        
        this.copiedFormat = {
            fontWeight: styles.fontWeight,
            fontStyle: styles.fontStyle,
            textDecoration: styles.textDecoration,
            color: styles.color,
            backgroundColor: styles.backgroundColor,
            fontFamily: styles.fontFamily,
            fontSize: styles.fontSize
        };
        
        this.isFormatPainting = true;
        this.requestUpdate();
        this.showToast('Format copied! Select text to apply', 'success');
    }

    applyFormatPainter(e) {
        if (!this.isFormatPainting || !this.copiedFormat) return;
        
        const selection = window.getSelection();
        if (!selection.isCollapsed && selection.rangeCount > 0) {
            const cf = this.copiedFormat;
            const editor = this.shadowRoot.querySelector('#description-editor') || this.shadowRoot.querySelector(noteId ? '#editor-' + noteId : '.full-note-editor');
            if (editor) editor.focus();
            
            if (cf.fontWeight === 'bold' || parseInt(cf.fontWeight) >= 600) document.execCommand('bold');
            if (cf.fontStyle === 'italic') document.execCommand('italic');
            if (cf.textDecoration.includes('underline')) document.execCommand('underline');
            if (cf.textDecoration.includes('line-through')) document.execCommand('strikeThrough');
            if (cf.color && cf.color !== 'rgba(0, 0, 0, 0)' && cf.color !== 'rgb(0, 0, 0)') document.execCommand('foreColor', false, cf.color);
            if (cf.backgroundColor && cf.backgroundColor !== 'rgba(0, 0, 0, 0)' && cf.backgroundColor !== 'transparent') document.execCommand('hiliteColor', false, cf.backgroundColor);
            if (cf.fontFamily) document.execCommand('fontName', false, cf.fontFamily);
            
            this.isFormatPainting = false;
            this.copiedFormat = null;
            this.requestUpdate();
            this.showToast('Format applied!', 'success');
        }
    }

    showToast(msg) { hideWin.setStatus(msg); }
    format(command, value = null) {
        document.execCommand(command, false, value);
        const editor = this.shadowRoot.querySelector(noteId ? '#editor-' + noteId : '.full-note-editor');
        if (editor) {
            this.syncLineNumbersSynchronously(editor.innerHTML);
            const index = this.notes.findIndex(n => n.id === (typeof noteId !== "undefined" ? noteId : this.activeTabId));
            if (index > -1) {
                this.notes[index] = { ...this.notes[index], content: editor.innerHTML };
                this.saveNotes(true);
            }
        }
    }

    renderFullNoteView(noteId) {
        if (!noteId) return '';
        const note = this.notes.find(n => n.id === noteId);
        if (!note) return '';

        // Detect if this note is primarily a document viewer (hide text toolbar)
        const isDocNote = note.content && note.content.includes('doc-viewer-wrapper');

        return html`
            <div class="full-note-view ${isDocNote ? 'doc-mode' : ''}">
                <div class="full-note-header">
                    <button class="hdr-icon-btn" title="Back to Notes" @click=${() => this.closeTab(note.id)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    </button>
                    <input
                        class="full-note-title-input"
                        type="text"
                        .value=${note.title}
                        @change=${e => this.handleModalTitleChange(e)}
                        placeholder="Note Title"
                    />
                    <div style="display:flex;gap:4px;">
                        ${!isDocNote ? html`
                            <button class="hdr-icon-btn ${this.copiedNoteId === note.id ? 'success' : ''}" title="Copy" @click=${e => this.copyNoteContent(note, e)}>
                                ${this.copiedNoteId === note.id ? html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>` : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`}
                            </button>
                        ` : ''}
                        <button class="hdr-icon-btn" title=${note.pinned ? "Unpin from Home" : "Pin to Home"} @click=${e => this.pinToHome(note, e)} style="color: ${note.pinned ? '#3b82f6' : 'currentColor'};">
                              <svg viewBox="0 0 24 24" fill="${note.pinned ? '#3b82f6' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"></path></svg>
                          </button>
                          <button class="hdr-icon-btn danger" title="Delete" @click=${() => this.deleteNote(note.id)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                </div>

                <div class="full-note-body-wrapper">
                    ${isDocNote ? '' : html`
                    <div class="editor-toolbar">
                        <div class="toolbar-group">
                            <button class="toolbar-btn" title="Heading 1" @click=${() => this.format('formatBlock', 'H1')}>H1</button>
                            <button class="toolbar-btn" title="Heading 2" @click=${() => this.format('formatBlock', 'H2')}>H2</button>
                            <button class="toolbar-btn" title="Heading 3" @click=${() => this.format('formatBlock', 'H3')}>H3</button>
                        <select class="toolbar-select" @change=${e => this.format('fontName', e.target.value)}>
                                    <option value="">Font</option>
                                    <option value="Arial">Arial</option>
                                    <option value="Consolas">Consolas</option>
                                    <option value="Georgia">Georgia</option>
                                    <option value="Tahoma">Tahoma</option>
                                    <option value="Times New Roman">Times</option>
                                </select>
                                <select class="toolbar-select" @change=${e => this.format('fontSize', e.target.value)}>
                                    <option value="">Size</option>
                                    <option value="1">Small</option>
                                    <option value="3">Normal</option>
                                    <option value="5">Large</option>
                                    <option value="7">Huge</option>
                                </select><button class="toolbar-btn ${this.isFormatPainting ? 'active' : ''}" title="Format Painter (Copy styles)" @click=${() => this.toggleFormatPainter()}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                </button></div>
                        <div class="toolbar-divider"></div>
                        <div class="toolbar-group">
                            <button class="toolbar-btn" title="Bold" @click=${() => this.format('bold')}><b>B</b></button>
                            <button class="toolbar-btn" title="Italic" @click=${() => this.format('italic')}><i>I</i></button>
                            <button class="toolbar-btn" title="Underline" @click=${() => this.format('underline')}><u>U</u></button>
                            <button class="toolbar-btn" title="Strikethrough" @click=${() => this.format('strikeThrough')}><s>S</s></button>
                            <label class="toolbar-btn" title="Highlight Color" style="cursor:pointer; position:relative;">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                    <input type="color" style="opacity:0; position:absolute; width:100%; height:100%; top:0; left:0; cursor:pointer;" @input=${e => this.format('hiliteColor', e.target.value)}>
                                </label>
                            <label class="toolbar-btn" title="Text Color" style="cursor:pointer; position:relative;">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>
                                    <input type="color" style="opacity:0; position:absolute; width:100%; height:100%; top:0; left:0; cursor:pointer;" @input=${e => this.format('foreColor', e.target.value)}>
                                </label>
                        </div>
                        <div class="toolbar-divider"></div>
                        <div class="toolbar-group">
                            <button class="toolbar-btn" title="Bullet List" @click=${() => this.format('insertUnorderedList')}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line>
                                </svg>
                            </button>
                            <button class="toolbar-btn" title="Numbered List" @click=${() => this.format('insertOrderedList')}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="10" y1="6" x2="21" y2="6"></line><line x1="10" y1="12" x2="21" y2="12"></line><line x1="10" y1="18" x2="21" y2="18"></line><path d="M4 6h1v4"></path><path d="M4 10h2"></path><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
                                </svg>
                            </button></button>
                            <button class="toolbar-btn" title="Indent" @click=${() => this.format('indent')}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line><line x1="11" y1="12" x2="21" y2="12"></line><polyline points="3 8 7 12 3 16"></polyline></svg>
                            </button>
                            <button class="toolbar-btn" title="Outdent" @click=${() => this.format('outdent')}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line><line x1="11" y1="12" x2="21" y2="12"></line><polyline points="7 8 3 12 7 16"></polyline></svg>
                            </button>
                        </div>
                        <div class="toolbar-divider"></div>
                        <div class="toolbar-group">
                            <button class="toolbar-btn" title="Align Left" @click=${() => this.format('justifyLeft')}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="15" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line>
                                </svg>
                            </button>
                            <button class="toolbar-btn" title="Align Center" @click=${() => this.format('justifyCenter')}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="3" y1="6" x2="21" y2="6"></line><line x1="7" y1="12" x2="17" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line>
                                </svg>
                            </button>
                            <button class="toolbar-btn" title="Align Right" @click=${() => this.format('justifyRight')}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="3" y1="6" x2="21" y2="6"></line><line x1="9" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <div class="toolbar-divider"></div>
                        <div class="toolbar-group">
                            <button class="toolbar-btn" title="Blockquote" @click=${() => this.format('formatBlock', 'BLOCKQUOTE')}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>
                            </button>
                            <button class="toolbar-btn" title="Insert Link" @click=${() => { const url = prompt('Enter URL:'); if(url) this.format('createLink', url); }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                            </button>
                            <button class="toolbar-btn" title="Code Block" @click=${() => this.format('formatBlock', 'PRE')}>Code</button>
                            <button class="toolbar-btn" title="Divider" @click=${() => this.format('insertHorizontalRule')}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="3" y1="12" x2="21" y2="12"></line>
                                </svg>
                            </button>
                            <button class="toolbar-btn" title="Attach Document" @click=${() => this.triggerDocUpload()}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                                </svg>
                            </button>
                            <button class="toolbar-btn" title="Clear Formatting" @click=${() => this.format('removeFormat')}>Clear</button>
                        </div>
                         <input
                             type="file"
                             class="hidden-doc-input"
                             style="display: none;"
                             multiple
                             accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,image/*"
                             @change=${e => this.handleDocUpload(e)}
                         />
                     </div>
                    `}
                    <div class="full-note-body">
                        ${isDocNote ? '' : html`
                        <div class="editor-gutter">
                            ${this.getLineNumbers(note.content).map(num => html`<span class="editor-line-number">${num}</span>`)}
                        </div>
                        `}
                        <div
                            class="full-note-editor ${isDocNote ? 'doc-mode' : ''}"
                            contenteditable="${isDocNote ? 'false' : 'true'}"
                            spellcheck="false"
                            @input=${e => this.handleEditorInput(e, note.id)}
                            @keyup=${e => this.handleEditorKeyup(e)}
                            @paste=${e => this.handleEditorPaste(e)}
                            @drop=${e => this.handleEditorDrop(e)}
                            @dragover=${e => e.preventDefault()}
                            @click=${e => this.handleEditorClick(e)}
                              @mouseup=${e => this.applyFormatPainter(e)}
                            .innerHTML=${note.content || (note.type === 'image' && note.imageData ? `<img src="${note.imageData}" alt="Pasted Image"/>` : '')}
                        ></div>
                    </div>
                </div>
            </div>
        `;
    }

    stripHtml(html) {
        if (!html) return '';
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    _noteTypeClass(note) {
        if (note.type === 'image') return 'image';
        if (note.content && note.content.includes('doc-viewer-wrapper')) return 'doc';
        return 'text';
    }

    render() {
        const filteredNotes = this.notes.filter(note => {
            if (!this.searchQuery) return true;
            const q = this.searchQuery.toLowerCase();
            return note.title.toLowerCase().includes(q) || (note.content && this.stripHtml(note.content).toLowerCase().includes(q));
        });

        return html`
            <div class="notes-container">
                <!-- Header Toolbar -->
                <div class="notes-toolbar">
                    <div class="toolbar-actions">
                        ${this.isSessionMode ? html`
                            <button class="notes-btn" @click=${() => this.dispatchEvent(new CustomEvent('close-notes', { bubbles: true, composed: true }))} style="color: #ef4444; border-color: rgba(239, 68, 68, 0.2); background: rgba(239, 68, 68, 0.05);">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                Close
                            </button>
                        ` : ''}

                        <button class="notes-btn primary" @click=${() => this.createNote()}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            New Note
                        </button>

                        <!-- Single merged upload icon button -->
                        <button class="icon-btn" title="Upload image or document" @click=${() => this.triggerMergedUpload()}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                            </svg>
                        </button>
                        <input type="file" class="hidden-merged-input" style="display:none;" multiple
                            accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                            @change=${e => this.handleMergedUpload(e)} />
                    </div>

                    <div class="search-box">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input class="search-input" type="text" placeholder="Search notes..."
                            .value=${this.searchQuery}
                            @input=${e => this.searchQuery = e.target.value} />
                    </div>

                    <!-- View toggle -->
                    <div style="display:flex;gap:4px;flex-shrink:0;padding-right:16px;">
                        <button class="icon-btn" title="Toggle View" @click=${() => this.viewMode = this.viewMode === 'list' ? 'grid' : 'list'}>
                            ${this.viewMode === 'list' 
                                ? html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>`
                                : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`
                            }
                        </button>
                    </div>
                </div>

                <!-- Upload Progress Bar -->
                ${this.uploadProgress ? html`
                    <div class="upload-progress-card">
                        <div class="upload-progress-info">
                            <div class="upload-progress-file">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                                ${this.uploadProgress.filename}
                            </div>
                            <span class="upload-progress-eta">${this.uploadProgress.eta} · ${this.uploadProgress.pct}%</span>
                        </div>
                        <div class="upload-progress-track">
                            <div class="upload-progress-fill" style="width: ${this.uploadProgress.pct}%"></div>
                        </div>
                    </div>
                ` : ''}

                <!-- Content area -->
                ${filteredNotes.length === 0 ? html`
                    <div class="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                        <div>No notes yet. Click <strong>New Note</strong> or the <strong>upload</strong> icon to get started.</div>
                    </div>
                ` : this.viewMode === 'list' ? html`
                    <!-- List View -->
                    <div class="notes-list">
                        ${filteredNotes.map(note => {
                            const typeClass = this._noteTypeClass(note);
                            return html`
                            <div class="list-row" @click=${(e) => { if (!e.target.closest("button")) this.expandedNoteId = note.id; }}>
                                <div class="list-row-icon">
                                    ${note.type === 'image' ? html`
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                    ` : typeClass === 'doc' ? html`
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                                    ` : html`
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                    `}
                                </div>
                                <span class="list-row-title">${note.title || 'Untitled Note'}</span>
                                ${note.type !== 'image' && typeClass !== 'doc' ? html`
                                    <span class="list-row-preview">${this.stripHtml(note.content) || '—'}</span>
                                ` : ''}
                                <span class="list-row-type ${typeClass}">${note.ext || typeClass}</span>
                                <span class="list-row-date">${note.createdAt}</span>
                                <div class="list-row-actions">
                                    <button class="row-action-btn" title="Copy" @click=${e => this.copyNoteContent(note, e)}>
                                        ${this.copiedNoteId === note.id ? html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>` : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`}
                                    </button>
                                    <button class="row-action-btn" title=${note.pinned ? "Unpin from Home" : "Pin to Home"} @click=${e => this.pinToHome(note, e)} style="color: ${note.pinned ? '#3b82f6' : 'currentColor'};">
                                          <svg viewBox="0 0 24 24" fill="${note.pinned ? '#3b82f6' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"></path></svg>
                                      </button>
                                      <button class="row-action-btn delete" title="Delete" @click=${e => this.deleteNote(note.id, e)}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                </div>
                            </div>`;
                        })}
                    </div>
                ` : html`
                    <!-- Grid View -->
                    <div class="grid-viewport">
                        <div class="notes-grid">
                            ${filteredNotes.map(note => html`
                                <div class="note-card" @click=${(e) => { if (!e.target.closest("button")) this.expandedNoteId = note.id; }}>
                                    <div class="card-header">
                                        <span class="card-title">${note.title || 'Untitled Note'}</span>
                                        <span class="card-type-badge ${note.type}">${note.ext || note.type}</span>
                                    </div>
                                    ${note.type === 'image' && note.imageData ? html`
                                        <div class="card-media"><img src=${note.imageData} alt=${note.title} /></div>
                                    ` : html`
                                        <div class="card-content">${this.stripHtml(note.content) || 'Click to add content...'}</div>
                                    `}
                                    <div class="card-footer">
                                        <span class="card-date">${note.createdAt}</span>
                                        <div class="card-actions">
                                            <button class="action-btn" title="Copy" @click=${e => this.copyNoteContent(note, e)}>
                                                ${this.copiedNoteId === note.id ? html`✓` : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`}
                                            </button>
                                            <button class="action-btn" title=${note.pinned ? "Unpin from Home" : "Pin to Home"} @click=${e => this.pinToHome(note, e)} style="color: ${note.pinned ? '#3b82f6' : 'currentColor'};">
                                                  <svg viewBox="0 0 24 24" fill="${note.pinned ? '#3b82f6' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"></path></svg>
                                              </button>
                                              <button class="action-btn delete" title="Delete" @click=${e => this.deleteNote(note.id, e)}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `)}
                        </div>
                    </div>
                `}

                <!-- Full-Window Expanded View -->
                ${this.renderFullNoteView()}
            </div>
        `;
    }
}

customElements.define('notes-view', NotesView);
