import re

filepath = r"Hide-Win-Master\src\index.html"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """<script>
window.onerror = function(message, source, lineno, colno, error) { 
    console.error('GLOBAL_ERROR_DETAIL:', message, source, lineno, colno, error ? error.stack : '');
};
window.addEventListener('unhandledrejection', function(e) {
    let reason = e.reason;
    let msg = reason;
    if (reason instanceof Error) msg = reason.stack || reason.message;
    else if (reason && typeof reason === 'object') {
        try { msg = JSON.stringify(reason, Object.getOwnPropertyNames(reason)); } catch(ex) { msg = String(reason); }
    }
    console.error('UNHANDLED_REJECTION_DETAIL:', msg);
});
window.addEventListener('error', function(e) {
    if (e.target && e.target.tagName) {
        console.error('RESOURCE_ERROR:', e.target.tagName, e.target.src || e.target.href);
    }
}, true);
</script>"""

content = re.sub(r'<script>\s*window\.onerror.*?</script>', replacement, content, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
