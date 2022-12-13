const User = require('../models/User');
const Like_res = require('../models/Like_res');
const Restaurant = require('../models/Restaurant');
const { QueryTypes, Op, where } = require('sequelize');
const { sequelize } = require('../../config/db');

const {
  multipleSequelizeToJSON,
  sequelizeToJSON,
} = require('../../ulti/sequelize');

class UsersController {
  // [GET] /users/create
  create(req, res, next) {
    res.render('users/create');
  }

  // [POST] /users/store
  store(req, res, next) {
    if ((req.body.email = 1)) {
      alert('test');
    } else {
      const user = User.create(req.body);
      user.then(() => res.redirect('/me/stored/users')).catch(next);
    }
  }

  // [GET] /users/:user_id/edit
  edit(req, res, next) {
    User.findOne({ where: { user_id: req.params.user_id } })
      .then((user) =>
        res.render('users/edit', {
          user: sequelizeToJSON(user),
        }),
      )
      .catch(next);
  }

  // [PUT] /users/:user_id
  update(req, res, next) {
    User.update(req.body, { where: { user_id: req.params.user_id } })
      .then(() => res.redirect('/me/stored/users'))
      .catch(next);
  }

  // [DELETE] /users/:user_id
  destroy(req, res, next) {
    User.destroy({ where: { user_id: req.params.user_id } })
      .then(() => res.redirect('back'))
      .catch(next);
  }

  // [DELETE] /users/:user_id/force
  forceDestroy(req, res, next) {
    User.destroy({ where: { user_id: req.params.user_id }, force: true })
      .then(() => res.redirect('back'))
      .catch(next);
  }

  // [PATCH] /users/:user_id/restore
  restore(req, res, next) {
    User.restore({ where: { user_id: req.params.user_id } })
      .then(() => res.redirect('back'))
      .catch(next);
  }

  // [GET] /users/:user_id
  show(req, res, next) {
    Promise.all([
      User.findOne({ where: { user_id: req.params.user_id } }),
      sequelize.query(
        ' select *, exists(select * from Like_res where Like_res.res_id = Restaurant.res_id and Like_res.user_id = :user_id) as likedRestaurants from Restaurant',
        {
          replacements: { user_id: req.params.user_id },
          type: QueryTypes.SELECT,
        },
      ),
    ])
      .then(([user, detailRestaurant]) => {
        return res.render('users/show', {
          user: sequelizeToJSON(user),
          detailRestaurant,
        });
      })
      .catch(next);
  }

  // [POST] /users/:user_id/likeRes
  likeResAction(req, res, next) {
    Like_res.findOrCreate({
      where: { user_id: req.params.user_id, res_id: req.body.res_id },
      defaults: {
        date_like: new Date(),
      },
    }).then((result) => {
      if (result[0]._options.isNewRecord) {
      } else {
        result[0].destroy();
      }
      res.send({ liked: result[0]._options.isNewRecord });
    });
  }
}

module.exports = new UsersController();
