const express = require('express');
const routes = require('./routes/routes');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const path = require('path');

const app = express();
app.use(cookieParser());

const secretKey = crypto.randomBytes(64).toString('hex');

// Middleware de sessão
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Configura o mecanismo de visualização EJS
app.set('view engine', 'ejs');
// Configuração para servir arquivos estáticos da pasta 'public' no diretório raiz.
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});