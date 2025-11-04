// backend/src/models/user.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    nome: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true
    },
    senha: { 
      type: String, 
      required: true 
    },
    bairro: {
      type: String,
      required: true
    },
    cpf: {
      type: String,
      required: false, // opcional como no frontend
      unique: true,
      sparse: true // permite null/undefined e mantém unique para valores não-nulos
    },
    horasTrabalhadasMes: { 
      type: Number, 
      default: 176 // (Padrão de 8h/dia, 22 dias/mês)
    } 
  },
  { 
    timestamps: true 
  }
);

const User = mongoose.model("User", userSchema);
export default User;