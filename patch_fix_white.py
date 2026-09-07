import re

path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# I will find the broken injection and remove it.
# The broken block starts with: const fs = window.require('fs');
# And ends with: }, 3000);

broken_block = r"""        const fs = window.require('fs');
        fs.appendFileSync('C:\Users\akula\Downloads\Hide-WIN\invite_test.log', new Date().toISOString() + ' - InviteView Mounted!
');
        
        setTimeout(() => {
            fs.appendFileSync('C:\Users\akula\Downloads\Hide-WIN\invite_test.log', new Date().toISOString() + ' - Auto-triggering createChannel()
');
            this.createChannel();
        }, 3000);
"""

# Let's just use regex to remove everything between `async firstUpdated() {` and `if (window.require) {`
content = re.sub(r'    async firstUpdated\(\) \{[\s\S]*?if \(window\.require\) \{', '    async firstUpdated() {\n        if (window.require) {', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
