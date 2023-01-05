const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');
const User = require('./User');
const Restaurant = require('./Restaurant');

class Order extends Model {}

Order.init(
  {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      unique: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'user_id',
      },
    },
    total_price: {
      type: DataTypes.INTEGER,
    },
    discount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: true,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: 'Order',
    timestamps: true,
    paranoid: true,
  },
);

// Associations
User.hasMany(Order, {
  sourceKey: 'user_id',
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  hooks: true,
});
Order.belongsTo(User, {
  foreignKey: 'user_id',
});

module.exports = Order;
