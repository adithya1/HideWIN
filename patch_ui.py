import re
with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add posh CSS styles
new_css = """
            .posh-card {
                background: #ffffff;
                border-radius: 16px;
                padding: 24px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.02);
                border: 1px solid #f3f4f6;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                display: flex;
                flex-direction: column;
                position: relative;
                overflow: hidden;
            }
            .posh-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 30px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.04);
            }
            
            .posh-card-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 16px;
            }
            .posh-card-title {
                font-size: 18px;
                font-weight: 700;
                color: #111827;
                margin: 0;
                line-height: 1.3;
            }
            .posh-badge {
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 0.5px;
                text-transform: uppercase;
            }
            .posh-badge.SCHEDULED { background: #e0e7ff; color: #4338ca; }
            .posh-badge.ACTIVE { background: #dcfce7; color: #166534; }
            .posh-badge.COMPLETED { background: #f3f4f6; color: #4b5563; }
            
            .posh-card-body {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin-bottom: 24px;
                flex: 1;
            }
            .posh-detail-row {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #4b5563;
                font-size: 14px;
                font-weight: 500;
            }
            .posh-detail-icon {
                color: #9ca3af;
                width: 16px;
                height: 16px;
            }
            
            .posh-actions-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-bottom: 16px;
            }
            .posh-btn {
                border: none;
                border-radius: 8px;
                padding: 10px 16px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            .posh-btn-primary {
                background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
                color: white;
                box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
            }
            .posh-btn-primary:hover {
                box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
                transform: translateY(-1px);
            }
            .posh-btn-secondary {
                background: #f3f4f6;
                color: #374151;
            }
            .posh-btn-secondary:hover {
                background: #e5e7eb;
            }
            .posh-btn-danger {
                background: #fef2f2;
                color: #ef4444;
            }
            .posh-btn-danger:hover {
                background: #fee2e2;
            }
            
            .posh-social-row {
                display: flex;
                justify-content: center;
                gap: 12px;
                padding-top: 16px;
                border-top: 1px solid #f3f4f6;
            }
            .posh-social-btn {
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 50%;
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: #6b7280;
                transition: all 0.2s ease;
            }
            .posh-social-btn:hover {
                background: #f9fafb;
                color: #111827;
                border-color: #d1d5db;
                transform: translateY(-2px);
            }
            
            .posh-grid-layout {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                gap: 24px;
                padding: 8px 4px 24px 4px;
            }
"""
content = content.replace(".card-type-badge.SCHEDULED { background: #e1dfdd; color: #323130; }", ".card-type-badge.SCHEDULED { background: #e1dfdd; color: #323130; }\n" + new_css)

# Update HTML render block
old_render_regex = r"<div class=\"grid-viewport\">[\s\S]*?</div>\s*</div>\s*</div>\s*`;"
new_render_html = """<div class="grid-viewport" style="padding-top: 12px;">
                          ${this.isLoading ? html`<div style="padding:40px; text-align:center; color:#9ca3af; font-size:16px; font-weight:500;">Loading your meetings...</div>` : ''}
                          ${!this.isLoading && filteredMeetings.length === 0 ? html`<div style="padding:60px 20px; text-align:center; color:#9ca3af; font-size:16px; font-weight:500; background:#f9fafb; border-radius:16px; border:2px dashed #e5e7eb; margin-top:20px;">
                              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:16px; color:#d1d5db;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                              <br>No meetings found in this view.
                          </div>` : ''}
                          
                          <div class="posh-grid-layout">
                              ${filteredMeetings.map(m => html`
                                  <div class="posh-card">
                                      <div class="posh-card-header">
                                          <h3 class="posh-card-title">${m.title}</h3>
                                          <span class="posh-badge ${m.status}">${m.status}</span>
                                      </div>
                                      
                                      <div class="posh-card-body">
                                          <div class="posh-detail-row">
                                              <svg class="posh-detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                              ${new Date(m.start_time).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                          </div>
                                          ${m.location ? html`
                                          <div class="posh-detail-row">
                                              <svg class="posh-detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                              ${m.location}
                                          </div>
                                          ` : ''}
                                      </div>
                                      
                                      <div class="posh-actions-grid">
                                          <button class="posh-btn posh-btn-primary" style="grid-column: span 2;" @click=${() => this.startMeeting(m)}>
                                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                              Start / Join Meeting
                                          </button>
                                          
                                          ${this.activeTab === 'active' ? html`
                                              <button class="posh-btn posh-btn-secondary" @click=${() => this.editMeeting(m)}>
                                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                  Edit
                                              </button>
                                          ` : html`<div></div>`}
                                          
                                          <button class="posh-btn posh-btn-danger" @click=${() => this.deleteMeeting(m.id)}>
                                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                              Delete
                                          </button>
                                      </div>
                                      
                                      <div class="posh-social-row">
                                          <button class="posh-social-btn" title="Copy Link" @click=${() => this.handleSocialShare('copy', m)}>
                                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                          </button>
                                          <button class="posh-social-btn" title="WhatsApp" @click=${() => this.handleSocialShare('whatsapp', m)}>
                                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                          </button>
                                          <button class="posh-social-btn" title="Gmail" @click=${() => this.handleSocialShare('gmail', m)}>
                                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                          </button>
                                          <button class="posh-social-btn" title="Outlook" @click=${() => this.handleSocialShare('outlook', m)}>
                                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                          </button>
                                      </div>
                                  </div>
                              `)}
                          </div>
                      </div>
                  </div>
              </div>
          `;"""

content = re.sub(old_render_regex, new_render_html, content)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Redesigned the Dashboard UI")
