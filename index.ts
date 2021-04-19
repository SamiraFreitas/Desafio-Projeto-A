//import {render}   from 'ejs';
import express from "express";
import path from 'path';
import bcrypt from 'bcrypt';
const PORT = process.env.PORT || 5000;
import session from "express-session";
import flash from "express-flash";
import { Pool } from 'pg';
import passport from "passport";
import initializePassport from './passportConfig';
const app = express();

initializePassport(passport);//inicia o passport com a config 

app.use(session({
  secret: process.env.SECRET || 'secret',
  resave : false,
  saveUninitialized:false
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(express.static(path.join(__dirname, 'public')))
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs');
  
  app.use(express.urlencoded({ extended: false}));
  app.get('/db',checkNotAuth,(req,res)=>{
    const usuario =
    {'usuario':(req.user)?
    req.user:
    null};
     res.render('pages/db', usuario);
    
    })
  app.get('/',(req,res)=>res.render('pages/index'));//renderiza a página home
  app.get('/inscreva-se',checkAuth,(req,res)=>res.render('pages/inscreva-se'));//renderiza página escreva
  app.get('/login',checkAuth,(req,res)=>res.render('pages/login'));//renderiza página login
  app.get('/republicas', async (req,res)=>{//conecta o banco de dados a página de republicas
    try{
    const client = await pool.connect();//conecta o banco de dados
    const result = await client.query('SELECT * FROM republicas');//seleciona tudo da tabela de teste
    const results = 
      {'results':(result)?
      result.rows:
      null}
      res.render('pages/republicas',results);//renderiza a página
      client.release();//libera
    }catch(err){
      console.log(err);
      res.send("Erro: "+err);
    }
  })
app.get('/logout',(req,res)=>{
  req.logOut();
  req.flash("success_msg","você foi desconectado");
  res.redirect("/login");
})

  app.post('/inscreva-se', async(req,res)=>{
    let name:string = req.body.name;
    let email:string = req.body.email;
    let password = req.body.password;
    let password2 = req.body.password2;
    let errors =[];
    if(!email||!password||!password2){
      errors.push({message:'Preencha todos os campos!'});
    }
    if(password!=password2){
      errors.push({message:'As senhas não conferem'});
    }
    if(errors.length >0){
      res.render("pages/inscreva-se",{errors});
    }else{
      //validação dos campos de login sucedida
      let hashedPassword = await bcrypt.hash(password,10);
      const client = await pool.connect();//conecta com o banco
      client.query(//Verifica se existe algum usuario no banco com o mesmo email digitado
        `SELECT * FROM usuarios
        WHERE email=$1`,
        [email],
        (err,results)=>{
          if(err){
            throw err;
          }
          if(results.rows.length>0){
            errors.push({message: "email já registrado"});
            res.render("pages/inscreva-se",{errors});
          }else{
            pool.query(//usuario valido insere no banco de dados
              `INSERT INTO usuarios (nome_usuario,email,senha)
              VALUES ($1,$2,$3)
              RETURNING id,senha`,
              [name,email,hashedPassword],
              (err,results)=>{
                if(err){
                  throw err;
                }
                //se o cadastro der certo redireciona pra pagina de login com a mensagem
                client.release();
                req.flash('success_msg',name+ " você está registrado, por favor faça login")
                res.redirect("/login");
              }
            )
          }
        }
      )
    }
})


  app.post("/login",passport.authenticate('local',{
    successRedirect: "/db",
    failureRedirect: "/login",
    failureFlash: true
  })
  )
  //redireciona o usuario logado middleware
  function checkAuth(req,res,next){
    if(req.isAuthenticated()){
      return res.redirect('/db');
    }
    next();
  }

  //redireciona o usuario deslogado middleware
function checkNotAuth(req,res,next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

  app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
 
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});