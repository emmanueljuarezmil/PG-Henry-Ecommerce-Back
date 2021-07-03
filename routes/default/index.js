const { Router } = require('express');
const {getProducts, getProductsById, addProduct, updateProduct, deleteProduct} = require('../../control/default/products.js')


const router = Router();

/* GET default landing. */
router.get('/', function(req, res, ) {
    res.send('respond with a resource');
  });

  
router.get('/products', getProducts);
router.get('/products/:idProduct', getProductsById);
router.post('/products', addProduct);
router.put('/products/:id', updateProduct);
router.delete('./products/:id', deleteProduct);




module.exports = router;