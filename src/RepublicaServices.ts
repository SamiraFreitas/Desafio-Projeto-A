import {Request , Response} from "express";
import { Pool } from "pg";

class RepublicaService{
async create(req: Request,res:Response){
    const usuario: any =(req.user)?req.user:null;
    const {
      nome_republica,
      rua,
      bairro,
      cidade,
      trote,
      n_quartos,
      n_banheiros,
      n_suites,
      area_de_estudos,
      wifi,
      tv_a_cabo,
      video_game,
      numero,
      area_externa,
      piscina,
      faxineira,
      almoco_diario,
      garagem,
      animais,
      whatsapp,
      img
    } = req.body;
    console.log(usuario)
    console.log(parseInt(wifi))
    try{
    const client = await pool.connect();//conecta o banco de dados
    const result:any = await client.query(
        `SELECT * FROM republicas 
        WHERE id=$1`,
        [usuario.id],
        (err,res)=>{
            if(err){
                throw err;
            }else{
                if(res.rows.length){
                    return res.rows[0];

                }else{
                    console.log("estou aqui")
                    client.query(`INSERT INTO republicas 
                    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)
                    RETURNING id`,
                    [
                        usuario.id,
                        nome_republica,
                        rua,
                        parseInt(numero),
                        bairro,
                        cidade,
                        trote=="on"?true:false,
                        parseInt(n_quartos),
                        parseInt(n_banheiros),
                        parseInt(n_suites),
                        area_de_estudos=="on"?true:false,
                        parseInt(wifi),
                        tv_a_cabo=="on"?true:false,
                        video_game,
                        area_externa=="on"?true:false,
                        piscina=="on"?true:false,
                        faxineira=="on"?true:false,
                        almoco_diario=="on"?true:false,
                        garagem=="on"?true:false,
                        animais=="on"?true:false,
                        whatsapp,
                        usuario.email,
                        usuario.id,
                        usuario.nome_usuario,
                        true,
                        img
                    ]
                    )
                }
                console.log([
                    nome_republica,
                    rua,
                    parseInt(numero),
                    bairro,
                    cidade,
                    trote=="on"?true:false,
                    parseInt(n_quartos),
                    parseInt(n_banheiros),
                    parseInt(n_suites),
                    area_de_estudos=="on"?true:false,
                    parseInt(wifi),
                    tv_a_cabo=="on"?true:false,
                    video_game,
                    area_externa=="on"?true:false,
                    piscina=="on"?true:false,
                    faxineira=="on"?true:false,
                    almoco_diario=="on"?true:false,
                    garagem=="on"?true:false,
                    animais=="on"?true:false,
                    whatsapp,
                    usuario.id,
                    usuario.nome_usuario,
                    true,
                    img
                ])
                console.log(res.rows[0]);
            }
        }
    );
    const results = (result)?result.rows:null;
    
     res.render("pages/db",{"usuario":usuario,"results":results});
  }catch(e){
      console.log(e);
  }
}
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
    
  export {RepublicaService}