import mongoose from "mongoose";
import 'dotenv/config';

async function conectaNaDatabase() {
  const rawUri = process.env.MONGO_URI;
  if (!rawUri) {
    console.error('[DB] MONGO_URI não encontrada em process.env (verifique backend/.env e dotenv).');
    throw new Error('MONGO_URI não definida');
  }

  // Trim possible surrounding quotes
  const uri = rawUri.replace(/^\s*\"|\"\s*$|^\s*'|'\s*$/g, '');
  const preview = uri.length > 40 ? uri.slice(0, 40) + '...' : uri;
  console.log('[DB] Usando MONGO_URI (preview):', preview);

  try {
    const conn = await mongoose.connect(uri);

    mongoose.connection.on('connected', () => {
      console.log('[DB] Conectado ao MongoDB com sucesso.');
    });
    mongoose.connection.on('error', (err) => {
      console.error('[DB] Erro na conexão com MongoDB:', err);
    });
    mongoose.connection.on('disconnected', () => {
      console.warn('[DB] Desconectado do MongoDB.');
    });

    console.log('[DB] Conexão ao banco iniciada.');
    return conn.connection;
  } catch (erro) {
    console.error('[DB] Erro ao conectar no MongoDB:', erro && erro.message ? erro.message : erro);
    throw erro;
  }
}

export default conectaNaDatabase;