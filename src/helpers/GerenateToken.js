const jwt = require('jsonwebtoken');
const configs = require('../config/env/index');

const maxAge = 3 * 60 * 60;
const generateToken = (id) => {
  return jwt.sign({ id }, configs.JWT_SECRET, { expiresIn: maxAge });
};

module.exports = generateToken;
