//redireciona o usuario logado middleware
function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect("/db");//redireciona para pagina do usuario
    }
    next();//chama a proxima função da rota
  }
  
  //redireciona o usuario deslogado middleware
  function checkNotAuth(req, res, next) {
    if (req.isAuthenticated()) {
      return next();//chama a proxima função da rota
    }
    res.redirect("/login");//redireciona para o login
  }

  export { checkAuth, checkNotAuth }