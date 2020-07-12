// modulos do node
const express = require('express');
const bcrypt = require('bcrypt');

// instâncias dos modulos
const router = express.Router();

// Meu modulos
// Models
const User = require('./User');

// Rota forulário para criar novo usuário
router.get('/admin/users/new', (req, res) => {
  var emailError = req.flash('emailError');
  var passwordError = req.flash('passwordError');
  var emailAlreadyExists = req.flash('emailAlreadyExists');
  var registeredUser = req.flash('registeredUser');

  // buscando as mensagens
  var email = req.flash('email');
  var password = req.flash('password');
  var emailExists = req.flash('emailExists');
  var registerUser = req.flash('registerUser');

  // validando erros
  emailError = (emailError == undefined || emailError.length == 0) ? undefined : emailError;
  passwordError = (passwordError == undefined || passwordError.length == 0) ? undefined : passwordError;
  emailAlreadyExists = (emailAlreadyExists == undefined || emailAlreadyExists.length == 0) ? undefined : emailAlreadyExists;
  registeredUser = (registeredUser == undefined || registeredUser.length == 0) ? undefined : registeredUser;

  // validando valores vindos do formulário
  email = (email == undefined || email.length == 0) ? "" : email;
  password = (password == undefined || password.length == 0) ? "" : password;
  emailExists = (emailExists == undefined || emailExists.length == 0) ? "" : emailExists;
  registerUser = (registerUser == undefined || registerUser.length == 0) ? "" : registerUser;


  res.render('admin/users/create', {emailError, passwordError, email, password, emailAlreadyExists, registeredUser});
})

// Rota para receber dados do usuário
router.post('/users/new', (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  // criando variáveis de erro
  var emailError;
  var passwordError;
  var emailAlreadyExists;
  var registeredUser;

  if(email == undefined || email.length < 4) {
    emailError = "Digite um email válido.";
  }

  if(password == undefined || password.length < 6) {
    passwordError = "A senha deve conter mais de 5 caracteres.";
  }

  if(emailError != undefined || passwordError != undefined) {
    req.flash('emailError', emailError);
    req.flash('passwordError', passwordError);

    req.flash('email', email);
    req.flash('password', password);

    res.redirect('/admin/users/new');
  } else {
    User.findOne({where: {email}}).then(user => {
      if(user == undefined) {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
  
        User.create({
          email,
          password: hash
        }).then(() => {
          registeredUser = "Cadastrado com sucesso. Faça login abaixo."

          if(registeredUser != undefined) {
            req.flash('registeredUser', registeredUser);
          };

          res.redirect('/admin/articles');
        }).catch((err) => {
          res.redirect('/admin/articles');
        });
      } else {
        emailAlreadyExists = "Email já cadastrado.";

        if(emailAlreadyExists != undefined) {
          req.flash('emailAlreadyExists', emailAlreadyExists);
        };
        res.redirect('/admin/users/new');
      };
    });
  };
});

// Rota para página de login
router.get('/login', (req, res) => {
  var unregisteredUser = req.flash('unregisteredUser');
  var incorrectPassword = req.flash('incorrectPassword');
  var registeredUser = req.flash('registeredUser');

  // buscando as mensagens
  var unregisterUser = req.flash('unregisterUser');
  var wrongPassword = req.flash('wrongPassword');
  var registerUser = req.flash('registerUser');

  // validando erros
  unregisteredUser = (unregisteredUser == undefined || unregisteredUser.length == 0) ? undefined : unregisteredUser;
  incorrectPassword = (incorrectPassword == undefined || incorrectPassword.length == 0) ? undefined : incorrectPassword;
  registeredUser = (registeredUser == undefined || registeredUser.length == 0) ? undefined : registeredUser;

  // validando valores vindos do formulário
  unregisterUser = (unregisterUser == undefined || unregisterUser.length == 0) ? "" : unregisterUser;
  wrongPassword = (wrongPassword == undefined || wrongPassword.length == 0) ? "" : wrongPassword;
  registerUser = (registerUser == undefined || registerUser.length == 0) ? "" : registerUser;

  res.render('admin/users/login', {unregisteredUser, incorrectPassword, registeredUser, unregisterUser});
});

// Rota para autenticar o susuário
router.post('/authentication', (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  // Iniciando variável de erro
  var unregisteredUser;

  User.findOne({where: {email}}).then(user => {
    if(user != undefined) {
      var correct = bcrypt.compareSync(password, user.password);

      if(correct) {
        req.session.user = {
          id: user.id,
          email: user.email
        }
        res.redirect('/admin/articles');
      } else {
        incorrectPassword = "Senha incorreta.";

        if(incorrectPassword != undefined) {
          req.flash('incorrectPassword', incorrectPassword);
        };

        res.redirect('/login');
      }
    } else {
      unregisteredUser = "Usuário não cadastrado.";

      if(unregisteredUser != undefined) {
        req.flash('unregisteredUser', unregisteredUser);
      };

      res.redirect('/login');
    }
  });
});


// Rota para deslogar
router.get('/logout', (req, res) => {
  req.session.user = undefined;
  res.redirect('/articles');
})

module.exports = router;