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
        key: 'user_id'
      }
    },
    res_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Restaurant,
        key: 'res_id'
      }
    },
    date_like: {
      type: DataTypes.DATE,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: 'Like_res',
    tableNames: 'like_res',
    timestamps: false,
  },
);

Restaurant.hasMany(Like_res, {
  foreignKey: 'res_id',
});
Like_res.belongsTo(Restaurant, {
  foreignKey: 'res_id',
});

User.hasMany(Like_res, {
  foreignKey: 'user_id',
});
Like_res.belongsTo(User, {
  foreignKey: 'user_id',
});



module.exports = Like_res;
