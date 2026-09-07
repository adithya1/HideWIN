import re
path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

tz_list = """const TIMEZONES = [
    { value: "Pacific/Midway", label: "(GMT-11:00) Midway Island, Samoa" },
    { value: "America/Honolulu", label: "(GMT-10:00) Hawaii" },
    { value: "America/Juneau", label: "(GMT-09:00) Alaska" },
    { value: "America/Los_Angeles", label: "(GMT-08:00) Pacific Time (US & Canada)" },
    { value: "America/Denver", label: "(GMT-07:00) Mountain Time (US & Canada)" },
    { value: "America/Chicago", label: "(GMT-06:00) Central Standard Time (CST) - Chicago, Mexico City" },
    { value: "America/New_York", label: "(GMT-05:00) Eastern Standard Time (EST) - New York, Bogota, Lima" },
    { value: "America/Caracas", label: "(GMT-04:30) Caracas" },
    { value: "America/Halifax", label: "(GMT-04:00) Atlantic Time (Canada), Caracas, La Paz" },
    { value: "America/St_Johns", label: "(GMT-03:30) Newfoundland" },
    { value: "America/Argentina/Buenos_Aires", label: "(GMT-03:00) Brazil, Buenos Aires, Georgetown" },
    { value: "Atlantic/South_Georgia", label: "(GMT-02:00) Mid-Atlantic" },
    { value: "Atlantic/Azores", label: "(GMT-01:00) Azores, Cape Verde Islands" },
    { value: "Europe/London", label: "(GMT+00:00) Western Europe Time, London, Lisbon, Casablanca" },
    { value: "Europe/Paris", label: "(GMT+01:00) Brussels, Copenhagen, Madrid, Paris" },
    { value: "Europe/Helsinki", label: "(GMT+02:00) Kaliningrad, South Africa" },
    { value: "Europe/Moscow", label: "(GMT+03:00) Baghdad, Riyadh, Moscow, St. Petersburg" },
    { value: "Asia/Tehran", label: "(GMT+03:30) Tehran" },
    { value: "Asia/Dubai", label: "(GMT+04:00) Abu Dhabi, Muscat, Baku, Tbilisi" },
    { value: "Asia/Kabul", label: "(GMT+04:30) Kabul" },
    { value: "Asia/Karachi", label: "(GMT+05:00) Ekaterinburg, Islamabad, Karachi, Tashkent" },
    { value: "Asia/Kolkata", label: "(GMT+05:30) Indian Standard Time (IST) - New Delhi, Mumbai" },
    { value: "Asia/Kathmandu", label: "(GMT+05:45) Kathmandu, Pokhara" },
    { value: "Asia/Dhaka", label: "(GMT+06:00) Almaty, Dhaka, Colombo" },
    { value: "Asia/Yangon", label: "(GMT+06:30) Yangon, Mandalay" },
    { value: "Asia/Bangkok", label: "(GMT+07:00) Bangkok, Hanoi, Jakarta" },
    { value: "Asia/Hong_Kong", label: "(GMT+08:00) Beijing, Perth, Singapore, Hong Kong" },
    { value: "Asia/Tokyo", label: "(GMT+09:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk" },
    { value: "Australia/Adelaide", label: "(GMT+09:30) Adelaide, Darwin" },
    { value: "Australia/Sydney", label: "(GMT+10:00) Eastern Australia, Guam, Vladivostok" },
    { value: "Asia/Magadan", label: "(GMT+11:00) Magadan, Solomon Islands, New Caledonia" },
    { value: "Pacific/Auckland", label: "(GMT+12:00) Auckland, Wellington, Fiji, Kamchatka" }
];
"""

if "const TIMEZONES = [" not in content:
    content = content.replace("export class ScheduleMeetingView extends LitElement {", tz_list + "\nexport class ScheduleMeetingView extends LitElement {")

new_dropdown = r"""
                        <select class="input-field" style="width:100%" .value=${this.timezone} @change=${e => this.timezone = e.target.value}>
                            ${TIMEZONES.map(tz => html`<option value="${tz.value}" ?selected=${this.timezone === tz.value}>${tz.label}</option>`)}
                        </select>
"""

content = re.sub(r'<select class="input-field"[^>]*>.*?Intl\.supportedValuesOf.*?</select>', new_dropdown.strip(), content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
