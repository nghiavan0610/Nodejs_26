const Restaurant = require('../models/Restaurant');
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const { multipleSequelizeToJSON } = require('../../ulti/sequelize');

class SiteController {
  // [GET] /
  index(req, res, next) {
    sequelize
      .query(
        'select res_id, res_name, `desc`, slug, image, (select count(user_id) from Like_res where Like_res.res_id = Restaurant.res_id) as totalLike, (select cast(avg(rating) as decimal(2,1)) from Rate_res where Rate_res.res_id = Restaurant.res_id) as rating from Restaurant',
        {
          type: QueryTypes.SELECT,
        },
      )
      .then((restaurants) =>
        res.render('home', {
          restaurants,
        }),
      )
      .catch(next);
  }
}

module.exports = new SiteController();
