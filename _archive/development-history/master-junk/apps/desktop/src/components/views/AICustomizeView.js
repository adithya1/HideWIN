import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';
import { unifiedPageStyles } from './sharedPageStyles.js';

export class AICustomizeView extends LitElement {
    static styles = [
        unifiedPageStyles,
        css`
            :host {
                display: flex;
                flex-direction: column;
                height: 100%;
                background: var(--bg-app);
                color: var(--text-primary);
                font-family: var(--font);
                overflow: hidden;
            }

            .profiles-container {
                display: flex;
                flex-direction: column;
                height: 100%;
                padding: var(--space-md);
                gap: var(--space-md);
                overflow: hidden;
            }

            /* ── Top Header Banner with Big Create Button ── */
            .profiles-header-banner {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%);
                padding: 14px 20px;
                border-radius: var(--radius-lg);
                border: 1px solid rgba(99, 102, 241, 0.3);
                gap: 16px;
                flex-wrap: wrap;
            }

            .btn-create-big {
                display: inline-flex;
                align-items: center;
                gap: 10px;
                padding: 10px 24px;
                border-radius: 12px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                border: none;
                background: #185fc4;
                color: white;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 4px 14px rgba(24, 95, 196, 0.4);
            }

            .btn-create-big:hover {
                transform: translateY(-2px);
                background: #1550a6;
                box-shadow: 0 6px 20px rgba(24, 95, 196, 0.6) !important;
            }

            .btn-create-big svg {
                width: 18px;
                height: 18px;
            }

            
            .notes-toolbar { display: flex; align-items: center; justify-content: space-between; gap: var(--space-sm); background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); padding: var(--space-sm) var(--space-md); border-radius: 16px; border: 1px solid rgba(59, 130, 246, 0.2); box-shadow: 0 4px 24px -8px rgba(59, 130, 246, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.5); flex-wrap: wrap; color: #0f172a; margin-bottom: var(--space-md); }
            .icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 10px; border: 1px solid transparent; background: transparent; color: #64748b; cursor: pointer; transition: all 0.2s; }
            .icon-btn:hover { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
            .icon-btn.active { background: #ffffff; border-color: rgba(59, 130, 246, 0.3); color: #3b82f6; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1); }
            .icon-btn svg { width: 18px; height: 18px; }
            .notes-list { display: flex; flex-direction: column; gap: var(--space-sm); overflow-y: auto; }
            .profile-card.list-mode { display: flex; flex-direction: row; align-items: center; justify-content: space-between; padding: 12px 16px; height: auto; min-height: unset; gap: var(--space-md); }
            .profile-card.list-mode .card-body { padding: 0; flex: 1; flex-direction: row; align-items: center; gap: var(--space-md); }
            .profile-card.list-mode .title-row { margin-bottom: 0; flex: 1; }
            .profile-card.list-mode .doc-labels { justify-content: flex-end; }
            .search-box {
                display: flex;
                align-items: center;
                gap: 8px;
                background: #ffffff;
                border: 1px solid rgba(59, 130, 246, 0.3);
                box-shadow: inset 0 2px 4px rgba(59, 130, 246, 0.05);
                border-radius: 12px;
                padding: 4px 10px;
                min-width: 220px;
                height: 42px;
                box-sizing: border-box;
                transition: all 0.2s;
            }

            .search-box:focus-within {
                border-color: #3b82f6;
                background: #ffffff;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2), inset 0 2px 4px rgba(59, 130, 246, 0.05);
            }

            .search-box svg {
                width: 14px;
                height: 14px;
                color: #64748b;
                flex-shrink: 0;
            }

            .search-input {
                background: transparent;
                border: none;
                color: #0f172a;
                font-size: 14px;
                outline: none;
                width: 100%;
                padding: 0;
            }

            .search-input::placeholder {
                color: #94a3b8;
            }

            /* ── Grid Viewport ── */
            .grid-viewport {
                flex: 1;
                overflow-y: auto;
                padding-right: 4px;
            }

            .profiles-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: var(--space-md);
                padding-bottom: 20px;
            }

            /* ── User Profile Card ── */
            .profile-card {
                display: flex;
                flex-direction: column;
                background: #ffffff;
                border: 1px solid rgba(59, 130, 246, 0.2);
                border-radius: var(--radius-lg);
                padding: 14px;
                gap: 10px;
                position: relative;
                cursor: default;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                min-height: 185px;
                color: #0f172a;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.05);
            }

            .profile-card:hover {
                border-color: #3b82f6;
                box-shadow: 0 6px 20px rgba(59, 130, 246, 0.15);
                transform: translateY(-2px);
            }

            .profile-card.active {
                border-color: #3b82f6;
                background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
            }

            .card-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
            }

            .id-badge {
                font-size: 10px;
                font-weight: 700;
                color: var(--accent);
                background: rgba(99, 102, 241, 0.15);
                padding: 2px 8px;
                border-radius: 4px;
                border: 1px solid rgba(99, 102, 241, 0.3);
            }

            .user-name {
                font-size: 14px;
                font-weight: 700;
                color: #0f172a;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                flex: 1;
            }

            .type-badge {
                font-size: 10px;
                font-weight: 600;
                padding: 2px 8px;
                border-radius: 4px;
                text-transform: uppercase;
                background: rgba(59, 130, 246, 0.1);
                color: #3b82f6;
                border: 1px solid rgba(59, 130, 246, 0.2);
            }

            .card-details {
                display: flex;
                flex-direction: column;
                gap: 6px;
                flex: 1;
            }

            .detail-row {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            .detail-label {
                font-size: 10px;
                font-weight: 600;
                color: #64748b;
                text-transform: uppercase;
            }

            .file-tag {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                font-size: 11px;
                color: var(--success);
                background: rgba(34, 197, 94, 0.12);
                padding: 2px 8px;
                border-radius: 4px;
                width: fit-content;
            }

            .snippet-text {
                font-size: 11px;
                line-height: 1.4;
                color: var(--text-secondary);
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                word-break: break-word;
            }

            .card-footer {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top: auto;
                padding-top: 10px;
                border-top: 1px solid var(--border);
            }

            .btn-action {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                padding: 6px 14px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 600;
                cursor: pointer;
                border: 1px solid rgba(59, 130, 246, 0.3);
                background: #ffffff;
                color: #0f172a;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .btn-action:hover {
                border-color: #3b82f6;
                background: #f8fafc;
            }

            .btn-action.active {
                background: #185fc4;
                color: #ffffff;
                border: none;
                box-shadow: 0 4px 14px rgba(24, 95, 196, 0.4);
            }

            .action-btn-icon {
                background: transparent;
                border: none;
                color: var(--text-muted);
                padding: 4px;
                border-radius: var(--radius-sm);
                cursor: default;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .action-btn-icon:hover {
                color: var(--danger);
                background: rgba(239, 68, 68, 0.15);
            }

            /* ── 800x800 Focus Window Modal ── */
            .modal-backdrop {
                position: fixed;
                inset: 0;
                z-index: 99999;
                background: rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(4px);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: var(--space-md);
            }

            .modal-card {
                background: var(--bg-surface);
                border: 1px solid var(--border-strong);
                border-radius: var(--radius-lg);
                width: 90vw;
                max-width: 800px;
                height: 85vh;
                max-height: 800px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                box-shadow: 0 16px 40px rgba(0, 0, 0, 0.85);
            }

            .modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 14px 20px;
                border-bottom: 1px solid var(--border);
                background: var(--bg-elevated);
            }

            .modal-title {
                font-size: 15px;
                font-weight: 700;
                color: var(--text-primary);
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .modal-body {
                padding: 20px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 16px;
                flex: 1;
            }

            .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
            }

            .form-group {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .form-label {
                font-size: 11px;
                font-weight: 600;
                color: var(--text-muted);
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .form-control {
                background: var(--bg-elevated);
                border: 1px solid rgba(128, 128, 128, 0.4);
                box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
                color: var(--text-primary);
                padding: 10px 12px;
                border-radius: var(--radius-sm);
                font-size: 13px;
                font-family: inherit;
                outline: none;
                transition: all var(--transition);
            }

            .form-control:focus {
                border-color: var(--accent);
                box-shadow: 0 0 0 2px rgba(128, 128, 128, 0.2);
            }

            textarea.form-control {
                min-height: 110px;
                resize: vertical;
                line-height: 1.5;
            }

            .modal-footer {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 14px 20px;
                border-top: 1px solid var(--border);
                background: var(--bg-elevated);
            }

            .hidden-file-input {
                display: none;
            }
        
            .analyze-canvas {
            position: absolute;
            inset: -1px;
            width: calc(100% + 2px);
            height: calc(100% + 2px);
            pointer-events: none;
        }

        @keyframes errorShake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-4px); }
            40%, 80% { transform: translateX(4px); }
        }
        .error-shake {
            animation: errorShake 0.4s ease-in-out;
            border-color: #ef4444 !important;
            box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.5) !important;
        }
    `
    ];

