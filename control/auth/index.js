const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const {User, Order} = require('../../db')
const { v4: uuidv4 } = require('uuid');

// const checkJwt = jwt({
//   secret: jwks.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: `https://YOUR_DOMAIN/.well-known/jwks.json`
//   }),

//   // Validate the audience and the issuer.
//   audience: 'YOUR_API_IDENTIFIER',
//   issuer: [`https://localhost:3000`],
//   algorithms: ['RS256']
// });

const checkJwt = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 50,
    jwksUri: `https://dev-8yg4kp4m.us.auth0.com/.well-known/jwks.json`
  }),
// Validate the audience and the issuer.
  audience: 'localhost:3000',
  issuer: [`https://dev-8yg4kp4m.us.auth0.com/`],
  algorithms: ['RS256']
});

const captureUser = async (req, res, next) => {
  console.log('headers: ', req.headers)
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

const isAuth = async (req, res, next) => {
  if(!req.headers.idUser) return res.status(400).send('No existen datos de usuario')
  if(req.headers.idUser) {
    const user = await User.findByPk(req.headers.idUser)
    if(!user) return res.status(400).send('No existen datos de usuario')
    else next()
  }
  // if(req.headers.Authorization) {
  //   const user = await User.findByPk(req.headers.id)
  //   if(!user) return res.status(400).send('No existen datos de usuario')
  // }
  else next()
}

const isAdmin = async (req, res, next) => {
  const {idUser} = req.headers
  const user = await User.findByPk(idUser)
  if(user && user.admin) next()
  else return res.status(401).send('No autorizado')
}

module.exports = {
  checkJwt,
  isAdmin,
  isAuth,
  captureUser
}