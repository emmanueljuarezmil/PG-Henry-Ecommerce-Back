const { Router } = require('express');
const {productsByCategory, prodByCatId, newCategory, addOrDeleteCategory, updateCategory, deleteCategory, getAllCategories, fulldbCat} = require('../../control/default/category.js')  // importar funcion para categorias



const router = Router();


router.get('/category/:catName', productsByCategory); //tiene que devolver los productos de esa categoria
router.get('/category/id',prodByCatId)
router.post('/category', newCategory); 
router.get('/categories', getAllCategories)
router.put('/category/product', addOrDeleteCategory);  //para agregar o sacar una categoria al producto
router.put('/category/update', updateCategory);
router.delete('/category/:idCategory', deleteCategory);
router.get('/categories/bring', fulldbCat); // para precargar las categorias de una, vamos a usarla solo una vez porque el force va a estar en false



module.exports = router;