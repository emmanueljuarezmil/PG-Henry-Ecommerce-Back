const { Router } = require('express');
const {getProducts} = require('../../control/default/products.js')

/* GET default landing. */

const router = Router();

router.use('/products', getProducts)


module.exports = router;