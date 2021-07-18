const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const {User, Order} = require('../../db')

const checkJwt = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://YOUR_DOMAIN/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: 'YOUR_API_IDENTIFIER',
  issuer: [`https://localhost:3000`],
  algorithms: ['RS256']
});

const captureUser = async (req, res, next) => {
  if(req.headers.userName) {
    const {email, userName, hashedPassword} = req.headers
    try {
      const isUser = await User.findOne({
        where: {
          email
        }
      })
      if (!isUser) {
        const user = await User.create({
          email,
          userName,
          hashedPassword
        })
      }
    } catch(err) {
      console.error(err)
    }
  }
  next()
}

const isAuth = async (req, res, next) => {
  if(!req.headers.id) return res.status(400).send('No existen datos de usuario')
  else next()
}

const isAdmin = async (req, res, next) => {
  const {id} = req.headers
  const user = await User.findByPk(id)
  if(user && user.admin) next()
  else return res.status(401).send('No autorizado')
}

module.exports = {
  checkJwt,
  isAdmin,
  isAuth,
  captureUser
}