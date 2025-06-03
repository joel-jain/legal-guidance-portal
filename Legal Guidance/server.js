// server.js
import express from 'express';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const { Database } = sqlite3;  // Correct way to access the Database constructor
const db = new Database('./database.db');  // Initialize the database

app.use(cors());
app.use(express.json());

// SQLite database setup
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT,
    isLawyer BOOLEAN
)`);

db.run(`CREATE TABLE IF NOT EXISTS lawyer_verifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    name TEXT,
    email TEXT,
    dob TEXT,
    proofDoc TEXT,
    specialization TEXT,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY(userId) REFERENCES users(id)
)`);

// Pre-assigned users
const preAssignedUsers = [
    { username: 'admin', email: 'admin@test.com', password: 'admin123', role: 'admin', isLawyer: false },
    { username: 'user', email: 'user@test.com', password: 'user123', role: 'user', isLawyer: false },
    { username: 'advocate', email: 'advocate@test.com', password: 'adv123', role: 'advocate', isLawyer: true }
];

preAssignedUsers.forEach(user => {
    db.run(`INSERT OR IGNORE INTO users (username, email, password, role, isLawyer) VALUES (?, ?, ?, ?, ?)`,
        [user.username, user.email, user.password, user.role, user.isLawyer]);
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, password], (err, row) => {
        if (row) {
            // Log the login activity
            db.run(`INSERT INTO activity_logs (userId, action) VALUES (?, ?)`, [row.id, 'Logged in']);
            res.json({ success: true, user: row });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    });
});

// Register endpoint
app.post('/api/register', (req, res) => {
    const { username, email, password, isLawyer } = req.body;
    db.run(`INSERT INTO users (username, email, password, role, isLawyer) VALUES (?, ?, ?, ?, ?)`,
        [username, email, password, isLawyer ? 'advocate' : 'user', isLawyer],
        function(err) {
            if (err) {
                res.json({ success: false, message: 'Email already exists' });
            } else {
                res.json({ success: true, userId: this.lastID });
            }
        });
});

// Lawyer verification request
app.post('/api/lawyer-verification', (req, res) => {
    const { userId, name, email, dob, proofDoc, specialization } = req.body;
    db.run(`INSERT INTO lawyer_verifications (userId, name, email, dob, proofDoc, specialization) VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, name, email, dob, proofDoc, specialization],
        function(err) {
            if (err) {
                res.json({ success: false, message: 'Error submitting verification' });
            } else {
                res.json({ success: true });
            }
        });
});

// Additional tables
db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    senderId INTEGER,
    receiverId INTEGER,
    content TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(senderId) REFERENCES users(id),
    FOREIGN KEY(receiverId) REFERENCES users(id)
)`);

db.run(`CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    action TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES users(id)
)`);

// Additional endpoints
app.get('/api/lawyer-verification-status/:userId', (req, res) => {
    const { userId } = req.params;
    db.get(`SELECT status FROM lawyer_verifications WHERE userId = ?`, [userId], (err, row) => {
        if (row) {
            res.json({ status: row.status });
        } else {
            res.json({ status: 'pending' });
        }
    });
});

app.get('/api/lawyer-verifications', (req, res) => {
    db.all(`SELECT * FROM lawyer_verifications WHERE status = 'pending'`, [], (err, rows) => {
        res.json(rows);
    });
});

app.post('/api/lawyer-verification-update', (req, res) => {
    const { id, status } = req.body;
    db.run(`UPDATE lawyer_verifications SET status = ? WHERE id = ?`, [status, id], function(err) {
        if (err) {
            res.json({ success: false });
        } else {
            res.json({ success: true });
        }
    });
});

app.get('/api/messages', (req, res) => {
    db.all(`SELECT m.*, u1.username as sender, u2.username as receiver 
            FROM messages m 
            JOIN users u1 ON m.senderId = u1.id 
            JOIN users u2 ON m.receiverId = u2.id`, [], (err, rows) => {
        if (err) {
            res.json({ success: false, message: 'Error fetching messages' });
        } else {
            res.json(rows);
        }
    });
});

app.delete('/api/messages/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM messages WHERE id = ?`, [id], function(err) {
        if (err) {
            res.json({ success: false, message: 'Error deleting message' });
        } else {
            res.json({ success: true });
        }
    });
});

app.post('/api/log-activity', (req, res) => {
    const { userId, action } = req.body;
    db.run(`INSERT INTO activity_logs (userId, action) VALUES (?, ?)`, [userId, action], function(err) {
        if (err) {
            res.json({ success: false });
        } else {
            res.json({ success: true });
        }
    });
});

app.get('/api/activity-logs', (req, res) => {
    db.all(`SELECT a.*, u.username 
            FROM activity_logs a 
            JOIN users u ON a.userId = u.id`, [], (err, rows) => {
        if (err) {
            res.json({ success: false, message: 'Error fetching activity logs' });
        } else {
            res.json(rows);
        }
    });
});

app.post('/api/send-message', (req, res) => {
    const { senderId, receiverId, content } = req.body;
    db.run(
        `INSERT INTO messages (senderId, receiverId, content) VALUES (?, ?, ?)`,
        [senderId, receiverId, content],
        function (err) {
            if (err) {
                res.json({ success: false, message: 'Error sending message' });
            } else {
                db.run(`INSERT INTO activity_logs (userId, action) VALUES (?, ?)`, [
                    senderId,
                    `Sent a message to user ${receiverId}`,
                ]);
                res.json({ success: true });
            }
        }
    );
});

app.listen(5000, () => console.log('Server running on port 5000'));