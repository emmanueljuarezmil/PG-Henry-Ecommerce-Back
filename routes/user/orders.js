const { Router } = require('express');
const { getAllOrders, userOrders, getOrderById, updateOrder } = require('../../control/user/orders.js')  //importar funciones para orders

const router = Router();

router.get('/orders/users/:idUser', userOrders);
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);
rotuer.put('/orders/:id', updateOrder)

module.exports = router;