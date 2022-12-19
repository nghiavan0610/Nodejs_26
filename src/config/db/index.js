const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('app_food', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql',
  port: '3306',
});

async function connect() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}



module.exports = { sequelize, connect };
