const { Router } = require('express');
const { getAllOrders, userOrders, getOrderById } = require('../../control/user/orders.js')  //importar funciones para orders

const router = Router();

router.get('/orders/users/:idUser', userOrders);
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);

module.exports = router;