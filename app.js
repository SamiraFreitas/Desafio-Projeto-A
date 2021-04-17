
// Carrega variavel de ambiente
const session = require('express-session');

// Load Passport
const express = require('express');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const userInViews = require('./lib/middleware/userInViews');
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const app = express();

app.use(userInViews());
app.use('/', authRouter);
app.use('/', indexRouter);
app.use('/', usersRouter);

const sess ={
    secret: '12345',
    cookie: {},
    resave: false,
    saveUninitialized: true
  }
  
  if(app.get('env')==='production'){
    // Use secure cookies in production (requires SSL/TLS)
    sess.cookie.secure = true;
      // Uncomment the line below if your application is behind a proxy (like on Heroku)
    // or if you're encountering the error message:
    // "Unable to verify authorization request state"
     //app.set('trust proxy', 1);
  }
  
  app.use(session(sess));
  
  var strategy = new Auth0Strategy(
    {
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL:
        process.env.AUTH0_CALLBACK_URL || 'localhost:3000/callback'
    },
    function (accessToken, refreshToken, extraParams, profile, done) {
      // accessToken is the token to call Auth0 API (not needed in the most cases)
      // extraParams.id_token has the JSON Web Token
      // profile has all the information from the user
      return done(null, profile);
    }
  );
  
  passport.use(strategy);
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  // You can use this section to keep a smaller payload
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });