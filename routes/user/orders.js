const { Router } = require('express');
const { getAllOrders, userOrders, getOrderById, updateOrder, updateOrderStatus } = require('../../control/user/orders.js')  //importar funciones para orders
const {checkJwt, isAdmin, isAuth} = require('../../control/auth/index.js')

const router = Router();

router.get('/orders/users/:idUser', checkJwt, isAuth, userOrders);
router.get('/orders', checkJwt, isAdmin, getAllOrders);
router.get('/orders/:id', checkJwt, isAuth, getOrderById);
router.put('/orders/:id', checkJwt, isAuth, updateOrder);
router.put('/orderStatus/:UserId',checkJwt, isAuth, updateOrderStatus);

module.exports = router;
