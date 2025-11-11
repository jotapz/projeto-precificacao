import mongoose from "mongoose";

const ingredienteSchema = new mongoose.Schema({
  materiaPrima: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'MateriaPrima', 
    required: true 
  },
  quantidade: { 
    type: Number, 
    required: true 
  },
  unidade: {
    type: String,
    enum: ['kg', 'g', 'L', 'ml', 'unidade'],
    required: false
  },
  custoIngrediente: { 
    type: Number, 
    required: true 
  }
});

const produtoSchema = new mongoose.Schema(
  {
    usuario: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    nome: { 
      type: String, 
      required: true 
    },
    unidade: {
      type: String,
      required: true,
      enum: ['kg', 'g', 'L', 'ml', 'unidade']
    },
    ingredientes: [ingredienteSchema],

    tempoProducaoHoras: {
      type: Number,
      required: true,
      default: 0
    },
  
    margemLucroPercentual: {
      type: Number,
      required: true,
      default: 20
    }
  
  },
  { 
    timestamps: true 
  }
);

const Produto = mongoose.model("Produto", produtoSchema);
export default Produto;