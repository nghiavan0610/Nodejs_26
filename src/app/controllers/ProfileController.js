const User = require('../models/User');
const { QueryTypes, Op, where } = require('sequelize');
const { sequelize } = require('../../config/db');

const { response } = require('../../helpers/response');

const {
  multipleSequelizeToJSON,
  sequelizeToJSON,
} = require('../../ulti/sequelize');

class ProfileController {
  // [GET] /profile
  show(req, res, next) {
    User.findOne({ where: { user_id: req.user.user_id } })
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
              reqUser: sequelizeToJSON(req.user)
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
      where: { user_id: req.user.user_id } })
      .then((user) => {
        if (!user) {
          res.status(404);
          throw new Error('User not found');
        }
        res.status(200).render('profile/edit', {
          user: sequelizeToJSON(user),
          reqUser: sequelizeToJSON(req.user)
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
            .then(() => res.status(304).redirect('/profile'))
            .catch(next);
        }

        if (!checkUser) {
          User.findOne({ where: { email: req.body.email } })
            .then((existedEmail) => {
              if (existedEmail) {
                res.status(404);
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

}

module.exports = new ProfileController();
