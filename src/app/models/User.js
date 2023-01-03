const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');

const SequelizeSlugify = require('sequelize-slugify');
const bcrypt = require('bcrypt');

class User extends Model {
  matchPassword(enterPassword) {
    return bcrypt.compareSync(enterPassword, this.password);
  }
}

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
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'invalid email',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        const hashedPassword = bcrypt.hashSync(value, 10);
        this.setDataValue('password', hashedPassword);
      },
    },
    role: {
      type: DataTypes.ENUM('user', 'manager', 'admin'),
      defaultValue: 'user',
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
    avatar: {
      type: DataTypes.TEXT('long'),
    },
  },
  {
    sequelize,
    freezeTableName: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    modelName: 'User',
    tableNames: 'users',
    defaultScope: {
      attributes: {
        exclude: ['password'],
      },
    },
    timestamps: true,
    paranoid: true,
    hooks: {
      afterSave: (record) => {
        delete record.dataValues.password;
      },
    },
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
