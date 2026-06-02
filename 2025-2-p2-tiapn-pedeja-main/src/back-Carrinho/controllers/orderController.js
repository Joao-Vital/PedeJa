const orderService = require('../services/orderService');

async function getCheckoutSummary(req, res, next) {
  try {
    const summary = await orderService.getCheckoutSummary(req.user.id);
    res.json(summary);
  } catch (error) {
    next(error);
  }
}

async function finalizeOrder(req, res, next) {
  try {
    const pedido = await orderService.finalizeOrder(req.user.id, req.body);
    res.status(201).json(pedido);
  } catch (error) {
    next(error);
  }
}

async function getLatestOrderStatus(req, res, next) {
  try {
    const pedido = await orderService.getLatestOrderStatus(req.user.id);
    res.json(pedido);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCheckoutSummary,
  finalizeOrder,
  getLatestOrderStatus,
};
