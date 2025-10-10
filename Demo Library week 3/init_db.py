import sqlite3

DB = "database.db"

conn = sqlite3.connect(DB)
c = conn.cursor()

# Tạo bảng books
c.execute("""
CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    available INTEGER NOT NULL DEFAULT 1
)
""")

conn.commit()
conn.close()
print("Database created successfully!")
