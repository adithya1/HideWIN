import re

path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

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

if 'showToast(msg' not in content:
    content = re.sub(r'(constructor\(\) \{.*?\})', r'\1\n' + show_toast_func, content, flags=re.DOTALL)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
