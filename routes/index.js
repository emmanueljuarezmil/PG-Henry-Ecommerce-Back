const {Router} = require('express');

const admin = require('./admin/index');
const user = require('./user/users');
const products = require('./default/index');

const router = Router();
/* GET landing */

router.use('/', products);
/* router.use('/', user);
router.use('/', admin); */


module.exports = router;
