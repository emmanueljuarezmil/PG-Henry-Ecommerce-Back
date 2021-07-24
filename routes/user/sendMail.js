const { Router } = require('express');
const { sendMail } = require('../../control/user/sendMail');
const router = Router();

router.get('/user/sendmail', sendMail);

module.exports = router;
