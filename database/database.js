// modulos do node
const Sequelize = require('sequelize');

// objeto de conexão
const connection = new Sequelize('skateforall', 'root', '200592', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
  timezone: '-03:00'
});

module.exports = connection;