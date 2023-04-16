// Middleware para verificar se o usuário está autenticado
function isAuthenticated(req, res, next) {
    console.log('Autenticado:', req.isAuthenticated()); // Verifica se o usuário está autenticado
    if (req.isAuthenticated()) {
        console.log('Usuário autenticado: ' + req.user.nome + ' ID: ' + req.user.id); // Se autenticado, exibe as informações do usuário
        return next(); // Chama a próxima função
    }
    console.log('Usuário não autenticado'); // Se não autenticado, exibe mensagem no console
    req.flash('error', 'Você precisa estar autenticado para acessar esta página.'); // Define mensagem de erro
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate'); // Desabilita cache do navegador
    res.set('Pragma', 'no-cache');
    res.set('Expires', 0);
    res.redirect('/'); // Redireciona para a página inicial
}

// Middleware que verifica se o usuário está autenticado
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log('Usuário autenticado!');
        return next();
    }
    console.log('Usuário não autenticado!');
    res.redirect('/');
}

module.exports = { ensureAuthenticated, isAuthenticated };