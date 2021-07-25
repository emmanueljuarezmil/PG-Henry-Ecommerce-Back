const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const { auth } = require("express-openid-connect");
const {checkJwt} = require('./control/auth')
const indexRouter = require('./routes/index');


const jwt = require('express-jwt')
const jwks = require('jwks-rsa')

const app = express();
// view engine setup
/* app.set('views', path.join(__dirname, 'views')); */
/* app.use(bodyParser.json()); */

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', (req,res,next) => {
  console.log('req.params: ', req.params)
  console.log('req.body: ', req.body)
  console.log('req.headers: ', req.headers)
  next()
})

app.use('/', indexRouter);

app.use('/', (error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || 'Internal server error'
  return res.status(status).send(message)
})

module.exports = app;