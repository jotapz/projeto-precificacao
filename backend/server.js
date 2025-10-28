import 'dotenv/config'; 

import express from "express";
import cors from "cors";
import conectaNaDatabase from "./src/db/dbConnect.js";

try {
    const conexao = await conectaNaDatabase();

    conexao.on("error", (erro) => {
      console.error("Erro de conexão com o banco após inicialização:", erro);
    });

    conexao.once("open", () => {
      console.log("Conexão ao banco feita com sucesso e ouvindo eventos.");
    });
    
} catch (error) {
    console.error("A aplicação não pode iniciar sem a conexão com o banco de dados.", error);
    process.exit(1); 
}

const app = express();

app.use(cors());

app.use(express.json()); 

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.status(200).send({ mensagem: 'Servidor está rodando e conectado ao MongoDB!' });
});

//ROTAS FUTURAS


app.listen(port, () => {
  console.log(`Servidor escutando na porta http://localhost:${port}`);
});