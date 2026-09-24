import re
file_path = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace(
    "console.error('RESOURCE_ERROR:', e.target.tagName, e.target.src || e.target.href);",
    "console.error('RESOURCE_ERROR:', e.target.tagName, e.target.src || e.target.href); require('electron').ipcRenderer.send('log-message', '[FATAL] RESOURCE ERROR: ' + (e.target.src || e.target.href));"
)

if 'window.addEventListener("unhandledrejection"' not in code:
    code = code.replace('</script>', """
    window.addEventListener('unhandledrejection', function(event) {
        require('electron').ipcRenderer.send('log-message', '[FATAL] UNHANDLED PROMISE: ' + event.reason);
    });
    window.addEventListener('error', function(event) {
        if (!event.target || !event.target.tagName) {
            require('electron').ipcRenderer.send('log-message', '[FATAL] UNCAUGHT ERROR: ' + event.message + ' at ' + event.filename + ':' + event.lineno);
        }
    });
    </script>""")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)
print("SUCCESS")
