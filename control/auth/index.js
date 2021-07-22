const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const {User, Order} = require('../../db')
const { v4: uuidv4 } = require('uuid')
const {APPLY_MIDDLEWARES} = process.env
const applyMiddlewares = JSON.parse(APPLY_MIDDLEWARES)

const checkJwt = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 50,
    jwksUri: `https://dev-8yg4kp4m.us.auth0.com/.well-known/jwks.json`
  }),
  audience: 'localhost:3000',
  issuer: [`https://dev-8yg4kp4m.us.auth0.com/`],
  algorithms: ['RS256']
});

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
        console.error(err)
      }
    }
    next()
  }
  else next()
}

const isAuth = async (req, res, next) => {
  if(applyMiddlewares) {
    if(!req.headers.idUser) return res.status(400).send('Id de usuario no enviado')
    else {
      const user = await User.findByPk(req.headers.idUser)
      if(!user) return res.status(400).send('No existen datos de usuario')
      else next()
    }
  }
  else next()
}

const isAdmin = async (req, res, next) => {
  if(applyMiddlewares) {
    const {idUser} = req.headers
    const user = await User.findByPk(idUser)
    if(user && user.admin) next()
    else return res.status(401).send('No autorizado')
  }
  else next()
}

module.exports = {
  checkJwt,
  isAdmin,
  isAuth,
  captureUser
}