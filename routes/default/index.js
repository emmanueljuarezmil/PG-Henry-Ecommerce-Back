const { Router } = require('express');
const {getProducts, getProductsById, addProduct, updateProduct, deleteProduct, fullDbproducts} = require('../../control/default/products.js')
const {jwtCheck, isAdmin, isAuth, captureUser} = require('../../control/auth/index.js')

const router = Router();

/* GET default landing. */
router.get('/', function(req, res, ) {
    res.send('respond with a resource');
  });

  
router.get('/products', getProducts);
router.get('/products/p/:idProduct', getProductsById);
router.post('/products',isAuth, isAdmin, addProduct);
router.put('/products/update',isAuth, isAdmin, updateProduct);
router.delete('/products',isAuth, isAdmin, deleteProduct);
router.get('/prod', fullDbproducts);



module.exports = router;