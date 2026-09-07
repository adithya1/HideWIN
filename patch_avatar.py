with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. State for initials and tools overlay
if "hostInitials: { type: String }" not in content:
    content = content.replace("customExtMinutes: { type: Number }", "customExtMinutes: { type: Number },\n        hostInitials: { type: String },\n        showToolsOverlay: { type: Boolean },\n        activeToolTab: { type: String }")
    content = content.replace("this.customExtMinutes = 15;", "this.customExtMinutes = 15;\n        this.hostInitials = 'CO';\n        this.showToolsOverlay = false;\n        this.activeToolTab = 'notes';")

# 2. Fetch initials in firstUpdated
fetch_initials = """        // Fetch host initials
        if (window.hideWin && window.hideWin.storage) {
            window.hideWin.storage.getCredentials().then(creds => {
                if (creds && creds.user && creds.user.name) {
                    const parts = creds.user.name.split(' ');
                    this.hostInitials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : creds.user.name.substring(0, 2).toUpperCase();
                } else if (creds && creds.userEmail) {
                    this.hostInitials = creds.userEmail.substring(0, 2).toUpperCase();
                } else {
                    this.hostInitials = 'HO';
                }
                this.requestUpdate();
            }).catch(e => { console.warn(e); });
        }"""
content = content.replace("this.setupSignaling();", fetch_initials + "\n        this.setupSignaling();")

# 3. Replace 'CO' with ${this.hostInitials}
content = content.replace("<div class=\"avatar\">CO</div>", "<div class=\"avatar\">${this.hostInitials}</div>")
content = content.replace("<div class=\"participant-avatar\">CO</div>", "<div class=\"participant-avatar\">${this.hostInitials}</div>")

# 4. Inject Scrollbars CSS
scrollbars_css = """
            /* Global Posh Scrollbars */
            ::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }
            ::-webkit-scrollbar-track {
                background: transparent;
            }
            ::-webkit-scrollbar-thumb {
                background: rgba(156, 163, 175, 0.5);
                border-radius: 10px;
            }
            ::-webkit-scrollbar-thumb:hover {
                background: rgba(107, 114, 128, 0.8);
            }
"""
content = content.replace(":host {\n                display: block;", ":host {\n                display: block;" + scrollbars_css)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Injected avatar logic and scrollbars")
