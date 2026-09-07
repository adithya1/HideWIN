import re

path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the broken constructor
content = content.replace('''        this.participants = [
            { id: 'me', name: 'You', role: 'Host', status: 'active' }

    showToast(msg, type = 'success') {
        this.toastMessage = msg;
        this.toastType = type;
        this.requestUpdate();
        setTimeout(() => {
            if (this.toastMessage === msg) {
                this.toastMessage = null;
                this.requestUpdate();
            }
        }, 5000);
    }

        ];''', '''        this.participants = [
            { id: 'me', name: 'You', role: 'Host', status: 'active' }
        ];''')

show_toast_func = r'''
    showToast(msg, type = 'success') {
        this.toastMessage = msg;
        this.toastType = type;
        this.requestUpdate();
        setTimeout(() => {
            if (this.toastMessage === msg) {
                this.toastMessage = null;
                this.requestUpdate();
            }
        }, 5000);
    }
'''

content = content.replace("    async firstUpdated() {", show_toast_func + "\n    async firstUpdated() {")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
