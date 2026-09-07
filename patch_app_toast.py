with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add global toast state
if "globalToastMessage: { type: String }" not in content:
    content = content.replace("activeMeetingData: { type: Object },", "activeMeetingData: { type: Object },\n        globalToastMessage: { type: String },\n        globalToastType: { type: String },")
    content = content.replace("this.activeMeetingData = null;", "this.activeMeetingData = null;\n        this.globalToastMessage = '';\n        this.globalToastType = 'success';")

# 2. Add listener to invite-view
content = content.replace("<invite-view", "<invite-view @global-toast=${(e) => this.showGlobalToast(e.detail.message, e.detail.type)}")

# 3. Add showGlobalToast function
show_toast_fn = """    showGlobalToast(message, type = 'success') {
        this.globalToastMessage = message;
        this.globalToastType = type;
        this.requestUpdate();
        if (this._globalToastTimeout) clearTimeout(this._globalToastTimeout);
        this._globalToastTimeout = setTimeout(() => {
            this.globalToastMessage = '';
            this.requestUpdate();
        }, 4000);
    }
"""
if "showGlobalToast(" not in content:
    content = content.replace("renderCurrentView() {", show_toast_fn + "\n    renderCurrentView() {")

# 4. Add the toast HTML inside the content-inner block so it floats over everything
toast_html = """
                        ${this.globalToastMessage ? html`
                            <div style="position: absolute; top: 24px; right: 24px; z-index: 99999; padding: 12px 24px; border-radius: 8px; color: white; font-weight: 600; font-size: 14px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); ${this.globalToastType === 'success' ? 'background: linear-gradient(135deg, #10b981 0%, #059669 100%); border: 1px solid #34d399;' : 'background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border: 1px solid #f87171;'}">
                                ${this.globalToastMessage}
                            </div>
                        ` : ''}"""
content = content.replace("<!-- Global Widget when meeting is active but view is hidden -->", toast_html + "\n                            <!-- Global Widget when meeting is active but view is hidden -->")

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Injected global toast into HideWinApp")
