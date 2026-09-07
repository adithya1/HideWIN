import re
path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the location form row entirely
content = re.sub(
    r'<div class="form-row">\s*<div class="row-icon"><svg[^>]*>.*?circle.*?</svg></div>\s*<input[^>]*placeholder="Add location"[^>]*>\s*</div>',
    '',
    content,
    flags=re.DOTALL
)

# Also remove location from properties and constructor if present
content = re.sub(r'\s*location:\s*\{\s*type:\s*String\s*\},', '', content)
content = re.sub(r"\s*this\.location\s*=\s*'';?", '', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
