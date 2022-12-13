const Restaurant = require('../models/Restaurant');
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const { sequelizeToJSON } = require('../../ulti/sequelize');

class RestaurantsController {
  // [GET] /restaurants/:slug
  show(req, res, next) {
    Restaurant.findOne({ where: { slug: req.params.slug } })
      .then((restaurant) =>
        res.render('restaurants/show', {
          restaurant: sequelizeToJSON(restaurant),
        }),
      )
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
