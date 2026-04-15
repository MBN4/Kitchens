const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrderById);
router.get('/customer/:userId', orderController.getCustomerOrders);
router.get('/chef/:chefId', orderController.getChefOrders);
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;