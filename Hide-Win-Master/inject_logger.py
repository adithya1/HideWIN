import re

with open('src/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

error_logger = """
      <script>
        window.addEventListener('error', function(event) {
            const fs = require('fs');
            fs.appendFileSync('renderer_errors.log', event.message + '\\n' + (event.error ? event.error.stack : '') + '\\n\\n');
        });
        window.addEventListener('unhandledrejection', function(event) {
            const fs = require('fs');
            fs.appendFileSync('renderer_errors.log', 'Unhandled Promise Rejection: ' + (event.reason ? event.reason.stack || event.reason : '') + '\\n\\n');
        });
      </script>
"""
if "renderer_errors.log" not in content:
    content = content.replace('<head>', '<head>\n' + error_logger)

with open('src/index.html', 'w', encoding='utf-8') as f:
    f.write(content)
