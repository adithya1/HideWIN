const fs = require('fs');
const path = 'C:\\Users\\akula\\Downloads\\Hide-WIN\\Hide-Win-Master\\src\\components\\views\\InviteView.js';
let content = fs.readFileSync(path, 'utf8');

const showToastFunc = \
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
\;

if (!content.includes('showToast(msg')) {
    content = content.replace(/constructor\(\) \{[\s\S]*?\}/, match => match + '\\n' + showToastFunc);
    fs.writeFileSync(path, content, 'utf8');
}
