import re
path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports
imports = """import '../views/NotesView.js';
import '../views/ScheduleMeetingView.js';
import '../views/MeetingDashboardView.js';"""
content = content.replace("import '../views/NotesView.js';", imports)

# Add routes
routes = """
            case 'calendar':
                return html`<meeting-dashboard-view 
                    @new-meeting=${() => { this.currentView = 'schedule-meeting'; this.requestUpdate(); }}
                    @start-existing-meeting=${(e) => { 
                        this.currentViewParams = e.detail;
                        this.currentView = 'invite'; 
                        this.requestUpdate(); 
                    }}
                ></meeting-dashboard-view>`;
            case 'schedule-meeting':
                return html`<schedule-meeting-view @close-meeting=${() => { this.currentView = 'calendar'; this.requestUpdate(); }}></schedule-meeting-view>`;
            case 'invite':
"""
content = content.replace("case 'invite':", routes.strip())

# Add sidebar item
sidebar = """
                        <button class="nav-btn ${this.currentView === 'browse' ? 'active' : ''}" @click=${() => this.switchView('browse')}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                            <span>Browse</span>
                        </button>
                        <button class="nav-btn ${this.currentView === 'calendar' ? 'active' : ''}" @click=${() => this.switchView('calendar')}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            <span>Calendar</span>
                        </button>
"""
content = re.sub(r'<button class="nav-btn \$\{this\.currentView === \'browse\' \? \'active\' : \'\'\}" @click=\$\{\(\) => this\.switchView\(\'browse\'\)\}>.*?<span>Browse</span>\s*</button>', sidebar.strip(), content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
