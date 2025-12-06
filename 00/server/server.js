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
        const [rows] = await db.query('SELECT * FROM clientes_app ORDER BY id DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
});

// GET One User
app.get('/api/usuarios/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM clientes_app WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar cliente' });
    }
});

// CREATE User
app.post('/api/usuarios', async (req, res) => {
    const { nome, email, fone, data_nascimento } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO clientes_app (nome, email, telefone, data_nasc) VALUES (?, ?, ?, ?)',
            [nome, email, fone, data_nascimento]
        );
        res.status(201).json({ id: result.insertId, message: 'Cliente criado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar cliente', details: error.message });
    }
});

// UPDATE User
app.put('/api/usuarios/:id', async (req, res) => {
    const { nome, email, fone, data_nascimento } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE clientes_app SET nome = ?, email = ?, telefone = ?, data_nasc = ? WHERE id = ?',
            [nome, email, fone, data_nascimento, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
        res.json({ message: 'Cliente atualizado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
});

// DELETE User
app.delete('/api/usuarios/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM clientes_app WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
        res.json({ message: 'Cliente deletado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar cliente' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
