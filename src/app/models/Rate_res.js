const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');

const Restaurant = require('./Restaurant');
const User = require('./User');

class Rate_res extends Model {}

Rate_res.init(
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
    rating: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: 'Rate_res',
    tableNames: 'rate_res',
    timestamps: true,
  },
);

// Associations
Restaurant.hasMany(Rate_res, {
  foreignKey: 'res_id',
  onDelete: 'CASCADE',
  hooks: true,
});
Rate_res.belongsTo(Restaurant, {
  foreignKey: 'res_id',
});

User.hasMany(Rate_res, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  hooks: true,
});
Rate_res.belongsTo(User, {
  foreignKey: 'user_id',
});



module.exports = Rate_res;
