import express from "express";
import path from "path";
import bcrypt from "bcrypt";
const PORT = process.env.PORT || 5000;
import session from "express-session";
import flash from "express-flash";
import { Pool } from "pg";
import passport from "passport";
import { initialize as initializePassport } from "./passportConfig";
import { RepublicaService,Republica } from "./services/RepublicaServices";
import { checkAuth, checkNotAuth } from "./middleware";

const app = express();
const republicaService = new RepublicaService();

initializePassport(passport); //inicia o passport com a config

app.use(session({
    secret: process.env.SECRET || "secret",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, "../public")));
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
  
app.get("/", (req, res) => {
  const usuario: any = req.user ? req.user : null;
  res.render("pages/index", { usuario: usuario });
}); //renderiza a página home

app.get("/republicas", async (req, res) => {
  //conecta o banco de dados a página de republicas
  try {
    const republicas:Republica[] = await republicaService.listaRepublicas();
    const usuario: any = req.user ? req.user : null;
    res.render("pages/republicas", { usuario: usuario,republicas: republicas}); //renderiza a página de republicas
  } catch (err) {
    console.log(err);
    res.send("Erro: " + err);
  }
});


app.get("/login", checkAuth, (req, res) => {
  const usuario: any = req.user ? req.user : null;
  res.render("pages/login", { usuario: usuario });
}); //renderiza página login

app.post("/login",
  passport.authenticate("local", {
    successRedirect: "/db",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "você foi desconectado");
  res.redirect("/login");
});



app.get("/inscreva-se", checkAuth, (req, res) => {
  const usuario: any = req.user ? req.user : null;
  res.render("pages/inscreva-se", { usuario: usuario });
}); //renderiza página escreva

app.post("/inscreva-se", async (req, res) => {
  let errors = [];
  interface Usuario {
    name: string;
    email: string;
    password: string;
    password2: string;
  }

  const usuario: Usuario = req.body;

  if (!usuario.email || !usuario.password || !usuario.password2) {
    errors.push({ message: "Preencha todos os campos!" });
  }
  if (usuario.password != usuario.password2) {
    errors.push({ message: "As senhas não conferem" });
  }
  if (errors.length > 0) {
    res.render("pages/inscreva-se", { errors });
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
          res.render("pages/inscreva-se", { errors });
        } else {
          pool.query(
            //usuario valido insere no banco de dados
            `INSERT INTO usuarios (nome_usuario,email,senha)
              VALUES ($1,$2,$3)
              RETURNING id,senha`,
            [usuario.name, usuario.email, hashedPassword],
            (err, results) => {
              if (err) {
                throw err;
              }
              //se o cadastro der certo redireciona pra pagina de login com a mensagem
              client.release();
              req.flash("success_msg",usuario.name + " você está registrado, por favor faça login");
              res.redirect("/login");
            }
          );
        }
      }
    );
  }
});


//página usuario/cadastro da republica
app.get("/db", checkNotAuth, (req, res) => {
  republicaService.create(req, res);
});
app.post("/db", (req, res) => {
  republicaService.create(req, res);
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

