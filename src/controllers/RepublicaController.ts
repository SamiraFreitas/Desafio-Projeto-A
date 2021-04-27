import { Request, Response } from "express";
import { Pool } from "pg";
import {v4 as uuid} from "uuid";
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

interface Republica {
  nome_republica: string;
  rua: string;
  numero: number;
  bairro: string;
  cidade: string;
  whatsapp: string;
  video_game: string;
  n_quartos: number;
  n_suites: number;
  n_banheiros: number;
  wifi: number;
  trote: boolean;
  area_de_estudos: boolean;
  tv_a_cabo: boolean;
  area_externa: boolean;
  piscina: boolean;
  faxineira: boolean;
  almoco_diario: boolean;
  garagem: boolean;
  animais: boolean;
  img: string;
}

class RepublicaController {

  
   async renderizaRep(req:Request, res:Response){
     try{      
        const client = await pool.connect(); //conecta o banco de dados
        const result = await client.query("SELECT * FROM republicas"); //seleciona tudo da tabela de teste
        const results:Republica[] = result ? result.rows : null;
        
        client.release();
        const usuario: any = req.user ? req.user : null;
        return res.render("pages/republicas", { usuario: usuario,republicas: results}); //renderiza a página de republicas
 
      }catch(e){
        console.error(e);
      }
    };
 async create(req: Request, res: Response) {
    const usuario: any = req.user ? req.user : null;
    const rep: Republica = req.body;
    console.log(usuario);
    
    try {
      const client = await pool.connect(); //conecta o banco de dados
      const result: any = await client.query(
        //retorna a republica cadastrada pelo usuario logado
        `SELECT * FROM republicas 
        WHERE id_user=$1`,
        [usuario.id_user]
      );

      if (result.rows.length > 0) {
        //verifica se a republica já está cadastrada

        client.release();
        return res.render("pages/db", { usuario: usuario, r: result.rows[0] }); //se ja estiver cadastrada imprime a republica
      } else {
        //se não estiver cadastrada

        if (rep.img != null) {
          //verifica se o formulário foi enviado se sim cadastra a republica
          console.log("estou aqui", rep.whatsapp.toString().length);
          await client.query(
            `INSERT INTO republicas 
                    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)
                    RETURNING id_rep`,
            [
              uuid(),
              rep.nome_republica,
              rep.rua,
              rep.numero,
              rep.bairro,
              rep.cidade,
              rep.whatsapp,
              rep.video_game,
              rep.n_quartos,
              rep.n_suites,
              rep.n_banheiros,
              rep.wifi,
              rep.trote,
              rep.area_de_estudos,
              rep.tv_a_cabo,
              rep.area_externa,
              rep.piscina,
              rep.faxineira,
              rep.almoco_diario,
              rep.garagem,
              rep.animais,
              true,
              rep.img,
              usuario.id_user,
            ]
          );
        }
      }
      const results = result ? result.rows[0] : null;
      client.release();
      return res.render("pages/db", { usuario: usuario, r: results });
    } catch (e) {
      console.log(e);
    }
  }
}

export { RepublicaController ,Republica};
