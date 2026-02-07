const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('CreditAgricole', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;