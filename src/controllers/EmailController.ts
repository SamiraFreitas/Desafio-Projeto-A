import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.PORT||5000,
    secure: false,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  async function run() {
    const mailSent = await transporter.sendMail({
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