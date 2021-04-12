const cool = require('cool-ascii-faces');
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/',(req,res)=>res.render('pages/index'))
  .get('/index',(req,res)=>res.render('pages/index'))
  .get('/inscreva-se',(req,res)=>res.render('pages/inscreva-se'))
  .get('/login',(req,res)=>res.render('pages/login'))
  //.get('/republicas',(req,res)=>res.render('pages/republicas'))
  .get('/republicas', async (req,res)=>{
    try{
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM test_table');
    const results = 
      {'results':(result)?
      result.rows:
      null}
      res.render('pages/republicas',results);
      client.release();
    }catch(err){
      console.log(err);
      res.send("Erro: "+err);
    }
  })
  // .get('/', (req, res) => res.render('pages/index'))
  //.get('/times', (req,res)=> res.send(showTimes()))
  //.get('/cool',(req,res)=>res.send(cool()))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
 
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});