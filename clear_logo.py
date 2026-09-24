import json
with open('services/api/data/admin_settings.json', 'r') as f:
    data = json.load(f)
data['logo_light_url'] = ''
data['logo_dark_url'] = ''
with open('services/api/data/admin_settings.json', 'w') as f:
    json.dump(data, f)
