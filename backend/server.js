// backend/server.js

// 1. CARREGA AS VARIÁVEIS DE AMBIENTE (do arquivo .env)
import 'dotenv/config'; 

// 2. Importa o Express e a função de conexão
import express from "express";
import conectaNaDatabase from "./src/db/dbConnect.js";

// --- INICIALIZAÇÃO DA CONEXÃO COM O BANCO ---

// Chama a função assíncrona para iniciar a conexão.
// Como o await está no topo, o Node.js espera a conexão antes de continuar.
try {
    const conexao = await conectaNaDatabase();

    // Configura um listener para registrar erros de conexão após a inicialização
    conexao.on("error", (erro) => {
      console.error("Erro de conexão com o banco após inicialização:", erro);
    });

    // Configura um listener para o evento de sucesso (opcional, mas bom)
    conexao.once("open", () => {
      console.log("Conexão ao banco feita com sucesso e ouvindo eventos.");
    });
    
} catch (error) {
    console.error("A aplicação não pode iniciar sem a conexão com o banco de dados.", error);
    process.exit(1); // Encerra a aplicação se a conexão inicial falhar
}


// --- CONFIGURAÇÃO E INICIALIZAÇÃO DO SERVIDOR EXPRESS ---

const app = express();
// Usa o middleware para que o Express entenda requisições JSON
app.use(express.json()); 

const port = process.env.PORT || 3000;

// Exemplo de Rota Raiz (apenas para testar se o servidor está funcionando)
app.get('/', (req, res) => {
  res.status(200).send({ mensagem: 'Servidor está rodando e conectado ao MongoDB!' });
});

// AQUI VOCÊ ADICIONARÁ SUAS ROTAS FUTURAS (Ex: app.use("/livros", livrosRouter))


// Inicia o servidor Express
app.listen(port, () => {
  console.log(`Servidor escutando na porta http://localhost:${port}`);
});