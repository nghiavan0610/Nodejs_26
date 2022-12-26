const Like_res = require('../models/Like_res');
const Rate_res = require('../models/Rate_res');
const { QueryTypes, Op, where } = require('sequelize');
const { sequelize } = require('../../config/db');

const { response } = require('../../helpers/response');

const {
  multipleSequelizeToJSON,
  sequelizeToJSON,
} = require('../../ulti/sequelize');

class ActionController {

  // [POST] /action/likeResAction
  likeResAction(req, res, next) {
    Like_res.findOrCreate({
      where: { user_id: req.body.user_id, res_id: req.body.res_id },
      defaults: {},
    })
      .then((result) => {
        if (!result[0].user_id) {
          res.status(404);
          throw new Error('User not found');
        }
        if (!result[0].res_id) {
          res.status(404);
          throw new Error('Restaurant not found');
        }

        if (!result[0]._options.isNewRecord) {
          result[0].destroy();
        }
        res.status(200).send({ liked: result[0]._options.isNewRecord });
      })
      .catch(next);
  }

  // [PUT] /action/rateResAction
  rateResAction(req, res, next) {
    Rate_res.findOrCreate({
      where: { user_id: req.body.user_id, res_id: req.body.res_id },
      defaults: {
        rating: req.body.rateStar,
      },
    })
      .then((result) => {
        if (!result[0].user_id) {
          res.status(404);
          throw new Error('User not found');
        }
        if (!result[0].res_id) {
          res.status(404);
          throw new Error('Restaurant not found');
        }

        if (!result[0]._options.isNewRecord) {
          result[0].update({ rating: req.body.rateStar });
        }
        res.status(200).send({ rating: result[0].rating });
      })
      .catch(next);
  }

}

module.exports = new ActionController();
