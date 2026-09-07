import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';
import { unifiedPageStyles } from './sharedPageStyles.js';

export class HistoryView extends LitElement {
    static styles = [
        unifiedPageStyles,
        css`
            .unified-page {
                overflow-y: hidden;
                display: flex;
                flex-direction: column;
                height: 100%;
            }

            .unified-wrap {
                height: 100%;
                display: flex;
                flex-direction: column;
            }

            .page-header-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: var(--space-md);
            }

            .page-title {
                font-size: 24px;
                font-weight: 700;
                color: #1e3a8a;
                letter-spacing: -0.01em;
            }

            
            .notes-toolbar { display: flex; align-items: center; justify-content: space-between; gap: var(--space-sm); background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); padding: var(--space-sm) var(--space-md); border-radius: 16px; border: 1px solid rgba(59, 130, 246, 0.2); box-shadow: 0 4px 24px -8px rgba(59, 130, 246, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.5); flex-wrap: wrap; color: #0f172a; margin-bottom: var(--space-md); }
            .search-box { display: flex; align-items: center; gap: 6px; background: #ffffff; border: 1px solid rgba(59, 130, 246, 0.3); box-shadow: inset 0 2px 4px rgba(59, 130, 246, 0.05); border-radius: 12px; padding: 4px 10px; min-width: 180px; transition: all 0.2s; height: 42px; box-sizing: border-box; flex: 1; }
            .search-box:focus-within { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2), inset 0 2px 4px rgba(59, 130, 246, 0.05); }
            .search-box input { background: transparent; border: none; color: #0f172a; width: 100%; font-size: var(--font-size-sm); outline: none; padding: 0; }
            .icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 10px; border: 1px solid transparent; background: transparent; color: #64748b; cursor: pointer; transition: all 0.2s; }
            .icon-btn:hover { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
            .icon-btn.active { background: #ffffff; border-color: rgba(59, 130, 246, 0.3); color: #3b82f6; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1); }
            .icon-btn svg { width: 18px; height: 18px; }
            .notes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: var(--space-md); }
            .grid-viewport { flex: 1; overflow-y: auto; padding-right: 4px; }
            .session-card.grid-mode { flex-direction: column; align-items: flex-start; }
            .search-wrap {
                position: relative;
                max-width: 100%;
            }

            .search-icon {
                position: absolute;
                left: 14px;
                top: 50%;
                transform: translateY(-50%);
                width: 16px;
                height: 16px;
                color: var(--text-muted);
                pointer-events: none;
                opacity: 0.6;
            }

            .search-wrap .control {
                width: 100%;
                padding: 0 16px 0 40px;
                border-radius: 12px;
                background: #ffffff;
                border: 1px solid rgba(59, 130, 246, 0.3);
                box-shadow: inset 0 2px 4px rgba(59, 130, 246, 0.05);
                color: #0f172a;
                height: 42px;
                font-size: 14px;
                transition: all 0.3s ease;
            }

            .search-wrap .control:focus {
                background: #ffffff;
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2), inset 0 2px 4px rgba(59, 130, 246, 0.05);
                outline: none;
            }

            .list-shell {
                flex: 1;
                display: flex;
                flex-direction: column;
                min-height: 0;
                border-radius: 16px;
                background: transparent;
            }

            .sessions-list {
                overflow-y: auto;
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 12px;
                padding: 4px;
                padding-right: 8px; /* For scrollbar */
            }

            .session-card {
                width: 100%;
                border: 1px solid rgba(59, 130, 246, 0.2);
                border-radius: 16px;
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(12px);
                text-align: left;
                padding: 16px 20px;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: var(--space-md);
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.05);
            }

            .session-card:hover {
                background: rgba(255, 255, 255, 1);
                border-color: rgba(59, 130, 246, 0.4);
                transform: translateY(-2px);
                box-shadow: 0 8px 24px rgba(59, 130, 246, 0.15);
            }

            .session-left {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .session-profile {
                color: #0f172a;
                font-size: 16px;
                font-weight: 600;
                letter-spacing: 0.01em;
            }

            .session-date {
                color: #64748b;
                font-size: 13px;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            
            .session-date svg {
                opacity: 0.6;
            }

            .session-badge {
                color: #a5b4fc;
                font-size: 12px;
                font-weight: 600;
                background: rgba(99, 102, 241, 0.1);
                border: 1px solid rgba(99, 102, 241, 0.2);
                border-radius: 20px;
                padding: 4px 12px;
                white-space: nowrap;
                box-shadow: 0 2px 8px rgba(99, 102, 241, 0.1);
            }

            /* Detail View */
            .detail-top {
                display: flex;
                align-items: center;
                gap: 16px;
                margin-bottom: var(--space-md);
                padding: 14px 16px;
                background: #ffffff;
                border: 1px solid rgba(59, 130, 246, 0.2);
                border-radius: 16px;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.05);
            }

            .back-btn {
                border: 1px solid rgba(59, 130, 246, 0.2);
                background: rgba(59, 130, 246, 0.1);
                border-radius: 50%;
                width: 36px;
                height: 36px;
                color: #3b82f6;
                padding: 0;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .back-btn:hover {
                background: rgba(255,255,255,0.1);
                border-color: rgba(255,255,255,0.15);
                transform: translateX(-4px);
            }

            .detail-info {
                color: #0f172a;
                font-size: 16px;
                font-weight: 600;
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            .detail-info-sub {
                font-size: 12px;
                color: #64748b;
                font-weight: 400;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .tab-row {
                display: flex;
                gap: 4px;
                margin-bottom: 16px;
                background: rgba(59, 130, 246, 0.1);
                padding: 4px;
                border-radius: 12px;
                align-self: flex-start;
                border: 1px solid rgba(59, 130, 246, 0.2);
            }

            .tab-btn {
                border: none;
                border-radius: 8px;
                background: transparent;
                color: #64748b;
                padding: 8px 16px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 600;
                transition: all 0.2s ease;
            }

            .tab-btn:hover {
                color: #1e3a8a;
                background: rgba(255,255,255,0.5);
            }

            .tab-btn.active {
                background: #ffffff;
                color: #1e3a8a;
                box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
            }

            .details-scroll {
                overflow-y: auto;
                flex: 1;
                min-height: 0;
                display: flex;
                flex-direction: column;
                gap: 20px;
                padding: 8px 16px 24px 8px;
            }

            /* Ultra Chat Bubbles */
            .message-row {
                display: flex;
                flex-direction: column;
                max-width: 85%;
                animation: slideUp 0.3s ease-out forwards;
            }

            @keyframes slideUp {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .message-row.user {
                align-self: flex-end;
                align-items: flex-end;
            }

            .message-row.ai,
            .message-row.screen {
                align-self: flex-start;
                align-items: flex-start;
            }

            .message {
                border-radius: 8px; /* Blockier look */
                padding: 16px 20px;
                word-break: break-word;
                user-select: text;
                cursor: text;
                font-size: 14.5px;
                line-height: 1.6;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                position: relative;
            }

            .message-body {
                white-space: pre-wrap;
            }

            /* User Question */
            .message-row.user .message {
                background: #f1f5f9; /* Light gray block */
                color: #0f172a;
                border: 1px solid #e2e8f0;
            }

            /* AI Answer */
            .message-row.ai .message,
            .message-row.screen .message {
                background: #ffffff; /* White block */
                color: #0f172a;
                border: 1px solid #cbd5e1;
            }

            .message-meta {
                font-size: 11px;
                color: #64748b;
                margin-top: 6px;
                display: flex;
                align-items: center;
                gap: 6px;
                font-weight: 500;
            }

            .message-row.user .message-meta {
                justify-content: flex-end;
                padding-right: 4px;
            }

            .message-row.ai .message-meta,
            .message-row.screen .message-meta {
                justify-content: flex-start;
                padding-left: 4px;
            }

            .message-meta svg {
                opacity: 0.6;
            }

            /* Context Row */
            .context-row {
                display: flex;
                align-items: flex-start;
                gap: 16px;
                padding: 16px;
                border: 1px solid rgba(59, 130, 246, 0.2);
                border-radius: 12px;
                background: #ffffff;
                box-shadow: 0 2px 8px rgba(59, 130, 246, 0.05);
            }

            .context-key {
                width: 100px;
                color: var(--text-muted);
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                font-weight: 600;
                flex-shrink: 0;
            }

            .context-value {
                color: var(--text-primary);
                font-size: 14px;
                line-height: 1.5;
                white-space: pre-wrap;
                word-break: break-word;
                user-select: text;
                cursor: text;
            }

            .empty {
                color: var(--text-muted);
                font-size: 15px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 12px;
                min-height: 160px;
                border: 1px dashed rgba(255,255,255,0.1);
                border-radius: 16px;
                background: rgba(255,255,255,0.01);
            }

        

        
        @media (max-width: 768px) {
            .notes-toolbar {
                flex-direction: column !important;
                align-items: stretch !important;
                padding: 6px 40px !important;
                gap: 6px !important;
                height: auto !important;
            }
            .search-box { width: 100% !important; height: 32px !important; }
            .search-box input { width: 100% !important; font-size: 12px !important; }
            .grid-viewport { padding: 8px !important; }
            .notes-grid { grid-template-columns: 1fr !important; gap: 8px !important; }
            .session-card { flex-direction: column; align-items: flex-start; padding: 10px !important; }
            .detail-top { padding: 8px !important; }
            .detail-info { font-size: 14px !important; }
            .session-profile { font-size: 14px !important; }
            .session-date { font-size: 11px !important; }
            .message-body { font-size: 12px !important; padding: 8px 12px !important; }
            .tab-btn { font-size: 11px !important; padding: 6px 12px !important; }
            .context-row { padding: 8px !important; flex-direction: column; gap: 4px; }
        }
`
    ];

