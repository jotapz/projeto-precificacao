import Despesa from "../db/models/despesa.js";

class DespesaController {


  static cadastrarDespesa = async (req, res) => {
    try {
      const { usuario, nome, valorMensal } = req.body;
      if (!usuario) {
        return res.status(400).json({ message: "O ID do usuário é obrigatório." });
      }

      const novaDespesa = new Despesa({ usuario, nome, valorMensal });
      const despesaSalva = await novaDespesa.save();
      res.status(201).json({ message: "Despesa cadastrada com sucesso!", item: despesaSalva });

    } catch (erro) {
      res.status(500).json({ message: `Falha ao cadastrar: ${erro.message}` });
    }
  };


  static listarDespesasPorUsuario = async (req, res) => {
    try {
      const userId = req.params.userId;
      const lista = await Despesa.find({ usuario: userId });
      res.status(200).json(lista);
    } catch (erro) {
      res.status(500).json({ message: "Erro ao buscar despesas." });
    }
  };


  static atualizarDespesa = async (req, res) => {
    try {
      const id = req.params.id;
      const { nome, valorMensal } = req.body;

      const itemAtualizado = await Despesa.findByIdAndUpdate(
        id,
        { $set: { nome, valorMensal } },
        { new: true, runValidators: true }
      );

      if (itemAtualizado) {
        res.status(200).json({ message: "Item atualizado com sucesso!", item: itemAtualizado });
      } else {
        res.status(404).json({ message: "Despesa não encontrada." });
      }
    } catch (erro) {
      res.status(500).json({ message: `Erro ao atualizar: ${erro.message}` });
    }
  };

  static deletarDespesa = async (req, res) => {
    try {
      const id = req.params.id;
      const resultado = await Despesa.findByIdAndDelete(id);

      if (resultado) {
        res.status(200).json({ message: "Despesa deletada com sucesso." });
      } else {
        res.status(404).json({ message: "Despesa não encontrada." });
      }
    } catch (erro) {
      res.status(500).json({ message: `Erro ao deletar: ${erro.message}` });
    }
  };
}

export default DespesaController;