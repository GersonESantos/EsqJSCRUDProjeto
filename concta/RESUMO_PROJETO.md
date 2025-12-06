# Resumo do Projeto: Conexão Node.js com MySQL

Este projeto é um exemplo simples e funcional de como uma aplicação web, com backend em **Node.js** e frontend em **HTML/JavaScript**, se conecta a um banco de dados **MySQL**.

## Objetivo

O principal objetivo é demonstrar o fluxo completo de uma requisição: desde a interação do usuário no navegador até a consulta ao banco de dados pelo servidor e o retorno da resposta.

## Tecnologias Utilizadas

*   **Backend**:
    *   **Node.js**: Ambiente de execução para o JavaScript no lado do servidor.
    *   **Express.js**: Framework para criar o servidor web e as rotas da API de forma simplificada.
    *   **mysql2**: Driver para conectar o Node.js ao banco de dados MySQL. A versão com `promise` é usada para trabalhar com código assíncrono (`async/await`).
    *   **dotenv**: Módulo para gerenciar variáveis de ambiente, permitindo separar as configurações (como senhas de banco de dados) do código-fonte.

*   **Frontend**:
    *   **HTML**: Estrutura da página web.
    *   **CSS**: Estilização da página.
    *   **JavaScript (Vanilla)**: Lógica do lado do cliente para fazer requisições à API e manipular o conteúdo da página (DOM).

## Como Funciona? (Fluxo de Execução)

1.  **Inicialização**:
    *   O comando `npm start` executa o arquivo `server.js`.
    *   `server.js` cria um servidor Express que fica "ouvindo" por requisições na porta `3000`.
    *   O servidor é configurado para servir os arquivos estáticos da pasta (como `index.html` e `app.js`).

2.  **Acesso do Usuário**:
    *   Você acessa `http://localhost:3000` no navegador.
    *   O servidor Express responde enviando o arquivo `index.html`.

3.  **Interação no Frontend**:
    *   O `index.html` carrega o script `app.js`.
    *   Quando o usuário clica no botão para testar a conexão, o `app.js` usa a função `fetch()` para fazer uma requisição para o endpoint `/test-connection` no backend.

4.  **Processamento no Backend**:
    *   O servidor Express recebe a requisição no endpoint `/test-connection`.
    *   A rota correspondente chama a função `testConnection` do arquivo `db.js`.
    *   A função `testConnection` tenta obter uma conexão com o banco de dados MySQL usando as credenciais definidas no arquivo `.env`.

5.  **Resposta e Atualização**:
    *   **Se a conexão for bem-sucedida**: `db.js` retorna uma mensagem de sucesso.
    *   **Se a conexão falhar**: `db.js` retorna uma mensagem de erro detalhada (ex: senha errada, banco não encontrado).
    *   O servidor envia essa mensagem de volta para o frontend em formato JSON.
    *   O `app.js` (no navegador) recebe a resposta e atualiza o conteúdo do `index.html` para mostrar o status da conexão ao usuário.

## Pontos Chave para Estudo

*   **Separação de Responsabilidades**: Observe como cada arquivo tem um papel claro: `server.js` cuida do servidor e rotas, `db.js` da lógica de banco de dados, e `app.js` da interação no cliente.
*   **Cliente-Servidor**: Entenda a comunicação entre o código que roda no navegador (cliente) e o que roda no ambiente Node.js (servidor) através de uma API.
*   **Código Assíncrono**: Veja o uso de `async/await` e `Promises` para lidar com operações que levam tempo, como a conexão com o banco de dados e as requisições de rede.
*   **Variáveis de Ambiente**: Perceba a importância de não colocar dados sensíveis (como senhas) diretamente no código, usando um arquivo `.env` para isso.
