with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js', 'r', encoding='utf-8') as f:
    content = f.read()

old_start = """    startMeeting(meeting) {
        this.dispatchEvent(new CustomEvent('start-existing-meeting', { 
            detail: { id: meeting.id, passcode: meeting.recurrence && meeting.recurrence !== 'none' ? meeting.recurrence : meeting.id.split('-').pop().toLowerCase() },
            bubbles: true, 
            composed: true 
        }));
    }"""
    
new_start = """    startMeeting(meeting) {
        this.dispatchEvent(new CustomEvent('start-existing-meeting', { 
            detail: { ...meeting, passcode: meeting.recurrence && meeting.recurrence !== 'none' ? meeting.recurrence : meeting.id.split('-').pop().toLowerCase() },
            bubbles: true, 
            composed: true 
        }));
    }"""
content = content.replace(old_start, new_start)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated startMeeting in Dashboard")
