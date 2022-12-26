const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const { QueryTypes, Op } = require('sequelize');
const { sequelize } = require('../../config/db');

const { sequelizeToJSON ,multipleSequelizeToJSON } = require('../../ulti/sequelize');
const Food_type = require('../models/Food_type');

class ManageController {
  // [GET] /manage/stored/restaurants
  storedRestaurants(req, res, next) {
    Promise.all([
      Restaurant.findAll(),
      Restaurant.count({
        where: { deletedAt: { [Op.not]: null } },
        paranoid: false,
      }),
    ])
      .then(([restaurants, deletedCount]) =>
        res.status(200).render('manage/stored-restaurants', {
          deletedCount,
          restaurants: multipleSequelizeToJSON(restaurants),
          reqUser: sequelizeToJSON(req.user)
        }),
      )
      .catch(next);
  }

  // [GET] /manage/trash/restaurants
  trashRestaurants(req, res, next) {
    Restaurant.findAll({
      where: { deletedAt: { [Op.not]: null } },
      paranoid: false,
    })
      .then((restaurants) =>
        res.status(200).render('manage/trash-restaurants', {
          restaurants: multipleSequelizeToJSON(restaurants),
          reqUser: sequelizeToJSON(req.user)
        }),
      )
      .catch(next);
  }

  // [GET] /manage/stored/users
  storedUsers(req, res, next) {
    Promise.all([
      sequelize.query(
        'select User.user_id, User.full_name as user_name, User.email, User.slug, User.createdAt, count(Like_res.res_id) as new from User left join Like_res on User.user_id = Like_res.user_id where User.deletedAt is null and User.user_id != :user_id group by User.user_id',
        {
          type: QueryTypes.SELECT,
          replacements : {user_id: req.user.user_id}
        },
      ),
      User.count({
        where: { deletedAt: { [Op.not]: null } },
        paranoid: false,
      }),
    ])
      .then(([users, deletedCount]) =>
        res.status(200).render('manage/stored-users', {
          deletedCount,
          users,
          reqUser: sequelizeToJSON(req.user)
        }),
      )
      .catch(next);
  }

  // [GET] /manage/trash/users
  trashUsers(req, res, next) {
    console.log(req.user)
    User.findAll({
      where: { deletedAt: { [Op.not]: null } },
      paranoid: false,
    })
      .then((users) =>
        res.status(200).render('manage/trash-users', {
          users: multipleSequelizeToJSON(users),
          reqUser: sequelizeToJSON(req.user)
        }),
      )
      .catch(next);
  }
}

module.exports = new ManageController();
