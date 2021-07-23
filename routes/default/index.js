const { Router } = require('express');
const {getProducts, getProductsById, addProduct, updateProduct, deleteProduct, fullDbproducts} = require('../../control/default/products.js')
const {checkJwt, isAdmin, isAuth} = require('../../control/auth/index.js')

const router = Router();
  
router.get('/products', getProducts);
router.get('/products/p/:idProduct', getProductsById);
router.post('/products', checkJwt, isAdmin, addProduct);
router.put('/products/update', checkJwt, isAdmin, updateProduct);
router.delete('/products',checkJwt, isAdmin, deleteProduct);
router.get('/prod', fullDbproducts);



module.exports = router;