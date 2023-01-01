const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const Order_detail = require('../models/Order_detail');
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
const { truncate } = require('../models/Restaurant');

class CartController {
  // [GET] /cart
  cart(req, res, next) {
    Order_detail.findAll({
      attributes: ['id', 'user_id', 'food_id', 'quantity'],
      include: {
        model: Food,
        attributes: ['food_name', 'image', 'price', 'desc'],
        where: { deletedAt: null },
        include: [
          {
            model: Restaurant,
            attributes: ['res_id', 'res_name', 'slug'],
          },
          {
            model: Food_type,
            attributes: ['type_name'],
          },
        ],
      },
      where: { user_id: req.user.user_id, order_id: null },
    })
      .then((orderDetails) => {
        res.render('shopping-cart/show', {
          orderDetails: multipleSequelizeToJSON(orderDetails),
          reqUser: req.user,
        });
      })
      .catch(next);
  }

  // [POST] /cart/order
  order(req, res, next) {
    if (!req.body.food_id) {
      res.status(404);
      throw new Error('Food not found');
    }

    Order_detail.findOrCreate({
      where: { user_id: req.user.user_id, food_id: req.body.food_id },
      defaults: {},
    })
      .then((orderDetail) => {
        if (!orderDetail[0]._options.isNewRecord) {
          orderDetail[0]
            .increment({
              quantity: +1,
            })

            .then((updatedOrderDetail) => updatedOrderDetail.reload())
            .catch(next);
        }
      })
      .catch(next);
  }

  // [PUT] /cart/quantity-update
  quantityUpdate(req, res, next) {
    Order_detail.findOne({ where: { id: req.body.order_detail_id } })
      .then((order_detail) => {
        if (!order_detail) {
          res.status(404);
          throw new Error('Order detail not found');
        }

        order_detail.update({ quantity: req.body.quantity }).catch(next);
      })
      .catch(next);
  }

  // [DELETE] /cart/:order_detail_id
  destroy(req, res, next) {
    Order_detail.findOne({ where: { id: req.params.order_detail_id } })
      .then((order_detail) => {
        if (!order_detail) {
          res.status(404);
          throw new Error('Order detail not found');
        }

        order_detail.destroy({ force: true });
        // .then(() => res.redirect('back'))
        // .catch(next);
        next();
      })
      .catch(next);
  }


  // [POST] /cart/pay
  pay(req, res, next) {
    console.log(req.body);
    if (req.body.total_price <= 0) {
      res.status(404);
      throw new Error('Total price must not null and be greater than 0');
    }

    Order.create({
      user_id: req.user.user_id,
      total_price: req.body.total_price,
      discount: req.body.discount,
    })
    .then((order) => {
      Order_detail.update({
        order_id: order.order_id,
      }, { where: {order_id: null}})
    })
    .next()
    .catch(next);
  }
}

module.exports = new CartController();
