const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

router.get('/', orderController.getOrderList);
router.put('/:id', orderController.updateOrder);

module.exports = router;
