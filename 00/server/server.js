require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.API_PORT || 3001;

// --- Middlewares ---
app.use(cors()); // Habilita CORS para todas as rotas
app.use(express.json()); // Permite que o servidor entenda JSON

// --- Rotas da API ---

// GET: Listar todos os usuários
app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, nome, email, data_criacao FROM usuarios ORDER BY data_criacao DESC');
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao buscar usuários.' });
    }
});

// POST: Criar um novo usuário
app.post('/api/users', async (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
    }
    try {
        // Idealmente, a senha seria criptografada aqui antes de salvar.
        // Ex: const hash = await bcrypt.hash(senha, 10);
        const [result] = await db.query('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senha]);
        res.status(201).json({ id: result.insertId, nome, email });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Este email já está cadastrado.' });
        }
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao criar usuário.' });
    }
});

// PUT: Atualizar um usuário existente
app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha } = req.body;

    if (!nome || !email) {
        return res.status(400).json({ error: 'Nome e email são obrigatórios.' });
    }

    let query = 'UPDATE usuarios SET nome = ?, email = ?';
    const params = [nome, email];

    if (senha) {
        // Se uma nova senha foi fornecida, atualiza também.
        query += ', senha = ?';
        params.push(senha);
    }

    query += ' WHERE id = ?';
    params.push(id);

    try {
        const [result] = await db.query(query, params);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        res.json({ message: 'Usuário atualizado com sucesso.' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Este email já pertence a outro usuário.' });
        }
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao atualizar usuário.' });
    }
});

// DELETE: Excluir um usuário
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        res.status(204).send(); // 204 No Content - sucesso sem corpo de resposta
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao deletar usuário.' });
    }
});


// --- Inicialização do Servidor ---
app.listen(PORT, () => {
    console.log(`🚀 Servidor da API rodando em http://localhost:${PORT}`);
});