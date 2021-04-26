//redireciona o usuario logado middleware
function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect("/db");
    }
    next();
  }
  
  //redireciona o usuario deslogado middleware
  function checkNotAuth(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  }

  export { checkAuth, checkNotAuth }