import re
path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove location property
content = re.sub(r'location:\s*\{\s*type:\s*String\s*\},?\n?', '', content)
content = re.sub(r'this\.location\s*=\s*\'\';\n?', '', content)
content = re.sub(r'location:\s*this\.location,?\n?', '', content)

# Remove the location HTML row completely
content = re.sub(r'<div class="form-row">\s*<div class="row-icon"><svg[^>]*><path[^>]*></path><circle[^>]*></circle></svg></div>\s*<input type="text" class="input-field" placeholder="Add location"[^>]*>\s*</div>', '', content, flags=re.DOTALL)

# Replace the recurrence row with a timezone dropdown
tz_dropdown = """
                    <div class="form-row">
                        <div class="row-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg></div>
                        <select class="input-field" style="width:300px" .value=${this.timezone} @change=${e => this.timezone = e.target.value}>
                            ${Intl.supportedValuesOf('timeZone').map(tz => html`<option value="${tz}" ?selected=${this.timezone === tz}>${tz}</option>`)}
                        </select>
                    </div>
"""

content = re.sub(r'<div class="form-row">\s*<div class="row-icon"><svg[^>]*><path d="M21\.5 2v6h-6M2\.13 15\.57a9 9 0 1 0 3\.87-11\.45L2 6"></path></svg></div>\s*<select class="input-field"[^>]*>.*?Does not repeat.*?</div>', tz_dropdown.strip(), content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
