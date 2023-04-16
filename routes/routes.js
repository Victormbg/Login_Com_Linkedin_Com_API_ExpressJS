const express = require('express');
const router = express.Router();
const passport = require('../passportConfig'); // Importa as funções do Passport
const { ensureAuthenticated, isAuthenticated } = require('../middlewares/auth');

// Rota principal
router.get('/', function (req, res, next) {
    console.log('Rota / acionada');

    // Define os headers de cache
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', 0);

    // Verifica se o usuário está autenticado
    if (req.isAuthenticated()) {
        console.log('Usuário autenticado: ' + req.user.nome + ' ID: ' + req.user.id);
        res.redirect('/perfil');
    } else {
        console.log('Usuário não autenticado');
        res.render('index');
    }
});

// Rota para o perfil do usuário
router.get('/perfil', ensureAuthenticated, (req, res) => {
    console.log('Rota /perfil acionada');
    if (!req.isAuthenticated()) {
        console.log('Usuário não autenticado');
        // usuário não autenticado, redireciona para página de login
        return res.redirect('/');
    }

    console.log('Usuário autenticado: ' + req.user.nome + ' ID: ' + req.user.id);
    const nome = req.user.nome;

    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', 0);

    res.render('perfil', { pageTitle: 'Perfil', userName: nome, userExperience: [], userSkills: [], userPhoto: null });
});

router.get('/login', function (req, res, next) {
    console.log('Acessando a rota /login');
    res.redirect('/auth/linkedin');
});

router.post('/logout', function (req, res) {
    console.log('Fazendo logout do usuário', req.user);

    req.logout(function (err) {
        if (err) {
            console.log('Erro ao fazer logout:', err);
            return next(err);
        }
        console.log('Usuário deslogado com sucesso');

        res.clearCookie('connect.sid');
        console.log('Cookies limpos');

        req.session.destroy(function (err) {
            if (err) {
                console.log('Erro ao destruir a sessão:', err);
            } else {
                console.log('Sessão destruída com sucesso');
            }
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            console.log('Cache do navegador limpo');

            res.redirect('/');
        });
    });
});

// Rota para a página de erro
router.get('/error', function (req, res) {
    const errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;
    res.render('error', { errorMessage });
});

// Middleware de tratamento de erro
router.use(function (err, req, res, next) {
    console.error(err.stack);
    console.log(req.originalUrl); // adicionando um console.log para verificar a URL da requisição
    res.status(500).send('Algo deu errado!!!');
});

// Rota de autenticação do LinkedIn
router.get('/auth/linkedin', passport.authenticate('linkedin'));

// Rota de callback do LinkedIn
router.get('/auth/linkedin/callback',
    passport.authenticate('linkedin', { failureRedirect: '/error' }),
    function (req, res) {
        console.log('Session:', req.session); // adicionado
        // Redireciona para a página de perfil
        res.redirect(302, '/perfil');
    });


module.exports = router;