const User = require('../models/User');
const { QueryTypes, Op, where } = require('sequelize');
const { sequelize } = require('../../config/db');

const { response } = require('../../helpers/response');

const {
  multipleSequelizeToJSON,
  sequelizeToJSON,
} = require('../../ulti/sequelize');

class UsersController {
  // [GET] /users/:user_slug
  show(req, res, next) {
    User.findOne({ where: { slug: req.params.user_slug } })
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
            res.status(200).render('users/show', {
              user: sequelizeToJSON(user),
              detailRestaurant,
              reqUser: sequelizeToJSON(req.user)
            });
          })
          .catch(next);
      })
      .catch(next);
  }


  // [POST] /users/create
  create(req, res, next) {
    User.findOne({ where: { email: req.body.email } })
      .then((userExists) => {
        if (userExists) {
          res.status(400);
          throw new Error('Email already in use');
        }

        User.create(req.body)
          .then(() => res.status(200).redirect('/manage/stored/users'))
          .catch(next);
      })
      .catch(next);
  }

  // [GET] /users/:user_slug/edit
  edit(req, res, next) {
    User.findOne({ where: { slug: req.params.user_slug } })
      .then((user) => {
        if (!user) {
          res.status(404);
          throw new Error('User not found');
        }
        res.status(200).render('users/edit', {
          user: sequelizeToJSON(user),
          reqUser: sequelizeToJSON(req.user)
        });
      })
      .catch(next);
  }

  // [PUT] /users/:user_slug
  update(req, res, next) {
    Promise.all([
      User.findOne({ where: { slug: req.params.user_slug } }),
      User.findOne({
        where: { email: req.body.email, user_id: req.body.user_id },
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
            .then(() => res.status(304).redirect('/manage/stored/users'))
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
                .then(() => res.status(200).redirect('/manage/stored/users'))
                .catch(next);
            })
            .catch(next);
        }
      })
      .catch(next);
  }

  // [DELETE] /users/:user_id
  destroy(req, res, next) {
    User.findOne({ where: { user_id: req.params.user_id } })
      .then((user) => {
        if (!user) {
          res.status(404);
          throw new Error('User not found');
        }
        user
          .destroy()
          .then(() => res.status(200).redirect('back'))
          .catch(next);
      })
      .catch(next);
  }

  // async destroy(req,res, next) {
  //   try{
  //     const user = await User.findOne({ where: { user_id: req.params.user_id }})
  //     if(!user) {
  //       res.status(404);
  //       throw new Error('User not found');
  //     }

  //     await user.destroy();
  //     res.status(200).redirect('back');
  //   } catch(err) {
  //     next(err);
  //   }
  // }

  // [DELETE] /users/:user_id/force
  forceDestroy(req, res, next) {
    User.findOne({ where: { user_id: req.params.user_id }, paranoid: false })
      .then((user) => {
        if (!user) {
          res.status(404);
          throw new Error('User not found');
        }
        user
          .destroy({ force: true })
          .then(() => res.status(200).redirect('back'))
          .catch(next);
      })
      .catch(next);
  }

  // [PATCH] /users/:user_id/restore
  restore(req, res, next) {
    User.findOne({ where: { user_id: req.params.user_id }, paranoid: false })
      .then((user) => {
        if (!user) {
          res.status(404);
          throw new Error('User not found');
        }

        user
          .restore()
          .then(() => res.status(200).redirect('back'))
          .catch(next);
      })
      .catch(next);
  }



  // [POST] /users/:user_id/order
  order(req, res, next) {
    res.json('test');
  }
}

module.exports = new UsersController();
