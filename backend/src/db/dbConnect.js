import mongoose from "mongoose";

async function conectaNaDatabase() {
  try {

    await mongoose.connect(process.env.MONGO_URI);
    

    return mongoose.connection;
  } catch (erro) {
    console.error("Erro ao conectar no MongoDB:", erro);

    throw erro; 
  }
}

export default conectaNaDatabase;