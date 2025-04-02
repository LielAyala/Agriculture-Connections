// // הגדרת router עבור Users
// const express = require('express');
// const bcrypt = require('bcrypt');//ייבוא ספרייה שאחראית על הצפנת סיסמאות ולהשוואת סיסמאות
// const jwt = require('jsonwebtoken');//כדי לייצר JWT Tokens.
// const db_pool = require('../database').pool;
// const usersRouter = express.Router();
// require('dotenv').config();


// usersRouter.get('/A', (req, res) => {
//     res.send('משתמש ');
//     console.log("  משתמש ");
//   });
// // רישום משתמש חדש
// usersRouter.post('/register', async (req, res) => {
//     console.log("🔍 Request body:", req.body);
//     const { Username, Password, Role } = req.body;
//     if (!Username || !Password || !Role) {
//         return res.status(400).json({ message: "Missing required fields" });
//     }

//     try {
//         const hashedPassword = await bcrypt.hash(Password, 10);
//         const query = `INSERT INTO Users (Username, Password, Role) VALUES (?, ?, ?)`;

//         db_pool.query(query, [Username, hashedPassword, Role], (err, result) => {
//             if (err) {
//                 console.log("❌ Error during insertion:", err);
//                 return res.status(500).json({ message: "Error registering user", error: err });
//             }
//             console.log("✔️ User registered successfully", result);
//             res.status(201).json({ message: "User registered successfully" });
//         });
//     } catch (error) {
//         console.log("❌ Server error:", error);
//         res.status(500).json({ message: "Server error", error });
//     }
// });
// usersRouter.post("/login", async (req, res) => {
//     try {
//         const { Username, Password } = req.body;

//         if (!Username || !Password) {
//             return res.status(400).json({ message: "Missing required fields" });
//         }

//         db_pool.query("SELECT * FROM Users WHERE Username = ?", [Username], async (err, results) => {
//             if (err) {
//                 return res.status(500).json({ message: "Error querying the database" });
//             }

//             if (results.length === 0) {
//                 return res.status(401).json({ message: "Invalid username or password" });
//             }

//             const validPassword = await bcrypt.compare(Password, results[0].Password);

//             if (!validPassword) {
//                 return res.status(401).json({ message: "Invalid username or password" });
//             }

//             res.json({ message: "Login successful", user: results[0] });
//         });

//     } catch (error) {
//         res.status(500).json({ message: "Internal server error" });
//     }
// });

  
//   module.exports = usersRouter;
const express = require('express');
const bcrypt = require('bcrypt');
const db_pool = require('../database'); // מחזיר את promisePool!
const usersRouter = express.Router();

// רישום משתמש חדש
usersRouter.post('/register', async (req, res, next) => {
    const { Username, Password, Role } = req.body;
    if (!Username || !Password || !Role) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);
    await db_pool.query("INSERT INTO Users (Username, Password, Role) VALUES (?, ?, ?)", [Username, hashedPassword, Role]);

    res.status(201).json({ message: "User registered successfully" });
});

// התחברות משתמש
usersRouter.post("/login", async (req, res, next) => {
    const { Username, Password, Role } = req.body;

    console.log("👉 Login input:", { Username, Password, Role });

    if (!Username || !Password || !Role) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const [results] = await db_pool.query(
        "SELECT * FROM Users WHERE Username = ? AND Role = ?",
        [Username, Role]
    );

    if (results.length === 0) {
        return res.status(401).json({ message: "Invalid username or role or password" });
    }

    const validPassword = await bcrypt.compare(Password, results[0].Password);
    if (!validPassword) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    res.json({ message: "Login successful", user: results[0] });
});


// שליפת כל המשתמשים
usersRouter.get('/all', async (req, res, next) => {
    const [results] = await db_pool.query("SELECT ID, Username, Role FROM Users");
    res.json(results);
});

// עדכון משתמש
usersRouter.patch('/edit', async (req, res, next) => {
    const { ID, Username, Password, Role } = req.body;
    if (!ID || !Username || !Password || !Role) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);
    await db_pool.query("UPDATE Users SET Username = ?, Password = ?, Role = ? WHERE ID = ?", [Username, hashedPassword, Role, ID]);
    res.json({ message: "User updated successfully" });
});

// מחיקת משתמש
usersRouter.delete('/delete', async (req, res, next) => {
    const { ID } = req.body;
    if (!ID) {
        return res.status(400).json({ message: "Missing ID" });
    }

    await db_pool.query("DELETE FROM Users WHERE ID = ?", [ID]);
    res.json({ message: "User deleted successfully" });
});

module.exports = usersRouter;