    static properties = {
        sessions: { type: Array },
        selectedSession: { type: Object },
        selectedSessionId: { type: String },
        loading: { type: Boolean },
        activeTab: { type: String },
        searchQuery: { type: String },
            viewMode: { type: String },
    };

    constructor() {
        super();
        this.sessions = [];
        this.selectedSession = null;
        this.selectedSessionId = null;
        this.loading = true;
        this.activeTab = 'conversation';
        this.searchQuery = '';
        this.viewMode = 'list';
        this.loadSessions();
    }

    async loadSessions() {
        try {
            this.loading = true;
            this.sessions = await hideWin.storage.getAllSessions();
        } catch (error) {
            console.error('Error loading sessions:', error);
            this.sessions = [];
        } finally {
            this.loading = false;
            this.requestUpdate();
        }
    }

    async openSession(sessionId) {
        try {
            const session = await hideWin.storage.getSession(sessionId);
            if (session) {
                this.selectedSession = session;
                this.selectedSessionId = sessionId;
                this.activeTab = 'conversation';
                this.requestUpdate();
            }
        } catch (error) {
            console.error('Error loading session:', error);
        }
    }

    closeSession() {
        this.selectedSession = null;
        this.selectedSessionId = null;
        this.activeTab = 'conversation';
    }

