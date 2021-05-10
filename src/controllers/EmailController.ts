import nodemailer from "nodemailer";
import {Request, Response} from "express";
const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

class EmailController{
     
      async run(req: Request, res: Response) {
    
        await transporter.sendMail({
          text: req.body.texto,
          subject: req.body.nome,
          from: "findyourrepublic@gmail.com",
          to: ["findyourrepublic@gmail.com", req.body.email],
        });
        res.redirect("/");
}

 
}

export {EmailController}