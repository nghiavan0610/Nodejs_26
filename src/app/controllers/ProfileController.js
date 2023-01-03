const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Like_res = require('../models/Like_res');
const Rate_res = require('../models/Rate_res');
const Food = require('../models/Food');
const Order = require('../models/Order');
const Order_detail = require('../models/Order_detail');

const { QueryTypes, Op, where } = require('sequelize');
const { sequelize } = require('../../config/db');
const fs = require('fs');

const { response } = require('../../helpers/response');

const {
  multipleSequelizeToJSON,
  sequelizeToJSON,
} = require('../../ulti/sequelize');

class ProfileController {
  // [GET] /profile
  show(req, res, next) {
    User.findOne({
      attributes: [
        'user_id',
        'user_name',
        'email',
        'avatar',
        'role',
        [
          sequelize.fn('COUNT', sequelize.col('`Like_res`.`user_id`')),
          'totalLiked',
        ],
        [
          sequelize.fn('COUNT', sequelize.col('`Rate_res`.`user_id`')),
          'totalRate',
        ],
        [
          sequelize.fn('COUNT', sequelize.col('`Orders`.`user_id`')),
          'totalOrder',
        ],
      ],
      include: [
        { model: Like_res, attributes: [] },
        { model: Rate_res, attributes: [] },
        { model: Order, attributes: [] },
      ],
      where: { user_id: req.user.user_id },
    })
      .then((user) => {
        if (!user) {
          res.status(404);
          throw new Error('User not found');
        }
        sequelize
          .query(
            ' select *, exists(select * from Like_res where Like_res.res_id = Restaurant.res_id and Like_res.user_id = :user_id) as likedRestaurants, (select rating from Rate_res where Rate_res.res_id = Restaurant.res_id and Rate_res.user_id = :user_id) as rating from Restaurant',
            {
              replacements: { user_id: user.user_id },
              type: QueryTypes.SELECT,
            },
          )
          .then((detailRestaurant) => {
            res.status(200).render('profile/show', {
              user: sequelizeToJSON(user),
              detailRestaurant,
              reqUser: req.user,
            });
          })
          .catch(next);
      })
      .catch(next);
  }

  // [GET] /profile/edit
  edit(req, res, next) {
    User.findOne({
      attributes: { include: ['password'] },
      where: { user_id: req.user.user_id },
    })
      .then((user) => {
        if (!user) {
          res.status(404);
          throw new Error('User not found');
        }
        res.status(200).render('profile/edit', {
          user: sequelizeToJSON(user),
          reqUser: req.user,
        });
      })
      .catch(next);
  }

  // [GET] /profile/history
  history(req, res, next) {
    Order.findAll({
      attributes: [
        'order_id',
        'discount',
        'total_price',
        [sequelize.literal('(total_price * 100) / (100-discount)'), 'amount'],
        'createdAt',
      ],
      where: { user_id: req.user.user_id },
    })
      .then((orders) => {
        res.status(200).render('profile/history', {
          orders: multipleSequelizeToJSON(orders),
          reqUser: req.user,
        });
      })
      .catch(next);
  }

  // [GET] /profile/history/:order_id
  historyDetail(req, res, next) {
    Order_detail.findAll({
      attributes: ['quantity'],
      include: {
        model: Food,
        attributes: ['food_name', 'price'],
        include: {
          model: Restaurant,
          attributes: ['res_name'],
        },
      },
      where: { order_id: req.params.order_id },
    })
      .then((order_details) => {
        if (!order_details[0]) {
          res.status(404);
          throw new Error('Order failed');
        }

        res.status(200).render('profile/history-detail', {
          order_details: multipleSequelizeToJSON(order_details),
          reqUser: req.user,
          order_id: req.params.order_id,
        });
      })
      .catch(next);
  }

  // [PUT] /profile/update
  update(req, res, next) {
    Promise.all([
      User.findOne({ where: { user_id: req.user.user_id } }),
      User.findOne({
        where: { email: req.body.email, user_id: req.user.user_id },
      }),
    ])
      .then(([user, checkUser]) => {
        if (!user) {
          res.status(404);
          throw new Error('User not found');
        }

        if (checkUser) {
          user
            .update(req.body)
            .then(() => res.status(200).redirect('/profile'))
            .catch(next);
        }

        if (!checkUser) {
          User.findOne({ where: { email: req.body.email } })
            .then((existedEmail) => {
              if (existedEmail) {
                res.status(409);
                throw new Error('Email already in use');
              }

              user
                .update(req.body)
                .then(() => res.status(200).redirect('/profile'))
                .catch(next);
            })
            .catch(next);
        }
      })
      .catch(next);
  }

  // [POST] /profile/avatar/upload
  upload(req, res, next) {
    if (!req.file) {
      res.status(404);
      throw new Error('Please upload a file');
    }

    const img = fs.readFileSync(req.file.path);
    const encode_image = img.toString('base64');

    // const test = Buffer.from(encode_image, 'base64');

    User.update(
      {
        avatar: encode_image,
      },
      {
        where: { user_id: req.user.user_id },
      },
    )
      .then(() => res.status(200).redirect('/profile'))
      .catch(next);
  }
}

module.exports = new ProfileController();
