const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Conexão com o banco de dados estabelecida com sucesso!');
        connection.release();
        return { success: true, message: 'Conexão com o banco de dados estabelecida com sucesso!' };
    } catch (error) {
        console.error('Erro ao conectar com o banco de dados:', error.message);
        
        let userMessage = 'Erro ao conectar com o banco de dados. Verifique as configurações e tente novamente.';

        if (error.code === 'ECONNREFUSED') {
            userMessage = 'Não foi possível conectar ao banco de dados. Verifique se o servidor de banco de dados está em execução e acessível.';
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            userMessage = 'Acesso negado ao banco de dados. Verifique o nome de usuário e a senha.';
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            userMessage = `O banco de dados '${process.env.DB_NAME}' não foi encontrado. Verifique se o nome do banco de dados está correto.`;
        }

        return { success: false, message: userMessage, error: error.message };
    }
}

module.exports = { pool, testConnection };
