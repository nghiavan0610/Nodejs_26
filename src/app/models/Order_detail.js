const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');
const Order = require('./Order');
const Food = require('./Food');

class Order_detail extends Model {}

Order_detail.init(
  {
    order_detail_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      unique: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Order,
        key: 'order_id',
      },
    },
    food_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Food,
        key: 'food_id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: 'Order_detail',
    tableNames: 'order_details',
    timestamps: true,
    paranoid: true,
  },
);

// Associations
Order.hasMany(Order_detail, {
  sourceKey: 'order_id',
  foreignKey: 'order_id',
  onDelete: 'CASCADE',
  hooks: true,
});
Order_detail.belongsTo(Order, {
  foreignKey: 'order_id',
});

Food.hasMany(Order_detail, {
  sourceKey: 'food_id',
  foreignKey: 'food_id',
  onDelete: 'CASCADE',
  hooks: true,
});
Order_detail.belongsTo(Food, {
  foreignKey: 'food_id',
});



module.exports = Order_detail;