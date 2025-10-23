// backend/src/db/dbConnect.js

import mongoose from "mongoose";

async function conectaNaDatabase() {
  try {
    // A função mongoose.connect usa a variável de ambiente MONGO_URI,
    // que foi carregada no server.js.
    await mongoose.connect(process.env.MONGO_URI);
    
    // Retorna o objeto de conexão, que pode ser usado para eventos
    return mongoose.connection;
  } catch (erro) {
    console.error("Erro ao conectar no MongoDB:", erro);
    // Lança o erro para ser capturado no server.js
    throw erro; 
  }
}

export default conectaNaDatabase;