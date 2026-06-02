const { query } = require('../config/database');

function normalizeProduct(row) {
  if (!row) return null;
  const preco = Number(row.preco);
  const imagemUrl = row.imagemUrl || null;
  const categoriaId = row.categoriaId || null;
  return {
    id: row.id,
    nome: row.nome,
    descricao: row.descricao,
    preco,
    Preco: preco,
    foto: imagemUrl,
    ImagemUrl: imagemUrl,
    categoriaId,
    CategoriaId: categoriaId,
    categoria: row.categoriaNome || null,
    Categoria: row.categoriaNome || null,
    disponivel: row.disponivel === 1,
    criadoEm: row.criadoEm || null,
    atualizadoEm: row.atualizadoEm || null,
  };
}

async function findById(produtoId, includeInativos = false) {
  const result = await query(
    `SELECT p.ProdutoId   AS id,
            p.Nome        AS nome,
            p.Descricao   AS descricao,
            p.Preco       AS preco,
            p.ImagemUrl   AS imagemUrl,
            p.Disponivel  AS disponivel,
            p.CategoriaId AS categoriaId,
            p.CriadoEm    AS criadoEm,
            p.AtualizadoEm AS atualizadoEm,
            c.Nome        AS categoriaNome
     FROM Produtos p
     LEFT JOIN CategoriasProduto c ON c.CategoriaId = p.CategoriaId
     WHERE p.ProdutoId = @ProdutoId
       ${includeInativos ? '' : 'AND p.Disponivel = 1'}`,
    [{ name: 'ProdutoId', value: produtoId }]
  );

  return normalizeProduct(result.recordset[0]);
}

async function listAll() {
  const result = await query(
    `SELECT p.ProdutoId   AS id,
            p.Nome        AS nome,
            p.Descricao   AS descricao,
            p.Preco       AS preco,
            p.ImagemUrl   AS imagemUrl,
            p.Disponivel  AS disponivel,
            p.CategoriaId AS categoriaId,
            p.CriadoEm    AS criadoEm,
            p.AtualizadoEm AS atualizadoEm,
            c.Nome        AS categoriaNome
     FROM Produtos p
     LEFT JOIN CategoriasProduto c ON c.CategoriaId = p.CategoriaId
     WHERE p.Disponivel = 1
     ORDER BY c.Nome, p.Nome`
  );

  return result.recordset.map(normalizeProduct);
}

async function listByCategory(categoria) {
  const isNumeric = Number.isInteger(Number(categoria));
  const whereClause = isNumeric
    ? 'p.CategoriaId = @CategoriaId'
    : 'LOWER(c.Nome) = LOWER(@CategoriaNome)';

  const params = isNumeric
    ? [{ name: 'CategoriaId', value: Number(categoria) }]
    : [{ name: 'CategoriaNome', value: categoria }];

  const result = await query(
    `SELECT p.ProdutoId   AS id,
            p.Nome        AS nome,
            p.Descricao   AS descricao,
            p.Preco       AS preco,
            p.ImagemUrl   AS imagemUrl,
            p.Disponivel  AS disponivel,
            p.CategoriaId AS categoriaId,
            p.CriadoEm    AS criadoEm,
            p.AtualizadoEm AS atualizadoEm,
            c.Nome        AS categoriaNome
     FROM Produtos p
     LEFT JOIN CategoriasProduto c ON c.CategoriaId = p.CategoriaId
     WHERE p.Disponivel = 1 AND ${whereClause}
     ORDER BY p.Nome`,
    params
  );

  return result.recordset.map(normalizeProduct);
}

async function findDuplicateByName(nome, ignoreId) {
  const params = [{ name: 'Nome', value: nome }];
  let sql = 'SELECT ProdutoId FROM Produtos WHERE LOWER(TRIM(Nome)) = LOWER(TRIM(@Nome))';
  if (ignoreId) {
    sql += ' AND ProdutoId <> @ProdutoId';
    params.push({ name: 'ProdutoId', value: ignoreId });
  }

  const result = await query(sql, params);
  return result.recordset[0] || null;
}

async function getOrCreateCategory(categoriaNome) {
  if (!categoriaNome) {
    return null;
  }

  const normalized = categoriaNome.trim();
  if (!normalized) {
    return null;
  }

  const existing = await query(
    'SELECT CategoriaId FROM CategoriasProduto WHERE LOWER(TRIM(Nome)) = LOWER(TRIM(@Nome)) LIMIT 1',
    [{ name: 'Nome', value: normalized }]
  );

  if (existing.recordset.length) {
    return existing.recordset[0].CategoriaId;
  }

  const result = await query(
    'INSERT INTO CategoriasProduto (Nome, Descricao, Ativo) VALUES (@Nome, NULL, 1)',
    [{ name: 'Nome', value: normalized }]
  );

  return result.insertId;
}

async function createProduct({ nome, descricao, preco, categoriaNome, imagemUrl }) {
  const categoriaId = await getOrCreateCategory(categoriaNome);
  const result = await query(
    `INSERT INTO Produtos (CategoriaId, Nome, Descricao, Preco, ImagemUrl, Disponivel)
     VALUES (@CategoriaId, @Nome, @Descricao, @Preco, @ImagemUrl, 1)`,
    [
      { name: 'CategoriaId', value: categoriaId },
      { name: 'Nome', value: nome },
      { name: 'Descricao', value: descricao },
      { name: 'Preco', value: preco },
      { name: 'ImagemUrl', value: imagemUrl },
    ]
  );

  return findById(result.insertId, true);
}

async function updateProduct(produtoId, { nome, descricao, preco, categoriaNome, imagemUrl }) {
  const categoriaId = await getOrCreateCategory(categoriaNome);

  await query(
    `UPDATE Produtos
     SET CategoriaId = @CategoriaId,
         Nome = @Nome,
         Descricao = @Descricao,
         Preco = @Preco,
         ImagemUrl = @ImagemUrl,
         AtualizadoEm = CURRENT_TIMESTAMP(3)
     WHERE ProdutoId = @ProdutoId`,
    [
      { name: 'CategoriaId', value: categoriaId },
      { name: 'Nome', value: nome },
      { name: 'Descricao', value: descricao },
      { name: 'Preco', value: preco },
      { name: 'ImagemUrl', value: imagemUrl },
      { name: 'ProdutoId', value: produtoId },
    ]
  );

  return findById(produtoId, true);
}

async function deleteProduct(produtoId) {
  const result = await query(
    'DELETE FROM Produtos WHERE ProdutoId = @ProdutoId',
    [{ name: 'ProdutoId', value: produtoId }]
  );

  return result.rowsAffected;
}

module.exports = {
  listAll,
  listByCategory,
  findById,
  findDuplicateByName,
  createProduct,
  updateProduct,
  deleteProduct,
};
