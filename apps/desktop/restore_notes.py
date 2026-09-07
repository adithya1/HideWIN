import re

missing_code = """
        ];
        
    static get properties() {
        return {
            notes: { type: Array },
            activeTabId: { type: String },
            openTabs: { type: Array },
            splitTabId: { type: String },
            searchQuery: { type: String },
            viewMode: { type: String },
            uploadProgress: { type: Object }
        };
    }

    constructor() {
        super();
        this.notes = [];
        this.openTabs = [];
        this.activeTabId = null;
        this.splitTabId = null;
        this.searchQuery = '';
        this.viewMode = 'grid';
        this.uploadProgress = null;
    }

    firstUpdated() {
        this.loadNotes();
    }

    async loadNotes() {
        try {
            const { ipcRenderer } = window.hideWin || window.require('electron');
            this.notes = await ipcRenderer.invoke('get-notes');
            this.requestUpdate();
        } catch (err) {
            console.error("Failed to load notes", err);
        }
    }

    async saveNotes() {
        try {
            const { ipcRenderer } = window.hideWin || window.require('electron');
            await ipcRenderer.invoke('save-notes', this.notes);
            this.requestUpdate();
        } catch (err) {
            console.error("Failed to save notes", err);
        }
    }

    createNote() {
        const newNote = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
            type: 'text',
            title: 'New Note',
            content: '',
            createdAt: new Date().toLocaleDateString(),
            pinned: false
        };
        this.notes = [newNote, ...this.notes];
        this.openTabs.push(newNote.id);
        this.activeTabId = newNote.id;
        this.saveNotes();
    }

    openNoteTab(id) {
        if (!this.openTabs.includes(id)) {
            this.openTabs.push(id);
        }
        this.activeTabId = id;
        this.requestUpdate();
    }

    closeTab(id, e) {
        if (e) e.stopPropagation();
        this.openTabs = this.openTabs.filter(tabId => tabId !== id);
        if (this.activeTabId === id) {
            this.activeTabId = this.openTabs.length > 0 ? this.openTabs[this.openTabs.length - 1] : null;
        }
        if (this.splitTabId === id) {
            this.splitTabId = null;
        }
        this.requestUpdate();
    }

    deleteNote(id, e) {
        if (e) e.stopPropagation();
        this.notes = this.notes.filter(n => n.id !== id);
        this.closeTab(id);
        this.saveNotes();
    }

    pinToHome(note, e) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        note.pinned = !note.pinned;
        if (note.pinned) {
            try {
                const { ipcRenderer } = window.hideWin || window.require('electron');
                ipcRenderer.invoke('pin-to-desktop', note.id, note.title || 'Untitled Note').then(result => {
                    if (result && !result.success) {
                        console.error("Desktop shortcut generation failed:", result.error);
                    } else {
                        if (window.hideWin && window.hideWin.setStatus) window.hideWin.setStatus('Pinned to Desktop!');
                    }
                }).catch(err => {
                    console.error("IPC invocation for pin-to-desktop failed:", err);
                });
            } catch (err) {
                console.error("Could not require electron for pin", err);
            }
        }
        this.saveNotes();
        this.requestUpdate();
    }

    _getUniqueTitle(baseName) {
        let name = baseName;
        let count = 1;
        while (this.notes.some(n => n.title === name)) {
            name = `${baseName} (${count})`;
            count++;
        }
        return name;
    }

    stripHtml(html) {
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
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
                            this.uploadProgress = { filename: file.name, pct, eta: 'reading...' };
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
                const OFFICE_EXTS = ['.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx'];
                const SUPPORTED_EXTS = [...OFFICE_EXTS, '.pdf', '.txt'];
                const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
                
                if (!SUPPORTED_EXTS.includes(ext)) {
                    if (window.hideWin && window.hideWin.setStatus) window.hideWin.setStatus(`Unsupported file format: ${ext}`);
                    continue;
                }

                const noteId = Date.now().toString() + Math.random().toString(36).substr(2, 4);
                const newNote = {
                    id: noteId,
                    type: 'text',
                    title: this._getUniqueTitle(file.name),
                    ext: ext.replace('.', '').toUpperCase(),
                    content: '',
                    imageData: null,
                    createdAt: new Date().toLocaleDateString()
                };
                this.notes = [newNote, ...this.notes];
                await this.saveNotes();

                if (OFFICE_EXTS.includes(ext)) {
                    const timer = this._simulateProgress(file.name);
                    try {
                        let viewerHtml = '';
                        if (ext === '.xls' || ext === '.xlsx') {
                            const result = await window.hideWin.convertExcelToHtml(file.path);
                            clearInterval(timer);
                            if (result.success && result.html) {
                                viewerHtml = `<div class="doc-viewer-wrapper" style="width: 100%; height: 500px; overflow: auto; background: #fff; padding: 10px; box-sizing: border-box;">
                                    <style>
                                        .doc-viewer-wrapper table { border-collapse: collapse; min-width: 100%; font-family: sans-serif; font-size: 13px; }
                                        .doc-viewer-wrapper td, .doc-viewer-wrapper th { border: 1px solid #ccc; padding: 4px 8px; white-space: nowrap; }
"""

with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'r', encoding='utf-8') as f:
    text = f.read()

# We need to find the `</style>` that starts `handleMergedUpload` and replace it and everything above it that is empty `\n` up to `    }`
idx_style = text.find('</style>\n                                    ${result.html}')
if idx_style != -1:
    # go backwards to find the end of the css literal block (which is `\n            }\n\n\n            `)
    # actually, I will just replace `\n\n            </style>` with my `missing_code` plus `</style>`?
    # wait, the original `\`` was deleted. 
    # Let's find `position: relative;\n            }`
    idx_relative = text.find('position: relative;\n            }')
    if idx_relative != -1:
        # replace everything from idx_relative + len to idx_style with missing_code
        start_replace = idx_relative + len('position: relative;\n            }')
        text = text[:start_replace] + "\n        `\n" + missing_code + text[idx_style:]
        print('Successfully restored missing block!')
    else:
        print('Could not find position: relative;')
else:
    print('Could not find idx_style')

with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'w', encoding='utf-8') as f:
    f.write(text)
