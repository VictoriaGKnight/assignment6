
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(express.json());

const db = new sqlite3.Database('./database/university.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to university database');
    }
});

app.get('/api/courses', (req, res) => {
    db.all('SELECT * FROM courses', (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: 'Failed to retrieve courses'
            });
        }

        res.json(rows);
    });
});

app.get('/api/courses/:id', (req, res) => {
    const id = req.params.id;

    db.get('SELECT * FROM courses WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({
                error: 'Failed to retrieve course'
            });
        }

        if (!row) {
            return res.status(404).json({
                error: 'Course not found'
            });
        }

        res.json(row);
    });
});

app.post('/api/courses', (req, res) => {
    const { courseCode, title, credits, description, semester } = req.body;

    db.run(`
        INSERT INTO courses (courseCode, title, credits, description, semester)
        VALUES (?, ?, ?, ?, ?)
    `, [courseCode, title, credits, description, semester], function(err) {
        if (err) {
            return res.status(500).json({
                error: 'Failed to create course'
            });
        }

        res.status(201).json({
            message: 'Course created successfully',
            id: this.lastID
        });
    });
});

app.put('/api/courses/:id', (req, res) => {
    const id = req.params.id;
    const { courseCode, title, credits, description, semester } = req.body;

    db.run(`
        UPDATE courses
        SET courseCode = ?, title = ?, credits = ?, description = ?, semester = ?
        WHERE id = ?
    `, [courseCode, title, credits, description, semester, id], function(err) {
        if (err) {
            return res.status(500).json({
                error: 'Failed to update course'
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                error: 'Course not found'
            });
        }

        res.json({
            message: 'Course updated successfully'
        });
    });
});

app.delete('/api/courses/:id', (req, res) => {
    const id = req.params.id;

    db.run('DELETE FROM courses WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({
                error: 'Failed to delete course'
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                error: 'Course not found'
            });
        }

        res.json({
            message: 'Course deleted successfully'
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
