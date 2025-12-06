const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' }); // Carrega as variáveis do .env na pasta raiz '00'

// Cria um pool de conexões com o banco de dados.
// Usar um pool é mais eficiente do que criar uma nova conexão para cada query.
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Testa a conexão ao iniciar
pool.getConnection()
    .then(connection => {
        console.log('✅ Conexão com o banco de dados MySQL bem-sucedida!');
        connection.release(); // Libera a conexão de volta para o pool
    })
    .catch(err => {
        console.error('❌ Erro ao conectar com o banco de dados:', err.message);
    });

module.exports = pool;