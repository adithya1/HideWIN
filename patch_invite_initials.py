with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove the fallback in constructor/properties since it'll be passed as a prop
content = content.replace("this.hostInitials = 'HO';", "")

# 2. Remove the fetch logic from firstUpdated
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
        
content = content.replace(fetch_initials, "")

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed old hostInitials logic")