    handleSearchInput(e) {
        this.searchQuery = e.target.value;
    }

    formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    getProfileNames() {
        return {
            interview: 'Job Interview',
            sales: 'Sales Call',
            meeting: 'Business Meeting',
            presentation: 'Presentation',
            negotiation: 'Negotiation',
            exam: 'Exam Assistant',
        };
    }

    _getProfileLabel(session) {
        if (session.profile) {
            const names = this.getProfileNames();
            return names[session.profile] || session.profile;
        }
        return 'Session';
    }

    getSessionPreview(session) {
        const parts = [];
        if (session.messageCount > 0) parts.push(`${session.messageCount} messages`);
        if (session.screenAnalysisCount > 0) parts.push(`${session.screenAnalysisCount} screen`);
        if (session.profile) {
            const profileNames = this.getProfileNames();
            parts.push(profileNames[session.profile] || session.profile);
        }
        return parts.length > 0 ? parts.join(' · ') : 'Empty session';
    }

    getFilteredSessions() {
        if (!this.searchQuery.trim()) return this.sessions;
        const q = this.searchQuery.toLowerCase();
        return this.sessions.filter(session => {
            const preview = this.getSessionPreview(session).toLowerCase();
            const date = this.formatDate(session.createdAt).toLowerCase();
            return preview.includes(q) || date.includes(q);
        });
    }

    collectConversation(session) {
        const messages = [];
        const history = session.conversationHistory || [];
        history.forEach(turn => {
            if (turn.transcription) messages.push({ type: 'user', content: turn.transcription, timestamp: turn.timestamp });
            if (turn.ai_response) messages.push({ type: 'ai', content: turn.ai_response, timestamp: turn.timestamp });
        });
        return messages;
    }

    renderTabContent() {
        if (!this.selectedSession) return html`<div class="empty">Select a session.</div>`;

        if (this.activeTab === 'conversation') {
            const messages = this.collectConversation(this.selectedSession);
            if (!messages.length) return html`<div class="empty">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.5; margin-bottom: 8px;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                No conversation data found for this session.
            </div>`;
            
            return messages.map(msg => html`
                <div class="message-row ${msg.type}">
                    <div class="message">
                        <div class="message-body">${msg.content}</div>
                        <div class="message-meta">
                            ${msg.type === 'user' 
                                ? html`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`
                                : html`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>`
                            }
                            ${this.formatTime(msg.timestamp)}
                        </div>
                    </div>
                </div>
            `);
        }

        if (this.activeTab === 'screen') {
            const screen = this.selectedSession.screenAnalysisHistory || [];
            if (!screen.length) return html`<div class="empty">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.5; margin-bottom: 8px;"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                No screen analysis data.
            </div>`;
            return screen.map(entry => html`
                <div class="message-row screen">
                    <div class="message">
                        <div class="message-body">${entry.response || ''}</div>
                        <div class="message-meta">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                            ${this.formatTime(entry.timestamp)}
                        </div>
                    </div>
                </div>
            `);
        }

        const profile = this.selectedSession.profile;
        const prompt = this.selectedSession.customPrompt;
        if (!profile && !prompt) return html`<div class="empty">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.5; margin-bottom: 8px;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            No context saved for this session.
        </div>`;

        return html`
            ${profile ? html`
                <div class="context-row">
                    <span class="context-key">Profile</span>
                    <span class="context-value">${this.getProfileNames()[profile] || profile}</span>
                </div>
            ` : ''}
            ${prompt ? html`
                <div class="context-row">
                    <span class="context-key">Prompt</span>
                    <span class="context-value">${prompt}</span>
                </div>
            ` : ''}
        `;
    }

