const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');
const User = require('./User');

class Order extends Model {}

Order.init(
  {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'order_id',
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
      type: DataTypes.FLOAT,
    },
    discount: {
      type: DataTypes.FLOAT,
    },
    status: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: 'Order',
    tableNames: 'orders',
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
