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
  },
  url1: {
    type: Sequelize.STRING
  },
  url2: {
    type: Sequelize.STRING
  },
  url3: {
    type: Sequelize.STRING
  },
  url4: {
    type: Sequelize.STRING
  },
  url5: {
    type: Sequelize.STRING
  },
  url6: {
    type: Sequelize.STRING
  },
  url7: {
    type: Sequelize.STRING
  },
  url8: {
    type: Sequelize.STRING
  },
  url9: {
    type: Sequelize.STRING
  },
  url10: {
    type: Sequelize.STRING
  }
});

// definindo relacionamento
Category.hasMany(Article); // 1 categoria => muitos artigos
Article.belongsTo(Category); // 1 artigo => 1 categoria

// sincronizando o banco de dados
// Article.sync({force: true});

module.exports = Article;