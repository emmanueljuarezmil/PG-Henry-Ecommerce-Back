const { Router } = require('express');
const { addCartItem, getCartEmpty, getAllCartItems, editCartQuantity, deleteCartItem } = require('../../control/user/cart')  //importar funciones para reviews
const {checkJwt, isAdmin, isAuth} = require('../../control/auth/index.js')


const router = Router();

router.get('/cart/:idUser', checkJwt, isAuth, getAllCartItems);
router.post('/cart/:idUser', checkJwt, isAuth, addCartItem);
router.delete('/cart/item', checkJwt, isAuth, deleteCartItem);
router.delete('/cart/:idUser', checkJwt, isAuth, getCartEmpty);
router.put('/cart/:idUser', checkJwt, isAuth, editCartQuantity);


module.exports = router;