with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the accidental injections in toggleFormatPainter
content = content.replace("this.editMeeting = null;\n          this.isFormatPainting = false;", "this.isFormatPainting = false;")

# Wait, in the constructor we DO want `this.editMeeting = null;`
# So let's restore it manually in the constructor
if "this.editMeeting = null;" not in content.split("constructor() {")[1].split("}")[0]:
    content = content.replace("super();", "super();\n        this.editMeeting = null;")

# Add the lifecycle hooks properly!
lifecycle_hooks = """
    updated(changedProps) {
        super.updated(changedProps);
        if (changedProps.has('editMeeting') && this.editMeeting) {
            this.title = this.editMeeting.title || '';
            
            // Set the description safely
            setTimeout(() => {
                const editor = this.shadowRoot.querySelector('#description-editor');
                if (editor) editor.innerHTML = this.editMeeting.description || '';
            }, 0);
            
            if (this.editMeeting.start_time) {
                const d = new Date(this.editMeeting.start_time);
                // Adjust for local timezone input
                this.startDate = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
                this.startTime = String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
            }
            if (this.editMeeting.end_time) {
                const d = new Date(this.editMeeting.end_time);
                this.endDate = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
                this.endTime = String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
            }
            this.timezone = this.editMeeting.timezone || this.timezone;
            this.recurrence = this.editMeeting.recurrence || 'none';
        }
    }
    
    firstUpdated() {
        if (super.firstUpdated) super.firstUpdated();
    }
"""

if "updated(changedProps)" not in content:
    # Inject it right after constructor
    content = content.replace("this.step = 'create'; // 'create' | 'share'\n    }", "this.step = 'create'; // 'create' | 'share'\n    }\n" + lifecycle_hooks)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Injected updated hook")
