import {Request, Response} from "express";
import {Republica} from "./RepublicaController"
import { Pool } from "pg";

class AdminController{  
    async renderADM(req:Request,res:Response){
        
      const client = await pool.connect(); //conecta o banco de dados
      const result = await client.query("SELECT * FROM republicas"); //seleciona tudo da tabela de teste
      const results: Republica[] = result ? result.rows : null;
      client.release();
      const usuario: any = req.user ? req.user : null;
      return res.render("pages/adm", {
        usuario: usuario,
        republicas: results,
      });

    }
    async attStatus(req:Request,res:Response){
        const client = await pool.connect(); //conecta o banco de dados
         
        const status = req.body.status;
        const id = req.body.id_rep;
        for(let i = 0;i<status.length;i++){
            const result = await client.query(`UPDATE republicas SET status=${status[i]} WHERE id_rep='${id[i]}'`);
        }
        console.log(status,id)
        res.redirect("/adm");
  
      }

}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  export { AdminController };