const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool to the MySQL database
// Pool allows multiple requests to be handled at the same time
const pool = mysql.createPool({
    host:     process.env.DB_HOST,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

// Export with promise support so we can use async/await in controllers
module.exports = pool.promise();
