const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

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

module.exports = {
  checkJwt
}