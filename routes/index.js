const {Router} = require('express');

const admin = require('./admin/index');
const user = require('./user/users');
const products = require('./default/index');
const categories = require('./default/category');
const reviews = require('./default/reviews');
const orders = require('./user/orders');
const cart = require('./user/cart');

const router = Router();


router.use('/', products);
router.use('/', categories);
router.use('/', reviews);
router.use('/', user);
router.use('/', admin); 
router.use('/', orders);
router.use('/', cart);


module.exports = router;
