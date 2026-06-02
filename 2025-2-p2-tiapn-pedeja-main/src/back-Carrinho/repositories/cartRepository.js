const { query } = require('../config/database');

async function findActiveCartByUser(userId) {
  const result = await query(
    `SELECT CarrinhoId, UsuarioId, Status, CriadoEm, AtualizadoEm
     FROM Carrinhos
     WHERE UsuarioId = @UsuarioId AND Status = 'ativo'
     ORDER BY CarrinhoId DESC
     LIMIT 1`,
    [{ name: 'UsuarioId', value: userId }]
  );

  return result.recordset[0] || null;
}

async function createCart(userId) {
  const insertResult = await query(
    `INSERT INTO Carrinhos (UsuarioId, Status)
     VALUES (@UsuarioId, 'ativo')`,
    [{ name: 'UsuarioId', value: userId }]
  );

  if (!insertResult.insertId) {
    throw new Error('Falha ao criar carrinho.');
  }

  const cart = await query(
    `SELECT CarrinhoId, UsuarioId, Status, CriadoEm, AtualizadoEm
     FROM Carrinhos WHERE CarrinhoId = @CarrinhoId`,
    [{ name: 'CarrinhoId', value: insertResult.insertId }]
  );

  return cart.recordset[0];
}

async function listItems(cartId) {
  const result = await query(
    `SELECT ic.ItemCarrinhoId, ic.CarrinhoId, ic.ProdutoId, ic.Quantidade, ic.PrecoUnitario, ic.Observacao,
            p.Nome AS ProdutoNome, p.Descricao AS ProdutoDescricao, p.ImagemUrl
     FROM ItensCarrinho ic
     INNER JOIN Produtos p ON p.ProdutoId = ic.ProdutoId
     WHERE ic.CarrinhoId = @CarrinhoId
     ORDER BY ic.ItemCarrinhoId`,
    [{ name: 'CarrinhoId', value: cartId }]
  );

  return result.recordset;
}

async function findItemByProduct(cartId, productId) {
  const result = await query(
    `SELECT ItemCarrinhoId, CarrinhoId, ProdutoId, Quantidade, PrecoUnitario
     FROM ItensCarrinho
     WHERE CarrinhoId = @CarrinhoId AND ProdutoId = @ProdutoId`,
    [
      { name: 'CarrinhoId', value: cartId },
      { name: 'ProdutoId', value: productId },
    ]
  );

  return result.recordset[0] || null;
}

async function insertItem(cartId, productId, quantity, price) {
  await query(
    `INSERT INTO ItensCarrinho (CarrinhoId, ProdutoId, Quantidade, PrecoUnitario)
     VALUES (@CarrinhoId, @ProdutoId, @Quantidade, @PrecoUnitario)`,
    [
      { name: 'CarrinhoId', value: cartId },
      { name: 'ProdutoId', value: productId },
      { name: 'Quantidade', value: quantity },
      { name: 'PrecoUnitario', value: price },
    ]
  );
}

async function updateItemQuantity(itemId, quantity) {
  await query(
    `UPDATE ItensCarrinho SET Quantidade = @Quantidade WHERE ItemCarrinhoId = @ItemCarrinhoId`,
    [
      { name: 'Quantidade', value: quantity },
      { name: 'ItemCarrinhoId', value: itemId },
    ]
  );
}

async function removeItem(itemId) {
  await query(
    'DELETE FROM ItensCarrinho WHERE ItemCarrinhoId = @ItemCarrinhoId',
    [{ name: 'ItemCarrinhoId', value: itemId }]
  );
}

async function findItemBelongsToUser(itemId, userId) {
  const result = await query(
    `SELECT ic.ItemCarrinhoId, ic.CarrinhoId, c.UsuarioId
     FROM ItensCarrinho ic
     INNER JOIN Carrinhos c ON c.CarrinhoId = ic.CarrinhoId
     WHERE ic.ItemCarrinhoId = @ItemCarrinhoId AND c.UsuarioId = @UsuarioId` ,
    [
      { name: 'ItemCarrinhoId', value: itemId },
      { name: 'UsuarioId', value: userId },
    ]
  );

  return result.recordset[0] || null;
}

module.exports = {
  findActiveCartByUser,
  createCart,
  listItems,
  findItemByProduct,
  insertItem,
  updateItemQuantity,
  removeItem,
  findItemBelongsToUser,
};
