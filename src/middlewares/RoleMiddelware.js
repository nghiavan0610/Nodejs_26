const requiredRoles = (...roles) => {
  return (req, res, next) => {
    const user = req.user;

    const isMatched = roles.includes(user.role);

    if (!isMatched) {
      res.status(403);
      throw new Error('No have permission');
    }

    next();
  };
};

module.exports = requiredRoles;
