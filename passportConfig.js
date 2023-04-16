const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const axios = require('axios');
require('dotenv').config({ path: ".env.development" });

const apiKey = process.env.API_KEY;
const applicationId = process.env.APPLICATION_ID;

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

// Callback do Passport
passport.use(
    new LinkedInStrategy(
        {
            passReqToCallback: true, // Configura a estratégia para passar o objeto de solicitação para o callback
            clientID: clientId,
            clientSecret: clientSecret,
            callbackURL: '/auth/linkedin/callback',
        },
        function (req, accessToken, refreshToken, profile, done) {
            try {
                // Extrai informações relevantes do perfil do usuário
                const { id, displayName, name, photos } = profile;
                const { givenName, familyName } = name;
                const foto = photos[3].value;

                // Cria um objeto de usuário com as informações extraídas
                const user = {
                    id,
                    name: displayName,
                    nome: givenName,
                    sobrenome: familyName,
                    foto,
                };

                // Chama o método 'done' para informar ao Passport que a autenticação foi bem-sucedida
                done(null, user);
            } catch (error) {
                // Se ocorrer um erro, chame o método 'done' com o erro para indicar ao Passport que a autenticação falhou
                done(error);
            }
        }
    )
);

// Serialização do Passport
passport.serializeUser(function (user, done) {

    const usuario = {
        "nome": user.nome,
        "sobrenome": user.sobrenome,
        "idade": 30,
        "endereco": {
            "logradouro": "teste",
            "municipio": "teste",
            "estado": "teste",
            "pais": "teste"
        }
    }

    // Salva o usuário na API
    axios.post('https://parseapi.back4app.com/usuario', usuario, {
        headers: {
            'X-Parse-Application-Id': applicationId,
            'X-Parse-REST-API-Key': apiKey
        }
    }).then(response => {
        // Chama o método 'done' com o ID do usuário salvo na API
        //console.log(response.data.id)
        done(null, response.data.id);
        return;
    }).catch(error => {
        if (error.response.data.status != null && error.response.data.mensagem != null) {
            // Mensagem de Erro retornando no RESPONSE da API
            console.error('Erro ao salvar usuário na API:', error.response.data.mensagem);
            done(error.response.data.mensagem);
            return;
        } else {
            // Mensagem de Erro não retornada do RESPONSE da API
            console.error('Erro ao salvar usuário na API:', error.message);
            done(error.message);
            return;
        }
    });
});

// Desserialização do Passport
passport.deserializeUser(function (id, done) {
    axios.get('https://parseapi.back4app.com/usuario/' + id, {
        headers: {
            'X-Parse-Application-Id': applicationId,
            'X-Parse-REST-API-Key': apiKey
        }
    })
        .then(function (response) {
            // Recupera o objeto de usuário recuperado
            const user = response.data.results[0];
            //console.log("Recupera o objeto de usuário recuperado", user)
            // Chama o método 'done' com o objeto de usuário recuperado
            done(null, user);
        })
        .catch(function (error) {
            done(error, null);
        });
});

module.exports = passport;