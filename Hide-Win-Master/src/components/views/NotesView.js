import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';
import { render } from './NotesViewRenderer.js';
import { notesStyles } from './NotesView.styles.js';

export class NotesView extends LitElement {
    static styles = notesStyles;


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
            this.notes = await hideWin.storage.getNotes();
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
                    if (result && !result.success) {
                        console.error("Desktop shortcut generation failed:", result.error);
                    } else {
                        // Show toast via main app
                        if (window.hideWin && window.hideWin.setStatus) window.hideWin.setStatus('Pinned to Desktop!');
                    }
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
                            <button class="hdr-icon-btn ${this.copiedNoteId === note.id ? 'success' : ''}"  @click=${e => this.copyNoteContent(note, e)}>
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
        return render.call(this);
    }
