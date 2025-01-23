// // https://www.npmjs.com/package/mysql2
// const mysql = require('mysql2');

// //require("./gen_params");
// let HOST = require("./gen_params").HOST;
// let USER = require("./gen_params").USER;
// let PASSWORD = require("./gen_params").PASSWORD;
// let DATABASE = require("./gen_params").DATABASE;

// console.log("database.HOST =", HOST);
// console.log("database.USER =", USER);
// console.log("database.PASSWORD =", PASSWORD);
// console.log("database.DATABASE =", DATABASE);
// console.log("gen_params.js loaded successfully");
// console.log("HOST:", exports.HOST);
// console.log("USER:", exports.USER);
// console.log("PASSWORD:", exports.PASSWORD);
// console.log("DATABASE:", exports.DATABASE);





// const pool = mysql.createPool({
//     host:		HOST		,
//     user:		USER		,
//     password:	PASSWORD	,
//     database:	DATABASE	,
//     waitForConnections: true,
//     connectionLimit: 10,
//     maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
//     idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
//     queueLimit: 0,
//     enableKeepAlive: true,
//     keepAliveInitialDelay: 0
// });


// module.exports = {
//     pool:pool
// };
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "agriculture connections",
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, 
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

module.exports = { pool };
