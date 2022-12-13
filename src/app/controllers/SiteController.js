const Restaurant = require('../models/Restaurant');
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const { multipleSequelizeToJSON } = require('../../ulti/sequelize');

class SiteController {
  // [GET] /
  index(req, res, next) {
    Restaurant.findAll()
      .then((restaurants) =>
        res.render('home', {
          restaurants: multipleSequelizeToJSON(restaurants),
        }),
      )
      .catch(next);
  }

  // // [GET] /
  // index = async(req,res) => {
  //     try{
  //         const restaurants = await sequelize.query("select * from Restaurant", {
  //             type: QueryTypes.SELECT
  //         });
  //         res.render('home', {restaurants});
  //     }catch(err){
  //         res.send(err)
  //     }
  // }
}

module.exports = new SiteController();
