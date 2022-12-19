const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const Food = require('../models/Food');
const Like_res = require('../models/Like_res');
const { QueryTypes, Op } = require('sequelize');
const { sequelize } = require('../../config/db');

const { multipleSequelizeToJSON } = require('../../ulti/sequelize');
const Food_type = require('../models/Food_type');

class MeController {
  // [GET] /me/stored/restaurants
  storedRestaurants(req, res, next) {
    Promise.all([
      Restaurant.findAll(),
      Restaurant.count({
        where: { deletedAt: { [Op.not]: null } },
        paranoid: false,
      }),
    ])
      .then(([restaurants, deletedCount]) =>
        res.render('me/stored-restaurants', {
          deletedCount,
          restaurants: multipleSequelizeToJSON(restaurants),
        }),
      )
      .catch(next);
  }

  // [GET] /me/trash/restaurants
  trashRestaurants(req, res, next) {
    Restaurant.findAll({
      where: { deletedAt: { [Op.not]: null } },
      paranoid: false,
    })
      .then((restaurants) =>
        res.render('me/trash-restaurants', {
          restaurants: multipleSequelizeToJSON(restaurants),
        }),
      )
      .catch(next);
  }

  // [GET] /me/stored/users
  storedUsers(req, res, next) {
    Promise.all([
      sequelize.query(
        'select User.user_id, User.full_name as user_name, User.email, User.createdAt, count(Like_res.res_id) as new from User left join Like_res on User.user_id = Like_res.user_id where User.deletedAt is null group by User.user_id',
        {
          type: QueryTypes.SELECT,
        },
      ),
      User.count({
        where: { deletedAt: { [Op.not]: null } },
        paranoid: false,
      }),
    ])
      .then(([users, deletedCount]) =>
        res.render('me/stored-users', {
          deletedCount,
          users,
        }),
      )
      .catch(next);
  }

  // [GET] /me/trash/users
  trashUsers(req, res, next) {
    User.findAll({
      where: { deletedAt: { [Op.not]: null } },
      paranoid: false,
    })
      .then((users) =>
        res.render('me/trash-users', {
          users: multipleSequelizeToJSON(users),
        }),
      )
      .catch(next);
  }
}

module.exports = new MeController();
