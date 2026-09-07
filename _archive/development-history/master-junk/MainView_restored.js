            border: 1px solid rgba(99, 102, 241, 0.2);
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.04) 100%);
            cursor: default;
            transition: background 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease;
        }

        .cloud-promo:hover {
            border-color: rgba(99, 102, 241, 0.4);
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%);
            box-shadow: 0 0 30px rgba(99, 102, 241, 0.1), 0 0 60px rgba(139, 92, 246, 0.05);
                    }

        .cloud-promo-glow {
            position: absolute;
            border-radius: 12px;
            font-size: var(--font-size-sm);
            font-family: var(--font);
            transition: background 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease;
            box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        /* ΓöÇΓöÇ Start button ΓöÇΓöÇ */

        .start-button {
            flex: 1;
            height: 48px;
            background: var(--accent);
            color: white;
            border: none;
            border-radius: 24px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;

        .home-subtext {
            font-size: 14px;
            color: var(--text-muted);
            margin-top: 8px;
        }

        .pinned-shortcuts-container::-webkit-scrollbar {
            width: 6px;
        }
        .pinned-shortcuts-container::-webkit-scrollbar-track {
            background: transparent;
        }
        .pinned-shortcuts-container::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.1);
            border-radius: 4px;
        }
        .pinned-shortcuts-container::-webkit-scrollbar-thumb:hover {
            background: rgba(255,255,255,0.2);
        }

        .pinned-shortcut-card {
            position: relative;
        }

        .unpin-btn {
            position: absolute;
            top: 12px;
            right: 12px;
            background: rgba(15, 23, 42, 0.8);
            backdrop-filter: blur(4px);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 50%;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ef4444;
            opacity: 0;
            transform: scale(0.9);
            transition: background 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease;
            cursor: pointer;
            z-index: 10;
        }

        .pinned-shortcut-card:hover .unpin-btn {
            opacity: 1;
            transform: scale(1);
        }

        .unpin-btn:hover {
            background: #ef4444;
            color: white;
            border-color: #ef4444;
            transform: scale(1.1) !important;
        }

        .modal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: fadeIn 0.2s ease-out;
        }

        .modal-content {
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 24px;
            width: 340px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
            animation: slideUpFade 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            color: var(--text-primary);
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUpFade {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .history-list-container {
        _ollamaModel: { state: true },
        _whisperModel: { state: true },
        _showLocalHelp: { state: true },
        _notes: { state: true },
        _loadingNotes: { state: true },
        _noteToUnpin: { state: true },
        _viewingNoteId: { state: true },
        isModeMenuOpen: { type: Boolean, state: true },
        isProfileMenuOpen: { type: Boolean, state: true }
    };
        this._mouseX = -1;
        this._mouseY = -1;

        this._notes = [];
        this._loadingNotes = false;
        this._noteToUnpin = null;
        this._viewingNoteId = null;

        this.boundKeydownHandler = this._handleKeydown.bind(this);
        this._loadFromStorage();
            // Load profiles
            this._profiles = await hideWin.storage.getProfiles().catch(() => []);

            // Load pinned notes (shortcuts)
            this._loadingNotes = true;
            this.requestUpdate();
            this._notes = await hideWin.storage.getNotes().catch(() => []);
            this._loadingNotes = false;

            this.requestUpdate();
        } catch (e) {
        }
    }

    async loadNotes() {
        this._loadingNotes = true;
        this.requestUpdate();
        this._notes = await hideWin.storage.getNotes().catch(() => []);
        this._loadingNotes = false;
        this.requestUpdate();
    }

    async connectedCallback() {
        super.connectedCallback();
        document.addEventListener('keydown', this.boundKeydownHandler);
        
        this._boundLoadNotes = this.loadNotes.bind(this);
        window.addEventListener('notes-updated', this._boundLoadNotes);
        
        this._handleOutsideClick = () => {
            if (this.isModeMenuOpen || this.isProfileMenuOpen) {
                this.isModeMenuOpen = false;

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._boundLoadNotes) {
            window.removeEventListener('notes-updated', this._boundLoadNotes);
        }
        document.removeEventListener('keydown', this.boundKeydownHandler);
        document.removeEventListener('click', this._handleOutsideClick);
        window.removeEventListener('profiles-updated', this._profilesListener);
                    70% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 6px rgba(0, 0, 0, 0); }
                    100% { transform: scale(0.95); opacity: 0.5; box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
                }
            
        /* MainView Responsive Action Bar */

        .action-mouse-toggle {
            pointer-events: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            padding: 0 8px;
            margin-right: 8px;
            width: 130px;
            max-width: 130px;
            flex-shrink: 0;
        }
        .start-btn-container {
            display: flex;
            gap: 12px;
            margin-left: 12px;
            flex-shrink: 0;
        }

        @media (max-width: 768px) {
            .action-mouse-toggle {
                width: 100%;
                max-width: 100%;
                margin-right: 0;
                margin-top: 8px;
                margin-bottom: 8px;
            }
            .start-btn-container {
                margin-left: 0;
            }
        }

        .action-bar-container {
            display: flex;
            align-items: center;
            border: 1px solid;
            border-radius: 50px;
            background: var(--bg-surface);
            padding: 8px 12px 8px 24px;
            width: 100%;
            max-width: 100%;
            transition: background 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease;
        }
        
        .action-dropdown {
            width: 220px;
            flex-shrink: 1;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            position: relative;
        }

        .action-divider {
            width: 1px;
            height: 32px;
            background: var(--border);
            margin: 0 20px;
        }

        @media (max-width: 768px) {
            .action-bar-container {
                flex-direction: column;
                border-radius: 20px;
                padding: 16px;
                gap: 16px;
                align-items: stretch;
            }
            .action-dropdown {
                width: 100%;
            }
            .action-divider {
                width: 100%;
                height: 1px;
                margin: 0;
            }
            .start-btn-container {
                display: flex;
                flex-direction: column;
                align-items: stretch;
                width: 100%;
                margin-top: 8px;
            }
            .start-btn-container > div, .start-btn-container > button {
                width: 100%;
                justify-content: center;
                margin-left: 0 !important;
            }
        }

    \n        @media (max-width: 768px) {\n            .home-container { padding: 20px 24px; }\n            .form-wrapper { max-width: 100%; }\n        }\n    
        .mouse-toggle-container { display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; padding: 0 8px; margin-right: 8px; width: 130px; max-width: 130px; flex-shrink: 0; pointer-events: auto; }
        .mouse-toggle-switch { position: relative; width: 32px; height: 18px; background: #cbd5e1; border-radius: 10px; transition: background 0.2s ease; pointer-events: none; margin: 0 auto; }
        .mouse-toggle-knob { position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; background: white; border-radius: 50%; box-shadow: 0 1px 2px rgba(0,0,0,0.1); transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .mouse-toggle-container.stealth-tooltip.undetectable .mouse-toggle-switch { background: #3b82f6; }
        .mouse-toggle-container.stealth-tooltip.undetectable .mouse-toggle-knob { transform: translateX(14px); }
        html[data-theme='dark'] .mouse-toggle-switch { background: #475569; }
    </style>
        `;
    }

        const outlineColor = this._modeCategoryError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)';

        return html`
            <div style="display: flex; flex-direction: column; align-items: center; margin: 8px 0 24px 0; width: 100%;">
                <div class="action-bar-container" style="border-color: ${borderColor === 'var(--accent, #3b82f6)' ? 'var(--border)' : borderColor}; box-shadow: 0 12px 40px rgba(0,0,0,0.15), 0 0 0 4px ${outlineColor};">
                    
                    <!-- Mode Select (Custom Dropdown) -->
                    <div class="action-dropdown" @click=${(e) => { e.stopPropagation(); this.isModeMenuOpen = !this.isModeMenuOpen; this.isProfileMenuOpen = false; this.requestUpdate(); }}>
                        <div style="display: flex; align-items: center; gap: 12px; padding: 6px 0; cursor: pointer; width: 100%;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted); flex-shrink: 0;">
                                <circle cx="11" cy="11" r="8"></circle>
                        ` : ''}
                    </div>

                    <div class="action-divider"></div>

                    <!-- Profile Select (Custom Dropdown) -->
                    <div style="width: 220px; flex-shrink: 0; flex-grow: 0; display: flex; flex-direction: column; position: relative;" @click=${(e) => { 
                    <div style="width: 1px; height: 32px; background: var(--border); margin: 0 12px;"></div>

                    <!-- Mouse Toggle (Centered with pointer-events fix and fixed width) -->
                    <div class="mouse-toggle-container stealth-tooltip action-mouse-toggle" data-tooltip="Stealth Mode" @click=${() => this.onToggleClickThrough && this.onToggleClickThrough()}>
                        <span style="font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); margin-bottom: 6px; transition: color 0.2s; text-align: center; width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${this.isClickThrough ? 'Mouse Un-Detect' : 'Mouse Detect'}
                        </span>
                        <div style="width: 42px; height: 22px; border-radius: 6px; background: ${this.isClickThrough ? 'var(--bg-elevated)' : 'var(--text-muted)'}; border: 1px solid var(--border); position: relative; transition: all 0.3s ease; box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);">
                            <div style="width: 18px; height: 18px; border-radius: 4px; background: #ffffff; position: absolute; top: 1px; left: ${this.isClickThrough ? '21px' : '1px'}; transition: background 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.15);">
                                <div style="width: 10px; height: 10px; border-radius: 2px; background: ${this.isClickThrough ? 'var(--bg-elevated)' : 'var(--text-muted)'}; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">
                                    <div style="width: 5px; height: 1.5px; background: #ffffff; border-radius: 1px; transform: rotate(-45deg);"></div>
                                </div>
                    </div>

                    <!-- Start/Active Buttons -->
                    <div class="start-btn-container">
                        ${this._sessionState === 'active' ? html`
                            <button class="start-btn-blue" @click=${() => this._handleStart()} style="border-radius: 40px; padding: 14px 40px; display: flex; align-items: center; gap: 8px; border: none; outline: none; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4); background: rgba(59, 130, 246, 0.1); border: 1px solid var(--accent); color: var(--accent); font-weight: 600; font-size: 15px; letter-spacing: 0.5px; cursor: pointer; transition: all 0.2s;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">

                <!-- Active Session Timer and Stop Button below the panel -->
                ${this._sessionState && this._sessionState !== 'idle' ? html`
                    <div style="display: flex; align-items: center; justify-content: center; gap: 24px; width: 100%; max-width: 100%; margin-top: 16px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            ${this.renderStatusDot()}
                            <span style="font-size: 20px; font-weight: 700; color: var(--text-primary); font-variant-numeric: tabular-nums; letter-spacing: 1px;">
                ` : ''}

                <!-- Validation message beneath the pill -->
                <div style="height: 20px; width: 100%; max-width: 100%; display: flex; align-items: center; padding-left: 20px; margin-top: 8px;">
                    ${this._modeCategoryError ? html`
                        <span style="color: #ef4444; font-size: 12px; font-weight: 500; margin-top: 8px;">Please select mode</span>
                    ` : ''}
        `;
    }

    async confirmUnpin() {
        if (!this._noteToUnpin) return;
        const note = this._notes.find(n => n.id === this._noteToUnpin.id);
        if (note) {
            note.pinned = false;
            note.shortcutName = null;
            await hideWin.storage.saveNotes(this._notes);
            this._notes = await hideWin.storage.getNotes().catch(() => []);
            this.requestUpdate();
        }
        this._noteToUnpin = null;
    }

    cancelUnpin() {
        this._noteToUnpin = null;
    }

    openNoteViewer(note) {
        this._viewingNoteId = note.id;
    }

    closeNoteViewer() {
        this._viewingNoteId = null;
    }

    render() {
        const pinnedNotes = (this._notes || []).filter(n => n.pinned);

        return html`
            <div class="home-container">
                    </div>

                    <div class="header-right">
                        <div style="display:flex; flex-direction:column; align-items:center;">
                            <span class="meetings-left-text" style="font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.7);">Unlimited sessions left</span>
                        </div>
                    </div>
                </div>

                ${this._renderActionBar()}

                <div class="home-subtext" style="margin-top: 16px; font-weight: 600; color: var(--text-primary);">
                    Pinned Shortcuts
                </div>

                <div class="pinned-shortcuts-container" style="width: 100%; max-width: 100%; max-height: 270px; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, 100px); gap: 16px; margin-top: 8px; padding: 24px; border: 1px solid var(--border); border-radius: 16px; background: var(--bg-surface); box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
                    <div class="pinned-shortcut-card" @click=${() => this.onNavigate('notes')} style="width: 100px; height: 100px; background: transparent; border: 2px dashed var(--border); border-radius: 12px; padding: 12px; cursor: pointer; transition: background 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; position: relative;" onmouseover="this.style.background='rgba(59, 130, 246, 0.05)'; this.style.borderColor='rgba(59, 130, 246, 0.4)'; " onmouseout="this.style.background='transparent'; this.style.borderColor='var(--border)'; ">
                        <div style="width: 24px; height: 24px; border-radius: 50%; background: rgba(59, 130, 246, 0.1); display: flex; align-items: center; justify-content: center; color: #3b82f6; transition: transform 0.2s;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </div>
                        <div style="font-size: 11px; font-weight: 500; color: var(--text-primary); text-align: center;">
                            Add
                        </div>
                    </div>
                    ${pinnedNotes.map(note => html`
                        <div class="pinned-shortcut-card" @click=${() => this.openNoteViewer(note)} style="width: 100px; height: 100px; background: rgba(120, 120, 120, 0.05); border: 1px solid var(--border); border-radius: 12px; padding: 12px; cursor: pointer; transition: background 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease; display: flex; flex-direction: column; gap: 8px; position: relative;" onmouseover="this.style.background='rgba(120, 120, 120, 0.08)'; this.style.borderColor='rgba(99, 102, 241, 0.4)'; this.style.boxShadow='0 12px 24px rgba(0,0,0,0.1), 0 0 0 1px rgba(99,102,241,0.2)';" onmouseout="this.style.background='rgba(120, 120, 120, 0.05)'; this.style.borderColor='var(--border)'; this.style.boxShadow='none';">
                            <button class="unpin-btn" title="Unpin from Home" @click=${(e) => { e.stopPropagation(); this._noteToUnpin = note; }} style="position: absolute; top: -6px; right: -6px; width: 20px; height: 20px; padding: 0;">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                            <div style="display: flex; align-items: center; justify-content: center; width: 100%;">
                                <div style="width: 24px; height: 24px; border-radius: 6px; background: rgba(59, 130, 246, 0.15); display: flex; align-items: center; justify-content: center; color: #3b82f6;">
                                    ${note.type === 'image' ? html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>` : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`}
                                </div>
                            </div>
                            <div style="font-size: 11px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: auto; text-align: center; width: 100%;">
                                ${note.shortcutName || note.title || 'Untitled Note'}
                            </div>
                            <div style="font-size: 9px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-transform: uppercase; letter-spacing: 0.5px; text-align: center; width: 100%;">
                                ${note.type === 'image' ? 'Image Note' : note.ext || 'Text Note'}
                            </div>
                        </div>
                    `)}
                </div>

                <!-- Unpin Confirmation Modal -->
                ${this._noteToUnpin ? html`
                    <div class="modal-overlay" @click=${() => this.cancelUnpin()}>
                        <div class="modal-content" @click=${e => e.stopPropagation()} style="display: flex; flex-direction: column; align-items: center; text-align: center; padding: 32px;">
                            <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(239, 68, 68, 0.1); color: #ef4444; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                            </div>
                            <h3 style="margin:0 0 12px 0; font-size: 18px; font-weight: 600;">Unpin Shortcut?</h3>
                            <p style="margin:0 0 24px 0; font-size: 14px; color: var(--text-muted); line-height: 1.5;">
                                This will remove "<strong>${this._noteToUnpin.shortcutName || this._noteToUnpin.title}</strong>" from your Home screen. The note itself will not be deleted.
                            </p>
                            <div style="display:flex; justify-content:center; gap: 12px; width: 100%;">
                                <button @click=${() => this.cancelUnpin()} style="flex: 1; padding: 10px 16px; border: 1px solid var(--border-color); background: rgba(255,255,255,0.05); color: var(--text-primary); cursor: pointer; border-radius: 8px; font-weight: 500; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'">Cancel</button>
                                <button @click=${() => this.confirmUnpin()} style="flex: 1; padding: 10px 16px; border: none; background: #ef4444; color: white; cursor: pointer; border-radius: 8px; font-weight: 500; transition: background 0.2s; box-shadow: 0 4px 12px rgba(239,68,68,0.3);" onmouseover="this.style.background='#dc2626'" onmouseout="this.style.background='#ef4444'">Unpin</button>
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- Inline Viewer Modal -->
                ${this._viewingNoteId ? (() => {
                    const viewingNote = this._notes.find(n => n.id === this._viewingNoteId);
                    if (!viewingNote) return '';
                    return html`
                        <style>
                            .modal-content.fullscreen-viewer {
                                width: 100% !important;
                                height: 100% !important;
                                border-radius: 0 !important;
                                background: var(--bg-surface);
                            }
                            .fullscreen-viewer .doc-viewer-wrapper {
                                width: 100%;
                                height: 100%;
                                display: flex;
                                flex-direction: column;
                            }
                            .fullscreen-viewer .doc-viewer-body {
                                flex: 1;
                                display: flex;
                                height: 100%;
                            }
                            .fullscreen-viewer .doc-viewer-sidebar {
                                display: none !important;
                            }
                            .fullscreen-viewer .doc-viewer-embed {
                                flex: 1;
                                width: 100%;
                                height: 100%;
                                border: none;
                            }
                            .fullscreen-viewer .doc-sidebar-header {
                                padding: 12px 16px;
                                font-weight: 600;
                                font-size: 14px;
                                color: var(--text-primary);
                                border-bottom: 1px solid var(--border-color);
                            }
                            .fullscreen-viewer .doc-page-btn {
                                padding: 8px 16px;
                                border: none;
                                background: transparent;
                                width: 100%;
                                text-align: left;
                                cursor: pointer;
                                color: var(--text-secondary);
                            }
                            .fullscreen-viewer .doc-page-btn:hover {
                                background: rgba(255,255,255,0.05);
                            }
                        
        /* MainView Responsive Action Bar */

        .action-mouse-toggle {
            pointer-events: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            padding: 0 8px;
            margin-right: 8px;
            width: 130px;
            max-width: 130px;
            flex-shrink: 0;
        }
        .start-btn-container {
            display: flex;
            gap: 12px;
            margin-left: 12px;
            flex-shrink: 0;
        }

        @media (max-width: 768px) {
            .action-mouse-toggle {
                width: 100%;
                max-width: 100%;
                margin-right: 0;
                margin-top: 8px;
                margin-bottom: 8px;
            }
            .start-btn-container {
                margin-left: 0;
            }
        }

        .action-bar-container {
            display: flex;
            align-items: center;
            border: 1px solid;
            border-radius: 50px;
            background: var(--bg-surface);
            padding: 8px 12px 8px 24px;
            width: 100%;
            max-width: 100%;
            transition: background 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease;
        }
        
        .action-dropdown {
            width: 220px;
            flex-shrink: 1;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            position: relative;
        }

        .action-divider {
            width: 1px;
            height: 32px;
            background: var(--border);
            margin: 0 20px;
        }

        @media (max-width: 768px) {
            .action-bar-container {
                flex-direction: column;
                border-radius: 20px;
                padding: 16px;
                gap: 16px;
                align-items: stretch;
            }
            .action-dropdown {
                width: 100%;
            }
            .action-divider {
                width: 100%;
                height: 1px;
                margin: 0;
            }
            .start-btn-container {
                display: flex;
                flex-direction: column;
                align-items: stretch;
                width: 100%;
                margin-top: 8px;
            }
            .start-btn-container > div, .start-btn-container > button {
                width: 100%;
                justify-content: center;
                margin-left: 0 !important;
            }
        }

    
        .mouse-toggle-container { display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; padding: 0 8px; margin-right: 8px; width: 130px; max-width: 130px; flex-shrink: 0; pointer-events: auto; }
        .mouse-toggle-switch { position: relative; width: 32px; height: 18px; background: #cbd5e1; border-radius: 10px; transition: background 0.2s ease; pointer-events: none; margin: 0 auto; }
        .mouse-toggle-knob { position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; background: white; border-radius: 50%; box-shadow: 0 1px 2px rgba(0,0,0,0.1); transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .mouse-toggle-container.stealth-tooltip.undetectable .mouse-toggle-switch { background: #3b82f6; }
        .mouse-toggle-container.stealth-tooltip.undetectable .mouse-toggle-knob { transform: translateX(14px); }
        html[data-theme='dark'] .mouse-toggle-switch { background: #475569; }
    </style>
                        <div class="modal-overlay" @click=${() => this.closeNoteViewer()} style="background:rgba(0,0,0,0.9); z-index: 9999;">
                            <div class="modal-content fullscreen-viewer" @click=${e => e.stopPropagation()} style="display: flex; flex-direction: column; padding: 0; overflow: hidden;">
                                <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; border-bottom: 1px solid var(--border-color); background: var(--bg-elevated);">
                                    <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: var(--text-primary);">${viewingNote.title || 'Untitled Note'}</h3>
                                    <button @click=${() => this.closeNoteViewer()} style="background:transparent; border:none; color:var(--text-muted); cursor:pointer; padding:8px; border-radius:8px;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                </div>
                                <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column;">
                                    ${viewingNote.type === 'image' && viewingNote.imageData ? html`
                                        <div style="flex: 1; display:flex; justify-content:center; align-items:center; padding: 24px; background: rgba(0,0,0,0.2);">
                                            <img src=${viewingNote.imageData} style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 8px; box-shadow: 0 8px 32px rgba(0,0,0,0.4);" />
                                        </div>
                                    ` : html`
                                        <div style="flex: 1; width: 100%; height: 100%; line-height: 1.6; color: var(--text-secondary); font-size: 14px; white-space: pre-wrap; ${viewingNote.content?.includes('doc-viewer-wrapper') ? 'padding: 0;' : 'padding: 24px;'}" .innerHTML=${viewingNote.content || '<em>No content</em>'}></div>
                                    `}
                                </div>
                            </div>
                        </div>
                    `;
                })() : ''}
            </div>
        `;
    }
}

customElements.define('main-view', MainView);

