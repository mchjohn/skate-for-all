// modulos do node
const Sequelize = require('sequelize');

// meus modulos
const connection = require('../database/database');
const Category = require('../categories/Category');

// definindo modulo
const Article = connection.define('articles', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  }, slug: {
    type: Sequelize.STRING,
    allowNull: false
  },
  body: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  author: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

// definindo relacionamento
Category.hasMany(Article); // 1 categoria => muitos artigos
Article.belongsTo(Category); // 1 artigo => 1 categoria

// sincronizando o banco de dados
// Article.sync({force: true});

module.exports = Article;