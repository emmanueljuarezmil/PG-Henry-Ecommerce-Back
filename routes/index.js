const {Router} = require('express');


const admin = require('./admin/index');
const user = require('./user/users');
const products = require('./default/index');
const categories = require('./default/category');
const reviews = require('./default/reviews');
const orders = require('./user/orders');
const cart = require('./user/cart');
const checkout = require('./user/checkout');

const router = Router();


router.use('/', cart); // check fer
router.use('/', products); // check emma
router.use('/', categories); // check emma
router.use('/', reviews); // in progress fer
router.use('/', user); // check emma
router.use('/', admin); 
router.use('/', orders);
router.use('/', checkout);

module.exports = router;
