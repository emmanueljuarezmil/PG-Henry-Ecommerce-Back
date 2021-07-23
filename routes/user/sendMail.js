const { Router } = require('express');
const { sendMail } = require('../../control/user/sendMail');
const router = Router();

router.post('/user/sendmail', sendMail);

module.exports = router;
