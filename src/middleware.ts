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
  function checkAdm(req,res,next){
    const usuario: any = req.user ? req.user : null;
    if(usuario.id_user==="7b7b6dc6-579c-4fa9-b1d8-c6f046fc2b24                                                                                                                                                                    "){
      return next();
    }
    res.redirect("/")
  }
  export { checkAuth, checkNotAuth, checkAdm }