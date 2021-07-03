const { Router } = require('express');
const {authMe, login, logout} = require('../../control/admin/auth/auth.js')



const router = Router();


router.get('/auth/me', authMe)
router.post('/auth/login', login);
router.post('/auth/logout', logout);



module.exports = router;