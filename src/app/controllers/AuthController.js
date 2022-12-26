const User = require('../models/User');
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const {
  multipleSequelizeToJSON,
  sequelizeToJSON,
} = require('../../ulti/sequelize');

const generateToken = require('../../helpers/GerenateToken');

class AuthControler {
  //LOGIN
  // [POST] /login
  login(req, res, next) {
    User.findOne({
      attributes: { include: ['password'] },
      where: { email: req.body.email },
    })
      .then((user) => {
        if (user && user.matchPassword(req.body.password)) {
          delete user.dataValues.password;
          
          const token = generateToken(user.user_id);
          res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 3*60*60*1000,
          })

          res.status(200).redirect('/');
        } else {
          res.status(400);
          throw new Error('Invalid email or password');
        }
      })
      .catch(next);
  }

  // [GET] /profile
  profile(req, res, next) {
    User.findByPk(req.user.user_id)
      .then((user) => {
        if (!user) {
          res.status(404);
          throw new Error('User not found');
        }

        res.status(200).json(user);
      })
      .catch(next);
  }

  // REGISTER
  // [POST] /register
  register(req, res, next) {
    console.log(req.body)
    User.findOne({ where: { email: req.body.email } })
      .then((userExists) => {
        if (userExists) {
          res.status(400);
          throw new Error('Email already exists');
          
        }

        User.create(req.body)
          .then((user) => res.status(200).json(user))
          .catch(next);
      })
      .catch(next); 
  }

  // LOGOUT
  // [GET] /logout
  logout(req, res, next) {
    res.cookie('jwt',"", {maxAge: '1'})
    res.status(200).redirect('/login');
  }


  // HOME PAGE
    // [GET] /
    // index(req, res, next) {
    //   sequelize
    //     .query(
    //       'select res_id, res_name, `desc`, slug, image, (select count(user_id) from Like_res where Like_res.res_id = Restaurant.res_id) as totalLike, (select cast(avg(rating) as decimal(2,1)) from Rate_res where Rate_res.res_id = Restaurant.res_id) as rating from Restaurant',
    //       {
    //         type: QueryTypes.SELECT,
    //       },
    //     )
    //     .then((restaurants) =>
    //       res.status(200).render('home', {
    //         reqUser: sequelizeToJSON(req.user),
    //         restaurants,
    //       }),
    //     )
    //     .catch(next);
    // }

    index(req, res, next) {
      sequelize
        .query(
          'select *, exists(select * from Like_res where Like_res.res_id = Restaurant.res_id and Like_res.user_id = :user_id) as likedRestaurants, (select rating from Rate_res where Rate_res.res_id = Restaurant.res_id and Rate_res.user_id = :user_id) as rating, (select count(user_id) from Like_res where Like_res.res_id = Restaurant.res_id) as totalLike, (select cast(avg(rating) as decimal(2,1)) from Rate_res where Rate_res.res_id = Restaurant.res_id) as totalRating from Restaurant',
          {
            type: QueryTypes.SELECT,
            replacements: { user_id: req.user.user_id },
          },
        )
        .then((restaurants) =>
          res.status(200).render('home', {
            restaurants,
            reqUser: sequelizeToJSON(req.user),
          }),
        )
        .catch(next);
    }
}

module.exports = new AuthControler();



