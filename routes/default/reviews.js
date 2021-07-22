const { Router } = require('express');
const {getProductReview, newReview, updateReview, deleteReview} = require('../../control/default/reviews.js')  //importar funciones para reviews



const router = Router();


//router.get('/review/:idProduct', getProductReview);   // la ruta decia que sea /product != de la de products
router.post('/review/:idUser', newReview);
router.put('/review/:idReview', updateReview);
router.delete('/review/:idReview', deleteReview)


module.exports = router;