const jwt = require('jsonwebtoken');

const maxAge = 3 * 60 * 60;
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: maxAge });
};

module.exports = generateToken;
