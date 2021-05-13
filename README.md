## 📜 Índice
- [📜 Índice](#-índice)
- [📝 Sobre](#-sobre)
- [## 👾 Tecnologias Utilizadas](#--tecnologias-utilizadas)
- [💻 Como baixar o projeto](#-como-baixar-o-projeto)

## 📝 Sobre 
Este repositório é referente ao projeto de desenvolvimento web para a Visão Tecnologias e Sistemas.  Tendo como base a criação de uma empresa fictícia, Find Your REP ( FY REP)  tem como objetivo principal facilitar o contato dos calouros com as repúblicas universitárias propondo maior acessibilidade, facilidade e conforto ao calouro na hora de encontrar a sua nova casa. 
- Missão: Facilitar e promover inclusão de todos os jovens universitários através da tecnologia.
- Visão: Ser referência em compatibilidade de perfis dos calouros  para com as repúblicas.
- Valores: Utilizar a tecnologia para unir as pessoas;
           Valorizamos a diversidade;
           Facilidade e precisão;

---
## 👾 Tecnologias Utilizadas 
  ---
- Html
- CSS
- Bootstrap
- [Node.js](https://nodejs.org/pt-br/download/)
- [PostgreSQL](https://www.postgresql.org/download/)
- Typescript
- [Yarn](https://classic.yarnpkg.com/en/docs/install)
- [Heroku]( https://devcenter.heroku.com/articles/heroku-cli)
## 💻 Como baixar o projeto 
-Requisitos 

- Baixe as tecnologias citadas acima nos links e em seguida: 
- Configure o arquivo '.env'
DATABASE_URL=`postgres://${User}:${Password}@${Host}:${Port}/${database}`
//exemplo 
DATABASE_URL=postgres://leo:123@localhost:5432/meudb
- Configure tabelas teste  execute o script sql que está na raiz do projeto para criar as tabelas básicas no seu banco PostgreeSQL 


```bash
#Clonando o repositorio 
$ git clone https://github.com/SamiraFreitas/Desafio-Projeto-A
#Entrar no diretorio 
$ cd Desafio-Projeto-A 
# Instalar as dependências
$ npm install || yarn install
#Rode o projeto 
$ heroku local
#Acesse o site 
$ localhost:5000/
```
---
Desenvolvido 💚 por Samira, Leonardo, Filipe, Wendler
