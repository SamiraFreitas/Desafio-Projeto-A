const LocalStrategy = require('passport-local').Strategy;
const { Pool } = require("pg")
const bcrypt = require("bcrypt");



function initialize(passport) {
    const authenticateUser = async(email,password,done)=>{
        const client = await pool.connect();//conecta com o banco
        client.query(//verifica se existe o email no banco de dados
            `SELECT * FROM usuarios
             WHERE email=$1`,
             [email],(err,results)=>{
                 if(err){
                     throw err;
                 }else{
                     console.log(results.rows);
                     if(results.rows.length){//encontrou um usuario no banco
                        const user = results.rows[0];//pega o usuario

                        bcrypt.compare(password,user.senha,(err, isMatch)=>{
                            if (err){
                                client.release();
                                throw err;
                            }
                            if(isMatch){
                                client.release();
                                return done(null,user);//retorna o usuario 
                            }else{
                                client.release();
                                return done(null,false,{message:"Senha invalida"});//retorna erro e a mensagem senha invalida
                            }
                        })
                     }else{
                        client.release();
                         return(done(null,false,{message:"Email invalido"}));//retorna o erro se não for encontrado email
                     }
                 }
             }

        );
    };
    passport.use(
        new LocalStrategy({
            usernameField: "email",
            passwordField: "password"
        },
         authenticateUser
        )
    );
    passport.serializeUser((user,done)=>done(null,user.id));

    passport.deserializeUser(async (id,done)=>{
        const client = await pool.connect();//conecta com o banco
        client.query(//pega o usuario pelo id recebido do passport
            client.query(
                `SELECT * FROM usuarios WHERE id = $1`,
                [id], (err,results)=>{
                    if(err){
                        client.release();
                        throw err;
                    }else{
                        client.release();
                        return done(null, results.rows[0]);//usa o id para pegar os detalhes e armazenar na sessão
                    }
                }
            )
        );
    });
  }

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
module.exports = initialize;