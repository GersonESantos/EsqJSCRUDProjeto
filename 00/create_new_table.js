require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'projeto'
});

const createTableQuery = `
CREATE TABLE IF NOT EXISTS clientes_app (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(50),
    data_nasc DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

connection.query(createTableQuery, (err, results) => {
    if (err) {
        console.error('Error creating table:', err);
    } else {
        console.log('Table clientes_app created successfully:', results);
    }
    connection.end();
});
