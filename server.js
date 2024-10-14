const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const dbConfig = {
    host: 'cuhqj.h.filess.io',
    user: 'PumpBot2_centraljet',
    password: '7d45320f4242e1f528ac5a14c8c0f7ce79700177',
    database: 'PumpBot2_centraljet',
    port: 3306,
};

app.use(express.json());
app.use(cors());

async function connectToDatabase() {
    return await mysql.createConnection(dbConfig);
}

app.post('/users', async (req, res) => {
    const { wallet_address } = req.body;

    try {
        const connection = await connectToDatabase();
        const [rows] = await connection.query(
            'SELECT credits FROM users WHERE wallet_address = ?',
            [wallet_address]
        );

        let credits = 3;

        if (rows.length === 0) {
            await connection.query(
                'INSERT INTO users (wallet_address, credits) VALUES (?, ?)',
                [wallet_address, credits]
            );
        } else {
            credits = rows[0].credits;
        }

        connection.end();
        res.json({ wallet_address, credits });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
