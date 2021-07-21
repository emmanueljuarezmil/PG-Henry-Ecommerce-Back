#!/usr/bin/env node

/**
 * Module dependencies.
 */
const { conn } = require('../db.js');
const app = require('../app');
const debug = require('debug')('pg-henry-ecommerce-back:server');
const http = require('http');

const { fullDbproducts } = require('../control/default/products')
const { fulldbCat } = require('../control/default/category')

/**
 * Get port from environment and store in Express.
 */

let port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
// Ya acomodado con sinq a la db

// definir force como true en .env para trabajar con la base de datos como no persistente, sino por default esta enfalse 
const force = (process.env.FORCE || false)

conn.sync({force}).then(() =>
server.on('error', onError),
server.on('listening', onListening),
server.listen(port)
)
.then(() => force ? fulldbCat() : null)
.then(() => force ? fullDbproducts() : null)
.then(() => force ? console.log('Productos y categorias precargados en la base de datos') : null)
.then(() => console.log(`funciona en el ${port}`))
.catch(err => console.log(err))


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
