const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.get('/checkout', orderController.getCheckoutSummary);
router.get('/latest', orderController.getLatestOrderStatus);
router.post('/', orderController.finalizeOrder);

module.exports = router;
