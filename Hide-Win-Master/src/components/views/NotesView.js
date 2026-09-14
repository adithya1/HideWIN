import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';
import { unifiedPageStyles } from './sharedPageStyles.js';

export class NotesView extends LitElement {
    static styles = [
        unifiedPageStyles,
        css`
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

            .editor-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 12px; background: var(--bg-elevated); border-bottom: 1px solid var(--border); border-top-left-radius: 12px; border-top-right-radius: 12px; }
            .toolbar-group { display: flex; align-items: center; gap: 4px; }
            .toolbar-divider { width: 1px; height: 20px; background: var(--border); margin: 0 4px; }
            .toolbar-btn { display: flex; align-items: center; justify-content: center; min-width: 32px; height: 32px; padding: 0 8px; background: transparent; border: 1px solid transparent; border-radius: 6px; color: var(--text-primary); font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; }
            .toolbar-btn:hover { background: rgba(120, 120, 120, 0.1); border-color: var(--border); }
            .toolbar-btn svg { width: 16px; height: 16px; }

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
                
                -webkit-
                border: 1px solid var(--bg-hover);
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
                border-bottom: 1px solid var(--bg-hover);
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

    static properties = {
        notes: { type: Array },
        expandedNoteId: { type: String },
        searchQuery: { type: String },
        copiedNoteId: { type: String },
        isSessionMode: { type: Boolean },
        viewMode: { type: String },
        uploadProgress: { type: Object },
        targetNoteId: { type: String },
        pinPromptNoteId: { type: String },
        pinPromptShortcutName: { type: String }
    };

    constructor() {
        super();
        this.notes = [];
        this.expandedNoteId = null;
        this.searchQuery = '';
        this.copiedNoteId = null;
        this.isSessionMode = false;
        this.viewMode = 'list';
        this.uploadProgress = null;
        this.targetNoteId = null;
        this.pinPromptNoteId = null;
        this.pinPromptShortcutName = '';
        this.loadNotes();
    }

    updated(changedProperties) {
        super.updated && super.updated(changedProperties);
        if (changedProperties.has('targetNoteId') && this.targetNoteId) {
            this.expandedNoteId = this.targetNoteId;
            // Optionally scroll to it
            setTimeout(() => {
                const noteEl = this.shadowRoot.getElementById(`note-${this.targetNoteId}`);
                if (noteEl) {
                    noteEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    }

    async loadNotes() {
        try {
            this.notes = (await hideWin.storage.getNotes()) || [];
        } catch (error) {
            console.error('Failed to load notes:', error);
        }
    }

    async saveNotes(skipUpdate = false) {
        try {
            await hideWin.storage.saveNotes(this.notes);
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
        this.expandedNoteId = newNote.id;
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
                // Document â€” validate format and create note with progress simulation, NO auto-expand
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
                    // Office conversion â€” simulate progress while converting
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
                    // PDF or TXT â€” quick embed
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
            this.expandedNoteId = newNote.id;
            await this.saveNotes();

            // Wait for next tick for the editor to render
            await new Promise(r => setTimeout(r, 100));

            const editor = this.shadowRoot.querySelector('.full-note-editor');
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

        const editor = this.shadowRoot.querySelector('.full-note-editor');
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
                const viewerHtml = `<div class="doc-viewer-wrapper" contenteditable="false" style="display:flex; justify-content:center; align-items:center; width:100%; height:100%; min-height: 400px; background:transparent;">
                    <img src="${event.target.result}" alt="${file.name}" style="max-width:100%; max-height:100%; object-fit:contain; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.2);"/>
                </div>`;
                if (editor) {
                    editor.innerHTML = viewerHtml;
                    this._saveEditorContent(editor);
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
        const index = this.notes.findIndex(n => n.id === this.expandedNoteId);
        if (index > -1) {
            this.notes[index] = { ...this.notes[index], content: editor.innerHTML };
            this.saveNotes(true);
        }
    }



    togglePin(e, note) {
        e.stopPropagation();
        if (note.pinned) {
            note.pinned = false;
            note.shortcutName = null;
            this.saveNotes();
        } else {
            this.pinPromptNoteId = note.id;
            this.pinPromptShortcutName = note.title || 'Pinned Note';
            this.requestUpdate();
        }
    }

    confirmPin() {
        if (!this.pinPromptNoteId) return;
        const note = this.notes.find(n => n.id === this.pinPromptNoteId);
        if (note) {
            note.pinned = true;
            note.shortcutName = this.pinPromptShortcutName.trim() || note.title || 'Pinned Note';
            this.saveNotes();
            window.dispatchEvent(new CustomEvent('notes-updated'));
            this.showToast('Shortcut pinned to Home!');
        }
        this.pinPromptNoteId = null;
        this.pinPromptShortcutName = '';
        this.requestUpdate();
    }

    showToast(msg) {
        this._toastMessage = msg;
        this.requestUpdate();
        setTimeout(() => {
            this._toastMessage = null;
            this.requestUpdate();
        }, 3000);
    }

    cancelPin() {
        this.pinPromptNoteId = null;
        this.pinPromptShortcutName = '';
        this.requestUpdate();
    }

    deleteNote(id, e) {
        if (e) e.stopPropagation();
        this.notes = this.notes.filter(n => n.id !== id);
        if (this.expandedNoteId === id) this.expandedNoteId = null;
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
        while (this.notes.some(n => n.id !== ignoreNoteId && (n.title || '').toLowerCase() === title.toLowerCase())) {
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
        const index = this.notes.findIndex(n => n.id === this.expandedNoteId);
        if (index > -1) {
            const oldTitle = this.notes[index].title;
            
            // Validation 1: Compulsory name
            if (!newTitle) {
                hideWin.setStatus('File name cannot be empty');
                e.target.value = oldTitle;
                return;
            }

            // Validation 2: Already exists
            const duplicate = this.notes.some(n => n.id !== this.expandedNoteId && n.title.toLowerCase() === newTitle.toLowerCase());
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
        const index = this.notes.findIndex(n => n.id === this.expandedNoteId);
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

    handleEditorInput(e) {
        const content = e.target.innerHTML;
        this.syncLineNumbersSynchronously(content);

        const index = this.notes.findIndex(n => n.id === this.expandedNoteId);
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

        const editor = this.shadowRoot.querySelector('.full-note-editor');
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

    format(command, value = null) {
        document.execCommand(command, false, value);
        const editor = this.shadowRoot.querySelector('.full-note-editor');
        if (editor) {
            this.syncLineNumbersSynchronously(editor.innerHTML);
            const index = this.notes.findIndex(n => n.id === this.expandedNoteId);
            if (index > -1) {
                this.notes[index] = { ...this.notes[index], content: editor.innerHTML };
                this.saveNotes(true);
            }
        }
    }

    renderFullNoteView() {
        if (!this.expandedNoteId) return '';
        const note = this.notes.find(n => n.id === this.expandedNoteId);
        if (!note) return '';

        // Detect if this note is primarily a document viewer (hide text toolbar)
        const isDocNote = note.content && note.content.includes('doc-viewer-wrapper');

        return html`
            <div class="full-note-view ${isDocNote ? 'doc-mode' : ''}">
                <div class="full-note-header">
                    <button class="hdr-icon-btn" title="Back to Notes" @click=${() => this.expandedNoteId = null}>
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
                        </div>
                        <div class="toolbar-divider"></div>
                        <div class="toolbar-group">
                            <button class="toolbar-btn" title="Bold" @click=${() => this.format('bold')}><b>B</b></button>
                            <button class="toolbar-btn" title="Italic" @click=${() => this.format('italic')}><i>I</i></button>
                            <button class="toolbar-btn" title="Underline" @click=${() => this.format('underline')}><u>U</u></button>
                            <button class="toolbar-btn" title="Strikethrough" @click=${() => this.format('strikeThrough')}><s>S</s></button>
                            <button class="toolbar-btn" title="Highlight" @click=${() => this.format('hiliteColor', '#ffeb3b')}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                                </svg>
                            </button>
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
                            @input=${e => this.handleEditorInput(e)}
                            @keyup=${e => this.handleEditorKeyup(e)}
                            @paste=${e => this.handleEditorPaste(e)}
                            @drop=${e => this.handleEditorDrop(e)}
                            @dragover=${e => e.preventDefault()}
                            @click=${e => this.handleEditorClick(e)}
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
                    <div style="display:flex;gap:4px;flex-shrink:0;">
                        <button class="icon-btn ${this.viewMode === 'list' ? 'active' : ''}" title="List view" @click=${() => this.viewMode = 'list'}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                        </button>
                        <button class="icon-btn ${this.viewMode === 'grid' ? 'active' : ''}" title="Grid view" @click=${() => this.viewMode = 'grid'}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>
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
                            <span class="upload-progress-eta">${this.uploadProgress.eta} Â· ${this.uploadProgress.pct}%</span>
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
                            <div class="list-row" @click=${() => this.expandedNoteId = note.id}>
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
                                    <span class="list-row-preview">${this.stripHtml(note.content) || 'â€”'}</span>
                                ` : ''}
                                <span class="list-row-type ${typeClass}">${note.ext || typeClass}</span>
                                <span class="list-row-date">${note.createdAt}</span>
                                <div class="list-row-actions">
                                    <button class="row-action-btn" title=${note.pinned ? 'Unpin from Home' : 'Pin to Home'} @click=${e => this.togglePin(e, note)} style="color: ${note.pinned ? 'var(--accent)' : 'inherit'};">
                                        <svg viewBox="0 0 24 24" fill="${note.pinned ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 11.24V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3v5.24a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg>
                                    </button>
                                    <button class="row-action-btn" title="Copy" @click=${e => this.copyNoteContent(note, e)}>
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
                                            <button class="action-btn" title=${note.pinned ? 'Unpin from Home' : 'Pin to Home'} @click=${e => this.togglePin(e, note)} style="color: ${note.pinned ? 'var(--accent)' : 'inherit'};">
                                                <svg viewBox="0 0 24 24" fill="${note.pinned ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 11.24V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3v5.24a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg>
                                            </button>
                                            <button class="action-btn" title="Copy" @click=${e => this.copyNoteContent(note, e)}>
                                                ${this.copiedNoteId === note.id ? html`âœ“` : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`}
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
                        <div class="modal-content" @click=${e => e.stopPropagation()} style="background:var(--bg-surface, white);padding:24px;border-radius: 6px;width:300px;box-shadow:0 10px 25px rgba(0,0,0,0.1);">
                            <h3 style="margin:0 0 16px 0;font-size:16px;color:var(--text-primary, var(--text-primary));">Pin Shortcut</h3>
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
                                <button @click=${() => this.confirmPin()} style="padding:8px 16px;border:none;background:var(--accent);color:white;cursor:pointer;border-radius:6px;font-weight:500;">Pin</button>
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- Toast Notification -->
                ${this._toastMessage ? html`
                    <div style="position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; font-weight: 500; font-size: 14px; box-shadow: 0 10px 25px rgba(16,185,129,0.3); z-index: 10000; animation: fade-in-up 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;">
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
                    </style>
                ` : ''}
            </div>
        `;
    }
}

customElements.define('notes-view', NotesView);



