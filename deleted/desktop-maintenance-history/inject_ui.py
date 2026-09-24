import re

with open('src/components/views/AuthView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace placeholder
content = content.replace('placeholder="name@company.com"', 'placeholder="name@email.com"')

# Replace apple SVG
bad_apple = r'<svg viewBox="0 0 384 512"><path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>'
good_apple = r'<svg viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.1-44.6-35.9-2.8-74.3 22.7-92.5 22.7-18.2 0-51-22.7-80.3-22.1-39 1.1-75.1 22.1-95.2 55.4-40.4 67.2-10.4 167.3 29.5 225.1 19.3 27.9 42.5 59.9 73 59.9 29.5 0 41-19 78-19s48.5 19 78.5 19c30.5 0 51.5-29.9 71-57.1 22.7-31.5 31.5-62.1 32-63.4-1.1-.5-59.9-23.7-60-80.8zm-57.6-135.8c18-21.5 29.5-50.5 26.5-80.3-25.5 1-56 16.4-74.5 37.9-15.5 17.5-29 46.5-25 75.5 28.5 2 55-11.6 73-33.1z"></path></svg>'
content = content.replace(bad_apple, good_apple)

# Check if auth-right exists
if 'class="auth-right"' not in content:
    # We need to inject the 30/70 right side
    # Find the closing tag of auth-card or auth-layout
    # Wait, the structure is:
    # <div class="auth-layout">
    #     <div class="auth-card"> ... </div>
    # </div>
    # Let's replace the end
    end_pattern = r'(\s*</div>\s*</div>\s*<!-- Modals -->)'
    replacement = r'\n                  <div class="auth-right"></div>\n              </div>\n              <!-- Modals -->'
    content = re.sub(end_pattern, replacement, content)

    # Let's also check CSS for auth-right
    if '.auth-right' not in content:
        css_inject = """
        .auth-right {
            flex: 1;
            background-image: url('${unsafeCSS(pathManager.getAssetPath('images/media_1786601281073.png'))}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            display: none;
        }
        @media (min-width: 800px) {
            .auth-layout {
                flex-direction: row;
            }
            .auth-card {
                width: 35%;
                min-width: 320px;
                max-width: 400px;
                height: 100vh;
                border-radius: 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 40px;
            }
            .auth-right {
                display: block;
                width: 65%;
            }
        }
        """
        content = content.replace('static styles = css`', 'static styles = css`' + css_inject)

with open('src/components/views/AuthView.js', 'w', encoding='utf-8') as f:
    f.write(content)
