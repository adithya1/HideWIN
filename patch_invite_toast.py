with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace local toast with global toast dispatch when needed
old_toast = """this.showToast(`New message from ${msg.sender}`, "success");"""
new_toast = """this.dispatchEvent(new CustomEvent('global-toast', { detail: { message: `New chat message from ${msg.sender}`, type: 'success' }, bubbles: true, composed: true }));\n                          if (this.activeSidebar !== 'chat') this.showToast(`New message from ${msg.sender}`, "success");"""
content = content.replace(old_toast, new_toast)

# What about participant joined/requests control?
# "Waiting Room" or requests control
old_participant = """this.showToast("Channel Created Successfully!", "success");"""
# Actually, wait, let's just intercept `showToast` and fire a global toast EVERY time so it shows up in both!
old_show_toast_fn = """    showToast(message, type = 'success') {
        this.toastMessage = message;
        this.toastType = type;
        this.requestUpdate();
        
        if(this.toastTimeout) clearTimeout(this.toastTimeout);
        this.toastTimeout = setTimeout(() => {
            this.toastMessage = '';
            this.requestUpdate();
        }, 3000);
    }"""
    
new_show_toast_fn = """    showToast(message, type = 'success') {
        // Also dispatch to global app in case this view is hidden
        this.dispatchEvent(new CustomEvent('global-toast', { detail: { message, type }, bubbles: true, composed: true }));
        
        this.toastMessage = message;
        this.toastType = type;
        this.requestUpdate();
        
        if(this.toastTimeout) clearTimeout(this.toastTimeout);
        this.toastTimeout = setTimeout(() => {
            this.toastMessage = '';
            this.requestUpdate();
        }, 3000);
    }"""
content = content.replace(old_show_toast_fn, new_show_toast_fn)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Routed all toasts to global event")
