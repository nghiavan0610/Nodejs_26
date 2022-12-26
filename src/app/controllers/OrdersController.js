const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const Food = require('../models/Food');
const Food_type = require('../models/Food_type');
const User = require('../models/User');
const Like_res = require('../models/Like_res');
const Rate_res = require('../models/Rate_res');
const { QueryTypes, Op, where } = require('sequelize');
const { sequelize } = require('../../config/db');

const {
  multipleSequelizeToJSON,
  sequelizeToJSON,
} = require('../../ulti/sequelize');

class OrdersController {
  // [POST] /users/:user_slug/:res_slug/order
  order(req, res, next) {
    console.log(req.body);
    Order.findOrCreate({
      where: { user_id: req.body.user_id },
      defaults: {},
    })
      .then(() => {
        res.redirect('back');
      })
      .catch(next);
  }

  // [GET] /users/:user_slug/:res_slug/order
  show(req, res, next) {
    let rst;
    sequelize
      .query(
        'select *, (select count(Like_res.user_id) from Like_res where Like_res.res_id = Restaurant.res_id) as totalLike, (select cast(avg(Rate_res.rating) as decimal(2,1)) from Rate_res where Rate_res.res_id = Restaurant.res_id) as rating from Restaurant where Restaurant.slug = :slug',
        {
          type: QueryTypes.SELECT,
          replacements: { slug: req.params.res_slug },
        },
      )
      .then((restaurant) => {
        rst = restaurant[0];
        if (!rst) {
          res.status(404);
          throw new Error('Restaurant not found');
        } else {
          return Promise.all([
            Like_res.findAll({
              where: { res_id: rst.res_id },
              include: { model: User, attributes: ['user_name'] },
            }),
            Rate_res.findAll({
              where: { res_id: rst.res_id },
              include: { model: User, attributes: ['user_name'] },
            }),
            Food.findAll({
              where: { res_id: rst.res_id },
              include: { model: Food_type },
            }),
          ]).then(([like, rate, foods]) => {
            res.status(200).render('users/orders/show', {
              rst,
              like: multipleSequelizeToJSON(like),
              rate: multipleSequelizeToJSON(rate),
              foods: multipleSequelizeToJSON(foods),
            });
          });
        }
      })
      .catch(next);
  }
}

module.exports = new OrdersController();
