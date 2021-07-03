const { Router } = require('express');
const {getProducts} = require('../../control/default/products.js')

/* GET default landing. */

const router = Router();

router.get('/products', getProducts);
router.get('/products/:idProduct', getProductsById);
router.post('/products', addProduct);
router.put('/products/:id', updateProduct);
router.delete('./products/:id', deleteProduct);

router.get('/products/category/:catName', productsByCategory); //tiene que devolver los productos de esa categoria
router.post('/products/category', newCategory); 
router.post('/products/:idProduct/category/:idCategory', addOrDeleteCategory);  //para agregar o sacar una categoria al producto
router.put('/product/cateory/:idCategory', updateCategory);
router.delete('/product/category/:idCategory', deleteCategory);


module.exports = router;