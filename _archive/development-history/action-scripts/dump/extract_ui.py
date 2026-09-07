import os
import re

def extract_assets(html_path, css_dir, js_dir, html_filename):
    if not os.path.exists(html_path):
        return

    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract CSS
    css_matches = re.findall(r'<style[^>]*>(.*?)</style>', content, re.DOTALL | re.IGNORECASE)
    css_content = "\n".join(css_matches)
    
    # Extract JS
    js_matches = re.findall(r'<script[^>]*>(.*?)</script>', content, re.DOTALL | re.IGNORECASE)
    # Filter out empty scripts (like external script tags)
    js_content = "\n".join([m for m in js_matches if m.strip()])

    if css_content.strip():
        os.makedirs(css_dir, exist_ok=True)
        css_path = os.path.join(css_dir, "styles.css")
        with open(css_path, 'w', encoding='utf-8') as f:
            f.write(css_content)
        content = re.sub(r'<style[^>]*>.*?</style>', '', content, flags=re.DOTALL | re.IGNORECASE)
        # Insert link before </head>
        content = content.replace('</head>', '    <link rel="stylesheet" href="css/styles.css">\n</head>')

    if js_content.strip():
        os.makedirs(js_dir, exist_ok=True)
        js_path = os.path.join(js_dir, "app.js")
        with open(js_path, 'w', encoding='utf-8') as f:
            f.write(js_content)
        content = re.sub(r'<script[^>]*>.*?</script>', '', content, flags=re.DOTALL | re.IGNORECASE)
        # Insert script before </body>
        content = content.replace('</body>', '    <script src="js/app.js"></script>\n</body>')

    # Re-save HTML
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Extracted assets from {html_filename}")

web_dir = r"C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Web"

# Guest
guest_dir = os.path.join(web_dir, "Guest")
os.makedirs(os.path.join(guest_dir, "images"), exist_ok=True)
extract_assets(
    os.path.join(guest_dir, "index.html"),
    os.path.join(guest_dir, "css"),
    os.path.join(guest_dir, "js"),
    "Guest/index.html"
)

# Admin
admin_dir = os.path.join(web_dir, "Admin")
os.makedirs(os.path.join(admin_dir, "images"), exist_ok=True)
extract_assets(
    os.path.join(admin_dir, "index.html"),
    os.path.join(admin_dir, "css"),
    os.path.join(admin_dir, "js"),
    "Admin/index.html"
)
extract_assets(
    os.path.join(admin_dir, "viewer.html"),
    os.path.join(admin_dir, "css"),
    os.path.join(admin_dir, "js"),
    "Admin/viewer.html"
)
