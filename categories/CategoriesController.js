// modulos do node
const express = require('express');
const slugify = require('slugify');

// meus modulos
// models
const Category = require('./Category');
const adminAuth = require('../middlewares/adminAuth');

// Config. rotas
const router = express.Router();

// Rotas

// Rota para formulário de categoria
router.get('/admin/categories/new', adminAuth, (req, res) => {
  res.render('admin/categories/new');
})

// rota para salvar a categoria
router.post('/categories/save', adminAuth, (req, res) => {
  var title = req.body.title;

  if(title != undefined) {

    Category.create({
      title,
      slug: slugify(title)
    }).then(() => {
      res.redirect('/');
    });

  } else {
    res.redirect('/admin/categories/new');
  }
});

module.exports = router;