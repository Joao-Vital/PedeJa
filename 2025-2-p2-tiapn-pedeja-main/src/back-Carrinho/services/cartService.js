const HttpError = require('../errors/HttpError');
const cartRepository = require('../repositories/cartRepository');
const productRepository = require('../repositories/productRepository');

function ensurePositiveInteger(value, fieldName) {
  const numericValue = Number(value);
  if (!Number.isInteger(numericValue) || numericValue <= 0) {
    throw new HttpError(400, `${fieldName} deve ser um número inteiro maior que zero.`);
  }
  return numericValue;
}

function mapCartResponse(cart, items) {
  const subtotal = items.reduce((acc, item) => acc + Number(item.PrecoUnitario) * item.Quantidade, 0);
  const desconto = 0;
  const taxas = 0;
  const total = subtotal - desconto + taxas;

  return {
    carrinhoId: cart.CarrinhoId,
    itens: items.map((item) => ({
      itemCarrinhoId: item.ItemCarrinhoId,
      produtoId: item.ProdutoId,
      nome: item.ProdutoNome,
      descricao: item.ProdutoDescricao,
      imagemUrl: item.ImagemUrl,
      quantidade: item.Quantidade,
      precoUnitario: Number(item.PrecoUnitario),
      totalItem: Number(item.PrecoUnitario) * item.Quantidade,
    })),
    resumo: {
      subtotal,
      desconto,
      taxas,
      total,
    },
  };
}

async function getOrCreateCart(userId) {
  let cart = await cartRepository.findActiveCartByUser(userId);
  if (!cart) {
    cart = await cartRepository.createCart(userId);
  }
  const items = await cartRepository.listItems(cart.CarrinhoId);
  return mapCartResponse(cart, items);
}

async function addItem(userId, { produtoId, quantidade }) {
  const productId = ensurePositiveInteger(produtoId, 'produtoId');
  const qty = ensurePositiveInteger(quantidade || 1, 'quantidade');

  const product = await productRepository.findById(productId);
  if (!product) {
    throw new HttpError(404, 'Produto não encontrado ou indisponível.');
  }

  const cart = await cartRepository.findActiveCartByUser(userId) || (await cartRepository.createCart(userId));
  const existingItem = await cartRepository.findItemByProduct(cart.CarrinhoId, productId);

  if (existingItem) {
    const newQty = existingItem.Quantidade + qty;
    await cartRepository.updateItemQuantity(existingItem.ItemCarrinhoId, newQty);
  } else {
    await cartRepository.insertItem(cart.CarrinhoId, productId, qty, Number(product.Preco));
  }

  const items = await cartRepository.listItems(cart.CarrinhoId);
  return mapCartResponse(cart, items);
}

async function updateItem(userId, itemId, { quantidade }) {
  const validItemId = ensurePositiveInteger(itemId, 'itemId');
  const item = await cartRepository.findItemBelongsToUser(validItemId, userId);
  if (!item) {
    throw new HttpError(404, 'Item não encontrado no carrinho informado.');
  }

  const qty = ensurePositiveInteger(quantidade, 'quantidade');
  await cartRepository.updateItemQuantity(validItemId, qty);

  const cart = await cartRepository.findActiveCartByUser(userId);
  const items = await cartRepository.listItems(cart.CarrinhoId);
  return mapCartResponse(cart, items);
}

async function removeItem(userId, itemId) {
  const validItemId = ensurePositiveInteger(itemId, 'itemId');
  const item = await cartRepository.findItemBelongsToUser(validItemId, userId);
  if (!item) {
    throw new HttpError(404, 'Item não encontrado no carrinho informado.');
  }

  await cartRepository.removeItem(validItemId);
  const cart = await cartRepository.findActiveCartByUser(userId);
  const items = await cartRepository.listItems(cart.CarrinhoId);
  return mapCartResponse(cart, items);
}

module.exports = {
  getOrCreateCart,
  addItem,
  updateItem,
  removeItem,
};
