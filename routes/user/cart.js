const { Router } = require('express');
const {getAllCartItems,addCartItem,getCartEmpty,editCartQuantity} = require('../../control/user/cart.js')  //importar funciones para reviews



const router = Router();

router.get('/users/:idUser/cart', getAllCartItems);
router.post('/users/:idUser/cart', addCartItem);
router.delete('/users/:idUser/cart', getCartEmpty);
router.put('/users/:idUser/cart', editCartQuantity);


module.exports = router;