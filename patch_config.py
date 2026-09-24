with open('Hide-Win-Master/src/utils/configManager.js', 'r', encoding='utf-8') as f:
    text = f.read()

old = '''function normalizeHttpUrl(value, name) {
    if (typeof value !== 'string' || !value.trim()) {
        throw new Error(\ must be configured before using network features.);
    }
    let endpoint = value.trim();
    if (!/^https?:\\/\\//i.test(endpoint)) endpoint = https://\;
    const parsed = new URL(endpoint);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error(\ must use HTTP or HTTPS.);
    }
    return parsed.toString().replace(/\\/+$/, '');
}'''

new = '''function normalizeHttpUrl(value, name) {
    if (typeof value !== 'string' || !value.trim()) {
        if (name === 'HIDEWIN_WEB_URL') return 'http://127.0.0.1:5173';
        if (name === 'HIDEWIN_API_URL') return 'http://127.0.0.1:8000';
        return '';
    }
    let endpoint = value.trim();
    if (!/^https?:\\/\\//i.test(endpoint)) endpoint = https://\;
    const parsed = new URL(endpoint);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error(\ must use HTTP or HTTPS.);
    }
    return parsed.toString().replace(/\\/+$/, '');
}'''

text = text.replace(old, new)

with open('Hide-Win-Master/src/utils/configManager.js', 'w', encoding='utf-8') as f:
    f.write(text)
