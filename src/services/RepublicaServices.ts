import { Request, Response } from "express";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

interface Republica {
  nome_republica: string;
  rua: string;
  bairro: string;
  cidade: string;
  trote: boolean;
  n_quartos: number;
  n_banheiros: number;
  n_suites: number;
  area_de_estudos: boolean;
  wifi: number;
  tv_a_cabo: boolean;
  video_game: string;
  numero: number;
  area_externa: boolean;
  piscina: boolean;
  faxineira: boolean;
  almoco_diario: boolean;
  garagem: boolean;
  animais: boolean;
  whatsapp: string;
  img: string;
}

class RepublicaService {
  async listaRepublicas() {
    const client = await pool.connect(); //conecta o banco de dados
    const result = await client.query("SELECT * FROM republicas"); //seleciona tudo da tabela de teste
    const results = result ? result.rows : null;
    client.release();
    return results;
  }

  async create(req: Request, res: Response) {
    const usuario: any = req.user ? req.user : null;
    const rep: Republica = req.body;
    console.log(usuario);

    try {
      const client = await pool.connect(); //conecta o banco de dados
      const result: any = await client.query(
        //retorna a republica cadastrada pelo usuario logado
        `SELECT * FROM republicas 
        WHERE id=$1`,
        [usuario.id]
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
                    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)
                    RETURNING id`,
            [
              usuario.id,
              rep.nome_republica,
              rep.rua,
              rep.numero,
              rep.bairro,
              rep.cidade,
              rep.trote,
              rep.n_quartos,
              rep.n_banheiros,
              rep.n_suites,
              rep.area_de_estudos,
              rep.wifi,
              rep.tv_a_cabo,
              rep.video_game,
              rep.area_externa,
              rep.piscina,
              rep.faxineira,
              rep.almoco_diario,
              rep.garagem,
              rep.animais,
              rep.whatsapp,
              usuario.email,
              usuario.id,
              usuario.nome_usuario,
              true,
              rep.img,
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

export { RepublicaService };
