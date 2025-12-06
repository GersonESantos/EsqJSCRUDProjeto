const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', async (req, res) => {
    try {
        // Tenta pegar uma conexão do pool do banco de dados
        const connection = await db.getConnection();
        // Libera a conexão imediatamente
        connection.release();
        // Se conseguiu, responde com status 200 (OK)
        res.status(200).json({ status: 'ok', message: 'API and DB estao rodando' });
    } catch (error) {
        // Se falhou, responde com status 503 (Serviço Indisponível)
        console.error('Health check failed:', error);
        res.status(503).json({ status: 'error', message: 'Cannot connect to the database' });
    }
});

// GET: List all users
app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM usuarios ORDER BY data_criacao DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});

// POST: Create user
app.post('/api/users', async (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    try {
        // Simple check for duplicate email handled by DB constraint usually, but we can catch it
        const [result] = await db.query('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senha]);
        res.status(201).json({ id: result.insertId, nome, email, message: 'Usuário criado com sucesso' });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Email já cadastrado' });
        }
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});

// PUT: Update user
app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email } = req.body; // Not updating password/date here for simplicity unless requested
    
    if (!nome || !email) {
         return res.status(400).json({ error: 'Nome e Email são obrigatórios para atualização' });
    }

    try {
        const [result] = await db.query('UPDATE usuarios SET nome = ?, email = ? WHERE id = ?', [nome, email, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json({ message: 'Usuário atualizado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
});

// DELETE: Delete user
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
});

// Check DB and Start server
const startServer = async () => {
    try {
        await db.query('SELECT 1'); // Simple connectivity check
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Database connection failed. Server not started.', error);
        process.exit(1);
    }
};

startServer();
