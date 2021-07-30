const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const {User, Order} = require('../../db')
const { v4: uuidv4 } = require('uuid')
const applyMiddlewares = JSON.parse(process.env.APPLY_MIDDLEWARES)
const {jwksUri, issuer, audience} = process.env

const checkJwt = applyMiddlewares ? jwt({
  secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri
}),
audience,
issuer,
algorithms: ['RS256']
}) :
(req,res,next) => next()

const captureUser = async (req, res, next) => {
  if(applyMiddlewares) {
    if(req.headers.username) {
      const {email, username, hashedpassword} = req.headers
      try {
        const isUser = await User.findOne({
          where: {
            email
          }
        })
        if (!isUser) {
          const id = uuidv4()
          await User.create({
            id,
            email,
            userName: username,
            hashedPassword: hashedpassword
          })
        }
      } catch(err) {
        return next(err)
      }
    }
    next()
  }
  else next()
}

const isAuth = async (req, res, next) => {
  if(applyMiddlewares) {
    try {
      if(!req.headers.iduser) return res.status(400).send('Id de usuario no enviado')
      else {
        const user = await User.findByPk(req.headers.iduser)
        if(!user) return res.status(400).send('No existen datos de usuario')
        next()
      }
    } catch(err) {
      console.log('Error de isAuth')
      return res.status(400).send(err)
    }
  }
  else next()
}

const isAdmin = async (req, res, next) => {
  if(applyMiddlewares) {
    try {
      const {iduser} = req.headers
      const user = await User.findByPk(iduser)
      if(!user) return res.status(400).send('No existen datos de usuario')
      if(!user.admin) return res.status(400).send('Usuario sin permisos de admin')
      next()
    } catch(err) {
      return res.status(400).send(err)
    }
  }
  else next()
}

const isVerified = async (req, res, next) => {
  if(applyMiddlewares) {
    try {
      const {iduser} = req.headers
      const user = await User.findByPk(iduser)
      if(!user.authenticatedByCode) return res.status(400).send('Usuario no verificado')
      next()
    } catch(err) {
      return res.status(400).send(err)
    }
  }
  else next()
}

module.exports = {
  checkJwt,
  isAdmin,
  isAuth,
  captureUser,
  isVerified
}