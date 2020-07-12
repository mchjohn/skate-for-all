function isAuth(req, res, next) {
  if(req.session.user != undefined) {
    res.redirect('/admin/articles');
  } else {
    next();
  }
}

module.exports = isAuth;