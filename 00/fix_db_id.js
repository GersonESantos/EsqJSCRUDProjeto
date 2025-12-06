require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'projeto'
});

const alterQuery = "ALTER TABLE usuarios MODIFY COLUMN id INT AUTO_INCREMENT";

connection.query(alterQuery, (err, results) => {
    if (err) {
        console.error('Error altering table:', err);
    } else {
        console.log('Successfully added AUTO_INCREMENT to id column:', results);
    }
    connection.end();
});
