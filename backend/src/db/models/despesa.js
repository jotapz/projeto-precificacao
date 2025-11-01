import mongoose from "mongoose";

const despesaSchema = new mongoose.Schema(
  {
    // "FOREIGN KEY" para o USUARIO
    usuario: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    nome: { 
      type: String, 
      required: true 
    },
    valorMensal: { 
      type: Number, 
      required: true 
    }
  },
  { 
    timestamps: true 
  }
);

const despesa = mongoose.model("Despesa", despesaSchema);

export default despesa;