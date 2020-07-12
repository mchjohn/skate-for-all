// modulos do node
const express = require('express');
const slugify = require('slugify');

// meus modulos
// models
const Category = require('../categories/Category');
const Article = require('./Article');
// Middlewares
const adminAuth = require('../middlewares/adminAuth');
const isAuth = require('../middlewares/isAuth');

// Config. rotas
const router = express.Router();

// Rotas

// Rota de artigos
router.get('/articles', isAuth, (req, res) => {
  Article.findAll({
    limit: 4,
    order: [
      ['id', 'DESC']
    ],
    include: [{model: Category}]
  }).then(articles => {
    res.render('articles', {articles});
  });
});

// Rota de artigos de admin
router.get('/admin/articles', adminAuth, (req, res) => {
  Article.findAll({
    limit: 4,
    include: [{model: Category}],
    order: [
      ['id', 'DESC']
    ]
  }).then(articles => {
    res.render('admin/articles/articles', {articles, isLogged});
  });
});

// rota para cadastrar artigo
router.get('/admin/articles/new', adminAuth, (req, res) => {
  var titleError = req.flash('titleError');
  var bodyError = req.flash('bodyError');
  var authorError = req.flash('authorError');

  // buscando as mensagens
  var title = req.flash('title');
  var body = req.flash('body');
  var author = req.flash('author');

  // validando erros
  titleError = (titleError == undefined || titleError.length == 0) ? undefined : titleError;
  bodyError = (bodyError == undefined || bodyError.length == 0) ? undefined : bodyError;
  authorError = (authorError == undefined || authorError.length == 0) ? undefined : authorError;

  // validando valores vindos do formulário
  title = (title == undefined || title.length == 0) ? "" : title;
  body = (body == undefined || body.length == 0) ? "" : body;
  author = (author == undefined || author.length == 0) ? "" : author;

  Category.findAll().then(categories => {
    res.render('admin/articles/new', {categories, titleError, bodyError, authorError, title: title, body, author});
  })
});

// Rota para salvar artigos
router.post('/articles/save', adminAuth, (req, res) => {
  var titleCru = req.body.title;
  var title = titleCru.trim();
  var body = req.body.body;
  var author = req.body.author;
  var category = req.body.category;

  var titleError;
  var bodyError;
  var authorError;

  if(title == undefined || title.length < 10) {
    titleError = "Título deve ser maior.";
  }

  if(body == undefined || body.length < 250) {
    bodyError = "Artigo deve conter mais de 250 caracteres.";
  }

  if(author == undefined || author.length < 3) {
    authorError = "Autor deve ser maior.";
  }

  if(titleError != undefined || bodyError != undefined || authorError != undefined) {
    req.flash('titleError', titleError);
    req.flash('bodyError', bodyError);
    req.flash('authorError', authorError);

    req.flash('title', title);
    req.flash('body', body);
    req.flash('author', author);

    res.redirect('/admin/articles/new');
  } else {
    Article.create({
      title,
      slug: slugify(title),
      body,
      author,
      categoryId: category
    }).then(() => {
      res.redirect('/articles');
    });
  }
});

// Rota de paginção
router.get('/articles/page/:num', (req, res) => {
  var page = req.params.num;
  isLogged = req.session.user;
  var offset = 0;

  if(isNaN(page) || page == 1) {
    offset = 0;
  } else {
    offset = (parseInt(page) - 1) * 4;
  };

  Article.findAndCountAll({
    limit: 4,
    offset,
    order: [
      ['id', 'DESC']
    ]
  }).then((articles) => {
    var next;

    if(offset + 4 >= articles.count) {
      next = false;
    } else {
      next = true;
    }

    var result = {
      page: parseInt(page),
      next,
      articles
    }

    Category.findAll().then(categories => {
      res.render('page', {result, categories, isLogged});
    });
  });
});

module.exports = router;