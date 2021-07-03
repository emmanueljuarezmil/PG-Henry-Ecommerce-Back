const { Router } = require('express');
const {getAllOrders, userOrders, getOrderById, updateOrder} = require('../../control/user/orders.js')  //importar funciones para orders



const router = Router();

router.get('/orders', getAllOrders);
router.get('/users/:idUser/orders', userOrders);
router.get('/orders/:id', getOrderById);
router.put('/orders/:id', updateOrder);


module.exports = router;