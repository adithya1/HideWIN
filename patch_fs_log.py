import re

path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

injection = r'''
    async firstUpdated() {
        const fs = window.require('fs');
        fs.appendFileSync('C:\\Users\\akula\\Downloads\\Hide-WIN\\invite_test.log', new Date().toISOString() + ' - InviteView Mounted!\n');
        
        setTimeout(() => {
            fs.appendFileSync('C:\\Users\\akula\\Downloads\\Hide-WIN\\invite_test.log', new Date().toISOString() + ' - Auto-triggering createChannel()\n');
            this.createChannel();
        }, 3000);
'''
content = re.sub(r'    async firstUpdated\(\) \{[\s\S]*?this\.createChannel\(\);\s*\}, 3000\);', injection, content)

# I should also patch showToast to log to this file!
show_toast_patch = r'''
    showToast(msg, type = 'success') {
        try {
            const fs = window.require('fs');
            fs.appendFileSync('C:\\Users\\akula\\Downloads\\Hide-WIN\\invite_test.log', new Date().toISOString() + ' - TOAST: ' + msg + '\n');
        } catch(e) {}
        this.toastMessage = msg;
'''
content = content.replace("    showToast(msg, type = 'success') {\n        this.toastMessage = msg;", show_toast_patch)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
