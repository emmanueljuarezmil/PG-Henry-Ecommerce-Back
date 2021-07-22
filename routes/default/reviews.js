const { Router } = require('express');
const {getProductReview, newReview, updateReview, deleteReview} = require('../../control/default/reviews.js')  //importar funciones para reviews
const {checkJwt, isAdmin, isAuth} = require('../../control/auth/index.js')


const router = Router();


//router.get('/review/:idProduct', getProductReview);   // la ruta decia que sea /product != de la de products
router.post('/review/:idUser', checkJwt, isAuth, newReview);
router.put('/review/:idReview', checkJwt, isAuth, updateReview);
router.delete('/review/:idReview', checkJwt, isAuth, deleteReview)


module.exports = router;