const jwt = require('jsonwebtoken')

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

module.exports = {
    createToken,
};