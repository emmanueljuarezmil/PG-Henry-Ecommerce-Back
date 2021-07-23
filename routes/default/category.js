const { Router } = require('express');
const {productsByCategory, prodByCatId, newCategory, addOrDeleteCategory, updateCategory, deleteCategory, getAllCategories, fulldbCat} = require('../../control/default/category.js')  // importar funcion para categorias
const {checkJwt, isAdmin, isAuth} = require('../../control/auth/index.js')


const router = Router();


router.get('/category/p_name/:catName', productsByCategory); //tiene que devolver los productos de esa categoria
router.get('/category/p_id/:id',prodByCatId)
router.post('/category', checkJwt, isAdmin, newCategory); 
router.get('/categories', getAllCategories)
router.put('/category/product', checkJwt, isAdmin, addOrDeleteCategory);  //para agregar o sacar una categoria al producto
router.put('/category/update', checkJwt, isAdmin, updateCategory);
router.delete('/category/:id', checkJwt, isAdmin, deleteCategory);
router.get('/categories/bring', fulldbCat); // para precargar las categorias de una, vamos a usarla solo una vez porque el force va a estar en false



module.exports = router;
