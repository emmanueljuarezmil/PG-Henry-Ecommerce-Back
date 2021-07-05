const { Router } = require('express');
const {productsByCategory, newCategory, addOrDeleteCategory, updateCategory, deleteCategory, getAllCategories} = require('../../control/default/category.js')  // importar funcion para categorias



const router = Router();


router.get('/category/:catName', productsByCategory); //tiene que devolver los productos de esa categoria
router.post('/category', newCategory); 
router.get('/categories', getAllCategories)
router.put('/category/product/:idCategory', addOrDeleteCategory);  //para agregar o sacar una categoria al producto
router.put('/category/:idCategory', updateCategory);
router.delete('/category/:idCategory', deleteCategory);



module.exports = router;