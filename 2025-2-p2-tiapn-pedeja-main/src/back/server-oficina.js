require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());
const path = require('path');
const publicDir = path.join(__dirname, '..', 'front');
console.log('Servindo arquivos estáticos de:', publicDir);

app.use(express.static(publicDir));
app.use('/front', express.static(publicDir));



const db = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'oficinas_db',
  port: process.env.DB_PORT || 5432,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

console.log('PostgreSQL pool configurado');

// ======================================================
// ROTA DE TESTE
// ======================================================
app.get('/', (req, res) => {
  res.send('API backend rodando!');
});

// ======================================================
// 1) LISTAR OFICINAS (GET)
// ======================================================
app.get('/oficinas', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM oficinas');
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar oficinas:', err);
    res.status(500).json({ error: 'Erro ao buscar oficinas' });
  }
});

// ======================================================
// 2) CRIAR OFICINA (POST)
// ======================================================
app.post('/oficinas', async (req, res) => {
  const { nome, descricao, status, duracao, isFavorito } = req.body;
  const sql = "INSERT INTO oficinas (nome, descricao, status, duracao, isFavorito) VALUES ($1, $2, $3, $4, $5) RETURNING id";
  try {
    const { rows } = await db.query(sql, [nome, descricao, status, duracao || '00:00', isFavorito || false]);
    res.json({ message: 'Oficina criada com sucesso', id: rows[0].id });
  } catch (err) {
    console.error('Erro ao criar oficina:', err);
    res.status(500).json({ error: 'Erro ao criar oficina' });
  }
});

// ======================================================
// 3) ATUALIZAR OFICINA (PUT)
// ======================================================
app.put('/oficinas/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, status, duracao, isFavorito } = req.body;
  const sql = "UPDATE oficinas SET nome = $1, descricao = $2, status = $3, duracao = $4, isFavorito = $5 WHERE id = $6";
  try {
    await db.query(sql, [nome, descricao, status, duracao || '00:00', isFavorito || false, id]);
    res.json({ message: 'Oficina atualizada com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar oficina:', err);
    res.status(500).json({ error: 'Erro ao atualizar oficina' });
  }
});

// ======================================================
// 4) TOGGLE FAVORITO (PATCH)
// ======================================================
app.patch('/oficinas/:id/favorito', async (req, res) => {
  const { id } = req.params;
  const { isFavorito } = req.body;
  const sql = "UPDATE oficinas SET isFavorito = $1 WHERE id = $2";
  try {
    await db.query(sql, [isFavorito, id]);
    res.json({ message: 'Status de favorito atualizado com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar favorito:', err);
    res.status(500).json({ error: 'Erro ao atualizar favorito' });
  }
});

// ======================================================
// 5) DELETAR OFICINA (DELETE)
// ======================================================
app.delete('/oficinas/:id', async (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM oficinas WHERE id = $1";
  try {
    await db.query(sql, [id]);
    res.json({ message: 'Oficina deletada com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar oficina:', err);
    res.status(500).json({ error: 'Erro ao deletar oficina' });
  }
});

// ======================================================
// INICIAR SERVIDOR
// ======================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));