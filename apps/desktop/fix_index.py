import re

with open('src/index.html', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace(
    "window.onerror = function(message, source, lineno, colno, error) {",
    "window.onerror = function(message, source, lineno, colno, error) { console.error('GLOBAL_ERROR:', message, source, lineno, colno, error);"
)
code = code.replace(
    "</script>",
    "window.addEventListener('unhandledrejection', function(e) { console.error('UNHANDLED_REJECTION:', e.reason); });\n</script>", 1
)

with open('src/index.html', 'w', encoding='utf-8') as f:
    f.write(code)
