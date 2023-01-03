const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const Food = require('../models/Food');
const Food_type = require('../models/Food_type');
const Order_detail = require('../models/Order_detail');
const Like_res = require('../models/Like_res');
const Rate_res = require('../models/Rate_res');

const { QueryTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const fs = require('fs');

const {
  multipleSequelizeToJSON,
  sequelizeToJSON,
} = require('../../ulti/sequelize');

class RestaurantsController {
  // [GET] /restaurants/:res_slug
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
              where: { res_id: rst.res_id, deletedAt: null },
              include: { model: Food_type },
            }),
          ]).then(([like, rate, foods]) => {
            res.status(200).render('restaurants/show', {
              rst,
              like: multipleSequelizeToJSON(like),
              rate: multipleSequelizeToJSON(rate),
              foods: multipleSequelizeToJSON(foods),
              reqUser: req.user,
            });
          });
        }
      })
      .catch(next);
  }

  // [POST] /restaurants/create
  create(req, res, next) {
    Restaurant.findOne({ where: { res_name: req.body.res_name } }).then(
      (resExists) => {
        if (resExists) {
          res.status(400);
          throw new Error('Restaurant already exists');
        }
      },
    );

    const img = fs.readFileSync(req.file.path);
    const encode_image = img.toString('base64');

    req.body.image = encode_image;

    Restaurant.create(req.body)
      .then(() => res.status(200).redirect('/manage/stored/restaurants'))
      .catch(next);
  }

  // [GET] /restaurants/:res_slug/edit
  edit(req, res, next) {
    Restaurant.findOne({ where: { slug: req.params.res_slug } })
      .then((restaurant) => {
        if (!restaurant) {
          res.status(404);
          throw new Error('Restaurant not found');
        }
        res.status(200).render('restaurants/edit', {
          restaurant: sequelizeToJSON(restaurant),
          reqUser: req.user,
        });
      })
      .catch(next);
  }

  // [PUT] /restaurants/:res_slug
  update(req, res, next) {
    Promise.all([
      Restaurant.findOne({
        where: { slug: req.params.res_slug },
      }),
      Restaurant.findOne({
        where: {
          res_id: req.body.res_id,
          res_name: req.body.res_name,
        },
      }),
    ])
      .then(([restaurant, checkRestaurant]) => {
        if (!restaurant) {
          res.status(404);
          throw new Error('Restaurant not found');
        }

        const img = fs.readFileSync(req.file.path);
        const encode_image = img.toString('base64');

        req.body.image = encode_image;

        if (checkRestaurant) {
          restaurant
            .update(req.body)
            .then(() => res.status(200).redirect('/manage/stored/restaurants'))
            .catch(next);
        }

        if (!checkRestaurant) {
          Restaurant.findOne({ where: { res_name: req.body.res_name } })
            .then((existedRes) => {
              if (existedRes) {
                res.status(409);
                throw new Error('Restaurant already exists');
              }

              restaurant
                .update(req.body)
                .then(() =>
                  res.status(200).redirect('/manage/stored/restaurants'),
                )
                .catch(next);
            })
            .catch(next);
        }
      })
      .catch(next);
  }

  // [DELETE] /restaurants/:res_id
  destroy(req, res, next) {
    Restaurant.findOne({ where: { res_id: req.params.res_id } })
      .then((restaurant) => {
        if (!restaurant) {
          res.status(404);
          throw new Error('Restaurant not found');
        }
        restaurant
          .destroy()
          .then(() => res.status(200).redirect('back'))
          .catch(next);
      })
      .catch(next);
  }

  // [DELETE] /restaurants/:res_id/force
  forceDestroy(req, res, next) {
    Restaurant.findOne({
      where: { res_id: req.params.res_id },
      paranoid: false,
    })
      .then((restaurant) => {
        if (!restaurant) {
          res.status(404);
          throw new Error('Restaurant not found');
        }
        restaurant
          .destroy({ force: true })
          .then(() => res.status(200).redirect('back'))
          .catch(next);
      })
      .catch(next);
  }
  // [PATCH] /restaurants/:res_id/restore
  restore(req, res, next) {
    Restaurant.findOne({
      where: { res_id: req.params.res_id },
      paranoid: false,
    })
      .then((restaurant) => {
        if (!restaurant) {
          res.status(404);
          throw new Error('Restaurant not found');
        }
        restaurant
          .restore()
          .then(() => res.status(200).redirect('back'))
          .catch(next);
      })
      .catch(next);
  }
}

module.exports = new RestaurantsController();
