import nodemailer from "nodemailer";



class EmailController{
     transporter = nodemailer.createTransport({
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
      async run() {
    
        await this.transporter.sendMail({
          text: "Texto do E-mail",
          subject: "Assunto do e-mail",
          from: "Victor Moraes <victormoraesgs@gmail.com",
          to: ["victormoraesgs@gmail.com", "victormoraesgs@hotmail.com"],
          html: `
          <html>
          <body>
            <strong>Conteúdo HTML</strong></br>Do E-mail
          </body>
        </html> 
          `,
        });
}

 
}