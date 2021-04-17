const { render } = require('ejs');
const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');

app = express();

app.use(express.static(path.join(__dirname, 'public')))
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs');

  app.use(express.urlencoded({ extended: false}));
  app.get('/db',(req,res)=>{console.log('oi'); res.render('pages/db')})
  app.get('/',(req,res)=>res.render('pages/index'));//renderiza a página home
  app.get('/inscreva-se',(req,res)=>res.render('pages/inscreva-se'));//renderiza página escreva
  app.get('/login',(req,res)=>res.render('pages/login'));//renderiza página login
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
  app.post('/inscreva-se', async(req,res)=>{
    console.log('oi')
    let email = req.body.email;
    let password = req.body.password;
    let password2 = req.body.password2;
    console.log(  email,password,password2);
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
      //validação sucedida
      let hashedPassword = await bcrypt.hash(password,10);
      const client = await pool.connect();
      client.query(
        `SELECT * FROM usuarios
        WHERE email=$1`,
        [email],
        (err,results)=>{
          if(err){
            throw err;
          }
          console.log(results.rows);
          if(results.rows.length>0){
            errors.push({message: "email já registrado"});
            res.render("pages/inscreva-se",{errors});
          }
        }
      )
    }
})

  app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
 
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});