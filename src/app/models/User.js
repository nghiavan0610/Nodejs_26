const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');
const SequelizeSlugify = require('sequelize-slugify');

class User extends Model {}

User.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'user_id',
      allowNull: false,
      autoIncrement: true,
      unique: true,
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'full_name',
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
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
    modelName: 'User',
    tableNames: 'users',
    defaultScope: {
      attributes: {
        exclude: ['password'],
      },
    },
    timestamps: true,
    paranoid: true,
  },
);

// Add plugins
SequelizeSlugify.slugifyModel(User, {
  source: ['user_name'],
  overwrite: true,
  column: 'slug',
  bulkUpdate: true,
});

module.exports = User;
