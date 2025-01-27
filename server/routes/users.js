// הגדרת router עבור Users
const express = require('express');
const db_pool = require('../database').pool;
const usersRouter = express.Router();

usersRouter.get('/A', (req, res) => {
    res.send('משתמש ');
    console.log("  משתמש ");
  });

// קריאת כל הפרטים של Users
usersRouter.get('/all', (req, res) => {
    const query = "SELECT * FROM `Users`";
    db_pool.query(query, (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.status(200).json(rows);
    });
});

// הוספת משתמש חדש
usersRouter.post('/add', (req, res) => {
    const { username, email, password, userType } = req.body;
    const query = `INSERT INTO Users (username, email, password, userType)
                   VALUES (?, ?, ?, ?)`;
    db_pool.query(query, [username, email, password, userType], (err) => {
        if (err) {
            return res.status(500).json({ message: "Error adding user", error: err });
        }
        res.status(200).json({ message: "User added successfully" });
    });
});

// עדכון פרטי משתמש
usersRouter.patch('/edit', (req, res) => {
    const { id, username, email, password, userType } = req.body;
    const query = `UPDATE Users SET username = ?, email = ?, password = ?, userType = ? WHERE id = ?`;
    db_pool.query(query, [username, email, password, userType, id], (err) => {
        if (err) {
            return res.status(500).json({ message: "Error updating user", error: err });
        }
        res.status(200).json({ message: "User updated successfully" });
    });
});

// מחיקת משתמש
usersRouter.delete('/delete', (req, res) => {
    const { id } = req.body;
    const query = "DELETE FROM Users WHERE id = ?";
    db_pool.query(query, [id], (err) => {
        if (err) {
            return res.status(500).json({ message: "Error deleting user", error: err });
        }
        res.status(200).json({ message: "User deleted successfully" });
    });
});

module.exports = usersRouter;
