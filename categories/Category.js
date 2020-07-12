// modulos do node
const Sequelize = require('sequelize');

// meus modulos
const connection = require('../database/database');

// definindo modulo
const Category = connection.define('categories', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  }, slug: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

// sincronizando o banco de dados
// Category.sync({force: true});

module.exports = Category;