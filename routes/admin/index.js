const express = require('express');
const router = express.Router();

/* GET default landing. */
router.get('/', function(req, res, next) {
  res.status(200).send({status:200})
});

module.exports = router;