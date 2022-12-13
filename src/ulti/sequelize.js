module.exports = {
  multipleSequelizeToJSON: function (sequelizes) {
    return sequelizes.map((sequelize) => sequelize.toJSON());
  },
  sequelizeToJSON: function (sequelize) {
    return sequelize ? sequelize.toJSON() : sequelize;
  },
};
