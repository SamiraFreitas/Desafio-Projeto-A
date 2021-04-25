//import {render}   from 'ejs';
import express from "express";
import path from 'path';
import bcrypt from 'bcrypt';
const PORT = process.env.PORT || 5000;
import session from "express-session";
import flash from "express-flash";
import { Pool } from 'pg';
import passport from "passport";
import {initialize as initializePassport} from './passportConfig';
import { RepublicaService } from "./services/RepublicaServices";
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

app.use(express.static(path.join(__dirname, '../public')))
.set('views', path.join(__dirname, '../views'))
.set('view engine', 'ejs');
  
  app.use(express.urlencoded({ extended: false}));
  app.get('/db',checkNotAuth,(req,res)=>{
    const usuario: any =(req.user)?req.user:null;
     res.render('pages/db', {"usuario":usuario});
    
    })

  app.get('/',(req,res)=>{
    const usuario: any =(req.user)?req.user:null;
    res.render('pages/index',{"usuario":usuario})
  
  });//renderiza a página home

  app.get('/inscreva-se',checkAuth,(req,res)=>{
    const usuario: any =(req.user)?req.user:null;
    res.render('pages/inscreva-se',{"usuario":usuario})
  });//renderiza página escreva
  
  app.get('/login',checkAuth,(req,res)=>{
    const usuario: any =(req.user)?req.user:null;
    res.render('pages/login',{"usuario":usuario})
  });//renderiza página login
  
  app.get('/republicas', async (req,res)=>{//conecta o banco de dados a página de republicas
    try{
      const republicaService = new RepublicaService();
      const republicas = await republicaService.listaRepublicas();
      const usuario: any = (req.user)?req.user:null;
      res.render('pages/republicas',{"usuario":usuario,"republicas":republicas});//renderiza a página
      //libera
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
    let errors =[];
    interface Usuario{
      name:string,
      email:string,
      password:string,
      password2:string
    }
    
      const usuario : Usuario = req.body;
    
      if(!usuario.email||!usuario.password||!usuario.password2){
      errors.push({message:'Preencha todos os campos!'});
    }
    if(usuario.password!=usuario.password2){
      errors.push({message:'As senhas não conferem'});
    }
    if(errors.length >0){
      res.render("pages/inscreva-se",{errors});
    }else{
      //validação dos campos de login sucedida
      let hashedPassword = await bcrypt.hash(usuario.password,10);
      const client = await pool.connect();//conecta com o banco
      client.query(//Verifica se existe algum usuario no banco com o mesmo email digitado
        `SELECT * FROM usuarios
        WHERE email=$1`,
        [usuario.email],
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
              [usuario.name,usuario.email,hashedPassword],
              (err,results)=>{
                if(err){
                  throw err;
                }
                //se o cadastro der certo redireciona pra pagina de login com a mensagem
                client.release();
                req.flash('success_msg',usuario.name+ " você está registrado, por favor faça login")
                res.redirect("/login");
              }
            )
          }
        }
      )
    }
})

  app.post("/db",(req,res)=>{
    const republicaService = new RepublicaService();
    republicaService.create(req,res);
  } )
  

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