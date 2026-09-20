import re

with open('src/components/views/AuthView.js', 'r', encoding='utf-8') as f:
    c = f.read()

# Find current position of auth-right in render HTML and move it outside auth-card
# Pattern: footer closes, then auth-right inside auth-card, then auth-card closes
c = re.sub(
    r'([ \t]*</div>\s*)\n([ \t]*<div class="auth-right"></div>)\n([ \t]*</div>)\n([ \t]*<!-- Modals -->)',
    r'                    </div>\n                </div>\n\n                <div class="auth-right"></div>\n\n                <!-- Modals -->',
    c
)

with open('src/components/views/AuthView.js', 'w', encoding='utf-8') as f:
    f.write(c)
print('Done')
