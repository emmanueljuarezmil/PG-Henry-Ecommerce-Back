const { Router } = require('express');
const { checkoutMP } = require('../../control/user/checkout.js')  //importar funciones para reviews
const {checkJwt, isAdmin, isAuth} = require('../../control/auth/index.js')

const router = Router();

router.post('/checkout', checkJwt, isAuth, checkoutMP);

module.exports = router;
