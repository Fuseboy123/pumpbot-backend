const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors()); // Permitir requisições de qualquer origem (como do GitHub Pages)
app.use(express.json()); // Permitir requisições JSON

// Configuração da conexão com o MySQL
const db = mysql.createConnection({
    host: 'cuhqj.h.filess.io',
    user: 'PumpBot2_centraljet',
    password: '7d45320f4242e1f528ac5a14c8c0f7ce79700177',
    database: 'PumpBot2_centraljet',
    port: 3306,
});

// Teste de conexão
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
    } else {
        console.log('Conectado ao MySQL com sucesso!');
    }
});

// Rota para registrar usuário e dar bônus de 3 créditos
app.post('/register', (req, res) => {
    const { walletAddress } = req.body;

    const query = `
        INSERT INTO users (wallet_address, credits) 
        VALUES (?, 3)
        ON DUPLICATE KEY UPDATE credits = credits;
    `;

    db.query(query, [walletAddress], (err, result) => {
        if (err) {
            console.error('Erro ao registrar usuário:', err);
            res.status(500).send('Erro ao registrar usuário');
        } else {
            res.status(200).send('Usuário registrado com 3 créditos de bônus!');
        }
    });
});

// Rota para buscar créditos de um usuário
app.get('/credits/:walletAddress', (req, res) => {
    const { walletAddress } = req.params;

    const query = `SELECT credits FROM users WHERE wallet_address = ?`;

    db.query(query, [walletAddress], (err, results) => {
        if (err) {
            console.error('Erro ao buscar créditos:', err);
            res.status(500).send('Erro ao buscar créditos');
        } else if (results.length === 0) {
            res.status(404).send('Usuário não encontrado');
        } else {
            res.status(200).json({ credits: results[0].credits });
        }
    });
});

// Inicializa o servidor na porta 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
