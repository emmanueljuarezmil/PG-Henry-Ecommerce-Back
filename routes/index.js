const express = require('express');
const router = express.Router();


/* GET landing */
router.get('/', require('./default/index'));

module.exports = router;
