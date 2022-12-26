const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');

class Food_type extends Model {}

Food_type.init(
  {
    type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      unique: true,
    },
    type_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: 'Food_type',
    tableNames: 'food_types',
    timestamps: false,
  },
);

module.exports = Food_type;
