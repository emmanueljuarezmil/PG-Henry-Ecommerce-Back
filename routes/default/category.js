const { Router } = require('express');
const {productsByCategory, newCategory, addOrDeleteCategory, updateCategory, deleteCategory} = require('../../control/default/category.js')  // importar funcion para categorias



const router = Router();

router.get('/products/category/:catName', productsByCategory); //tiene que devolver los productos de esa categoria
router.post('/products/category', newCategory); 
router.post('/products/:idProduct/category/:idCategory', addOrDeleteCategory);  //para agregar o sacar una categoria al producto
router.put('/products/cateory/:idCategory', updateCategory);
router.delete('/products/category/:idCategory', deleteCategory);



module.exports = router;