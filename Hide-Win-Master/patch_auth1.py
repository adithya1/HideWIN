import re

fpath = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\AuthView.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add new properties
properties_replacement = '''    static properties = {
        _isWaiting: { state: true },
        step: { state: true },
        email: { state: true },
        otp: { state: true },
        loading: { state: true },
        error: { state: true },
        successMsg: { state: true }
    };

    constructor() {
        super();
        this._isWaiting = false;
        this.step = 'email';
        this.email = '';
        this.otp = '';
        this.loading = false;
        this.error = '';
        this.successMsg = '';
    }'''

content = re.sub(
    r'    static properties = \{.*?\};.*?constructor\(\) \{.*?\}' ,
    properties_replacement,
    content,
    flags=re.DOTALL
)

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated AuthView.js properties.")
