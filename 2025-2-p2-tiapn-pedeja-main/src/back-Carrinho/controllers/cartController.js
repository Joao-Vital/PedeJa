const cartService = require('../services/cartService');

async function getCart(req, res, next) {
  try {
    const cart = await cartService.getOrCreateCart(req.user.id);
    res.json(cart);
  } catch (error) {
    next(error);
  }
}

async function addItem(req, res, next) {
  try {
    const cart = await cartService.addItem(req.user.id, req.body);
    res.status(201).json(cart);
  } catch (error) {
    next(error);
  }
}

async function updateItem(req, res, next) {
  try {
    const itemId = Number(req.params.itemId);
    const cart = await cartService.updateItem(req.user.id, itemId, req.body);
    res.json(cart);
  } catch (error) {
    next(error);
  }
}

async function removeItem(req, res, next) {
  try {
    const itemId = Number(req.params.itemId);
    const cart = await cartService.removeItem(req.user.id, itemId);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
};
