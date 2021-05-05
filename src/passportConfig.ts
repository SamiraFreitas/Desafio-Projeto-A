import { Strategy as LocalStrategy } from "passport-local";
import { Pool } from "pg";
import bcrypt from "bcrypt";

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    const client = await pool.connect(); //conecta com o banco
    client.query(
      //verifica se existe o email no banco de dados
      `SELECT * FROM usuarios
             WHERE email=$1`,
      [email],
      (err, results) => {
        if (err) {
          throw err;
        } else {
          if (results.rows.length) {
            //encontrou um usuario no banco
            const user = results.rows[0]; //pega o usuario

            bcrypt.compare(password, user.senha, (err, isMatch) => {
              if (err) {
                client.release();
                throw err;
              }
              if (isMatch) {
                client.release();
                return done(null, user); //retorna o usuario
              } else {
                client.release();
                return done(null, false, { message: "Senha invalida" }); //retorna erro e a mensagem senha invalida
              }
            });
          } else {
            client.release();
            return done(null, false, { message: "Email invalido" }); //retorna o erro se não for encontrado email
          }
        }
      }
    );
  };
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      authenticateUser
    )
  );
  passport.serializeUser((user, done) => done(null, user.id_user));

 
  passport.deserializeUser(async (id, done) => {
    try{
    const client = await pool.connect(); //conecta com o banco
    //pega o usuario pelo id recebido do passport
    client.query(
      `SELECT * FROM usuarios WHERE id_user = $1`,
      [id],
      
      (err, results) => {
        if (err) {
          client.release();
          throw err;
        } else {
          client.release();
          return done(null, results.rows[0]); //usa o id para pegar os detalhes e armazenar na sessão
        }
      }
    );
    }catch(e){
        console.log(e);
    }
  });
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
export  { initialize };
