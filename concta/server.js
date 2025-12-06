const express = require('express');
const cors = require('cors');
const { testConnection } = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve arquivos estáticos do diretório atual

// Rota para testar a conexão
app.get('/api/status', async (req, res) => {
    const result = await testConnection();
    if (result.success) {
        res.status(200).json(result);
    } else {
        res.status(500).json(result);
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Acesse para testar a conexão.`);
});
