import {Request,Response} from "express";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";


class UsuarioController {

      mostraIndex(req:Request, res:Response) {
        const usuario: any = req.user ? req.user : null;
        res.render("pages/index", { usuario: usuario });
      }

      mostraLogin(req:Request, res:Response) {
        const usuario: any = req.user ? req.user : null;
        res.render("pages/login", { usuario: usuario });
      }

      mostraInscreva(req:Request, res:Response){
          const usuario: any = req.user ? req.user : null;
          res.render("pages/inscreva-se", { usuario: usuario });
      }

      logout(req:Request, res:Response){
          req.logOut();
          req.flash("success_msg", "você foi desconectado");
          res.redirect("/login");
      }      

       async inscreve(req:Request, res:Response) {
        let errors = [];
        interface Usuario {
          name: string;
          email: string;
          password: string;
          password2: string;
        }
      
        const usuario: Usuario = req.body;
        console.log(usuario);
      
        if (!usuario.email || !usuario.password || !usuario.password2) {
          errors.push({ message: "Preencha todos os campos!" });
        }
        if (usuario.password != usuario.password2) {
          errors.push({ message: "As senhas não conferem" });
        }
        if (errors.length > 0) {
          res.render("pages/inscreva-se", {"errors": errors,"usuario":null });
        } else {
          //validação dos campos de login sucedida
          let hashedPassword = await bcrypt.hash(usuario.password, 10);
          const client = await pool.connect(); //conecta com o banco
          client.query(
            //Verifica se existe algum usuario no banco com o mesmo email digitado
            `SELECT * FROM usuarios
              WHERE email=$1`,
            [usuario.email],
            (err, results) => {
              if (err) {
                throw err;
              }
              if (results.rows.length > 0) {
                errors.push({ message: "email já registrado" });
                res.render("pages/inscreva-se", {"errors": errors,"usuario":null });
              } else {
                pool.query(
                  //usuario valido insere no banco de dados
                  `INSERT INTO usuarios (id_user,nome_usuario,email,senha)
                    VALUES ($1,$2,$3,$4)
                    RETURNING id_user,senha`,
                  [uuid(),usuario.name, usuario.email, hashedPassword],
                  (err, results) => {
                    if (err) {
                      throw err;
                    }
                    //se o cadastro der certo redireciona pra pagina de login com a mensagem
                    client.release();
                    req.flash("success_msg","Cadastro foi um Sucesso");
                    res.redirect("/login");
                  }
                );
              }
            }
          );
        }
      }
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
export {UsuarioController}