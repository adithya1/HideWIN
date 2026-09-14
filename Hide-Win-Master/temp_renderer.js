import { html } from '../../assets/lit-core-2.7.4.min.js';

export function render() {
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
                            <span class="upload-progress-eta">${this.uploadProgress.eta} ┬╖ ${this.uploadProgress.pct}%</span>
                        </div>
                        <div class="upload-progress-track">
                            <div class="upload-progress-fill" style="width: ${this.uploadProgress.pct}%"></div>
                        </div>
                    </div>
                ` : ''}

                <!-- Content area -->
                ${filteredNotes.length === 0 ? html`
                    <div class="empty-state">
                        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2" style="opacity: 0.5; margin-bottom: 16px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                        <div>No notes yet. Click <strong>New Note</strong> or the <strong>upload</strong> icon to get started.</div>
                    </div>
                ` : this.viewMode === 'list' ? html`
                    <!-- List View -->
                    <div class="notes-list">
                        ${filteredNotes.map(note => {
                            const typeClass = this._noteTypeClass(note);
                            return html`
                            <div class="list-row" @click=${() => this.expandedNoteId = note.id}>
                                <div class="list-row-icon">
                                    ${note.type === 'image' ? html`
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                    ` : typeClass === 'doc' ? html`
                                        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2" style="opacity: 0.5; margin-bottom: 16px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                                    ` : html`
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                    `}
                                </div>
                                <span class="list-row-title">${note.title || 'Untitled Note'}</span>
                                ${note.type !== 'image' && typeClass !== 'doc' ? html`
                                    <span class="list-row-preview">${this.stripHtml(note.content) || 'ΓÇö'}</span>
                                ` : ''}
                                <span class="list-row-type ${typeClass}">${note.ext || typeClass}</span>
                                <span class="list-row-date">${note.createdAt}</span>
                                <div class="list-row-actions">
                                    <button class="row-action-btn" title=${note.pinned ? 'Unpin from Home' : 'Pin to Home'} @click=${e => this.togglePin(e, note)} style="color: ${note.pinned ? '#3b82f6' : 'inherit'};">
                                        <svg viewBox="0 0 24 24" fill="${note.pinned ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 11.24V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3v5.24a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg>
                                    </button>
                                    <button class="row-action-btn"  @click=${e => this.copyNoteContent(note, e)}>
                                        ${this.copiedNoteId === note.id ? html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>` : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`}
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
                                <div class="note-card" id="note-${note.id}" @click=${() => this.expandedNoteId = note.id}>
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
                                            <button class="action-btn" title=${note.pinned ? 'Unpin from Home' : 'Pin to Home'} @click=${e => this.togglePin(e, note)} style="color: ${note.pinned ? '#3b82f6' : 'inherit'};">
                                                <svg viewBox="0 0 24 24" fill="${note.pinned ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 11.24V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3v5.24a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg>
                                            </button>
                                            <button class="action-btn"  @click=${e => this.copyNoteContent(note, e)}>
                                                ${this.copiedNoteId === note.id ? html`Γ£ô` : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`}
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
                
                <!-- Pin Shortcut Prompt Overlay -->
                ${this.pinPromptNoteId ? html`
                    <div class="modal-overlay" @click=${() => this.cancelPin()} style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;">
                        <div class="modal-content" @click=${e => e.stopPropagation()} style="background:var(--bg-surface, white);padding:24px;border-radius:12px;width:300px;box-shadow:0 10px 25px rgba(0,0,0,0.1);">
                            <h3 style="margin:0 0 16px 0;font-size:16px;color:var(--text-primary, #0f172a);">Pin Shortcut</h3>
                            <p style="margin:0 0 12px 0;font-size:13px;color:var(--text-muted, #64748b);">Enter a short name for this pinned item:</p>
                            <input type="text" 
                                .value=${this.pinPromptShortcutName} 
                                @input=${e => this.pinPromptShortcutName = e.target.value}
                                @keyup=${e => e.key === 'Enter' && this.confirmPin()}
                                style="width:100%;padding:10px;border:1px solid var(--border, #e2e8f0);border-radius:8px;background:var(--bg-elevated, white);color:var(--text-primary, black);font-size:14px;margin-bottom:20px;outline:none;"
                                autofocus
                            />
                            <div style="display:flex;justify-content:flex-end;gap:8px;">
                                <button @click=${() => this.cancelPin()} style="padding:8px 16px;border:none;background:transparent;color:var(--text-muted, #64748b);cursor:pointer;border-radius:6px;font-weight:500;">Cancel</button>
                                <button @click=${() => this.confirmPin()} style="padding:8px 16px;border:none;background:#3b82f6;color:white;cursor:pointer;border-radius:6px;font-weight:500;">Pin</button>
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- Toast Notification -->
                ${this._toastMessage ? html`
                    <div style="position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); background: #10b981; color: white; padding: 12px 24px; border-radius: 50px; font-weight: 500; font-size: 14px; box-shadow: 0 10px 25px rgba(16,185,129,0.3); z-index: 10000; animation: fade-in-up 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;">
                        <div style="display:flex; align-items:center; gap:8px;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            ${this._toastMessage}
                        </div>
                    </div>
                    <style>
                        @keyframes fade-in-up {
                            from { opacity: 0; transform: translate(-50%, 20px); }
                            to { opacity: 1; transform: translate(-50%, 0); }
                        }
                    
        @media (max-width: 768px) {
            .toolbar {
                flex-direction: column !important;
                align-items: stretch !important;
                padding: 16px !important;
                gap: 12px !important;
                height: auto !important;
            }
            .toolbar > div:first-child {
                display: none !important;
            }
            .toolbar .search-container, .toolbar .search-container input {
                width: 100% !important;
                max-width: 100% !important;
            }
            .grid-viewport { padding: 16px !important; }
            .notes-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
            .note-card { height: auto !important; min-height: 120px !important; }
            .list-row { padding: 16px !important; gap: 12px !important; flex-wrap: wrap; }
            .list-row-title { font-size: 16px !important; }
        }


        @media (max-width: 768px) {
            .toolbar {
                flex-direction: column !important;
                align-items: stretch !important;
                padding: 6px 40px !important;
                gap: 6px !important;
                height: auto !important;
            }
            .toolbar > div:first-child { display: none !important; }
            .toolbar .search-container { width: 100% !important; max-width: 100% !important; height: 32px !important; }
            .toolbar .search-container input { font-size: 12px !important; padding: 4px 8px 4px 30px !important; height: 100% !important;}
            .toolbar button { height: 32px !important; font-size: 12px !important; padding: 0 10px !important; border-radius: 6px !important;}
            .grid-viewport { padding: 8px !important; }
            .notes-grid { grid-template-columns: 1fr !important; gap: 8px !important; }
            .note-card { height: auto !important; min-height: 70px !important; padding: 10px !important; }
            .list-row { padding: 8px !important; gap: 6px !important; flex-wrap: wrap; }
            .list-row-title { font-size: 13px !important; }
            .note-content-preview { font-size: 11px !important; }
        }

</style>
                ` : ''}
            </div>
        
            <style>
            .tabs-container {
                display: flex;
                flex-direction: column;
                height: 100%;
                width: 100%;
                background: #1e1e1e;
            }
            .tabs-bar {
                display: flex;
                flex-direction: row;
                align-items: center;
                background: #2d2d2d;
                border-bottom: 1px solid #3e3e42;
                height: 36px;
                flex-shrink: 0;
            }
            .tabs-list {
                display: flex;
                flex-direction: row;
                align-items: center;
                flex: 1;
                overflow-x: auto;
                height: 100%;
            }
            .tab {
                display: flex;
                align-items: center;
                height: 100%;
                padding: 0 12px;
                background: #2d2d2d;
                border-right: 1px solid #3e3e42;
                color: #969696;
                cursor: pointer;
                user-select: none;
                min-width: 120px;
                max-width: 200px;
            }
            .tab:hover {
                background: #333333;
            }
            .tab.active {
                background: #1e1e1e;
                color: #ffffff;
                border-top: 2px solid #007acc;
            }
            .tab.split {
                background: #1e1e1e;
                color: #ffffff;
                border-top: 2px solid #10b981;
            }
            .tab-title {
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 13px;
                margin-right: 8px;
            }
            .tab-close {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 20px;
                height: 20px;
                border-radius: 3px;
                border: none;
                background: transparent;
                color: inherit;
                cursor: pointer;
                opacity: 0.6;
            }
            .tab-close:hover {
                background: rgba(255, 255, 255, 0.1);
                opacity: 1;
            }
            .tab-add {
                margin-left: 4px;
                font-size: 18px;
                opacity: 0.7;
            }
            .tab-add:hover {
                opacity: 1;
            }
            .split-view {
                display: flex;
                flex-direction: row !important;
            }
            .split-pane {
                flex: 1;
                border-right: 1px solid #3e3e42;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            .split-pane:last-child {
                border-right: none;
            }
            
        @media (max-width: 768px) {
            .toolbar {
                flex-direction: column !important;
                align-items: stretch !important;
                padding: 16px !important;
                gap: 12px !important;
                height: auto !important;
            }
            .toolbar > div:first-child {
                display: none !important;
            }
            .toolbar .search-container, .toolbar .search-container input {
                width: 100% !important;
                max-width: 100% !important;
            }
            .grid-viewport { padding: 16px !important; }
            .notes-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
            .note-card { height: auto !important; min-height: 120px !important; }
            .list-row { padding: 16px !important; gap: 12px !important; flex-wrap: wrap; }
            .list-row-title { font-size: 16px !important; }
        }


        @media (max-width: 768px) {
            .toolbar {
                flex-direction: column !important;
                align-items: stretch !important;
                padding: 6px 40px !important;
                gap: 6px !important;
                height: auto !important;
            }
            .toolbar > div:first-child { display: none !important; }
            .toolbar .search-container { width: 100% !important; max-width: 100% !important; height: 32px !important; }
            .toolbar .search-container input { font-size: 12px !important; padding: 4px 8px 4px 30px !important; height: 100% !important;}
            .toolbar button { height: 32px !important; font-size: 12px !important; padding: 0 10px !important; border-radius: 6px !important;}
            .grid-viewport { padding: 8px !important; }
            .notes-grid { grid-template-columns: 1fr !important; gap: 8px !important; }
            .note-card { height: auto !important; min-height: 70px !important; padding: 10px !important; }
            .list-row { padding: 8px !important; gap: 6px !important; flex-wrap: wrap; }
            .list-row-title { font-size: 13px !important; }
            .note-content-preview { font-size: 11px !important; }
        }

</style>
`;
    }



