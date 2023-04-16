# Descrição

# app.js

Esse é um código em JavaScript que utiliza o framework Express para criar um servidor web. Ele também utiliza os pacotes passport, express-session, cookie-parser e crypto.

O código começa importando os pacotes necessários, incluindo o arquivo de rotas definido em ./routes/routes.js. Em seguida, ele cria uma instância do aplicativo express e adiciona o middleware cookieParser.

Depois, é gerada uma chave secreta aleatória usando o pacote crypto e usada como parâmetro para o middleware express-session, que cria um objeto de sessão para armazenar informações do usuário.

Em seguida, o aplicativo adiciona o middleware passport.initialize() e passport.session() para gerenciar a autenticação de usuários. Ele também configura o mecanismo de visualização EJS para renderizar as páginas HTML.

Por fim, ele define a rota principal do aplicativo usando o arquivo de rotas definido em routes.js e inicia o servidor na porta 3000.

# router.js

Este código é um arquivo de roteamento (ou roteador) que define as rotas para diferentes páginas do aplicativo. Ele usa o framework Express.js para criar as rotas e o Passport.js para lidar com a autenticação do usuário. O arquivo começa importando o Express e o roteador, bem como o passportConfig, que contém as funções para autenticação do Passport.

A primeira rota é para a página inicial do aplicativo. Quando um usuário acessa a rota raiz ("/"), a função router.get() é chamada e renderiza a página "index". A próxima rota é para a página de login ("/login"), que renderiza a página "login" com o título "Login".

A função ensureAuthenticated() é um middleware que verifica se o usuário está autenticado antes de permitir o acesso a determinadas rotas. Se o usuário estiver autenticado, ele chama a função next(), permitindo que a rota seja acessada. Se não estiver autenticado, a função redireciona o usuário para a página de login ("/login").

A próxima rota é para a página de perfil ("/perfil"). Essa rota usa o middleware ensureAuthenticated() para garantir que o usuário esteja autenticado antes de renderizar a página "perfil". A rota também verifica se o objeto do usuário existe. Se não existir, o usuário é redirecionado para a página de login ("/login"). Se o objeto do usuário existir, o nome do usuário é recuperado e passado como parâmetro para a página "perfil".

A rota "/logout" é uma rota POST que faz logout do usuário e redireciona-o para a página inicial ("/"). Quando a função req.logout() é chamada, o objeto do usuário é removido da sessão.

A rota "/error" é usada para renderizar a página "error" com uma mensagem de erro, se houver.

O middleware de tratamento de erro é usado para lidar com erros em qualquer rota do aplicativo. Ele exibe um erro 500 e adiciona a URL da requisição atual no console.

As últimas duas rotas são para autenticação com o LinkedIn. A rota "/auth/linkedin" é a rota de autenticação do LinkedIn. Quando um usuário acessa essa rota, ele é redirecionado para a página de autenticação do LinkedIn. A rota "/auth/linkedin/callback" é a rota de callback do LinkedIn. Quando um usuário é autenticado com sucesso, ele é redirecionado para essa rota. A rota usa a função passport.authenticate() do Passport para autenticar o usuário e, em seguida, redirecioná-lo para a página de perfil ("/perfil"). Se a autenticação falhar, o usuário é redirecionado para a página de erro ("/error").

## Arquivo de roteamento da aplicação Express com Passport -
Este é um arquivo de roteamento de uma aplicação Express que utiliza o Passport para autenticação de usuários. Ele exporta um objeto Router do Express com as seguintes rotas:

## Rota para a página inicial (index)

- Método: GET
- Path: '/'
- Função de middleware: Renderiza a página 'index'.

## Rota para a página de login

- Método: GET
- Path: '/login'
- Função de middleware: Renderiza a página 'login' com o título 'Login'.

## Middleware ensureAuthenticated

- Verifica se o usuário está autenticado.
- Se estiver, chama o próximo middleware.
- Caso contrário, redireciona o usuário para a página de login.

## Rota para o perfil do usuário

- Método: GET
- Path: '/perfil'
- Função de middleware: 
    - Verifica se o usuário está autenticado. 
    - Se não estiver, redireciona para a página de login. 
    - Renderiza a página 'perfil' com o título 'Perfil' e o nome do usuário logado.

## Rota para o logout

- Método: POST
- Path: '/logout'
- Função de middleware: 
    - Faz o logout do usuário. 
    - Redireciona o usuário para a página inicial.

## Rota para a página de erro

- Método: GET
- Path: '/error'
- Função de middleware: 
    - Renderiza a página 'error' com a mensagem de erro armazenada na sessão.

## Middleware de tratamento de erro

- Recebe um objeto de erro como primeiro parâmetro.
- Imprime o stack trace do erro no console.
- Define uma mensagem de erro padrão.
- Envia a mensagem de erro e um status 500 como resposta.

## Rota de autenticação do LinkedIn

- Método: GET
- Path: '/auth/linkedin'
- Função de middleware: 
    - Inicia o processo de autenticação do Passport com a estratégia de autenticação do LinkedIn.

## Rota de callback do LinkedIn

- Método: GET
- Path: '/auth/linkedin/callback'
- Função de middleware: 
    - Completa o processo de autenticação do Passport com a estratégia de autenticação do LinkedIn. 
    - Redireciona o usuário para a página de perfil.


# passportConfig.js

Este código é responsável por implementar a autenticação com a API do LinkedIn utilizando o Passport, um middleware de autenticação para aplicativos Node.js. Ele também implementa a serialização e desserialização do Passport, que é a forma como o Passport mantém o estado da autenticação entre as solicitações.

O código começa importando os módulos necessários, incluindo o Passport, a estratégia do LinkedIn, o Axios para fazer chamadas de API e o pacote dotenv para carregar variáveis de ambiente a partir de um arquivo .env. Em seguida, ele recupera as chaves de API e outras informações sensíveis do arquivo .env usando o método process.env.

A estratégia do LinkedIn é configurada com as credenciais do cliente, o URL de retorno e uma função de callback que é chamada após a autenticação bem-sucedida. A função de callback extrai informações relevantes do perfil do usuário, cria um objeto de usuário e chama o método done do Passport para indicar que a autenticação foi bem-sucedida.

A serialização do Passport é implementada com uma função que recebe o objeto do usuário e o salva em um banco de dados. Ele usa o Axios para fazer uma chamada de API POST para a API do Back4App para salvar as informações do usuário. Depois que o usuário é salvo, a função chama o método done do Passport com o ID do usuário salvo na API.

A desserialização do Passport é implementada com uma função que recebe o ID do usuário e usa o Axios para fazer uma chamada de API GET para recuperar as informações do usuário a partir da API do Back4App. A função chama o método done do Passport com o objeto de usuário recuperado da API.

Por fim, o módulo Passport é exportado para ser usado em outras partes do aplicativo.

# LINKS - Entrar com a conta linkedin
https://www.linkedin.com/developers/apps/209774034/settings
https://www.linkedin.com/company/92831091/admin/?feedType=following