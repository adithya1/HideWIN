
import sqlite3
import json

conn = sqlite3.connect('../api/src/lib/hidewin.db')
cursor = conn.cursor()

try:
    interview_schema = json.dumps([
        {'name': 'target_role', 'label': 'Target Role', 'type': 'text', 'required': True, 'placeholder': 'e.g. Senior Backend Engineer'},
        {'name': 'experience_years', 'label': 'Experience (Years)', 'type': 'number', 'required': True, 'placeholder': '5'},
        {'name': 'resume_url', 'label': 'Resume', 'type': 'file', 'required': False}
    ])
    
    trivia_schema = json.dumps([]) # Just materials which is default
    
    # Update existing
    cursor.execute('UPDATE copilot_templates SET form_schema = ? WHERE name = ?', (interview_schema, 'Interview'))
    cursor.execute('UPDATE copilot_templates SET form_schema = ? WHERE name = ?', (trivia_schema, 'Trivia & Quiz'))
    
    conn.commit()
    print('Templates schema updated.')
except Exception as e:
    print('Error:', e)
finally:
    conn.close()

