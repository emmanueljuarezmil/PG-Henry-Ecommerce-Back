const { Router } = require('express');
const { checkoutMP } = require('../../control/user/checkout.js')  //importar funciones para reviews


const router = Router();

router.post('/checkout', checkoutMP);

module.exports = router;
