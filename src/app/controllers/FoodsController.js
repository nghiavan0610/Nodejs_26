const Food = require('../models/Food');
const Food_type = require('../models/Food_type');
const Restaurant = require('../models/Restaurant');
const { QueryTypes, Op } = require('sequelize');
const { sequelize } = require('../../config/db');
const fs = require('fs');

const {
  multipleSequelizeToJSON,
  sequelizeToJSON,
} = require('../../ulti/sequelize');

class FoodsController {
  // [GET] /restaurants/:res_slug/foods
  storedFoods(req, res, next) {
    Promise.all([
      Restaurant.findOne({
        include: {
          model: Food,
          include: {
            model: Food_type,
          },
        },
        attributes: ['res_name', 'slug'],
        where: { slug: req.params.res_slug },
      }),
      Food.count({
        include: {
          model: Restaurant,
          attributes: ['slug'],
          where: { slug: req.params.res_slug },
        },
        where: { deletedAt: { [Op.not]: null } },
        paranoid: false,
      }),
    ])
      .then(([restaurant, deletedCount]) => {
        if (!restaurant) {
          res.status(404);
          throw new Error('Restaurant not found');
        }

        res.status(200).render('foods/stored-foods', {
          deletedCount,
          foods: multipleSequelizeToJSON(restaurant.Food),
          resName: restaurant.res_name,
          resSlug: restaurant.slug,
          reqUser: req.user,
        });
      })
      .catch(next);
  }

  // [GET] /restaurants/:res_slug/foods/trash
  trashFoods(req, res, next) {
    Restaurant.findOne({
      include: {
        model: Food,
        where: { deletedAt: { [Op.not]: null } },
        paranoid: false,
        required: false,
        include: {
          model: Food_type,
        },
      },
      attributes: ['res_name', 'slug'],
      where: { slug: req.params.res_slug },
    }).then((restaurant) => {
      if (!restaurant) {
        res.status(404);
        throw new Error('Restaurant not found');
      }
      res.status(200).render('foods/trash-foods', {
        foods: multipleSequelizeToJSON(restaurant.Food),
        resName: restaurant.res_name,
        resSlug: restaurant.slug,
        reqUser: req.user,
      });
    });
  }

  // [GET] /restaurants/:res_slug/foods/create
  create(req, res, next) {
    Promise.all([
      Food_type.findAll(),
      Restaurant.findOne({
        attributes: ['res_id', 'res_name', 'slug'],
        where: { slug: req.params.res_slug },
      }),
    ])
      .then(([food_types, restaurant]) => {
        if (!restaurant) {
          res.status(404);
          throw new Error('Restaurant not found');
        }
        res.status(200).render('foods/create', {
          food_types: multipleSequelizeToJSON(food_types),
          restaurant: sequelizeToJSON(restaurant),
          reqUser: req.user,
        });
      })
      .catch(next);
  }

  // [POST] /restaurants/:res_slug/foods/store
  store(req, res, next) {
    Restaurant.findOne({ where: { slug: req.params.res_slug } })
      .then((restaurant) => {
        if (!restaurant) {
          res.status(404);
          throw new Error('Restaurant not found');
        }

        const img = fs.readFileSync(req.file.path);
        const encode_image = img.toString('base64');

        req.body.image = encode_image;
        Food.create(req.body)
          .then((food) => {
            console.log(food),
              res
                .status(200)
                .redirect('/restaurants/' + req.params.res_slug + '/foods');
          })
          .catch(next);
      })
      .catch(next);
  }

  // [GET] /restaurants/:res_slug/foods/:food_id/edit
  edit(req, res, next) {
    Promise.all([
      Restaurant.findOne({
        include: {
          model: Food,
          where: { food_id: req.params.food_id },
          required: false,
          include: {
            model: Food_type,
          },
        },
        attributes: ['res_name', 'slug'],
        where: { slug: req.params.res_slug },
      }),
      Food_type.findAll(),
    ])
      .then(([restaurant, food_types]) => {
        if (!restaurant) {
          res.status(404);
          throw new Error('Restaurant not found');
        }

        if (!restaurant.Food[0]) {
          res.status(404);
          throw new Error('Food not found');
        }
        res.status(200).render('foods/edit', {
          food_types: multipleSequelizeToJSON(food_types),
          food: sequelizeToJSON(restaurant.Food[0]),
          resName: restaurant.res_name,
          resSlug: restaurant.slug,
          reqUser: req.user,
        });
      })
      .catch(next);
  }

  // [PUT] /restaurants/:res_slug/foods/:food_id
  update(req, res, next) {
    Restaurant.findOne({
      include: {
        model: Food,
        where: { food_id: req.params.food_id },
        required: false,
      },
      attributes: ['res_name', 'slug'],
      where: { slug: req.params.res_slug },
    })
      .then((restaurant) => {
        if (!restaurant) {
          res.status(404);
          throw new Error('Restaurant not found');
        }

        if (!restaurant.Food[0]) {
          res.status(404);
          throw new Error('Food not found');
        }

        const img = fs.readFileSync(req.file.path);
        const encode_image = img.toString('base64');

        req.body.image = encode_image;
        restaurant.Food[0]
          .update(req.body)
          .then(() => {
            res
              .status(200)
              .redirect('/restaurants/' + req.params.res_slug + '/foods');
          })
          .catch(next);
      })
      .catch(next);
  }

  // [DELETE] /restaurants/:res_slug/foods/:food_id
  destroy(req, res, next) {
    Restaurant.findOne({
      include: {
        model: Food,
        where: { food_id: req.params.food_id },
        required: false,
      },
      attributes: ['res_name', 'slug'],
      where: { slug: req.params.res_slug },
    })
      .then((restaurant) => {
        if (!restaurant) {
          res.status(404);
          throw new Error('Restaurant not found');
        }

        if (!restaurant.Food[0]) {
          res.status(404);
          throw new Error('Food not found');
        }

        restaurant.Food[0]
          .destroy()
          .then(() => {
            res.status(200).redirect('back');
          })
          .catch(next);
      })
      .catch(next);
  }

  // [DELETE] /restaurants/:res_slug/foods/:food_id/force
  forceDestroy(req, res, next) {
    Restaurant.findOne({
      include: {
        model: Food,
        where: { food_id: req.params.food_id },
        paranoid: false,
        required: false,
      },
      attributes: ['res_name', 'slug'],
      where: { slug: req.params.res_slug },
    })
      .then((restaurant) => {
        if (!restaurant) {
          res.status(404);
          throw new Error('Restaurant not found');
        }

        if (!restaurant.Food[0]) {
          res.status(404);
          throw new Error('Food not found');
        }
        restaurant.Food[0]
          .destroy({ force: true })
          .then(() => {
            res.status(200).redirect('back');
          })
          .catch(next);
      })
      .catch(next);
  }

  // [PATCH] /restaurants/:res_slug/foods/:food_id/restore
  restore(req, res, next) {
    Restaurant.findOne({
      include: {
        model: Food,
        where: { food_id: req.params.food_id },
        paranoid: false,
        required: false,
      },
      attributes: ['res_name', 'slug'],
      where: { slug: req.params.res_slug },
    })
      .then((restaurant) => {
        if (!restaurant) {
          res.status(404);
          throw new Error('Restaurant not found');
        }

        if (!restaurant.Food[0]) {
          res.status(404);
          throw new Error('Food not found');
        }
        restaurant.Food[0]
          .restore()
          .then(() => {
            res.status(200).redirect('back');
          })
          .catch(next);
      })
      .catch(next);
  }
}

module.exports = new FoodsController();
