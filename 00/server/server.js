const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(express.json());
app.use(cors());

// Test Route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// GET All Users
app.get('/api/usuarios', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM usuarios ORDER BY id DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});

// GET One User
app.get('/api/usuarios/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
});

// CREATE User
app.post('/api/usuarios', async (req, res) => {
    const { nome, email, fone, data_nascimento } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO usuarios (nome, email, fone, data_nascimento) VALUES (?, ?, ?, ?)',
            [nome, email, fone, data_nascimento]
        );
        res.status(201).json({ id: result.insertId, message: 'Usuário criado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});

// UPDATE User
app.put('/api/usuarios/:id', async (req, res) => {
    const { nome, email, fone, data_nascimento } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE usuarios SET nome = ?, email = ?, fone = ?, data_nascimento = ? WHERE id = ?',
            [nome, email, fone, data_nascimento, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
        res.json({ message: 'Usuário atualizado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
});

// DELETE User
app.delete('/api/usuarios/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
        res.json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
