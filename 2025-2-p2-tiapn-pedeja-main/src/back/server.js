// server.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;


   //CONFIG MULTER (UPLOAD)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'front', 'images');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'produto-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) cb(null, true);
    else cb(new Error('Apenas imagens são permitidas'));
  }
});


  // MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'front')));
app.use('/images', express.static(path.join(__dirname, '..', 'front', 'images')))

// DATABASE
const db = require('./database');

   // ROTAS DE PRODUTOS
app.get('/api/produtos', async (req, res) => {
  try {
    const { categoria } = req.query;
    
    let query = `
      SELECT 
        p.produtoid AS id,
        p.imagemurl AS foto,
        p.nome,
        p.preco,
        p.descricao,
        c.nome AS categoria
      FROM produtos p
      LEFT JOIN categoriasproduto c ON p.categoriaid = c.categoriaid
      WHERE p.disponivel = true
    `;
    
    const params = [];
    
    if (categoria) {
      query += ` AND LOWER(c.nome) = LOWER($1)`;
      params.push(categoria);
    }
    
    query += ` ORDER BY p.criadoem DESC`;

    const { rows } = await db.query(query, params);

    res.json(rows.map(p => ({
      id: p.id,
      foto: p.foto,
      nome: p.nome,
      preco: Number(p.preco),
      categoria: p.categoria || 'Geral',
      descricao: p.descricao
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

app.get('/api/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(`
      SELECT 
        p.produtoid AS id,
        p.imagemurl AS foto,
        p.nome,
        p.preco,
        p.descricao,
        c.nome AS categoria
      FROM produtos p
      LEFT JOIN categoriasproduto c ON p.categoriaid = c.categoriaid
      WHERE p.produtoid = $1
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json({
      id: rows[0].id,
      foto: rows[0].foto,
      nome: rows[0].nome,
      preco: Number(rows[0].preco),
      categoria: rows[0].categoria || 'Geral',
      descricao: rows[0].descricao
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
});

app.post('/api/produtos', upload.single('foto'), async (req, res) => {
  const { nome, preco, descricao } = req.body;
  if (!nome || preco == null) {
    return res.status(400).json({ error: 'Nome e preço obrigatórios' });
  }

  try {
    const { rows } = await db.query(
      'SELECT 1 FROM produtos WHERE LOWER(nome) = LOWER($1)',
      [nome]
    );

    if (rows.length > 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(409).json({ error: 'Produto já existe' });
    }

    const foto = req.file ? `/images/${req.file.filename}` : null;

    const result = await db.query(
      `INSERT INTO produtos (imagemurl, nome, descricao, preco)
       VALUES ($1, $2, $3, $4)
       RETURNING produtoid`,
      [foto, nome, descricao, preco]
    );

    res.status(201).json({
      id: result.rows[0].produtoid,
      foto,
      nome,
      preco,
      descricao
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

app.put('/api/produtos/:id', upload.single('foto'), async (req, res) => {
  const { id } = req.params;
  const { nome, preco, descricao, fotoAtual } = req.body;

  if (!nome || preco == null) {
    return res.status(400).json({ error: 'Nome e preço obrigatórios' });
  }

  try {
    // Verificar se produto existe
    const { rows: existing } = await db.query(
      'SELECT imagemurl FROM produtos WHERE produtoid = $1',
      [id]
    );

    if (existing.length === 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    // Verificar duplicação de nome
    const { rows: duplicate } = await db.query(
      'SELECT 1 FROM produtos WHERE LOWER(nome) = LOWER($1) AND produtoid != $2',
      [nome, id]
    );

    if (duplicate.length > 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(409).json({ error: 'Já existe outro produto com este nome' });
    }

    let foto = fotoAtual || existing[0].imagemurl;

    // Se enviou nova foto, remover a antiga e usar a nova
    if (req.file) {
      if (existing[0].imagemurl) {
        const oldPath = path.join(__dirname, '..', 'front', existing[0].imagemurl);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      foto = `/images/${req.file.filename}`;
    }

    await db.query(
      `UPDATE produtos 
       SET nome = $1, preco = $2, descricao = $3, imagemurl = $4, atualizadoem = NOW()
       WHERE produtoid = $5`,
      [nome, preco, descricao, foto, id]
    );

    res.json({
      id: Number(id),
      nome,
      preco: Number(preco),
      descricao,
      foto
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

app.delete('/api/produtos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await db.query(
      'SELECT imagemurl FROM produtos WHERE produtoid = $1',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    // Remover imagem se existir
    if (rows[0].imagemurl) {
      const imagePath = path.join(__dirname, '..', 'front', rows[0].imagemurl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await db.query('DELETE FROM produtos WHERE produtoid = $1', [id]);

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
});

// ROTAS DE OFICINAS
app.get('/api/oficinas', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT 
        id,
        nome,
        descricao,
        duracao,
        status,
        isfavorito
      FROM oficinas
      ORDER BY criadoem DESC
    `);

    res.json(rows.map(o => ({
      id: o.id,
      nome: o.nome,
      descricao: o.descricao,
      duracao: o.duracao,
      status: o.status,
      isFavorito: o.isfavorito
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar oficinas' });
  }
});

app.get('/api/oficinas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(`
      SELECT 
        oficinaid AS id,
        nome,
        descricao,
        duracao,
        status,
        isfavorito
      FROM oficinas
      WHERE oficinaid = $1
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Oficina não encontrada' });
    }

    res.json({
      id: rows[0].id,
      nome: rows[0].nome,
      descricao: rows[0].descricao,
      duracao: rows[0].duracao,
      status: rows[0].status,
      isFavorito: rows[0].isfavorito
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar oficina' });
  }
});

app.post('/api/oficinas', async (req, res) => {
  const { nome, descricao, duracao, status, isFavorito } = req.body;
  
  if (!nome || !descricao) {
    return res.status(400).json({ error: 'Nome e descrição são obrigatórios' });
  }

  try {
    const result = await db.query(`
      INSERT INTO oficinas (nome, descricao, duracao, status, isfavorito)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING oficinaid AS id
    `, [nome, descricao, duracao || '00:00', status || 'Agendada', isFavorito || false]);

    res.status(201).json({
      id: result.rows[0].id,
      nome,
      descricao,
      duracao: duracao || '00:00',
      status: status || 'Agendada',
      isFavorito: isFavorito || false
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar oficina' });
  }
});

app.put('/api/oficinas/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, duracao, status, isFavorito } = req.body;

  if (!nome || !descricao) {
    return res.status(400).json({ error: 'Nome e descrição são obrigatórios' });
  }

  try {
    const { rows: existing } = await db.query(
      'SELECT 1 FROM oficinas WHERE oficinaid = $1',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Oficina não encontrada' });
    }

    await db.query(`
      UPDATE oficinas 
      SET nome = $1, descricao = $2, duracao = $3, status = $4, isfavorito = $5, atualizadoem = NOW()
      WHERE oficinaid = $6
    `, [nome, descricao, duracao, status, isFavorito, id]);

    res.json({
      id: Number(id),
      nome,
      descricao,
      duracao,
      status,
      isFavorito
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar oficina' });
  }
});

app.patch('/api/oficinas/:id/favorito', async (req, res) => {
  const { id } = req.params;
  const { isFavorito } = req.body;

  try {
    const { rows: existing } = await db.query(
      'SELECT 1 FROM oficinas WHERE oficinaid = $1',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Oficina não encontrada' });
    }

    await db.query(
      'UPDATE oficinas SET isfavorito = $1, atualizadoem = NOW() WHERE oficinaid = $2',
      [isFavorito, id]
    );

    res.json({ message: 'Favorito atualizado', isFavorito });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar favorito' });
  }
});

app.delete('/api/oficinas/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await db.query(
      'SELECT 1 FROM oficinas WHERE oficinaid = $1',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Oficina não encontrada' });
    }

    await db.query('DELETE FROM oficinas WHERE oficinaid = $1', [id]);

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar oficina' });
  }
});

// ROTAS DE AUTENTICAÇÃO
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);


   // ROTAS DE CADASTRO

const cadastroRoutes = require('./routes/cadastroRoutes');
app.use('/api', cadastroRoutes);

    // ROTAS DE PERFIL
const perfilRoutes = require('./routes/perfilRoutes');
app.use('/api', perfilRoutes);

// FALLBACK
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// START SERVER
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
