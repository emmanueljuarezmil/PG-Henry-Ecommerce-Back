const { Router } = require('express');
const { getAllOrders, userOrders, getOrderById, updateOrder, updateOrderStatus, updateShipStatus } = require('../../control/user/orders.js')  //importar funciones para orders
const {checkJwt, isAdmin, isAuth} = require('../../control/auth/index.js')

const   router = Router();

router.put('/orders', checkJwt, isAdmin, updateShipStatus)
router.get('/orders', checkJwt, isAdmin, getAllOrders);
router.get('/orders/users/:idUser', checkJwt, isAuth, userOrders);
router.get('/orders/:id', checkJwt, isAuth, getOrderById);
router.put('/orders/:UserId', checkJwt, isAuth, updateOrder)

module.exports = router;
