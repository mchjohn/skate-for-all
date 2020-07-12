// modulos do node
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');

// meus modulos
const connection = require('./database/database');
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const usersController = require('./users/UserController');
// models
const Article = require('./articles/Article');
const Category = require('./categories/Category');
const User = require('./users/User');

// instâncias dos modulos
const app = express();

// config. de view engine
app.set('view engine', 'ejs');

// config. para arquivos estáticos
app.use(express.static('public'));

// config. Body-Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// config. do cookie-parser
app.use(cookieParser('skateforever'));

// config. express-session
app.use(session({
  secret: 'skateeterno',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 86400000}
}));

// config. do express-flash
app.use(flash());

// Conexão com o banco de dados
connection
  .authenticate()
  .then(() => {
    console.log("Conexão com o banco ok.");
  }).catch((error) => {
    console.log(error);
  });

// config. de rotas
app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', usersController);

// rotas

// rota para home
app.get('/', (req, res) => {
  isLogged = req.session.user;
  res.render('home', {isLogged});
});

// Rota para ler artigo
app.get('/:slug', (req, res) => {
  var slug = req.params.slug;
  isLogged = req.session.user;

  Article.findOne({
    where: {
      slug
    }
  }).then(article => {
    if(article != undefined) {
      res.render('article', {article, isLogged});
    } else {
      res.redirect('/articles');
    }
  }).catch(err => {
    res.redirect('/articles');
  })
});

// Rota para listar artigos de uma categoria especifica
app.get('/category/:slug', (req, res) => {
  var slug = req.params.slug;
  isLogged = req.session.user;

  Category.findOne({
    where: {
      slug
    },
    include: [{model: Article}]
  }).then(category => {
    if(category != undefined) {
      Category.findAll().then(categories => {
        res.render('homeCategory', {articles: category.articles, categories, category, isLogged});
      });
    } else {
      res.redirect('/articles');
    }
  }).catch(err => {
    res.redirect('/articles');
  });
});

// config. servidor
app.listen(8181, () => {
  console.log("Servidor rodando na porta 8181");
});