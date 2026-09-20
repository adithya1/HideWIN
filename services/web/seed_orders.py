
import sqlite3

conn = sqlite3.connect('../api/src/lib/hidewin.db')
cursor = conn.cursor()

try:
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            amount FLOAT DEFAULT 0.0,
            status VARCHAR DEFAULT 'pending',
            payment_method VARCHAR,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER,
            stripe_charge_id VARCHAR,
            amount FLOAT DEFAULT 0.0,
            status VARCHAR DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(order_id) REFERENCES orders(id)
        )
    ''')
    
    conn.commit()
    print('Orders tables created.')
except Exception as e:
    print('Error:', e)
finally:
    conn.close()

