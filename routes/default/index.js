const { Router } = require('express');
const {getProducts, getProductsById, addProduct, updateProduct, deleteProduct, fullDbproducts} = require('../../control/default/products.js')
const {jwtCheck} = require('../../control/auth/index.js')

const router = Router();

/* GET default landing. */
router.get('/', function(req, res, ) {
    res.send('respond with a resource');
  });

  
router.get('/products', getProducts);
router.get('/products/p/:idProduct', getProductsById);
router.post('/products', addProduct);
router.put('/products/update',jwtCheck, updateProduct);
router.delete('/products', deleteProduct);
router.get('/prod', fullDbproducts);



module.exports = router;