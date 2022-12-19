const Food = require('../models/Food');
const Food_type = require('../models/Food_type');
const Restaurant = require('../models/Restaurant');
const { QueryTypes, Op } = require('sequelize');
const { sequelize } = require('../../config/db');

const {
  multipleSequelizeToJSON,
  sequelizeToJSON,
} = require('../../ulti/sequelize');

class FoodsController {
  // [GET] /restaurants/:slug/foods
  storedFoods(req, res, next) {
    Promise.all([
      Restaurant.findOne({
        include: {
          model: Food,
          include: {
            model: Food_type,
          }
        },
        attributes: ['res_name', 'slug'],
        where: { slug: req.params.slug }
      }),
      Food.count({
        where: { deletedAt: { [Op.not]: null } },
        paranoid: false,
      }),
    ])
    .then(([restaurant, deletedCount]) => {
      res.render('restaurants/foods/stored-foods', {
        deletedCount,
        foods: multipleSequelizeToJSON(restaurant.Food),
        resName: restaurant.res_name,
        resSlug: restaurant.slug
      });
    })
    .catch(next);
  }


  // [GET] /restaurants/:slug/foods/trash
  trashFoods(req, res, next) {
    Restaurant.findOne({
      include: {
        model: Food,
        where: { deletedAt: { [Op.not]: null }},
        paranoid: false,
        required: false,
        include: {
          model: Food_type,
        }
      },
      attributes: ['res_name', 'slug'],
      where: { slug: req.params.slug }
    })
      .then(restaurant => {
        res.render('restaurants/foods/trash-foods', {
          foods: multipleSequelizeToJSON(restaurant.Food),
          resName: restaurant.res_name,
          resSlug: restaurant.slug
        })
      })
  }

  // [GET] /restaurants/:slug/foods/create
  create(req, res, next) {
    Promise.all([
      Food_type.findAll(),
      Restaurant.findOne({
        attributes: ['res_id', 'res_name', 'slug'],
        where: { slug: req.params.slug },
      }),
    ])
      .then(([food_types, restaurant]) => {
        res.render('restaurants/foods/create', {
          food_types: multipleSequelizeToJSON(food_types),
          restaurant: sequelizeToJSON(restaurant),
        });
      })
      .catch(next);
  }

  // [POST] /restaurants/:slug/foods/store
  store(req, res, next) {
    Food.create(req.body)
      .then(() => res.redirect('/restaurants/' +req.params.slug+ '/foods'))
      .catch(next);
  }

  // [GET] /restaurants/:slug/foods/:food_id/edit
  // edit(req, res, next) {
  //   Promise.all([
  //     Food.findOne({
  //       where: { food_id: req.params.food_id },
  //       include: [
  //         { model: Food_type },
  //         { model: Restaurant, attributes: ['res_name'] },
  //       ],
  //     }),
  //     Food_type.findAll(),
  //   ])
  //     .then(([food, food_types]) => {
  //       res.render('restaurants/foods/edit', {
  //         food_types: multipleSequelizeToJSON(food_types),
  //         food: sequelizeToJSON(food),
  //       });
  //     })
  //     .catch(next);
  // }


  edit(req, res, next) {
    Promise.all([
      Restaurant.findOne({
        include: {
          model: Food,
          where: { food_id: req.params.food_id },
          required: false,
          include: {
            model: Food_type,
          }
        },
        attributes: ['res_name', 'slug'],
        where: { slug: req.params.slug },
      }),
      Food_type.findAll(),
    ])
    .then(([restaurant, food_types]) => {
      res.render('restaurants/foods/edit', {
        food_types: multipleSequelizeToJSON(food_types),
        food: sequelizeToJSON(restaurant.Food[0]),
        resName: restaurant.res_name,
        resSlug: restaurant.slug
      });
    })
    .catch(next);
  }

  // [PUT] /restaurants/:slug/foods/:food_id
  update(req, res, next) {
    Food.update(req.body, { where: { food_id: req.params.food_id } })
      .then(() => {
        res.redirect('/restaurants/' +req.params.slug+ '/foods');
      })
      .catch(next);
  }

  // [DELETE] /restaurants/:slug/foods/:food_id
  destroy(req, res, next) {
    Food.destroy({ where: { food_id: req.params.food_id } })
      .then(() => {
        res.redirect('back');
      })
      .catch(next);
  }

  // [DELETE] /restaurants/:slug/foods/:food_id/force
  forceDestroy(req, res, next) {
    Food.destroy({ where: { food_id: req.params.food_id }, force: true })
      .then(() => {
        res.redirect('back');
      })
      .catch(next);
  }

  // [PATCH] /restaurants/:slug/foods/:food_id/restore
  restore(req, res, next) {
    Food.restore({ where: { food_id: req.params.food_id } })
      .then(() => {
        res.redirect('back');
      })
      .catch(next);
  }
}

module.exports = new FoodsController();
