const mysql = require('mysql2');

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "agriculture connections",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise(); // הגדרה נכונה של promise()

console.log("✅ חיבור למסד הנתונים נוצר בהצלחה!");

module.exports = promisePool; // ייצוא promisePool ישירות




