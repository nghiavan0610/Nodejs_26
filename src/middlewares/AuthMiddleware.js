const jwt = require('jsonwebtoken');
const User = require('../app/models/User');

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.status(401).json({message: 'Not authorized'});
      } 

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findByPk(decoded.id);
      next();
    
      
    
  } catch (error) {
    next(error);
  }
};

module.exports = protect;
