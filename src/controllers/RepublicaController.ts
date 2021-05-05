import { Request, Response } from "express";
import { Pool } from "pg";
import { v4 as uuid } from "uuid";
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
  sexo: string;
  n_quartos: number;
  n_suites: number;
  n_banheiros: number;
  wifi: number;
  trote: boolean;
  area_estudos: boolean;
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
  async renderizaRep(req: Request, res: Response) {
    try {
      const client = await pool.connect(); //conecta o banco de dados
      const result = await client.query("SELECT * FROM republicas"); //seleciona tudo da tabela de teste
      const results: Republica[] = result ? result.rows : null;

      client.release();
      const usuario: any = req.user ? req.user : null;
      return res.render("pages/republicas", {
        usuario: usuario,
        republicas: results,
      }); //renderiza a página de republicas
    } catch (e) {
      console.error(e);
    }
  }
  async update(req: Request, res: Response){
    try{
      const usuario: any = req.user ? req.user : null;
      const c = await pool.connect(); //conecta o banco de dados
      const result: any = await c.query(
        //retorna a republica cadastrada pelo usuario logado
        `SELECT * FROM republicas 
        WHERE id_user=$1`,
        [usuario.id_user]
      );
      const republica: Republica = result.rows?result.rows[0]:null;

    let rep: Republica = req.body;
    rep.whatsapp = "55" + rep.whatsapp.replace(/\D/g, "");
    const client = await pool.connect(); //conecta o banco de dados
    for (var [key, value] of Object.entries(rep)) {
      if (value!=republica[key]){
         console.log(`UPDATE republicas SET ${key} = ${value} WHERE id_user = ${usuario.id_user}`);
         await client.query(`UPDATE republicas SET ${key}=$1 WHERE id_user=$2`,[value,usuario.id_user]);
      }
    }
    client.release();
    }catch (e) {
      console.error(e);
    }
    res.redirect("/");
  }
  async create(req: Request, res: Response) {
    const usuario: any = req.user ? req.user : null;
    let rep: Republica = req.body;
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
          rep.whatsapp != null
            ? (rep.whatsapp = "55" + rep.whatsapp.replace(/\D/g, ""))
            : null;
          //verifica se o formulário foi enviado se sim cadastra a republica
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
              rep.sexo,
              rep.n_quartos,
              rep.n_suites,
              rep.n_banheiros,
              rep.wifi,
              rep.trote,
              rep.area_estudos,
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

export { RepublicaController, Republica };
