const jwt = require('jsonwebtoken');
const Order_detail = require('../app/models/Order_detail');
const User = require('../app/models/User');

const { QueryTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const {
  multipleSequelizeToJSON,
  sequelizeToJSON,
} = require('../ulti/sequelize');

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.redirect('/login');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await sequelize.query(
      'select *, (select sum(Order_detail.quantity) from Order_detail where Order_detail.user_id = `User`.user_id and Order_detail.order_id is null) as amount_cart from `User` where `User`.user_id = :id',
      {
        type: QueryTypes.SELECT,
        replacements: { id: decoded.id },
      },
    );

    req.user = user[0];
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = protect;
