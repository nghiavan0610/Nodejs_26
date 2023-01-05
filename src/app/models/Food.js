const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');
const Food_type = require('./Food_type');
const Restaurant = require('./Restaurant');

class Food extends Model {}

Food.init(
  {
    food_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      unique: true,
    },
    res_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Restaurant,
        key: 'res_id',
      },
    },
    food_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT('long'),
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    desc: {
      type: DataTypes.STRING,
    },
    type_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Food_type,
        key: 'type_id',
      },
    },
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: 'Food',
    timestamps: true,
    paranoid: true,
  },
);

// Associations
Restaurant.hasMany(Food, {
  sourceKey: 'res_id',
  foreignKey: 'res_id',
  onDelete: 'CASCADE',
  hooks: true,
});
Food.belongsTo(Restaurant, {
  foreignKey: 'res_id',
});

Food_type.hasMany(Food, {
  sourceKey: 'type_id',
  foreignKey: 'type_id',
  onDelete: 'CASCADE',
  hooks: true,
});
Food.belongsTo(Food_type, {
  foreignKey: 'type_id',
});

module.exports = Food;
