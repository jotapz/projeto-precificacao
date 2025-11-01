import 'dotenv/config'; 

import express from "express";
import cors from "cors";
import conectaNaDatabase from "./src/db/dbConnect.js";


import userRoutes from "./src/routes/userRoutes.js";
import materiaPrimaRoutes from "./src/routes/materiaPrimaRoutes.js";
import despesaRoutes from "./src/routes/despesaRoutes.js";
import custoOperacionalRoutes from "./src/routes/custoOperacionalRoutes.js";
import produtoRoutes from "./src/routes/produtoRoutes.js";


try {
    const conexao = await conectaNaDatabase();
    console.log("Conexão ao banco feita com sucesso!");

    conexao.on("error", (erro) => {
      console.error("Erro de conexão com o banco após inicialização:", erro);
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


app.use("/api", userRoutes);
app.use("/api", materiaPrimaRoutes);
app.use("/api", despesaRoutes);
app.use("/api", custoOperacionalRoutes);
app.use("/api", produtoRoutes);


app.listen(port, () => {
  console.log(`Servidor escutando na porta http://localhost:${port}`);
});