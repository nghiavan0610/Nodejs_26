const Restaurant = require('../models/Restaurant');
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const { multipleSequelizeToJSON } = require('../../ulti/sequelize');

class LikeResController {
  // [GET] /
  likeUnlike(req, res, next) {
    console.log(req.params, req.body);
    Like_res.findOrCreate({
      where: { user_id: req.params.user_id, res_id: req.body.res_id },
      defaults: {
        date_like: new Date(),
      },
    }).then((result) => {
      console.log(result);
      if (result[0]._options.isNewRecord) {
        // res.render(result);
      } else {
        result[0].destroy();
      }
    });
  }
}

module.exports = new LikeResController();
