import express from "express";
import path from "path";
const PORT = process.env.PORT || 5000;
import session from "express-session";
import flash from "express-flash";
import passport from "passport";
import { initialize as initializePassport } from "./passportConfig";
import { RepublicaController } from "./controllers/RepublicaController";
import { UsuarioController } from "./controllers/UsuarioController";
import { checkAuth, checkNotAuth } from "./middleware";

const app = express();
const republicaController = new RepublicaController();
const usuarioController = new UsuarioController();

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
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));


  
app.get("/", usuarioController.mostraIndex); //renderiza a página home

app.get("/login", checkAuth, usuarioController.mostraLogin); //renderiza página login

app.post("/login",
passport.authenticate("local", {
  successRedirect: "/db",
  failureRedirect: "/login",
  failureFlash: true,
}));

app.get("/inscreva-se", checkAuth,usuarioController.mostraInscreva); //renderiza página escreva

app.post("/inscreva-se",usuarioController.inscreve);

app.get("/logout", usuarioController.logout);

app.get("/republicas", republicaController.renderizaRep);

app.get("/db",//página usuario/cadastro da republica
checkNotAuth, //verifica se o usuario esta deslogado ao tentar entrar na pagina do usuario
republicaController.create
);
app.post("/db",
 republicaController.create
);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));