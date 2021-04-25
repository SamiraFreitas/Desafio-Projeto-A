import {Request , Response} from "express";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
});

interface Republica {
    nome_republica:string,
    rua:string,
    bairro:string,
    cidade:string,
    trote:boolean,
    n_quartos:number,
    n_banheiros:number,
    n_suites:number,
    area_de_estudos:boolean,
    wifi:number,
    tv_a_cabo:boolean,
    video_game:string,
    numero:number,
    area_externa:boolean,
    piscina:boolean,
    faxineira:boolean,
    almoco_diario:boolean,
    garagem:boolean,
    animais:boolean,
    whatsapp:string,
    img:string
  } 

class RepublicaService{
async listaRepublicas(){
    const client = await pool.connect();//conecta o banco de dados
    const result = await client.query('SELECT * FROM republicas');//seleciona tudo da tabela de teste
    const results = (result)?result.rows:null;
    client.release();
    return results;
}

async create(req: Request,res:Response){
    const usuario: any =(req.user)?req.user:null;
    const rep:Republica= req.body;
    console.log(usuario)
    
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
                    console.log("estou aqui",rep.whatsapp.toString().length)
                    client.query(`INSERT INTO republicas 
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
                        rep.img
                    ]
                    )
                }
                console.log(rep);
                
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


    
  export {RepublicaService}