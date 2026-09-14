import { css } from '../../assets/lit-core-2.7.4.min.js';

export const unifiedPageStyles = css`
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

        .notes-toolbar { display: flex; align-items: center; justify-content: space-between; gap: var(--space-sm); background: var(--bg-elevated);  -webkit- padding: var(--space-sm) var(--space-md); border-radius: 8px; border: 1px solid rgba(59, 130, 246, 0.2); box-shadow: 0 1px 3px rgba(0,0,0,0.1); flex-wrap: wrap; color: var(--text-primary); margin-bottom: var(--space-md); }
    .toolbar-actions { display: flex; align-items: center; gap: 8px; }
    .notes-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 6px; font-size: var(--font-size-xs); font-weight: 600; cursor: pointer; border: 1px solid rgba(59, 130, 246, 0.2); background: #ffffff; color: var(--text-primary); transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: inset 0 2px 4px rgba(59, 130, 246, 0.05); }
    .notes-btn:hover { background: #f8fafc; border-color: var(--accent); transform: translateY(-1px); }
    .notes-btn.primary { background: var(--accent); color: white; border: none; box-shadow: 0 4px 14px rgba(24, 95, 196, 0.4); }
    .notes-btn.primary:hover { background: var(--accent-hover); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(24, 95, 196, 0.6) !important; }
    .notes-btn.danger:hover { background: rgba(239, 68, 68, 0.2); border-color: rgba(239, 68, 68, 0.5); color: #f87171; }
    .notes-btn svg { width: 14px; height: 14px; flex-shrink: 0; }
    .icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 10px; border: 1px solid transparent; background: transparent; color: #64748b; cursor: pointer; transition: all 0.2s; }
    .icon-btn:hover { background: rgba(59, 130, 246, 0.1); color: var(--accent); }
    .icon-btn.active { background: #ffffff; border-color: rgba(59, 130, 246, 0.3); color: var(--accent); box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1); }
    .icon-btn svg { width: 18px; height: 18px; }
    .search-box { display: flex; align-items: center; gap: 6px; background: #ffffff; border: 1px solid rgba(59, 130, 246, 0.3); box-shadow: inset 0 2px 4px rgba(59, 130, 246, 0.05); border-radius: 6px; padding: 4px 10px; min-width: 180px; transition: all 0.2s; height: 42px; box-sizing: border-box; }
    .search-box:focus-within { border-color: var(--accent); background: #ffffff; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2), inset 0 2px 4px rgba(59, 130, 246, 0.05); }
    .search-box svg { width: 14px; height: 14px; color: #64748b; flex-shrink: 0; }
    .search-input { background: transparent; border: none; color: var(--text-primary); width: 100%; font-size: var(--font-size-sm); outline: none; box-shadow: none; padding: 0; }
    .search-input::placeholder { color: var(--text-muted); }
    .grid-viewport { flex: 1; overflow-y: auto; padding-right: 4px; }
    .notes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: var(--space-md); padding-bottom: 20px; }
    .notes-list { display: flex; flex-direction: column; gap: var(--space-sm); overflow-y: auto; }
    
    .page-header {
        display: flex;
        flex-direction: column;
        gap: var(--space-xs);
        margin-bottom: var(--space-sm);
    }

    .page-title {
        font-size: var(--font-size-xl);
        font-weight: 600;
        color: var(--text-primary);
        letter-spacing: -0.01em;
    }

    .page-subtitle {
        font-size: var(--font-size-sm);
        color: var(--text-muted);
        line-height: 1.5;
    }

    .section {
        display: flex;
        flex-direction: column;
        gap: var(--space-md);
        background: var(--bg-elevated);
        
        -webkit-
        border: 1px solid rgba(59, 130, 246, 0.2);
        border-radius: 8px;
        padding: 24px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        color: var(--text-primary);
    }

    .section:hover {

        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        border: 1px solid rgba(59, 130, 246, 0.4);
    }

    .section-title {
        font-size: 13px;
        font-weight: 700;
        color: #1e3a8a;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        display: flex;
        align-items: center;
        gap: var(--space-sm);
    }

    .form-grid {
        display: flex;
        flex-direction: column;
        gap: var(--space-md);
    }

    .form-row {
        display: flex;
        flex-direction: column;
        gap: var(--space-xs);
    }

    
    input, select, textarea {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid var(--border);
        border-radius: 6px;
        background: var(--bg-elevated);
        color: var(--text-primary);
        font-size: 13px;
        font-family: var(--font);
        outline: none;
        transition: border-color 0.15s, box-shadow 0.15s;
    }

    input:focus, select:focus, textarea:focus {
        border-color: var(--accent);
        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
    }

    .form-group {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-md);
    }

    .form-group.vertical {
        flex-direction: column;
        align-items: stretch;
        gap: var(--space-sm);
    }

    .form-label {
        color: var(--text-secondary);
        font-size: var(--font-size-sm);
        font-weight: 600;
        white-space: nowrap;
        flex-shrink: 0;
    }

    .form-help {
        color: #64748b;
        font-size: 12px;
        line-height: 1.5;
    }

    

    

    

    input::placeholder, textarea::placeholder {
        color: var(--text-muted);
    }

    select {
        cursor: default;
        appearance: none;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
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

    .start-btn {
        background: var(--accent);
        color: white;
        border: none;
        padding: 10px 16px;
        border-radius: 6px;
        font-weight: 500;
        font-size: 14px;
        cursor: pointer;
        transition: background 0.15s;
        width: 100%;
    }

    .start-btn:hover:not(:disabled) {
        background: var(--accent-hover);
    }

    .start-btn:active:not(:disabled) {
        background: var(--accent);
    }

    .start-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        box-shadow: none;
        transform: none;
        background: var(--bg-hover);
        border: 1px solid var(--bg-hover);
        color: var(--text-muted);
    }

    .start-btn svg {
        width: 18px;
        height: 18px;
    }

    .mouse-toggle-container {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: var(--bg-hover);
        padding: 6px 12px;
        border-radius: 8px;
        border: 1px solid var(--border);
        pointer-events: auto !important; /* Ensure it stays clickable in click-through mode */
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
    }

    .mouse-toggle-label {
        font-size: 13px;
        font-weight: 500;
        color: var(--text-secondary);
        display: flex;
        align-items: center;
        gap: 6px;
        pointer-events: none;
    }

    .mouse-toggle-switch {
        position: relative;
        width: 36px;
        height: 20px;
        background: var(--bg-hover);
        border-radius: 6px;
        transition: background 0.3s ease, box-shadow 0.3s ease;
        pointer-events: none;
        box-shadow: inset 0 1px 3px rgba(0,0,0,0.3);
    }

    /* When Click-Through is ON (Undetectable), the toggle is Active (Blue) */
    .mouse-toggle-container.undetectable .mouse-toggle-switch {
        background: var(--accent);
        box-shadow: inset 0 1px 3px rgba(0,0,0,0.2), 0 0 8px rgba(59, 130, 246, 0.4);
    }

    .mouse-toggle-knob {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 16px;
        height: 16px;
        background: white;
        border-radius: 50%;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes pulse-glow {
        0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.1); border-color: rgba(99, 102, 241, 0.2); }
        100% { box-shadow: 0 0 8px 0 rgba(99, 102, 241, 0.3); border-color: rgba(99, 102, 241, 0.5); }
    }
    .stealth-note {
        font-size: 12px;
        font-weight: 500;
        color: var(--text-secondary);
        background: rgba(99, 102, 241, 0.08);
        border: 1px solid rgba(99, 102, 241, 0.2);
        padding: 6px 12px;
        border-radius: 6px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        animation: pulse-glow 3s infinite alternate;
    }
    .stealth-note kbd {
        background: rgba(0,0,0,0.4);
        border: 1px solid var(--bg-hover);
        border-radius: 6px;
        padding: 2px 6px;
        font-family: var(--font-mono);
        font-size: 11px;
        color: var(--accent);
        box-shadow: inset 0 -1px 0 var(--bg-hover);
    }

    .mouse-toggle-container.undetectable .mouse-toggle-knob {
        transform: translateX(16px);
    }

    .notes-container, .profiles-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: var(--space-md);
        gap: var(--space-md);
        box-sizing: border-box;
    }

    /* EXACT NOTES LIST/GRID UI FOR 100% CONSISTENCY */
    .note-card { display: flex; flex-direction: column; background: var(--bg-surface);  -webkit- border: 1px solid var(--border); border-radius: 8px; padding: 16px; gap: 8px; position: relative; cursor: default; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1); min-height: 150px; max-height: 260px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .note-card:hover { transform: translateY(-2px); box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 1px solid var(--border-strong); }
    .card-header { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
    .card-title { font-size: 13px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; }
    .card-type-badge { font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; background: rgba(99, 102, 241, 0.15); color: var(--accent); }
    .card-content { flex: 1; font-size: 12px; color: var(--text-secondary); line-height: 1.5; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; margin-top: 4px; }
    .card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 12px; border-top: 1px solid var(--bg-hover); }
    .card-date { font-size: 10px; color: var(--text-muted); }
    .card-actions { display: flex; gap: 4px; }
    .action-btn { background: transparent; border: none; padding: 4px; color: var(--text-muted); cursor: pointer; border-radius: 6px; transition: all 0.2s; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; }
    .action-btn:hover { background: var(--bg-hover); color: var(--text-primary); }
    .action-btn.delete:hover { background: rgba(239, 68, 68, 0.2); color: #f87171; }
    .action-btn svg { width: 14px; height: 14px; }

    .list-row { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid transparent; background: var(--bg-surface); cursor: pointer; transition: all 0.15s; min-height: 40px; }
    .list-row:hover { background: var(--bg-hover); border-color: var(--bg-hover); }
    .list-row-icon { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 8px; background: var(--bg-hover); color: var(--text-muted); }
    .list-row-icon svg { width: 14px; height: 14px; }
    .list-row-title { font-size: 13px; font-weight: 500; color: var(--text-primary); min-width: 120px; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .list-row-preview { flex: 1; font-size: 12px; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .list-row-type { font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; background: rgba(99, 102, 241, 0.15); color: var(--accent); min-width: 60px; text-align: center; }
    .list-row-date { font-size: 11px; color: var(--text-muted); min-width: 80px; text-align: right; }
    .list-row-actions { display: flex; gap: 4px; opacity: 0; transition: opacity 0.2s; }
    .list-row:hover .list-row-actions { opacity: 1; }
    .row-action-btn { background: transparent; border: none; padding: 4px; color: var(--text-muted); cursor: pointer; border-radius: 6px; transition: all 0.2s; }
    .row-action-btn:hover { background: rgba(59, 130, 246, 0.1); color: var(--accent); }
    .row-action-btn.delete:hover { background: rgba(239, 68, 68, 0.2); color: #f87171; }
    .row-action-btn svg { width: 14px; height: 14px; }

`;


