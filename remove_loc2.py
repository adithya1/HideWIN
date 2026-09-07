import re
path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find and remove the location row using a broader pattern
loc_start = content.find('placeholder="Add location"')
if loc_start >= 0:
    # Find the enclosing form-row div - walk backwards to find <div class="form-row">
    before = content[:loc_start]
    row_start = before.rfind('<div class="form-row">')
    # Walk forward from loc_start to find the closing </div>
    after = content[loc_start:]
    row_end = after.find('</div>\n') 
    # There's the input </div> then the form-row </div>
    # Find the second </div> after location to close the form-row
    first_close = after.find('</div>')
    second_close = after.find('</div>', first_close + 6)
    end_pos = loc_start + second_close + 6
    
    content = content[:row_start] + content[end_pos:]
    print("Location field removed!")
else:
    print("Location not found")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
