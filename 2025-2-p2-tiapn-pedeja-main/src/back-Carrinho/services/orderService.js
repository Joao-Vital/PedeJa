const HttpError = require('../errors/HttpError');
const cartRepository = require('../repositories/cartRepository');
const orderRepository = require('../repositories/orderRepository');

const PAYMENT_METHODS = ['Cartão', 'Pix', 'Dinheiro'];
const DEFAULT_STATUS_FLOW = [
  {
    nome: 'Aceito',
    descricao: 'Pedido foi aceito pelo estabelecimento.',
    ordemEtapa: 1,
  },
  {
    nome: 'Preparando',
    descricao: 'Equipe está preparando os seus itens.',
    ordemEtapa: 2,
  },
  {
    nome: 'Pronto',
    descricao: 'Pedido pronto para retirada ou entrega.',
    ordemEtapa: 3,
  },
];

function ensurePaymentMethod(formaPagamento) {
  const sanitized = String(formaPagamento || '').trim();
  if (!PAYMENT_METHODS.includes(sanitized)) {
    throw new HttpError(400, 'Forma de pagamento inválida.');
  }
  return sanitized;
}

function buildSummary(items) {
  const subtotal = items.reduce((acc, item) => acc + Number(item.PrecoUnitario) * item.Quantidade, 0);
  const desconto = 0;
  const taxas = 0;
  const total = subtotal - desconto + taxas;

  return {
    itens: items.map((item) => ({
      itemCarrinhoId: item.ItemCarrinhoId,
      produtoId: item.ProdutoId,
      nome: item.ProdutoNome,
      descricao: item.ProdutoDescricao,
      imagemUrl: item.ImagemUrl,
      quantidade: item.Quantidade,
      precoUnitario: Number(item.PrecoUnitario),
      observacao: item.Observacao,
      totalItem: Number(item.PrecoUnitario) * item.Quantidade,
    })),
    resumo: {
      subtotal,
      desconto,
      taxas,
      total,
    },
    totalItens: items.reduce((acc, item) => acc + item.Quantidade, 0),
  };
}

async function getCheckoutSummary(userId) {
  const cart = await cartRepository.findActiveCartByUser(userId);
  if (!cart) {
    throw new HttpError(404, 'Nenhum carrinho ativo foi localizado.');
  }

  const items = await cartRepository.listItems(cart.CarrinhoId);
  if (!items.length) {
    throw new HttpError(400, 'Seu carrinho está vazio. Adicione itens antes de prosseguir.');
  }

  const summary = buildSummary(items);
  return {
    carrinhoId: cart.CarrinhoId,
    totalItens: summary.totalItens,
    itens: summary.itens,
    resumo: summary.resumo,
    formasPagamento: PAYMENT_METHODS,
  };
}

async function finalizeOrder(userId, { formaPagamento }) {
  const cart = await cartRepository.findActiveCartByUser(userId);
  if (!cart) {
    throw new HttpError(404, 'Nenhum carrinho ativo foi localizado.');
  }

  const items = await cartRepository.listItems(cart.CarrinhoId);
  if (!items.length) {
    throw new HttpError(400, 'Seu carrinho está vazio.');
  }

  const summary = buildSummary(items);
  const payment = ensurePaymentMethod(formaPagamento);

  const pedido = await orderRepository.createOrderFromCart({
    userId,
    cartId: cart.CarrinhoId,
    formaPagamento: payment,
    resumo: summary.resumo,
    itens: summary.itens,
  });

  return {
    pedidoId: pedido.PedidoId,
    codigoLocalizador: pedido.CodigoLocalizador,
    status: pedido.StatusAtual,
    formaPagamento: pedido.FormaPagamento,
    total: summary.resumo.total,
    totalItens: summary.totalItens,
  };
}

function normalizeOrderItems(items) {
  return items.map((item) => ({
    itemPedidoId: item.ItemPedidoId,
    produtoId: item.ProdutoId,
    nome: item.NomeProduto,
    quantidade: item.Quantidade,
    precoUnitario: Number(item.PrecoUnitario),
    totalItem: Number(item.PrecoUnitario) * item.Quantidade,
    observacao: item.Observacao,
    imagemUrl: item.ImagemUrl,
  }));
}

function normalizeHistory(history) {
  return history.map((entry) => ({
    historicoId: entry.HistoricoId,
    status: entry.StatusPedido,
    observacao: entry.Observacao,
    registradoEm: entry.RegistradoEm,
  }));
}

async function getStatusFlow() {
  try {
    const definitions = await orderRepository.listStatusDefinitions();
    if (definitions && definitions.length) {
      return definitions
        .map((status) => {
          const fallback = DEFAULT_STATUS_FLOW.find((item) => item.nome === status.Nome);
          return {
            nome: status.Nome,
            ordemEtapa: status.OrdemEtapa,
            descricao: fallback?.descricao || '',
          };
        })
        .sort((a, b) => a.ordemEtapa - b.ordemEtapa);
    }
  } catch (error) {
    console.warn('[Pedidos] Falha ao obter etapas configuradas, usando padrão.', error.message);
  }

  return DEFAULT_STATUS_FLOW;
}

async function buildOrderStatusResponse(order) {
  const [items, history, etapas] = await Promise.all([
    orderRepository.listOrderItems(order.PedidoId),
    orderRepository.listOrderHistory(order.PedidoId),
    getStatusFlow(),
  ]);

  return {
    pedidoId: order.PedidoId,
    codigoLocalizador: order.CodigoLocalizador,
    statusAtual: order.StatusAtual,
    formaPagamento: order.FormaPagamento,
    dataPedido: order.DataPedido,
    resumo: {
      subtotal: Number(order.Subtotal),
      taxas: Number(order.TaxaServico),
      total: Number(order.Total),
    },
    itens: normalizeOrderItems(items),
    historico: normalizeHistory(history),
    etapas,
  };
}

async function getLatestOrderStatus(userId) {
  const order = await orderRepository.findLatestOrderByUser(userId);
  if (!order) {
    throw new HttpError(404, 'Nenhum pedido foi encontrado para este usuário.');
  }

  return buildOrderStatusResponse(order);
}

module.exports = {
  getCheckoutSummary,
  finalizeOrder,
  getLatestOrderStatus,
};