    static properties = {
        responses: { type: Array },
        currentResponseIndex: { type: Number },
        selectedProfile: { type: String },
        onSendText: { type: Function },
        shouldAnimateResponse: { type: Boolean },
        onProfileChange: { type: Function },
        profiles: { type: Array },
        editingProfileId: { type: String },
        searchQuery: { type: String },
            viewMode: { type: String },

        // Modal edit state
        editUserName: { state: true },
        editType: { state: true },
        editResume: { state: true },
        editJd: { state: true },
        editResumeFile: { state: true },
        editJdFile: { state: true },
        isModalOpen: { state: true },
        editErrors: { state: true },
        isOverlayMode: { type: Boolean }
    };

    constructor() {
        super();
        this.selectedProfile = 'interview';
        this.onProfileChange = () => {};
        this.profiles = [];
        this.editingProfileId = null;
        this.searchQuery = '';
        this.viewMode = 'grid';
        this.isModalOpen = false;

        this.editUserName = '';
        this.editType = '';
        this.editResume = '';
        this.editJd = '';
        this.editResumeFile = null;
        this.editJdFile = null;
        this.editErrors = {};

        this.loadProfiles();
    }

    async _loadProfiles() {
        this.profiles = await window.hideWin.storage.getProfiles();
    }

    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('isModalOpen')) {
            const wasOpen = changedProperties.get('isModalOpen');
            if (wasOpen === true && this.isModalOpen === false) {
                this.dispatchEvent(new CustomEvent('modal-closed', { bubbles: true, composed: true }));
            }
        }
    }

    async loadProfiles() {
        try {
            this.profiles = await hideWin.storage.getProfiles();
            this.requestUpdate();
        } catch (error) {
            console.error('Failed to load profiles:', error);
        }
    }

    async saveProfiles() {
        try {
            await hideWin.storage.saveProfiles(this.profiles);
            window.dispatchEvent(new CustomEvent('profiles-updated'));
            this.requestUpdate();
        } catch (error) {
            console.error('Failed to save profiles:', error);
        }
    }

    openCreateModal() {
        this.editingProfileId = null;
        this.editUserName = '';
        this.editType = '';
        this.editResume = '';
        this.editJd = '';
        this.editResumeFile = null;
        this.editJdFile = null;
        this.editErrors = {};
        this.isModalOpen = true;
    }

    openEditModal(profile, e) {
        if (e) e.stopPropagation();
        this.editingProfileId = profile.id;
        this.editUserName = profile.userName || profile.name || '';
        this.editType = profile.type || '';
        this.editResume = profile.resumeContent || profile.customPrompt || '';
        this.editJd = profile.jdContent || '';
        this.editResumeFile = profile.resumeFileName || profile.attachmentName || null;
        this.editJdFile = profile.jdFileName || null;
        this.editErrors = {};
        this.isModalOpen = true;
    }

    triggerUpload(target) {
        const input = this.shadowRoot.querySelector(`.file-input-${target}`);
        if (input) input.click();
    }

    async handleFileUpload(target, e) {
        const file = e.target.files[0];
        if (!file) return;

        if (file.path && window.require) {
            try {
                const { ipcRenderer } = window.require('electron');
                const result = await ipcRenderer.invoke('parse-document', file.path);
                
                if (result.success) {
                    const textContent = result.text;
                    if (target === 'resume') {
                        this.editResume = (this.editResume ? this.editResume + '\n\n' : '') + textContent;
                        this.editResumeFile = file.name;
                    } else {
                        this.editJd = (this.editJd ? this.editJd + '\n\n' : '') + textContent;
                        this.editJdFile = file.name;
                    }
                    this.requestUpdate();
                } else {
                    alert('Failed to parse document: ' + result.error);
                }
            } catch (err) {
                alert('Error parsing document: ' + err.message);
            }
            e.target.value = '';
            return;
        }

        const fileName = file.name.toLowerCase();
        if (fileName.endsWith('.pdf') || fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
            alert('Error: Please upload plain text files only if running outside the desktop app.');
            e.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const textContent = event.target.result;
            if (target === 'resume') {
                this.editResume = (this.editResume ? this.editResume + '\n\n' : '') + textContent;
                this.editResumeFile = file.name;
            } else {
                this.editJd = (this.editJd ? this.editJd + '\n\n' : '') + textContent;
                this.editJdFile = file.name;
            }
            this.requestUpdate();
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    saveProfileModal() {
        const errors = {};
        if (!this.editUserName.trim()) errors.userName = true;
        if (!this.editType) errors.type = true;
        if (!this.editResume.trim()) errors.resume = true;

        if (Object.keys(errors).length > 0) {
            this.editErrors = errors;
            this.requestUpdate();
            setTimeout(() => {
                this.editErrors = {};
                this.requestUpdate();
            }, 500);
            return;
        }

        const labels = this.getDocLabelsForType(this.editType);

        const fullCombinedPrompt = [
            this.editResume ? `${labels.doc1.toUpperCase()} (${this.editUserName}):\n${this.editResume}` : '',
            this.editJd ? `${labels.doc2.toUpperCase()}:\n${this.editJd}` : ''
        ].filter(Boolean).join('\n\n');

        let finalProfileId;

        if (this.editingProfileId) {
            const index = this.profiles.findIndex(p => p.id === this.editingProfileId);
            if (index > -1) {
                this.profiles[index] = {
                    ...this.profiles[index],
                    userName: this.editUserName,
                    name: this.editUserName,
                    type: this.editType,
                    resumeContent: this.editResume,
                    jdContent: this.editJd,
                    resumeFileName: this.editResumeFile,
                    jdFileName: this.editJdFile,
                    customPrompt: fullCombinedPrompt,
                    attachmentName: this.editResumeFile || this.editJdFile
                };
            }
            finalProfileId = this.editingProfileId;
        } else {
            const nextNumericId = this.profiles.length > 0 ? Math.max(...this.profiles.map(p => p.numericId || 0)) + 1 : 1;
            const newId = 'profile-' + Date.now();
            const newProfile = {
                id: newId,
                numericId: nextNumericId,
                userName: this.editUserName,
                name: this.editUserName,
                type: this.editType,
                resumeContent: this.editResume,
                jdContent: this.editJd,
                resumeFileName: this.editResumeFile,
                jdFileName: this.editJdFile,
                customPrompt: fullCombinedPrompt,
                attachmentName: this.editResumeFile || this.editJdFile,
                createdAt: new Date().toISOString()
            };
            this.profiles = [newProfile, ...this.profiles];
            finalProfileId = newId;
        }

        this.saveProfiles();
        
        // Automatically select the newly created or edited profile
        this.selectProfileForSession(finalProfileId);
        
        this.isModalOpen = false;
    }

    deleteProfile(id, e) {
        if (e) e.stopPropagation();
        this.profiles = this.profiles.filter(p => p.id !== id);
        this.saveProfiles();
    }

    selectProfileForSession(id, e) {
        if (e) e.stopPropagation();
        this.selectedProfile = id;
        this.onProfileChange(id);
        hideWin.storage.updatePreference('selectedProfile', id);
        this.requestUpdate();
    }

    getDocLabelsForType(type) {
        switch (type) {
            case 'Job Interview':
                return {
                    doc1: 'Candidate Resume / CV',
                    doc1Btn: '📁 Upload Resume (.pdf, .docx, .txt)',
                    doc1Place: 'Paste candidate resume, experience, skills, and past projects...',
                    doc2: 'Job Description (JD)',
                    doc2Btn: '📁 Upload Job Description (.pdf, .docx, .txt)',
                    doc2Place: 'Paste target role requirements, responsibilities, and company details...'
                };
            case 'Business Meeting':
                return {
                    doc1: 'Meeting Pitch / Business Deck',
                    doc1Btn: '📁 Upload Pitch Deck (.pdf, .docx, .txt)',
                    doc1Place: 'Paste presentation content, proposal details, or business deck text...',
                    doc2: 'Meeting Agenda & Objectives',
                    doc2Btn: '📁 Upload Agenda (.pdf, .docx, .txt)',
                    doc2Place: 'Paste meeting goals, discussion topics, and target outcomes...'
                };
            case 'Sales Call':
                return {
                    doc1: 'Product Offer & Pricing Brochure',
                    doc1Btn: '📁 Upload Offer Brochure (.pdf, .docx, .txt)',
                    doc1Place: 'Paste product features, ROI benefits, and pricing plans...',
                    doc2: 'Prospect Background & Objections',
                    doc2Btn: '📁 Upload Prospect Info (.pdf, .docx, .txt)',
                    doc2Place: 'Paste prospect company background, pain points, and expected objections...'
                };
            case 'Presentation':
                return {
                    doc1: 'Presentation Slide Deck Content',
                    doc1Btn: '📁 Upload Slide Deck (.pdf, .docx, .txt)',
                    doc1Place: 'Paste main speech text, key slides, and core presentation points...',
                    doc2: 'Audience Q&A & Reference Data',
                    doc2Btn: '📁 Upload Q&A Data (.pdf, .docx, .txt)',
                    doc2Place: 'Paste anticipated audience questions, key statistics, and reference data...'
                };
            case 'Negotiation':
                return {
                    doc1: 'Contract Terms & Target Deal Terms',
                    doc1Btn: '📁 Upload Contract Terms (.pdf, .docx, .txt)',
                    doc1Place: 'Paste desired terms, clause requirements, and target deal points...',
                    doc2: 'Walkaway Limits & Counter-Offers',
                    doc2Btn: '📁 Upload Walkaway Rules (.pdf, .docx, .txt)',
                    doc2Place: 'Paste fallback positions, maximum budget/price bounds, and concession rules...'
                };
            case 'Exam Assistant':
                return {
                    doc1: 'Study Syllabus & Course Notes',
                    doc1Btn: '📁 Upload Syllabus (.pdf, .docx, .txt)',
                    doc1Place: 'Paste course topics, study material, formulas, and reference guides...',
                    doc2: 'Exam Constraints & Rules',
                    doc2Btn: '📁 Upload Exam Rules (.pdf, .docx, .txt)',
                    doc2Place: 'Paste test format, time limits, and specific scoring criteria...'
                };
            default: // Custom
                return {
                    doc1: 'Primary Reference Document',
                    doc1Btn: '📁 Upload Primary Doc (.pdf, .docx, .txt)',
                    doc1Place: 'Paste primary context document or instructions...',
                    doc2: 'Secondary Reference Document',
                    doc2Btn: '📁 Upload Secondary Doc (.pdf, .docx, .txt)',
                    doc2Place: 'Paste secondary reference document or notes...'
                };
        }
    }

    renderModal() {
        if (!this.isModalOpen) return '';

        const editingProfile = this.editingProfileId ? this.profiles.find(p => p.id === this.editingProfileId) : null;
        const modalHeading = editingProfile ? `Edit User Profile #${editingProfile.numericId || ''}` : 'Create User Profile';

        const labels = this.getDocLabelsForType(this.editType);

        return html`
            <div class="modal-backdrop" @click=${() => this.isModalOpen = false}>
                <div class="modal-card" @click=${e => e.stopPropagation()}>
                    <div class="modal-header">
                        <span class="modal-title">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="8.5" cy="7" r="4"></circle>
                                <polyline points="17 11 19 13 23 9"></polyline>
                            </svg>
                            ${modalHeading}
                        </span>
                        <button class="action-btn-icon" @click=${() => this.isModalOpen = false}>✕</button>
                    </div>

                    <div class="modal-body">
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Profile Name / User Name</label>
                                <input
                                    class="form-control ${this.editErrors?.userName ? 'error-shake' : ''}"
                                    type="text"
                                    placeholder="e.g. Ram, Sam, Raj, Bob"
                                    .value=${this.editUserName}
                                    @input=${e => this.editUserName = e.target.value}
                                />
                            </div>

                            <div class="form-group">
                                <label class="form-label">SELECT MODE</label>
                                <select
                                    class="form-control ${this.editErrors?.type ? 'error-shake' : ''}"
                                    .value=${this.editType}
                                    @change=${e => {
                                        this.editType = e.target.value;
                                        this.requestUpdate();
                                    }}
                                >
                                    <option value="" disabled selected hidden>Select</option>
                                    <option value="Job Interview">Job Interview</option>
                                    <option value="Business Meeting">Business Meeting</option>
                                    <option value="Sales Call">Sales Call</option>
                                    <option value="Presentation">Presentation</option>
                                    <option value="Negotiation">Negotiation</option>
                                    <option value="Exam Assistant">Exam Assistant</option>
                                    <option value="Custom">Custom</option>
                                </select>
                            </div>
                        </div>

                        <!-- Dynamic Document Upload #1 -->
                        <div class="form-group">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <label class="form-label">${labels.doc1}</label>
                                <button class="btn-action" @click=${() => this.triggerUpload('resume')}>
                                    ${labels.doc1Btn}
                                </button>
                            </div>
                            ${this.editResumeFile ? html`<span class="file-tag">📄 Attached: ${this.editResumeFile}</span>` : ''}
                            <textarea
                                class="form-control ${this.editErrors?.resume ? 'error-shake' : ''}"
                                placeholder="${labels.doc1Place}"
                                .value=${this.editResume}
                                @input=${e => this.editResume = e.target.value}
                            ></textarea>
                            <input
                                type="file"
                                class="hidden-file-input file-input-resume"
                                accept=".txt,.doc,.docx,.pdf"
                                @change=${e => this.handleFileUpload('resume', e)}
                            />
                        </div>

                        <!-- Dynamic Document Upload #2 -->
                        <div class="form-group">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <label class="form-label">${labels.doc2}</label>
                                <button class="btn-action" @click=${() => this.triggerUpload('jd')}>
                                    ${labels.doc2Btn}
                                </button>
                            </div>
                            ${this.editJdFile ? html`<span class="file-tag">📄 Attached: ${this.editJdFile}</span>` : ''}
                            <textarea
                                class="form-control"
                                placeholder="${labels.doc2Place}"
                                .value=${this.editJd}
                                @input=${e => this.editJd = e.target.value}
                            ></textarea>
                            <input
                                type="file"
                                class="hidden-file-input file-input-jd"
                                accept=".txt,.doc,.docx,.pdf"
                                @change=${e => this.handleFileUpload('jd', e)}
                            />
                        </div>
                    </div>

                    <div class="modal-footer">
                        <span style="font-size: 11px; color: var(--text-muted);">Saved locally to app storage</span>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn-action" @click=${() => this.isModalOpen = false}>Cancel</button>
                            <button class="btn-action active" @click=${() => this.saveProfileModal()}>Save Profile</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    render() {
        if (this.isOverlayMode) {
            return html`
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">
                    <div style="pointer-events: auto;">
                        ${this.renderModal()}
                    </div>
                </div>
            `;
        }

        const filtered = this.profiles.filter(p => {
            if (!this.searchQuery) return true;
            const q = this.searchQuery.toLowerCase();
            const uName = (p.userName || p.name || '').toLowerCase();
            const pType = (p.type || '').toLowerCase();
            return uName.includes(q) || pType.includes(q) || (p.customPrompt && p.customPrompt.toLowerCase().includes(q));
        });

                return html`
            <div class="profiles-container">
                <div class="notes-toolbar">
                    <div class="toolbar-actions">
                        <button class="notes-btn primary" @click=${() => this.openCreateModal()}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            New Profile
                        </button>
                    </div>

                    <div class="search-box">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input
                            class="search-input"
                            type="text"
                            placeholder="Search profiles..."
                            .value=${this.searchQuery}
                            @input=${e => this.searchQuery = e.target.value}
                        />
                    </div>
                    
                    <div style="display:flex;gap:4px;flex-shrink:0;">
                        <button class="icon-btn ${this.viewMode === 'list' ? 'active' : ''}" title="List view" @click=${() => this.viewMode = 'list'}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                        </button>
                        <button class="icon-btn ${this.viewMode === 'grid' ? 'active' : ''}" title="Grid view" @click=${() => this.viewMode = 'grid'}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>
                        </button>
                    </div>
                </div>

                ${this.viewMode === 'list' ? html`
                    <div class="notes-list">
                        ${filtered.map(p => html`
                            <div class="list-row" @click=${() => this.editProfile(p)}>
                                <div class="list-row-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                </div>
                                <span class="list-row-title">${p.userName || p.name || 'Unnamed Profile'}</span>
                                <span class="list-row-preview">${p.customPrompt ? p.customPrompt.substring(0,40) + '...' : ''}</span>
                                <span class="list-row-type">${p.type || 'Profile'}</span>
                                <div class="list-row-actions">
                                    <button class="row-action-btn delete" @click=${(e) => { e.stopPropagation(); this.deleteProfile(e, p.id); }} title="Delete Profile">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                </div>
                            </div>
                        `)}
                    </div>
                ` : html`
                    <div class="grid-viewport">
                        <div class="notes-grid">
                            ${filtered.map(p => html`
                                <div class="note-card" @click=${() => this.editProfile(p)} style="cursor:pointer;">
                                    <div class="card-header">
                                        <span class="card-title">${p.userName || p.name || 'Unnamed Profile'}</span>
                                        <span class="card-type-badge">${p.type || 'Profile'}</span>
                                    </div>
                                    <div class="card-content">
                                        ${p.customPrompt ? p.customPrompt.substring(0,100) + '...' : 'No prompt...'}
                                    </div>
                                    <div class="card-footer">
                                        <span class="card-date"></span>
                                        <div class="card-actions">
                                            <button class="action-btn delete" @click=${(e) => { e.stopPropagation(); this.deleteProfile(e, p.id); }} title="Delete Profile">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `)}
                        </div>
                    </div>
                `}

                <!-- Popup Focus Modal -->
                ${this.renderModal()}
                        </div>
        `;
    }
}

customElements.define('ai-customize-view', AICustomizeView);
