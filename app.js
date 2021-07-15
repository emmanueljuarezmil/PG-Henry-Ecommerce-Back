const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const { auth } = require("express-openid-connect");


//const indexRouter = require('./routes/index');
const cat = require('./routes/default/category')
const ind = require('./routes/default/index.js')
const log = require('./routes/user/users.js')
const cart = require('./routes/user/cart.js')

const app = express();
// view engine setup
/* app.set('views', path.join(__dirname, 'views')); */
/* app.use(bodyParser.json()); */



// app.use(jwtCheck)
// app.use(auth())
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', ind)
app.use('/', cat);
app.use('/', log)
app.use('/', cart)

// app.use('/users', usersRouter);

// catch 404 and forward to error handler
/* app.use(function(req, res, next) {
  next(createError(404));
}); */

/* // error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
}); */

module.exports = app;
