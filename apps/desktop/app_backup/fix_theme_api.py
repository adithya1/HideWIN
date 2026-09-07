import sys, re

with open("src/components/views/AssistantView.js", "r", encoding="utf-8") as f:
    code = f.read()

# Replace changeTheme body
old_change_theme = """    changeTheme(theme) {
        if (window.hideWin && window.hideWin.storage) {
            window.hideWin.storage.updatePreference('theme', theme);
        }
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'system') {
            const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        }
        this.requestUpdate();
    }"""

new_change_theme = """    changeTheme(theme) {
        if (window.hideWin && window.hideWin.theme) {
            if (theme === 'system') {
                const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                window.hideWin.theme.save(isDark ? 'dark' : 'light');
            } else {
                window.hideWin.theme.save(theme);
            }
        }
        this.requestUpdate();
    }"""

code = code.replace(old_change_theme, new_change_theme)

with open("src/components/views/AssistantView.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Updated AssistantView.js to use window.hideWin.theme API.")