        renderListView() {
        const filteredSessions = this.getFilteredSessions();
        return html`
            <div class="notes-toolbar">
                <div class="toolbar-actions">
                    <button class="notes-btn primary" @click=${() => this.clearHistory && this.clearHistory()}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        Clear History
                    </button>
                </div>
                <div class="search-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input class="search-input" type="text" placeholder="Search history..." .value=${this.searchQuery} @input=${this.handleSearchInput} />
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

            ${this.loading ? html`<div class="empty">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.5; margin-bottom: 8px; animation: spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
                Loading sessions...
            </div>` : ''}
            ${!this.loading && filteredSessions.length === 0 ? html`<div class="empty">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.5; margin-bottom: 8px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                No matching sessions found.
            </div>` : ''}

            ${(!this.loading && filteredSessions.length > 0) ? (this.viewMode === 'list' ? html`
                <div class="notes-list">
                    ${filteredSessions.map(session => html`
                        <div class="list-row" @click=${() => this.openSession(session.sessionId)}>
                            <div class="list-row-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            </div>
                            <span class="list-row-title">${this._getProfileLabel(session)}</span>
                            <span class="list-row-preview">${session.messageCount || 0} Messages</span>
                            <span class="list-row-type">SESSION</span>
                            <span class="list-row-date">${this.formatDate(session.createdAt)}</span>
                            <div class="list-row-actions">
                                <button class="row-action-btn" title="Open" @click=${() => this.openSession(session.sessionId)}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </button>
                            </div>
                        </div>
                    `)}
                </div>
            ` : html`
                <div class="grid-viewport">
                    <div class="notes-grid">
                        ${filteredSessions.map(session => html`
                            <div class="note-card" @click=${() => this.openSession(session.sessionId)} style="cursor: pointer;">
                                <div class="card-header">
                                    <span class="card-title">${this._getProfileLabel(session)}</span>
                                    <span class="card-type-badge">SESSION</span>
                                </div>
                                <div class="card-content">
                                    ${session.messageCount || 0} Messages
                                </div>
                                <div class="card-footer">
                                    <span class="card-date">${this.formatDate(session.createdAt)} - ${this.formatTime(session.createdAt)}</span>
                                    <div class="card-actions">
                                        <button class="action-btn" title="Open" @click=${() => this.openSession(session.sessionId)}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `)}
                    </div>
                </div>
            `) : ''}
        `;
    }

    renderDetailView() {
        const conversationCount = this.collectConversation(this.selectedSession).length;
        const screenCount = this.selectedSession?.screenAnalysisHistory?.length || 0;

        return html`
            <div class="detail-top">
                <button class="back-btn" @click=${this.closeSession} title="Back to Sessions">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>
                <div class="detail-info">
                    ${this._getProfileLabel(this.selectedSession)}
                    <span class="detail-info-sub">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity: 0.5;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        ${this.formatDate(this.selectedSession.createdAt)} · ${this.formatTime(this.selectedSession.createdAt)}
                    </span>
                </div>
            </div>
            
            <div class="tab-row">
                <button class="tab-btn ${this.activeTab === 'conversation' ? 'active' : ''}" @click=${() => { this.activeTab = 'conversation'; }}>
                    Conversation (${conversationCount})
                </button>
                <button class="tab-btn ${this.activeTab === 'screen' ? 'active' : ''}" @click=${() => { this.activeTab = 'screen'; }}>
                    Screen (${screenCount})
                </button>
                <button class="tab-btn ${this.activeTab === 'context' ? 'active' : ''}" @click=${() => { this.activeTab = 'context'; }}>
                    Context
                </button>
            </div>
            
            <section class="details-scroll">
                ${this.renderTabContent()}
            </section>

        
`;
    }

    render() {
        return html`
            <div class="notes-container">
                    ${this.selectedSession ? this.renderDetailView() : this.renderListView()}
                </div>
        `;
    }
}

customElements.define('history-view', HistoryView);
