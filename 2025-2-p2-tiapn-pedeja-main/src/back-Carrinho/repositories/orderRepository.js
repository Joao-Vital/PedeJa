const { getConnection, query } = require('../config/database');

async function createOrderFromCart({
  userId,
  cartId,
  formaPagamento,
  resumo,
  itens,
}) {
  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    const [orderResult] = await connection.execute(
      `INSERT INTO Pedidos (
        CarrinhoId,
        UsuarioId,
        FormaPagamento,
        StatusAtual,
        Subtotal,
        TaxaServico,
        Total
      )
      VALUES (
        :CarrinhoId,
        :UsuarioId,
        :FormaPagamento,
        :StatusAtual,
        :Subtotal,
        :TaxaServico,
        :Total
      )`,
      {
        CarrinhoId: cartId,
        UsuarioId: userId,
        FormaPagamento: formaPagamento,
        StatusAtual: 'Aceito',
        Subtotal: resumo.subtotal,
        TaxaServico: resumo.taxas,
        Total: resumo.total,
      }
    );

    const pedidoId = orderResult.insertId;

    const [pedidoRows] = await connection.execute(
      `SELECT PedidoId,
              UsuarioId,
              CodigoLocalizador,
              FormaPagamento,
              StatusAtual,
              DataPedido,
              Total,
              Subtotal,
              TaxaServico
       FROM Pedidos
       WHERE PedidoId = :PedidoId`,
      { PedidoId: pedidoId }
    );

    const pedido = pedidoRows[0];

    for (const item of itens) {
      await connection.execute(
        `INSERT INTO ItensPedido (
          PedidoId,
          ProdutoId,
          NomeProduto,
          Quantidade,
          PrecoUnitario,
          Observacao
        )
        VALUES (
          :PedidoId,
          :ProdutoId,
          :NomeProduto,
          :Quantidade,
          :PrecoUnitario,
          :Observacao
        )`,
        {
          PedidoId: pedido.PedidoId,
          ProdutoId: item.produtoId,
          NomeProduto: item.nome,
          Quantidade: item.quantidade,
          PrecoUnitario: item.precoUnitario,
          Observacao: item.observacao || null,
        }
      );
    }

    await connection.execute(
      `INSERT INTO HistoricoStatusPedido (PedidoId, StatusPedido, Observacao)
       VALUES (:PedidoId, :StatusPedido, :Observacao)`,
      {
        PedidoId: pedido.PedidoId,
        StatusPedido: 'Aceito',
        Observacao: null,
      }
    );

    await connection.execute(
      `UPDATE Carrinhos
       SET Status = 'convertido', AtualizadoEm = CURRENT_TIMESTAMP
       WHERE CarrinhoId = :CarrinhoId`,
      { CarrinhoId: cartId }
    );

    await connection.execute(
      `DELETE FROM ItensCarrinho WHERE CarrinhoId = :CarrinhoId`,
      { CarrinhoId: cartId }
    );

    await connection.commit();
    return pedido;
  } catch (error) {
    await connection.rollback().catch((rollbackErr) => {
      console.error('[Pedidos] Falha ao reverter transação:', rollbackErr.message);
    });
    throw error;
  } finally {
    connection.release();
  }
}

async function findLatestOrderByUser(userId) {
  const result = await query(
    `SELECT PedidoId,
            UsuarioId,
            CarrinhoId,
            CodigoLocalizador,
            FormaPagamento,
            StatusAtual,
            Subtotal,
            TaxaServico,
            Total,
            DataPedido
     FROM Pedidos
     WHERE UsuarioId = @UsuarioId
     ORDER BY DataPedido DESC, PedidoId DESC
     LIMIT 1`,
    [{ name: 'UsuarioId', value: userId }]
  );

  return result.recordset[0] || null;
}

async function listOrderItems(pedidoId) {
  const result = await query(
    `SELECT ip.ItemPedidoId,
            ip.PedidoId,
            ip.ProdutoId,
            ip.NomeProduto,
            ip.Quantidade,
            ip.PrecoUnitario,
            ip.Observacao,
            p.ImagemUrl
     FROM ItensPedido ip
     LEFT JOIN Produtos p ON p.ProdutoId = ip.ProdutoId
     WHERE ip.PedidoId = @PedidoId
     ORDER BY ip.ItemPedidoId`,
    [{ name: 'PedidoId', value: pedidoId }]
  );

  return result.recordset;
}

async function listOrderHistory(pedidoId) {
  const result = await query(
    `SELECT HistoricoId,
            PedidoId,
            StatusPedido,
            Observacao,
            RegistradoEm
     FROM HistoricoStatusPedido
     WHERE PedidoId = @PedidoId
     ORDER BY RegistradoEm ASC, HistoricoId ASC`,
    [{ name: 'PedidoId', value: pedidoId }]
  );

  return result.recordset;
}

async function listStatusDefinitions() {
  const result = await query(
    `SELECT StatusId,
            Nome,
            OrdemEtapa
     FROM StatusPedido
     WHERE Ativo = 1
     ORDER BY OrdemEtapa ASC, StatusId ASC`
  );

  return result.recordset;
}

module.exports = {
  createOrderFromCart,
  findLatestOrderByUser,
  listOrderItems,
  listOrderHistory,
  listStatusDefinitions,
};
