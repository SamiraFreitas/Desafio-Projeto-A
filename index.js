const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
app = express();

app.use(express.static(path.join(__dirname, 'public')))
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs');

  app.use(express.urlencoded({extended : false}));

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
  app.post('/users/inscreva-se',(req,res)=>{
    let {name,email,password,password2}=req.body;
    console.log(
      name,
      email,
      password,
      password2
    )
  })
  app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
 
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});