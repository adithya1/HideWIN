
import sqlite3

conn = sqlite3.connect('../api/src/lib/hidewin.db')
cursor = conn.cursor()

try:
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS copilot_templates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR,
            description VARCHAR,
            icon VARCHAR,
            is_active BOOLEAN,
            form_schema JSON,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS assistants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            template_id INTEGER,
            name VARCHAR,
            target_role VARCHAR,
            experience_years INTEGER,
            resume_url VARCHAR,
            job_description_url VARCHAR,
            materials_url VARCHAR,
            is_active BOOLEAN,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(template_id) REFERENCES copilot_templates(id),
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    ''')

    templates = [
        ('Interview', 'A real-time interview co-pilot that helps you answer faster and more confidently.', 'interview_icon', True, '{}'),
        ('Trivia & Quiz', 'A quick-answer co-pilot for trivia games, quizzes, and rapid-fire Q&A.', 'trivia_icon', True, '{}'),
        ('Custom', 'A flexible co-pilot you can fully customize to fit any meeting.', 'custom_icon', True, '{}')
    ]
    
    cursor.executemany('INSERT INTO copilot_templates (name, description, icon, is_active, form_schema) VALUES (?, ?, ?, ?, ?)', templates)
    
    conn.commit()
    print('Templates seeded.')
except Exception as e:
    print('Error:', e)
finally:
    conn.close()

