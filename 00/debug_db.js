require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'projeto'
});

connection.query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'projeto' AND TABLE_NAME = 'usuarios'", (err, results) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('Columns:', results.map(r => r.COLUMN_NAME));
    }
    connection.end();
});
