const { Router } = require('express');
const {getProducts, getProductsById, addProduct, updateProduct, deleteProduct, fullDbproducts} = require('../../control/default/products.js')


const router = Router();

/* GET default landing. */
router.get('/', function(req, res, ) {
    res.send('respond with a resource');
  });

  
router.get('/products', getProducts);
router.get('/products/:idProduct', getProductsById);
router.post('/products', addProduct);
router.put('/products/update', updateProduct);
router.delete('/products', deleteProduct);
router.get('/prod', fullDbproducts);



module.exports = router;