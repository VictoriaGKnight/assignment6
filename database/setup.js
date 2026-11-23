
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/university.db');

db.run(`
    CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        courseCode TEXT,
        title TEXT,
        credits INTEGER,
        description TEXT,
        semester TEXT
    )
`, (err) => {
    if (err) {
        console.error('Error creating courses table:', err.message);
    } else {
        console.log('University database and courses table created successfully!');
    }

    db.close();
});
