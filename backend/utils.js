const jwt = require('jsonwebtoken');
const ejwt = require('express-jwt');
const jwtDecode = require('jwt-decode');

const createToken = (user) => {
  if (!user.role) {
    throw new Error('No user role specified');
  }
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      iss: 'api.hermes',
      aud: 'api.hermes',
    },
    process.env.JWT_SECRET,
    { algorithm: 'HS256', expiresIn: '1h' }
  );
};

const requireAdmin = (req, res, next) => {
  const {role} = req.user;
  if (role !== 'admin'){
    return res.status(401).json({message: 'insufficient role'})
  }
  next();
};

const attachUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token){
    return res.status(401).json({message: 'Authentication required'})
  }
  const decodedToken = jwtDecode(token);

  if(!decodedToken){
    return res.status(401).json({message: 'There was a problem with authorization'})
  }
  else{
    req.user = decodedToken;
    next();
  }
};

const checkJwt = ejwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  ignoreExpiration: true,
  getToken: req => req.cookies.token
});

module.exports = {
    createToken,
    requireAdmin,
    attachUser,
    checkJwt
};