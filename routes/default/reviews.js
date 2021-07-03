const { Router } = require('express');
const {getProductReview, newReview, updateReview, deleteReview} = require('../../control/default/reviews.js')  //importar funciones para reviews



const router = Router();


router.get('/product/:idProduct/review', getProductReview);   // la ruta decia que sea /product != de la de products
router.post('product/:idProduct/review', newReview);
router.put('/product/:idProduct/review/:idReview', updateReview);
router.delete('/product/:idProduct/review/:idReview', deleteReview)


module.exports = router;