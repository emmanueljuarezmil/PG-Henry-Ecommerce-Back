const {Router} = require('express');

const user = require('./user/users');
const products = require('./default/index');
const categories = require('./default/category');
const reviews = require('./default/reviews');
const orders = require('./user/orders');
const cart = require('./user/cart');
const checkout = require('./user/checkout');
const sendMail = require('./user/sendMail')

const router = Router();

router.get('/', (req,res,next) => {
    return res.send('Response with a resource')
})
router.use('/', cart); // check fer
router.use('/', products); // check emma
router.use('/', categories); // check emma
router.use('/', reviews); // check fer
router.use('/', user); // check emma
router.use('/', orders); // check emma
router.use('/', checkout); //
router.use('/', sendMail)

module.exports = router;
