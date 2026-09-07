with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'r', encoding='utf-8') as f:
    content = f.read()

old_logic = """                // If meeting expired and modal not shown yet, show it!
                if (this.meetingSeconds === 0 && !this.showExtendModal && this.meetingData.id) {
                    // Check if we just joined an already expired meeting, show it immediately
                    this.showExtendModal = true;
                }"""
new_logic = """                // If meeting expired and modal not shown yet, show it!
                if (this.meetingSeconds === 0 && !this.showExtendModal && this.meetingData.id) {
                    this.showExtendModal = true;
                    this.dispatchEvent(new CustomEvent('global-toast', { detail: { message: 'Meeting Time Expired! Please extend the session.', type: 'error' }, bubbles: true, composed: true }));
                }"""
content = content.replace(old_logic, new_logic)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Added global toast on expiry")
