import re

path = 'src/admin.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

bad = """    <style>
    <script>"""

good = """    <script>
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
    </script>
    <style>"""

content = content.replace(bad, "<MARKER>")
# Remove the old script completely
content = re.sub(r"<MARKER>.*?</script>", good, content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed script tag")
