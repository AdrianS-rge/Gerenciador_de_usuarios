const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

// Definicao do modulo usuario
const Usuario = sequelize.define('usuarios', {
    nome: {
        type: Sequelize.STRING
    },
    sobrenome: {
        type: Sequelize.STRING
    },
    idade: {
        type: Sequelize.INTEGER
    },
    email: {
        type: Sequelize.STRING
    }
})

// Middleware para permitir solicitações CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

//middleware para permitir solicitaçoes cors
app.use(cors());
app.use(express.json());

app.get('/usuarios', async (req, res) => {
    try {
        await Usuario.sync();
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (err) {
        console.error('Erro ao conectar', err);
        res.status(500).json({ error: 'Erro interno no server'})
    }
});

// Rota para criar um novo user

app.post('/usuarios', async (req, res) => {
    try {
        const { nome, sobrenome, idade, email } = req.body;
        await Usuario.sync();
        const novoUsuario = await Usuario.create({nome, sobrenome, idade, email});
        res.status(201).json(novoUsuario);
    } catch(err) {
        console.error('Erro ao adicionar usuario:', err);
        res.status(500).json({ error: 'Erro interno no servidor' })
    }
});

app.delete('/usuarios/:id', async (req, res) => {
    try {
        const usuarioId = req.params.id;
        await Usuario.sync();
        const usuario = await Usuario.findByPk(usuarioId);
        if (usuario) {
            await usuario.destroy();
            res.status(204).send(); //Sucesso sem conteudo
        } else {
            res.status(404).json({ error: 'Usuario nao encontrado' })
        }
    } catch (err) {
        console.error('Erro ao remover usuario', err);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }

})

const PORT = 3000;
app.listen(PORT, (req, res) => {
    console.log(`Server conectado com sucesso na porta ${PORT}!`);
});
