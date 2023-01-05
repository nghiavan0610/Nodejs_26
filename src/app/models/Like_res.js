const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');

const Restaurant = require('./Restaurant');
const User = require('./User');

class Like_res extends Model {}

Like_res.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'user_id',
      },
    },
    res_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Restaurant,
        key: 'res_id',
      },
    },
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: 'Like_res',
    timestamps: true,
  },
);

// Associations
Restaurant.hasMany(Like_res, {
  sourceKey: 'res_id',
  foreignKey: 'res_id',
  onDelete: 'CASCADE',
  hooks: true,
});
Like_res.belongsTo(Restaurant, {
  foreignKey: 'res_id',
});

User.hasMany(Like_res, {
  sourceKey: 'user_id',
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  hooks: true,
});
Like_res.belongsTo(User, {
  foreignKey: 'user_id',
});

module.exports = Like_res;
