const { Router } = require('express');
const {getProducts, getProductsById, addProduct, updateProduct, deleteProduct, fullDbproducts} = require('../../control/default/products.js')
const {jwtCheck, isAdmin, isAuth} = require('../../control/auth/index.js')

const router = Router();
  
router.get('/products', getProducts);
router.get('/products/p/:idProduct', getProductsById);
router.post('/products', addProduct);
router.put('/products/update', updateProduct);
router.delete('/products', deleteProduct);
router.get('/prod', fullDbproducts);



module.exports = router;