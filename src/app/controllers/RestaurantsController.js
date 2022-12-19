const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const Food = require('../models/Food');
const Food_type = require('../models/Food_type');
const Like_res = require('../models/Like_res');
const Rate_res = require('../models/Rate_res');
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const {
  multipleSequelizeToJSON,
  sequelizeToJSON,
} = require('../../ulti/sequelize');

class RestaurantsController {
  // [GET] /restaurants/:slug
  show(req, res, next) {
    let rst;
    sequelize
      .query(
        'select *, (select count(Like_res.user_id) from Like_res where Like_res.res_id = Restaurant.res_id) as totalLike, (select cast(avg(Rate_res.rating) as decimal(2,1)) from Rate_res where Rate_res.res_id = Restaurant.res_id) as rating from Restaurant where Restaurant.slug = :slug',
        {
          type: QueryTypes.SELECT,
          replacements: { slug: req.params.slug },
        },
      )
      .then(restaurant => {
        rst = restaurant[0];

        if(!rst) {
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
            include: { model: Food_type }
          })
        ])
          .then(([like, rate, foods]) => {
            res.render('restaurants/show', {
              rst,
              like: multipleSequelizeToJSON(like),
              rate: multipleSequelizeToJSON(rate),
              foods: multipleSequelizeToJSON(foods),
            });
          })
        }
      })
      .catch(next);
  }

 
  // [GET] /restaurants/create
  create(req, res, next) {
    res.render('restaurants/create');
  }

  // [POST] /restaurants/store
  store(req, res, next) {
    req.body.image = `https://img.youtube.com/vi/${req.body.videoID}/sddefault.jpg`;
    const restaurant = Restaurant.create(req.body);
    restaurant.then(() => res.redirect('/me/stored/restaurants')).catch(next);
  }

  // [GET] /restaurants/:res_id/edit
  edit(req, res, next) {
    Restaurant.findOne({ where: { res_id: req.params.res_id } })
      .then((restaurant) =>
        res.render('restaurants/edit', {
          restaurant: sequelizeToJSON(restaurant),
        }),
      )
      .catch(next);
  }

  // [PUT] /restaurants/:res_id
  update(req, res, next) {
    Restaurant.update(req.body, { where: { res_id: req.params.res_id } })
      .then(() => res.redirect('/me/stored/restaurants'))
      .catch(next);
  }

  // [DELETE] /restaurants/:res_id
  destroy(req, res, next) {
    Restaurant.destroy({ where: { res_id: req.params.res_id } })
      .then(() => res.redirect('back'))
      .catch(next);
  }

  // [DELETE] /restaurants/:res_id/force
  forceDestroy(req, res, next) {
    Restaurant.destroy({ where: { res_id: req.params.res_id }, force: true })
      .then(() => res.redirect('back'))
      .catch(next);
  }

  // [PATCH] /restaurants/:res_id/restore
  restore(req, res, next) {
    Restaurant.restore({ where: { res_id: req.params.res_id } })
      .then(() => res.redirect('back'))
      .catch(next);
  }
}

module.exports = new RestaurantsController();
