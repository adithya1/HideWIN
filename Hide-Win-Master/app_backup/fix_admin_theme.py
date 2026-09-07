import re

path = 'src/admin.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add light mode variables to :root
light_css = r"""
        :root[data-theme="light"], @media (prefers-color-scheme: light) {
            :root:not([data-theme="dark"]) {
                --bg: #F9FAFB;
                --surface: #FFFFFF;
                --elevated: #F3F4F6;
                --hover: #E5E7EB;
                --text: #111827;
                --muted: #6B7280;
                --dim: #9CA3AF;
                --border: #E5E7EB;
                --border-s: #D1D5DB;
            }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }"""

content = content.replace('* { box-sizing: border-box; margin: 0; padding: 0; }', light_css.strip())

# 2. Add script to fetch preference and apply theme
theme_script = r"""    <style>
    <script>
        (async () => {
            try {
                const { ipcRenderer } = require('electron');
                const prefsStr = await ipcRenderer.invoke('get-preferences');
                const prefs = typeof prefsStr === 'string' ? JSON.parse(prefsStr) : prefsStr;
                if (prefs && prefs.themeMain === 'light') {
                    document.documentElement.setAttribute('data-theme', 'light');
                } else if (prefs && prefs.themeMain === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                }
            } catch (e) {
                console.error("Theme sync failed", e);
            }
        })();
    </script>"""

content = content.replace('    <style>', theme_script)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Added light mode to admin.html")
