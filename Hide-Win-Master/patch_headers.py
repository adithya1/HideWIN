import sys
file = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\index.js'
content = open(file, 'r', encoding='utf-8').read()
patch = """
require('electron').app.whenReady().then(() => {
  require('electron').session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Cross-Origin-Embedder-Policy': ['require-corp'],
        'Cross-Origin-Opener-Policy': ['same-origin']
      }
    });
  });
});
"""
if "require-corp" not in content:
    content = patch + content
    open(file, 'w', encoding='utf-8').write(content)
    print("Patched index.js with COOP/COEP headers")
else:
    print("Already patched")
