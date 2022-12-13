const { DataTypes, Model, Op } = require('sequelize');
const { sequelize } = require('../../config/db');
const SequelizeSlugify = require('sequelize-slugify');

class Restaurant extends Model {}

Restaurant.init(
  {
    res_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'res_id',
      allowNull: false,
      autoIncrement: true,
    },
    res_name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'res_name',
    },
    image: {
      type: DataTypes.STRING,
    },
    desc: {
      type: DataTypes.STRING,
    },
    videoID: {
      type: DataTypes.STRING,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: 'Restaurant',
    tableNames: 'restaurants',
    timestamps: true,
    paranoid: true,
  },
);

// Like_res.belongsTo(Restaurant, {
//   foreignKey: 'res_id',
// });

// Add plugins
SequelizeSlugify.slugifyModel(Restaurant, {
  source: ['res_name'],
  overwrite: true,
  column: 'slug',
  bulkUpdate: true,
});

// const test = Like_res.findOne({
//   where: {
//     'res_id' : 11
//   },
//   include: Restaurant
// })

module.exports = Restaurant;
