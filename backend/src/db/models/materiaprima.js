import mongoose from "mongoose";

const materiaPrimaSchema = new mongoose.Schema(
  {
    // "FOREIGN KEY" para o USUARIO
    usuario: { 
      type: mongoose.Schema.Types.ObjectId, // Tipo especial de ID do Mongoose
      ref: 'User', 
      required: true 
    },
    nome: { 
      type: String, 
      required: true 
    },
    quantidade: { 
      type: Number, 
      required: true 
    },
    valorUnitario: { 
      type: Number, 
      required: true 
    },

    unidade: {
      type: String,
      required: true,
      enum: ['kg', 'g', 'L', 'ml', 'unidade'] // Só aceita esses valores exatos
    }
  },
  { 
    timestamps: true 
  }
);

const materiaprima = mongoose.model("MateriaPrima", materiaPrimaSchema);

export default materiaprima;