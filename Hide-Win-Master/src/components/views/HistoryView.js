import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';
import { historyStyles } from './HistoryView.styles.js';

export class HistoryView extends LitElement {
    static styles = historyStyles;


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
