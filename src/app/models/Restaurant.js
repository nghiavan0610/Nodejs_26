const { DataTypes, Model, Op } = require('sequelize');
const { sequelize } = require('../../config/db');
const SequelizeSlugify = require('sequelize-slugify');

class Restaurant extends Model {}

Restaurant.init(
  {
    res_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    res_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    image: {
      type: DataTypes.TEXT('long'),
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
    timestamps: true,
    paranoid: true,
  },
);

// Add plugins
SequelizeSlugify.slugifyModel(Restaurant, {
  source: ['res_name'],
  overwrite: true,
  column: 'slug',
  bulkUpdate: true,
});

module.exports = Restaurant;
