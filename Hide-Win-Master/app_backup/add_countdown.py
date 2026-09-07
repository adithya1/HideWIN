with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """                                    <div class="share-info-row">
                                        <span class="share-info-label">Meeting Name</span>
                                        <span class="share-info-value" style="text-align: right; max-width: 60%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${this.viewingMeeting.title}</span>
                                    </div>"""

countdown_row = """                                    <div class="share-info-row">
                                        <span class="share-info-label">Meeting Name</span>
                                        <span class="share-info-value" style="text-align: right; max-width: 60%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${this.viewingMeeting.title}</span>
                                    </div>
                                    <div class="share-info-row" style="align-items: flex-start; padding: 4px 0;">
                                        <span class="share-info-label" style="margin-top: 4px;">Scheduled</span>
                                        <span class="share-info-value" style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
                                            <span style="font-size: 14px; color: #4b5563;">${new Date(this.viewingMeeting.start_time).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                            ${this.getTimeUntil(this.viewingMeeting.start_time) ? html`
                                                <span style="color: #ea580c; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: inline-flex; align-items: center; gap: 6px; background: #fff7ed; padding: 4px 12px; border-radius: 20px; border: 1px solid #ffedd5;">
                                                    <span style="width: 6px; height: 6px; border-radius: 50%; background: #ea580c; display: inline-block;"></span>
                                                    ${this.getTimeUntil(this.viewingMeeting.start_time)}
                                                </span>
                                            ` : html`
                                                <span style="color: #059669; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: inline-flex; align-items: center; gap: 6px; background: #ecfdf5; padding: 4px 12px; border-radius: 20px; border: 1px solid #d1fae5;">
                                                    <span style="width: 6px; height: 6px; border-radius: 50%; background: #059669; display: inline-block;"></span>
                                                    ${this.viewingMeeting.status}
                                                </span>
                                            `}
                                        </span>
                                    </div>"""

if target in content:
    content = content.replace(target, countdown_row)
    with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Countdown row added successfully.")
else:
    print("Could not find the target string.")
