require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'projeto'
});

connection.query("SHOW COLUMNS FROM usuarios LIKE 'id'", (err, results) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('ID Column Details:', results);
    }
    connection.end();
});
